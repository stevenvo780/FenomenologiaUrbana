"""
Procesamiento de fotos de campo: detección multi-clase + EXIF + features visuales.

Salida: investigacion/data/processed/photo_summary_<basename>.json con
- exif: GPS si existe, fecha original, orientación, modelo de cámara.
- detections: clases COCO relevantes detectadas con confianza y bbox.
- visual: brillo, contraste, saturación HSV, densidad de bordes.
- meta: nodo y franja si hay sidecar .meta.json o convención de nombre.
"""

from __future__ import annotations

import argparse
import json
import os
import socket
import sys
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable

import cv2
import numpy as np
from PIL import Image, ExifTags
from ultralytics import YOLO

PHOTO_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".heic")


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


@dataclass
class Detection:
    class_name: str
    confidence: float
    bbox_xyxy: list[float]


@dataclass
class PhotoSummary:
    photo: str
    node: str | None
    window: str | None
    captured_at: str | None
    width: int
    height: int
    exif: dict
    counts: dict[str, int]
    detections: list[Detection]
    persons: int
    brightness: float
    contrast: float
    saturation: float
    edge_density: float
    saturation_index: float
    worker: str
    yolo_model: str
    processed_at: str


def parse_metadata(photo_path: Path) -> dict:
    sidecar = photo_path.with_suffix(photo_path.suffix + ".meta.json")
    if sidecar.exists():
        try:
            return json.loads(sidecar.read_text(encoding="utf-8"))
        except Exception:
            return {}
    name = photo_path.stem
    parts = name.split("__")
    meta: dict = {}
    if len(parts) >= 3:
        meta["node"] = parts[0]
        meta["window"] = parts[1]
        meta["captured_at"] = parts[2]
    return meta


def gps_to_decimal(value, ref) -> float | None:
    try:
        d, m, s = value
        deg = float(d) + float(m) / 60.0 + float(s) / 3600.0
        if ref in ("S", "W"):
            deg = -deg
        return deg
    except Exception:
        return None


def read_exif(photo_path: Path) -> dict:
    out: dict = {}
    try:
        img = Image.open(photo_path)
        raw = img._getexif() or {}
        if not raw:
            return out
        tagmap = {ExifTags.TAGS.get(k, k): v for k, v in raw.items()}
        if "DateTimeOriginal" in tagmap:
            out["datetime_original"] = str(tagmap["DateTimeOriginal"])
        if "Orientation" in tagmap:
            out["orientation"] = int(tagmap["Orientation"])
        if "Make" in tagmap:
            out["camera_make"] = str(tagmap["Make"]).strip()
        if "Model" in tagmap:
            out["camera_model"] = str(tagmap["Model"]).strip()
        gps = tagmap.get("GPSInfo")
        if isinstance(gps, dict) and gps:
            named = {ExifTags.GPSTAGS.get(k, k): v for k, v in gps.items()}
            lat = gps_to_decimal(named.get("GPSLatitude"), named.get("GPSLatitudeRef"))
            lon = gps_to_decimal(named.get("GPSLongitude"), named.get("GPSLongitudeRef"))
            alt = named.get("GPSAltitude")
            if lat is not None and lon is not None:
                out["gps_lat"] = lat
                out["gps_lon"] = lon
                if alt is not None:
                    try:
                        out["gps_alt_m"] = float(alt)
                    except Exception:
                        pass
    except Exception as exc:
        out["exif_error"] = str(exc)
    return out


def compute_visual_features(frame_bgr: np.ndarray) -> tuple[float, float, float, float]:
    gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2HSV)
    brightness = float(gray.mean())
    contrast = float(gray.std())
    saturation = float(hsv[..., 1].mean())
    edges = cv2.Canny(gray, 80, 160)
    edge_density = float(edges.mean())
    return brightness, contrast, saturation, edge_density


def claim_job(jobs_dir: Path, photo: Path, worker: str) -> bool:
    jobs_dir.mkdir(parents=True, exist_ok=True)
    lock = jobs_dir / f"{photo.name}.lock"
    done = jobs_dir / f"{photo.name}.done"
    err = jobs_dir / f"{photo.name}.error"
    if done.exists() or err.exists():
        return False
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        with os.fdopen(fd, "w") as f:
            f.write(json.dumps({"worker": worker, "host": socket.gethostname(), "ts": time.time()}))
        return True
    except FileExistsError:
        return False


def mark_done(jobs_dir: Path, photo: Path, summary: PhotoSummary) -> None:
    (jobs_dir / f"{photo.name}.lock").unlink(missing_ok=True)
    (jobs_dir / f"{photo.name}.done").write_text(
        dumps({"summary": asdict(summary)}),
        encoding="utf-8",
    )


