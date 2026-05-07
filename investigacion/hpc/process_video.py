"""
Procesamiento exhaustivo de videos POV / saturación con YOLO tracking + análisis multimodal.

Extrae por video:
- Detecciones por clase (persona, bicicleta, moto, carro, perro, mochila, paraguas, celular).
- Tracking persistente con BoTSORT: IDs únicos, permanencia y velocidad aparente.
- Estadísticas visuales por frame muestreado: brillo, contraste, saturación HSV, densidad de bordes.
- Audio: dB-FS RMS por segundo (presión acústica relativa).
- Metadatos del contenedor: duración, fps, resolución, GPS si está en metadata.
- Resumen agregado por percentiles + saturation_index compuesto.

Salida: investigacion/data/processed/video_saturation_<basename>.json con `summary` + `frames` + `tracks` + `audio`.

Modo cooperativo entre workers vía locks en --jobs-dir (dos GPUs no procesan el mismo video).
"""

from __future__ import annotations

import argparse
import json
import os
import socket
import subprocess
import sys
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np
import soundfile as sf
from tqdm import tqdm
from ultralytics import YOLO

VIDEO_EXTS = (".mp4", ".mov", ".mkv", ".avi", ".m4v")
MIN_FRAMES = 30


class SkipVideo(Exception):
    pass


class NpEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, np.integer):
            return int(o)
        if isinstance(o, np.floating):
            return float(o)
        if isinstance(o, np.ndarray):
            return o.tolist()
        return super().default(o)


def dumps(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2, cls=NpEncoder)

# Subset relevante de clases COCO para análisis urbano del corredor.
TRACK_CLASSES = {
    0: "person",
    1: "bicycle",
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck",
    16: "dog",
    24: "backpack",
    26: "handbag",
    28: "suitcase",
    67: "cell_phone",
}
PERSON_ID = 0


@dataclass
class FrameStat:
    frame_idx: int
    timestamp_s: float
    counts: dict[str, int]
    persons_conf_mean: float
    brightness: float
    contrast: float
    saturation: float
    edge_density: float


@dataclass
class TrackInfo:
    track_id: int
    class_name: str
    frames_seen: int
    duration_s: float
    distance_px: float
    speed_px_per_s: float
    bbox_area_mean: float


@dataclass
class AudioStat:
    sample_rate: int
    duration_s: float
    rms_dbfs_p50: float
    rms_dbfs_p75: float
    rms_dbfs_p90: float
    rms_dbfs_max: float
    silence_ratio: float


@dataclass
class VideoSummary:
    video: str
    node: str | None
    window: str | None
    captured_at: str | None
    width: int
    height: int
    duration_s: float
    fps: float
    frames_total: int
    frames_sampled: int
    persons_unique: int
    persons_p50: float
    persons_p75: float
    persons_p90: float
    persons_max: int
    vehicles_p75: float
    bicycles_p75: float
    dwell_seconds_median: float
    dwell_seconds_p75: float
    apparent_speed_px_p50: float
    brightness_mean: float
    brightness_std: float
    contrast_mean: float
    saturation_mean: float
    edge_density_mean: float
    audio: AudioStat | None
    saturation_index: float
    worker: str
    lot: str
    yolo_model: str
    processed_at: str
    duration_processing_s: float


def parse_metadata(video_path: Path) -> dict:
    sidecar = video_path.with_suffix(video_path.suffix + ".meta.json")
    if sidecar.exists():
        try:
            return json.loads(sidecar.read_text(encoding="utf-8"))
        except Exception:
            return {}
    name = video_path.stem
    parts = name.split("__")
    meta: dict = {}
    if len(parts) >= 3:
        meta["node"] = parts[0]
        meta["window"] = parts[1]
        meta["captured_at"] = parts[2]
    return meta


def claim_job(jobs_dir: Path, video: Path, worker: str) -> bool:
    jobs_dir.mkdir(parents=True, exist_ok=True)
    lock = jobs_dir / f"{video.name}.lock"
    done = jobs_dir / f"{video.name}.done"
    err = jobs_dir / f"{video.name}.error"
    if done.exists() or err.exists():
        return False
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        with os.fdopen(fd, "w") as f:
            f.write(json.dumps({"worker": worker, "host": socket.gethostname(), "ts": time.time()}))
        return True
    except FileExistsError:
        return False


