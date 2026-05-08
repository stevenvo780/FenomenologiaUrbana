"""
Asignación de videos a nodos por correlación temporal con las fotos GPS.

Heurística: los videos del campo se grabaron en la misma jornada que las fotos.
Las fotos llevan EXIF GPS → ya asignadas a nodo (assign_nodes.py). Los videos
NO embeben GPS en MP4 (limitación del celular), pero llevan timestamp en el
nombre `VID_YYYYMMDD_HHMMSS.mp4` y/o en el sidecar `.meta.json`.

Para cada video se busca la foto más cercana en tiempo y se hereda el nodo
de esa foto. Se reporta:
- nearest_node (heredado)
- delta_seconds (cuán fiable es la herencia)
- confidence: high si delta < 300 s, medium si < 1800 s, low si más
- también se calcula la franja horaria por timestamp del video

Salida:
  data/processed/video_node_assignments.json

NO modifica los video_saturation_*.json existentes; solo produce un mapa
auxiliar que el cruce de la matriz puede consumir.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, time, timedelta
from pathlib import Path

WINDOWS = [
    ("peak_am", time(7, 0), time(10, 0)),
    ("midday", time(10, 0), time(15, 0)),
    ("peak_pm", time(15, 0), time(20, 0)),
    ("night", time(20, 0), time(23, 59, 59)),
]

PHONE_RE = re.compile(r"VID_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})", re.IGNORECASE)
TZ_OFFSET = timedelta(hours=-5)


def parse_video_ts(name: str) -> datetime | None:
    m = PHONE_RE.search(name)
    if not m:
        return None
    y, mo, d, h, mi, s = m.groups()
    return datetime(int(y), int(mo), int(d), int(h), int(mi), int(s))


def parse_iso(s: str | None) -> datetime | None:
    if not s:
        return None
    s = s.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(s)
        if dt.tzinfo is not None:
            dt = (dt + TZ_OFFSET) - dt.utcoffset() if dt.utcoffset() else dt
        return dt.replace(tzinfo=None)
    except ValueError:
        try:
            return datetime.strptime(s[:19], "%Y:%m:%d %H:%M:%S")
        except Exception:
            return None


def infer_window(dt: datetime | None) -> str | None:
    if not dt:
        return None
    t = dt.time()
    for name, lo, hi in WINDOWS:
        if lo <= t <= hi:
            return name
    return None


def load_photo_assignments(processed_dir: Path) -> list[dict]:
    """Carga las asignaciones nodo+gps+timestamp de las fotos."""
    photos = []
    for f in sorted(processed_dir.glob("photo_summary_*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        s = data.get("summary") or {}
        exif = s.get("exif") or {}
        if exif.get("gps_lat") is None:
            continue
        ts = parse_iso(s.get("captured_at") or exif.get("datetime_original"))
        if not ts:
            continue
        photos.append({
            "photo": s.get("photo"),
            "ts": ts,
            "gps": [exif["gps_lat"], exif["gps_lon"]],
            "persons": s.get("persons"),
            "saturation_index": s.get("saturation_index"),
        })
    return photos


def assign_nearest_photo_node(photos: list[dict], video_ts: datetime) -> dict | None:
    if not photos:
        return None
    best = min(photos, key=lambda p: abs((p["ts"] - video_ts).total_seconds()))
    delta = abs((best["ts"] - video_ts).total_seconds())
    return {"photo": best, "delta_seconds": delta}


def haversine_node(case: dict, lat: float, lon: float) -> tuple[str, float]:
    import math
    R = 6371000.0
    best = None
    for n in case["nodes"]:
        p1, p2 = math.radians(lat), math.radians(n["lat"])
        dp = math.radians(n["lat"] - lat)
        dl = math.radians(n["lon"] - lon)
        a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
        d = 2 * R * math.asin(math.sqrt(a))
        if best is None or d < best[1]:
            best = (n["id"], d)
    return best


def confidence_from_delta(delta_s: float) -> str:
    if delta_s < 300:
        return "high"
    if delta_s < 1800:
        return "medium"
    if delta_s < 7200:
        return "low"
    return "very_low"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    processed = args.root / "data" / "processed"
    case = json.loads((args.root / "outputs" / "case_model.json").read_text(encoding="utf-8"))

    photos = load_photo_assignments(processed)
    print(f"fotos con GPS y timestamp: {len(photos)}")

    videos_dir = args.root / "data" / "raw" / "video"
    video_files = sorted(videos_dir.glob("*.mp4"))

    assignments = []
    for v in video_files:
        ts = parse_video_ts(v.name)
        if ts is None:
            continue
        nearest = assign_nearest_photo_node(photos, ts)
        if nearest is None:
            assignments.append({
                "video": v.name, "ts": ts.isoformat(),
                "window": infer_window(ts),
                "node": None, "method": "no_photos",
            })
            continue
        photo = nearest["photo"]
        node, dist_m = haversine_node(case, photo["gps"][0], photo["gps"][1])
        assignments.append({
            "video": v.name,
            "ts": ts.isoformat(),
            "window": infer_window(ts),
            "node": node,
            "method": "temporal_correlation_with_photo",
            "reference_photo": photo["photo"],
            "reference_photo_ts": photo["ts"].isoformat(),
            "delta_seconds": nearest["delta_seconds"],
            "confidence": confidence_from_delta(nearest["delta_seconds"]),
            "reference_distance_to_node_m": round(dist_m, 1),
            "reference_persons": photo.get("persons"),
            "reference_saturation_index": photo.get("saturation_index"),
        })

    out = args.out or (processed / "video_node_assignments.json")
    out.write_text(json.dumps({
        "method": "Para cada video, se asigna el nodo de la foto GPS más cercana en tiempo. "
                  "Confianza decrece con el delta_seconds. Las fotos del corredor de La Candelaria "
                  "tienen GPS por EXIF; los videos no, por limitación del contenedor MP4 del celular.",
        "n_videos": len(assignments),
        "n_with_node": sum(1 for a in assignments if a.get("node")),
        "by_confidence": {
            c: sum(1 for a in assignments if a.get("confidence") == c)
            for c in ("high", "medium", "low", "very_low")
        },
        "assignments": assignments,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {out}")
    for a in assignments:
        n = a.get("node") or "-"
        c = a.get("confidence") or "-"
        d = a.get("delta_seconds")
        d_str = f"{d:.0f}s" if isinstance(d, (int, float)) else "-"
        print(f"  {a['video']:42s}  ts={a['ts'][11:19]}  win={a.get('window') or '-':8s}  node={n:22s}  conf={c:9s}  Δ={d_str}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