def iter_photos(raw_dir: Path) -> Iterable[Path]:
    for p in sorted(raw_dir.rglob("*")):
        if p.is_file() and p.suffix.lower() in PHOTO_EXTS:
            yield p


def process_one(
    photo: Path,
    out_dir: Path,
    model: YOLO,
    yolo_model_name: str,
    conf_thresh: float,
    imgsz: int,
    worker: str,
) -> PhotoSummary:
    img_bgr = cv2.imread(str(photo))
    if img_bgr is None:
        raise RuntimeError(f"No se puede abrir {photo}")
    h, w = img_bgr.shape[:2]
    brightness, contrast, saturation, edge_density = compute_visual_features(img_bgr)

    res = model.predict(
        source=img_bgr,
        imgsz=imgsz,
        conf=conf_thresh,
        classes=list(TRACK_CLASSES.keys()),
        device=0,
        verbose=False,
    )[0]
    counts = {v: 0 for v in TRACK_CLASSES.values()}
    detections: list[Detection] = []
    if res.boxes is not None and res.boxes.cls is not None:
        cls = res.boxes.cls.cpu().numpy().astype(int)
        conf = res.boxes.conf.cpu().numpy()
        xyxy = res.boxes.xyxy.cpu().numpy()
        for i in range(len(cls)):
            name = TRACK_CLASSES.get(int(cls[i]))
            if not name:
                continue
            counts[name] += 1
            detections.append(Detection(
                class_name=name,
                confidence=float(conf[i]),
                bbox_xyxy=[float(x) for x in xyxy[i]],
            ))

    persons = counts.get("person", 0)
    sat_components = [
        persons / 20.0,
        edge_density / 50.0,
        saturation / 200.0,
    ]
    saturation_index = float(np.clip(np.mean(sat_components), 0.0, 5.0))

    meta = parse_metadata(photo)
    exif = read_exif(photo)

    summary = PhotoSummary(
        photo=photo.name,
        node=meta.get("node"),
        window=meta.get("window"),
        captured_at=meta.get("captured_at") or exif.get("datetime_original"),
        width=w,
        height=h,
        exif=exif,
        counts=counts,
        detections=detections,
        persons=persons,
        brightness=brightness,
        contrast=contrast,
        saturation=saturation,
        edge_density=edge_density,
        saturation_index=saturation_index,
        worker=worker,
        yolo_model=yolo_model_name,
        processed_at=time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    )

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"photo_summary_{photo.stem}.json"
    out_path.write_text(
        dumps({"summary": asdict(summary)}),
        encoding="utf-8",
    )
    return summary


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    parser.add_argument("--jobs-dir", type=Path, required=True)
    parser.add_argument("--worker-name", default=os.environ.get("WORKER_NAME", "worker"))
    parser.add_argument("--yolo-model", default=os.environ.get("YOLO_MODEL", "yolo11x.pt"))
    parser.add_argument("--imgsz", type=int, default=int(os.environ.get("IMGSZ", "1280")))
    parser.add_argument("--conf-thresh", type=float, default=float(os.environ.get("CONF_THRESH", "0.25")))
    parser.add_argument("--poll-seconds", type=int, default=20)
    args = parser.parse_args()

    print(f"[{args.worker_name}] cargando modelo {args.yolo_model} (imgsz={args.imgsz})...", flush=True)
    model = YOLO(args.yolo_model)

    while True:
        any_claimed = False
        for photo in iter_photos(args.raw_dir):
            if not claim_job(args.jobs_dir, photo, args.worker_name):
                continue
            any_claimed = True
            try:
                summary = process_one(
                    photo=photo,
                    out_dir=args.out_dir,
                    model=model,
                    yolo_model_name=args.yolo_model,
                    conf_thresh=args.conf_thresh,
                    imgsz=args.imgsz,
                    worker=args.worker_name,
                )
                mark_done(args.jobs_dir, photo, summary)
                gps = ""
                if "gps_lat" in summary.exif:
                    gps = f" gps=({summary.exif['gps_lat']:.5f},{summary.exif['gps_lon']:.5f})"
                print(
                    f"[{args.worker_name}] OK {photo.name} persons={summary.persons} "
                    f"sat_index={summary.saturation_index:.2f}{gps}",
                    flush=True,
                )
            except Exception as exc:
                print(f"[{args.worker_name}] FAIL {photo.name}: {exc}", file=sys.stderr, flush=True)
                (args.jobs_dir / f"{photo.name}.lock").unlink(missing_ok=True)
                (args.jobs_dir / f"{photo.name}.error").write_text(str(exc), encoding="utf-8")
        if not any_claimed:
            time.sleep(args.poll_seconds)


if __name__ == "__main__":
    sys.exit(main() or 0)