def mark_done(jobs_dir: Path, video: Path, summary: VideoSummary) -> None:
    (jobs_dir / f"{video.name}.lock").unlink(missing_ok=True)
    (jobs_dir / f"{video.name}.done").write_text(
        dumps({"summary": asdict(summary)}),
        encoding="utf-8",
    )


def mark_skipped(jobs_dir: Path, video: Path, reason: str) -> None:
    (jobs_dir / f"{video.name}.lock").unlink(missing_ok=True)
    (jobs_dir / f"{video.name}.done").write_text(
        dumps({"skipped": True, "reason": reason}),
        encoding="utf-8",
    )


def iter_videos(raw_dir: Path) -> Iterable[Path]:
    for p in sorted(raw_dir.rglob("*")):
        if p.is_file() and p.suffix.lower() in VIDEO_EXTS:
            yield p


def compute_visual_features(frame_bgr: np.ndarray) -> tuple[float, float, float, float]:
    gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2HSV)
    brightness = float(gray.mean())
    contrast = float(gray.std())
    saturation = float(hsv[..., 1].mean())
    edges = cv2.Canny(gray, 80, 160)
    edge_density = float(edges.mean())
    return brightness, contrast, saturation, edge_density


def extract_audio(video: Path, target_sr: int = 16000) -> np.ndarray | None:
    cmd = [
        "ffmpeg", "-v", "error", "-i", str(video),
        "-vn", "-ac", "1", "-ar", str(target_sr),
        "-f", "s16le", "pipe:1",
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, check=False)
        if proc.returncode != 0 or not proc.stdout:
            return None
        return np.frombuffer(proc.stdout, dtype=np.int16).astype(np.float32) / 32768.0
    except FileNotFoundError:
        return None


