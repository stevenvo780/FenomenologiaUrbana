"""
Procesamiento de videos POV / saturación con detección YOLO en GPU.

Entrada:  archivos .mp4/.mov/.mkv en --raw-dir, con metadata (nodo, franja) por convención
          de nombre `NODE__WINDOW__YYYY-MM-DD__libre.ext` o vía sidecar `<video>.meta.json`.
Salida:   un JSON por video en --out-dir/video_saturation_<basename>.json con conteo por
          frame, densidad agregada, percentiles y resumen por celda nodo×franja.

Modo cooperativo: cada worker reclama un job creando un lock en --jobs-dir.
Esto permite ejecutar dos contenedores sobre el mismo --raw-dir sin colisión.
"""

from __future__ import annotations

import argparse
import json
import os
import socket
import sys
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np
from tqdm import tqdm
from ultralytics import YOLO

VIDEO_EXTS = (".mp4", ".mov", ".mkv", ".avi", ".m4v")
PERSON_CLASS_ID = 0


@dataclass
class FrameStat:
    frame_idx: int
    timestamp_s: float
    persons: int
    mean_conf: float


@dataclass
class VideoSummary:
    video: str
    node: str | None
    window: str | None
    captured_at: str | None
    duration_s: float
    fps: float
    frames_total: int
    frames_sampled: int
    persons_p50: float
    persons_p75: float
    persons_p90: float
    persons_max: int
    saturation_index: float  # persons_p75 normalizado por área visible (proxy)
    worker: str
    lot: str
    yolo_model: str
    processed_at: str


def parse_metadata(video_path: Path) -> dict:
    sidecar = video_path.with_suffix(video_path.suffix + ".meta.json")
    if sidecar.exists():
        return json.loads(sidecar.read_text(encoding="utf-8"))
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
    if done.exists():
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
        json.dumps({"summary": asdict(summary)}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def iter_videos(raw_dir: Path) -> Iterable[Path]:
    for p in sorted(raw_dir.rglob("*")):
        if p.is_file() and p.suffix.lower() in VIDEO_EXTS:
            yield p


def process_one(
    video: Path,
    out_dir: Path,
    model: YOLO,
    yolo_model_name: str,
    sample_stride: int,
    conf_thresh: float,
    worker: str,
    lot: str,
) -> VideoSummary:
    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        raise RuntimeError(f"No se puede abrir {video}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration = (total / fps) if fps else 0.0

    stats: list[FrameStat] = []
    idx = 0
    pbar = tqdm(total=total or None, desc=f"[{worker}] {video.name}", unit="frame", leave=False)
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if idx % sample_stride == 0:
            res = model.predict(
                source=frame,
                imgsz=960,
                conf=conf_thresh,
                classes=[PERSON_CLASS_ID],
                device=0,
                verbose=False,
            )[0]
            if res.boxes is None or res.boxes.cls is None:
                persons = 0
                mean_conf = 0.0
            else:
                cls = res.boxes.cls.cpu().numpy().astype(int)
                conf = res.boxes.conf.cpu().numpy()
                mask = cls == PERSON_CLASS_ID
                persons = int(mask.sum())
                mean_conf = float(conf[mask].mean()) if persons else 0.0
            ts = idx / fps if fps else 0.0
            stats.append(FrameStat(idx, ts, persons, mean_conf))
        idx += 1
        pbar.update(1)
    pbar.close()
    cap.release()

    counts = np.array([s.persons for s in stats], dtype=np.float64) if stats else np.array([0.0])
    p50 = float(np.percentile(counts, 50))
    p75 = float(np.percentile(counts, 75))
    p90 = float(np.percentile(counts, 90))
    pmax = int(counts.max())
    sat = p75  # placeholder normalizable cuando se calibre área visible por nodo

    meta = parse_metadata(video)
    summary = VideoSummary(
        video=video.name,
        node=meta.get("node"),
        window=meta.get("window"),
        captured_at=meta.get("captured_at"),
        duration_s=duration,
        fps=fps,
        frames_total=total,
        frames_sampled=len(stats),
        persons_p50=p50,
        persons_p75=p75,
        persons_p90=p90,
        persons_max=pmax,
        saturation_index=sat,
        worker=worker,
        lot=lot,
        yolo_model=yolo_model_name,
        processed_at=time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    )

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"video_saturation_{video.stem}.json"
    out_path.write_text(
        json.dumps(
            {"summary": asdict(summary), "frames": [asdict(s) for s in stats]},
            ensure_ascii=False,
            indent=2,
        ),
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
    parser.add_argument("--sample-stride", type=int, default=int(os.environ.get("SAMPLE_STRIDE", "5")))
    parser.add_argument("--conf-thresh", type=float, default=float(os.environ.get("CONF_THRESH", "0.35")))
    parser.add_argument("--poll-seconds", type=int, default=15)
    args = parser.parse_args()

    print(f"[{args.worker_name}] cargando modelo {args.yolo_model}...", flush=True)
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
                    conf_thresh=args.conf_thresh,
                    worker=args.worker_name,
                    lot=args.lot,
                )
                mark_done(args.jobs_dir, video, summary)
                print(f"[{args.worker_name}] OK {video.name} p75={summary.persons_p75:.1f}", flush=True)
            except Exception as exc:
                print(f"[{args.worker_name}] FAIL {video.name}: {exc}", file=sys.stderr, flush=True)
                (args.jobs_dir / f"{video.name}.lock").unlink(missing_ok=True)
                (args.jobs_dir / f"{video.name}.error").write_text(str(exc), encoding="utf-8")
        if not any_claimed:
            time.sleep(args.poll_seconds)


if __name__ == "__main__":
    sys.exit(main() or 0)
