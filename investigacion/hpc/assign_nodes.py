"""
Asignación automática de fotos a nodos del modelo M-MASS por proximidad GPS.

Lee `photo_summary_*.json` (campo `exif.gps_lat`/`gps_lon`), calcula distancia
haversine al nodo más cercano del `case_model.json` y escribe:

- investigacion/data/processed/photo_node_assignments.json: mapping foto→nodo
  con distancia, persons, sat_index, captured_at y una franja inferida del
  timestamp.

Si la foto no tiene GPS, queda sin asignar y se reporta.

Uso:
  python assign_nodes.py [--root <repo_root>]

NO usa GPU ni red.
"""

from __future__ import annotations

import argparse
import json
import math
from collections import Counter, defaultdict
from datetime import datetime, time
from pathlib import Path

WINDOWS = [
    ("peak_am", time(7, 0), time(10, 0)),
    ("midday", time(10, 0), time(15, 0)),
    ("peak_pm", time(15, 0), time(20, 0)),
    ("night", time(20, 0), time(23, 59)),
]


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def infer_window(captured_at: str | None) -> str | None:
    if not captured_at:
        return None
    s = captured_at.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(s)
    except ValueError:
        try:
            dt = datetime.strptime(captured_at[:19], "%Y:%m:%d %H:%M:%S")
        except Exception:
            return None
    t = dt.time()
    for name, lo, hi in WINDOWS:
        if lo <= t <= hi:
            return name
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    case_path = args.root / "outputs" / "case_model.json"
    case = json.loads(case_path.read_text(encoding="utf-8"))
    nodes = [(n["id"], n["lat"], n["lon"]) for n in case["nodes"]]

    proc_dir = args.root / "data" / "processed"
    files = sorted(proc_dir.glob("photo_summary_*.json"))
    assignments = []
    no_gps = []

    for f in files:
        data = json.loads(f.read_text(encoding="utf-8"))
        s = data.get("summary") or {}
        exif = s.get("exif") or {}
        lat = exif.get("gps_lat")
        lon = exif.get("gps_lon")
        if lat is None or lon is None:
            no_gps.append(s.get("photo"))
            continue
        best = None
        for nid, nlat, nlon in nodes:
            d = haversine_m(lat, lon, nlat, nlon)
            if best is None or d < best[1]:
                best = (nid, d)
        window = infer_window(s.get("captured_at") or exif.get("datetime_original"))
        assignments.append({
            "photo": s.get("photo"),
            "captured_at": s.get("captured_at") or exif.get("datetime_original"),
            "gps": [lat, lon],
            "nearest_node": best[0],
            "distance_m": round(best[1], 1),
            "inferred_window": window,
            "persons": s.get("persons"),
            "saturation_index": s.get("saturation_index"),
            "edge_density": s.get("edge_density"),
            "brightness": s.get("brightness"),
        })

    # agregaciones
    by_node = defaultdict(list)
    by_node_window = defaultdict(list)
    for a in assignments:
        by_node[a["nearest_node"]].append(a)
        if a["inferred_window"]:
            by_node_window[(a["nearest_node"], a["inferred_window"])].append(a)

    aggregates = {}
    for n, items in by_node.items():
        persons = [x["persons"] for x in items if x.get("persons") is not None]
        sat = [x["saturation_index"] for x in items if x.get("saturation_index") is not None]
        aggregates[n] = {
            "n_photos": len(items),
            "persons_mean": (sum(persons) / len(persons)) if persons else None,
            "persons_max": max(persons) if persons else None,
            "saturation_mean": (sum(sat) / len(sat)) if sat else None,
            "saturation_max": max(sat) if sat else None,
        }

    cells = {}
    for (n, w), items in by_node_window.items():
        persons = [x["persons"] for x in items if x.get("persons") is not None]
        sat = [x["saturation_index"] for x in items if x.get("saturation_index") is not None]
        cells[f"{n}|{w}"] = {
            "n_photos": len(items),
            "persons_mean": (sum(persons) / len(persons)) if persons else None,
            "persons_max": max(persons) if persons else None,
            "saturation_mean": (sum(sat) / len(sat)) if sat else None,
        }

    out = {
        "n_photos_total": len(files),
        "n_with_gps": len(assignments),
        "n_without_gps": len(no_gps),
        "no_gps_files": no_gps,
        "aggregates_by_node": aggregates,
        "aggregates_by_node_window": cells,
        "assignments": assignments,
    }

    out_path = args.out or (proc_dir / "photo_node_assignments.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {out_path}")
    print(f"asignadas: {len(assignments)}/{len(files)} (sin GPS: {len(no_gps)})")
    print(f"distribución por nodo: {dict(Counter(a['nearest_node'] for a in assignments))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