def analyze_audio(samples: np.ndarray | None, sr: int = 16000) -> AudioStat | None:
    if samples is None or samples.size == 0:
        return None
    win = sr  # ventana de 1 segundo
    n = (len(samples) // win) * win
    if n == 0:
        return None
    block = samples[:n].reshape(-1, win)
    rms = np.sqrt(np.mean(block * block, axis=1) + 1e-12)
    dbfs = 20.0 * np.log10(rms + 1e-12)
    return AudioStat(
        sample_rate=sr,
        duration_s=len(samples) / sr,
        rms_dbfs_p50=float(np.percentile(dbfs, 50)),
        rms_dbfs_p75=float(np.percentile(dbfs, 75)),
        rms_dbfs_p90=float(np.percentile(dbfs, 90)),
        rms_dbfs_max=float(dbfs.max()),
        silence_ratio=float(np.mean(dbfs < -50.0)),
    )


def process_one(
    video: Path,
    out_dir: Path,
    model: YOLO,
    yolo_model_name: str,
    sample_stride: int,
    track_stride: int,
    conf_thresh: float,
    imgsz: int,
    worker: str,
    lot: str,
) -> VideoSummary:
    t_start = time.time()
    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        raise RuntimeError(f"No se puede abrir {video}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    duration = (total / fps) if fps else 0.0
    if total < MIN_FRAMES:
        cap.release()
        raise SkipVideo(f"video con {total} frames (< {MIN_FRAMES}), se omite")

    frames_stats: list[FrameStat] = []
    track_history: dict[int, dict] = {}

    pbar = tqdm(total=total or None, desc=f"[{worker}] {video.name}", unit="frame", leave=False)
    idx = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break

        is_track_frame = (idx % track_stride == 0)
        is_visual_frame = (idx % sample_stride == 0)

        if is_track_frame:
            res_list = model.track(
                source=frame,
                imgsz=imgsz,
                conf=conf_thresh,
                classes=list(TRACK_CLASSES.keys()),
                device=0,
                persist=True,
                tracker="botsort.yaml",
                verbose=False,
            )
            if res_list:
                res = res_list[0]
                if res.boxes is not None and res.boxes.cls is not None:
                    cls = res.boxes.cls.cpu().numpy().astype(int)
                    conf = res.boxes.conf.cpu().numpy()
                    xyxy = res.boxes.xyxy.cpu().numpy()
                    ids = res.boxes.id.cpu().numpy().astype(int) if res.boxes.id is not None else np.full_like(cls, -1)
                    counts: dict[str, int] = {v: 0 for v in TRACK_CLASSES.values()}
                    for c in cls:
                        name = TRACK_CLASSES.get(int(c))
                        if name:
                            counts[name] += 1
                    person_mask = cls == PERSON_ID
                    persons_conf = float(conf[person_mask].mean()) if person_mask.any() else 0.0

                    # actualiza tracking
                    for i in range(len(cls)):
                        tid = int(ids[i])
                        if tid < 0:
                            continue
                        cname = TRACK_CLASSES.get(int(cls[i]))
                        if cname is None:
                            continue
                        x1, y1, x2, y2 = xyxy[i]
                        cx, cy = (x1 + x2) / 2.0, (y1 + y2) / 2.0
                        area = max(0.0, (x2 - x1) * (y2 - y1))
                        h = track_history.setdefault(tid, {
                            "class": cname,
                            "frames": 0,
                            "first_idx": idx,
                            "last_idx": idx,
                            "last_cx": cx,
                            "last_cy": cy,
                            "distance_px": 0.0,
                            "area_sum": 0.0,
                        })
                        h["frames"] += 1
                        h["last_idx"] = idx
                        h["distance_px"] += float(np.hypot(cx - h["last_cx"], cy - h["last_cy"]))
                        h["last_cx"], h["last_cy"] = cx, cy
                        h["area_sum"] += area
                else:
                    counts = {v: 0 for v in TRACK_CLASSES.values()}
                    persons_conf = 0.0
            else:
                counts = {v: 0 for v in TRACK_CLASSES.values()}
                persons_conf = 0.0

        if is_visual_frame:
            brightness, contrast, saturation, edge_density = compute_visual_features(frame)
            ts = idx / fps if fps else 0.0
            frames_stats.append(FrameStat(
                frame_idx=idx,
                timestamp_s=ts,
                counts=dict(counts) if is_track_frame else {v: 0 for v in TRACK_CLASSES.values()},
                persons_conf_mean=persons_conf if is_track_frame else 0.0,
                brightness=brightness,
                contrast=contrast,
                saturation=saturation,
                edge_density=edge_density,
            ))

        idx += 1
        pbar.update(1)
    pbar.close()
    cap.release()

    # tracks → resumen
    tracks: list[TrackInfo] = []
    for tid, h in track_history.items():
        f_count = h["frames"]
        dur_s = (h["last_idx"] - h["first_idx"]) / fps if fps else 0.0
        speed = (h["distance_px"] / dur_s) if dur_s > 0 else 0.0
        tracks.append(TrackInfo(
            track_id=tid,
            class_name=h["class"],
            frames_seen=f_count,
            duration_s=dur_s,
            distance_px=h["distance_px"],
            speed_px_per_s=speed,
            bbox_area_mean=h["area_sum"] / max(1, f_count),
        ))

    person_tracks = [t for t in tracks if t.class_name == "person"]
    persons_unique = len(person_tracks)
    dwells = np.array([t.duration_s for t in person_tracks]) if person_tracks else np.array([0.0])
    speeds = np.array([t.speed_px_per_s for t in person_tracks]) if person_tracks else np.array([0.0])

    counts_arr = {k: np.array([f.counts.get(k, 0) for f in frames_stats], dtype=np.float64) if frames_stats else np.array([0.0]) for k in TRACK_CLASSES.values()}
    persons_arr = counts_arr["person"]
    vehicles_arr = counts_arr["car"] + counts_arr["motorcycle"] + counts_arr["bus"] + counts_arr["truck"]

    bright_arr = np.array([f.brightness for f in frames_stats]) if frames_stats else np.array([0.0])
    contrast_arr = np.array([f.contrast for f in frames_stats]) if frames_stats else np.array([0.0])
    sat_arr = np.array([f.saturation for f in frames_stats]) if frames_stats else np.array([0.0])
    edge_arr = np.array([f.edge_density for f in frames_stats]) if frames_stats else np.array([0.0])

    # audio
    audio_samples = extract_audio(video)
    audio = analyze_audio(audio_samples)

    # saturation_index compuesto: combinación normalizada de personas + bordes + audio
    sat_components = []
    sat_components.append(float(np.percentile(persons_arr, 75)) / 30.0)  # ~30 personas en frame es densidad alta
    sat_components.append(float(edge_arr.mean()) / 50.0)
    if audio is not None:
        sat_components.append(max(0.0, (audio.rms_dbfs_p75 + 60.0)) / 60.0)
    saturation_index = float(np.clip(np.mean(sat_components), 0.0, 5.0))

    meta = parse_metadata(video)
    summary = VideoSummary(
        video=video.name,
        node=meta.get("node"),
        window=meta.get("window"),
        captured_at=meta.get("captured_at"),
        width=width,
        height=height,
        duration_s=duration,
        fps=fps,
        frames_total=total,
        frames_sampled=len(frames_stats),
        persons_unique=persons_unique,
        persons_p50=float(np.percentile(persons_arr, 50)),
        persons_p75=float(np.percentile(persons_arr, 75)),
        persons_p90=float(np.percentile(persons_arr, 90)),
        persons_max=int(persons_arr.max()),
        vehicles_p75=float(np.percentile(vehicles_arr, 75)),
        bicycles_p75=float(np.percentile(counts_arr["bicycle"], 75)),
        dwell_seconds_median=float(np.percentile(dwells, 50)),
        dwell_seconds_p75=float(np.percentile(dwells, 75)),
        apparent_speed_px_p50=float(np.percentile(speeds, 50)),
        brightness_mean=float(bright_arr.mean()),
        brightness_std=float(bright_arr.std()),
        contrast_mean=float(contrast_arr.mean()),
        saturation_mean=float(sat_arr.mean()),
        edge_density_mean=float(edge_arr.mean()),
        audio=audio,
        saturation_index=saturation_index,
        worker=worker,
        lot=lot,
        yolo_model=yolo_model_name,
        processed_at=time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        duration_processing_s=time.time() - t_start,
    )

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"video_saturation_{video.stem}.json"
    out_path.write_text(
        dumps({
            "summary": asdict(summary),
            "frames": [asdict(s) for s in frames_stats],
            "tracks": [asdict(t) for t in tracks],
        }),
        encoding="utf-8",
    )
    return summary


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    parser.add_argument("--jobs-dir", type=Path, required=True)
    parser.add_argument("--worker-name", default=os.environ.get("WORKER_NAME", "worker"))
    parser.add_argument("--lot", default=os.environ.get("WORKER_LOT", "primary"))
    parser.add_argument("--yolo-model", default=os.environ.get("YOLO_MODEL", "yolo11x.pt"))
    parser.add_argument("--imgsz", type=int, default=int(os.environ.get("IMGSZ", "640")))
    parser.add_argument("--sample-stride", type=int, default=int(os.environ.get("SAMPLE_STRIDE", "5")))
    parser.add_argument("--track-stride", type=int, default=int(os.environ.get("TRACK_STRIDE", "2")))
    parser.add_argument("--conf-thresh", type=float, default=float(os.environ.get("CONF_THRESH", "0.30")))
    parser.add_argument("--poll-seconds", type=int, default=15)
    args = parser.parse_args()

    print(f"[{args.worker_name}] cargando modelo {args.yolo_model} (imgsz={args.imgsz})...", flush=True)
    model = YOLO(args.yolo_model)

    while True:
        any_claimed = False
        for video in iter_videos(args.raw_dir):
            if not claim_job(args.jobs_dir, video, args.worker_name):
                continue
            any_claimed = True
            try:
                summary = process_one(
                    video=video,
                    out_dir=args.out_dir,
                    model=model,
                    yolo_model_name=args.yolo_model,
                    sample_stride=args.sample_stride,
                    track_stride=args.track_stride,
                    conf_thresh=args.conf_thresh,
                    imgsz=args.imgsz,
                    worker=args.worker_name,
                    lot=args.lot,
                )
                mark_done(args.jobs_dir, video, summary)
                print(
                    f"[{args.worker_name}] OK {video.name} "
                    f"persons_unique={summary.persons_unique} p75={summary.persons_p75:.1f} "
                    f"sat_index={summary.saturation_index:.2f} "
                    f"t={summary.duration_processing_s:.1f}s",
                    flush=True,
                )
            except SkipVideo as exc:
                print(f"[{args.worker_name}] SKIP {video.name}: {exc}", flush=True)
                mark_skipped(args.jobs_dir, video, str(exc))
            except Exception as exc:
                import traceback
                tb = traceback.format_exc()
                print(f"[{args.worker_name}] FAIL {video.name}: {exc}", file=sys.stderr, flush=True)
                (args.jobs_dir / f"{video.name}.lock").unlink(missing_ok=True)
                (args.jobs_dir / f"{video.name}.error").write_text(f"{exc}\n\n{tb}", encoding="utf-8")
        if not any_claimed:
            time.sleep(args.poll_seconds)


if __name__ == "__main__":
    sys.exit(main() or 0)
