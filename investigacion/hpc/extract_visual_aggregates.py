#!/usr/bin/env python3
"""
extract_visual_aggregates.py

Re-analiza outputs YOLO existentes (photo_summary_* y video_saturation_*) para
extraer agregados M1 (físicos) y M3 (sociales/heterotopía) por nodo×ventana.

Lee:
- investigacion/data/processed/photo_summary_IMG_*.json
- investigacion/data/processed/video_saturation_VID_*.json
- investigacion/data/processed/photo_node_assignments.json
- investigacion/data/processed/video_node_assignments.json

Escribe:
- investigacion/data/processed/m1_visual_aggregate.json
- investigacion/data/processed/m3_visual_aggregate.json

Idempotente: solo lee inputs y escribe los dos JSON nuevos.
"""

from __future__ import annotations

import glob
import json
import math
import os
import statistics
from collections import Counter, defaultdict
from typing import Any, Dict, Iterable, List, Tuple

# ----------------------------------------------------------------------------
# Paths
# ----------------------------------------------------------------------------
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)  # investigacion/
DATA = os.path.join(ROOT, "data", "processed")

PHOTO_SUMMARY_GLOB = os.path.join(DATA, "photo_summary_IMG_*.json")
VIDEO_SAT_GLOB = os.path.join(DATA, "video_saturation_VID_*.json")
PHOTO_ASSIGN = os.path.join(DATA, "photo_node_assignments.json")
VIDEO_ASSIGN = os.path.join(DATA, "video_node_assignments.json")

OUT_M1 = os.path.join(DATA, "m1_visual_aggregate.json")
OUT_M3 = os.path.join(DATA, "m3_visual_aggregate.json")

# ----------------------------------------------------------------------------
# Class taxonomy (proxies)
# ----------------------------------------------------------------------------
VEHICLE_CLASSES = {"car", "motorcycle", "bus", "truck"}
# bolso / mochila / cámara como proxy de turismo + comerciante con producto
CARRIED_OBSTACLE_CLASSES = {"backpack", "handbag", "suitcase"}
TOURIST_PROXY_CLASSES = {"backpack", "handbag", "suitcase", "cell_phone"}
# en COCO no hay "vendor"; usamos productos típicos de comercio informal cuando
# están disponibles. yolo11x detecta superset COCO (bottle, cup, bowl, ...).
COMMERCE_PROXY_CLASSES = {
    "bottle",
    "cup",
    "bowl",
    "wine glass",
    "banana",
    "apple",
    "orange",
    "sandwich",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "handbag",  # vendedora con bolso de mercancía
}

# ----------------------------------------------------------------------------
# Utils
# ----------------------------------------------------------------------------

def _safe_load(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _percentile(values: List[float], p: float) -> float:
    if not values:
        return 0.0
    vs = sorted(values)
    if len(vs) == 1:
        return float(vs[0])
    k = (len(vs) - 1) * (p / 100.0)
    lo = math.floor(k)
    hi = math.ceil(k)
    if lo == hi:
        return float(vs[int(k)])
    return float(vs[lo] + (vs[hi] - vs[lo]) * (k - lo))


def _shannon_entropy(counts: Iterable[int]) -> float:
    counts = [c for c in counts if c > 0]
    total = sum(counts)
    if total == 0:
        return 0.0
    h = 0.0
    for c in counts:
        p = c / total
        h -= p * math.log2(p)
    return h


# ----------------------------------------------------------------------------
# Load assignments
# ----------------------------------------------------------------------------

def load_photo_assignments() -> Dict[str, Tuple[str, str]]:
    """Return mapping photo_filename -> (node, window)."""
    blob = _safe_load(PHOTO_ASSIGN)
    out: Dict[str, Tuple[str, str]] = {}
    for a in blob.get("assignments", []):
        fname = a.get("photo")
        node = a.get("nearest_node")
        window = a.get("inferred_window") or "unknown"
        if fname and node:
            out[fname] = (node, window)
    return out


def load_video_assignments() -> Dict[str, Tuple[str, str]]:
    blob = _safe_load(VIDEO_ASSIGN)
    out: Dict[str, Tuple[str, str]] = {}
    for a in blob.get("assignments", []):
        fname = a.get("video")
        node = a.get("node")
        window = a.get("window") or "unknown"
        if fname and node:
            out[fname] = (node, window)
    return out


# ----------------------------------------------------------------------------
# Per-source extraction: produce a flat list of "frames" with class counts
# ----------------------------------------------------------------------------

def photo_frames(path: str) -> Dict[str, Any]:
    """One photo == one frame. Returns dict with persons, counts, classes."""
    blob = _safe_load(path)
    s = blob.get("summary", {})
    counts = dict(s.get("counts", {}))
    detections = s.get("detections", [])
    # If detections list non-empty, use it as authoritative source of class set
    classes = Counter()
    for d in detections:
        cn = d.get("class_name")
        if cn:
            classes[cn] += 1
    if not classes:
        # fallback to counts dict
        for k, v in counts.items():
            if v:
                classes[k] = int(v)
    return {
        "filename": os.path.basename(s.get("photo", path)),
        "persons": int(s.get("persons", counts.get("person", 0)) or 0),
        "saturation_index": float(s.get("saturation_index") or 0.0),
        "classes": classes,
        "n_frames": 1,
    }


def video_frames(path: str) -> Dict[str, Any]:
    blob = _safe_load(path)
    s = blob.get("summary", {})
    frames = blob.get("frames", []) or []
    tracks = blob.get("tracks", []) or []

    # Per-frame person counts (for percentiles)
    persons_per_frame: List[int] = []
    vehicles_per_frame: List[int] = []
    carried_per_frame: List[int] = []
    classes = Counter()

    for fr in frames:
        c = fr.get("counts", {}) or {}
        persons_per_frame.append(int(c.get("person", 0) or 0))
        vehicles_per_frame.append(sum(int(c.get(k, 0) or 0) for k in VEHICLE_CLASSES))
        carried_per_frame.append(sum(int(c.get(k, 0) or 0) for k in CARRIED_OBSTACLE_CLASSES))
        for k, v in c.items():
            if v:
                classes[k] += int(v)

    # tracks → unique objects observed; better proxy of class diversity
    track_classes = Counter()
    for t in tracks:
        cn = t.get("class_name")
        if cn:
            track_classes[cn] += 1

    return {
        "filename": os.path.basename(s.get("video", path)),
        "persons_per_frame": persons_per_frame,
        "vehicles_per_frame": vehicles_per_frame,
        "carried_per_frame": carried_per_frame,
        "classes_per_frame": classes,
        "track_classes": track_classes,
        "saturation_index": float(s.get("saturation_index") or 0.0),
        "saturation_mean": float(s.get("saturation_mean") or 0.0),
        "persons_unique": int(s.get("persons_unique") or 0),
        "n_frames_sampled": int(s.get("frames_sampled") or len(frames)),
    }


# ----------------------------------------------------------------------------
# Aggregate by (node, window)
# ----------------------------------------------------------------------------

def aggregate() -> Tuple[Dict[str, Any], Dict[str, Any]]:
    photo_assign = load_photo_assignments()
    video_assign = load_video_assignments()

    # buckets by (node, window)
    bucket: Dict[Tuple[str, str], Dict[str, Any]] = defaultdict(lambda: {
        "n_photos": 0,
        "n_videos": 0,
        "person_counts_per_frame": [],   # one entry per photo or per video-frame
        "vehicle_counts_per_frame": [],
        "carried_counts_per_frame": [],
        "saturations": [],               # one per photo or video
        "saturation_max_seen": 0.0,
        "class_counter": Counter(),      # union of detections (counts)
        "tourist_hits": 0,
        "tourist_total_dets": 0,
        "commerce_hits": 0,
        "commerce_total_dets": 0,
        "files_photos": [],
        "files_videos": [],
    })

    # --- photos ---
    for path in sorted(glob.glob(PHOTO_SUMMARY_GLOB)):
        info = photo_frames(path)
        # Match against assignment table by jpg filename
        jpg = os.path.splitext(info["filename"])[0]
        # photo_node_assignments uses ".jpg"
        key_candidates = [info["filename"], jpg + ".jpg"]
        node_window = None
        for k in key_candidates:
            if k in photo_assign:
                node_window = photo_assign[k]
                break
        if node_window is None:
            continue
        node, window = node_window
        b = bucket[(node, window)]
        b["n_photos"] += 1
        b["files_photos"].append(info["filename"])
        b["person_counts_per_frame"].append(info["persons"])
        # photos: vehicles & carried from class counter
        veh = sum(info["classes"].get(k, 0) for k in VEHICLE_CLASSES)
        car = sum(info["classes"].get(k, 0) for k in CARRIED_OBSTACLE_CLASSES)
        b["vehicle_counts_per_frame"].append(veh)
        b["carried_counts_per_frame"].append(car)
        b["saturations"].append(info["saturation_index"])
        b["saturation_max_seen"] = max(b["saturation_max_seen"], info["saturation_index"])
        b["class_counter"].update(info["classes"])
        # tourist / commerce detection accounting
        total_dets = sum(info["classes"].values())
        tourist_hits = sum(info["classes"].get(k, 0) for k in TOURIST_PROXY_CLASSES)
        commerce_hits = sum(info["classes"].get(k, 0) for k in COMMERCE_PROXY_CLASSES)
        b["tourist_hits"] += tourist_hits
        b["commerce_hits"] += commerce_hits
        b["tourist_total_dets"] += total_dets
        b["commerce_total_dets"] += total_dets

    # --- videos ---
    for path in sorted(glob.glob(VIDEO_SAT_GLOB)):
        info = video_frames(path)
        # match key: try .mp4 variants as in assignments table
        candidates = [
            info["filename"],
            info["filename"].replace(".compressed.json", ".compressed.mp4"),
            info["filename"].replace(".json", ".mp4"),
        ]
        # The video_saturation file's `summary.video` already has .mp4; but
        # filename here is from path basename, which is video_saturation_*.json
        # Recover the original VID name:
        base = os.path.basename(path)
        # video_saturation_VID_xxxx.json → VID_xxxx.mp4 (or .compressed.mp4)
        vid_name = base.replace("video_saturation_", "").replace(".json", "")
        # Sometimes file is "....compressed" without .json suffix removed correctly
        # Build candidate with .mp4
        cand2 = [vid_name + ".mp4", vid_name + ".compressed.mp4"]
        # Also: summary.video field is the canonical name
        try:
            blob = _safe_load(path)
            canonical = blob.get("summary", {}).get("video")
            if canonical:
                cand2.insert(0, canonical)
        except Exception:
            pass

        node_window = None
        for k in cand2 + candidates:
            if k in video_assign:
                node_window = video_assign[k]
                break
        if node_window is None:
            continue
        node, window = node_window
        b = bucket[(node, window)]
        b["n_videos"] += 1
        b["files_videos"].append(cand2[0] if cand2 else info["filename"])
        b["person_counts_per_frame"].extend(info["persons_per_frame"])
        b["vehicle_counts_per_frame"].extend(info["vehicles_per_frame"])
        b["carried_counts_per_frame"].extend(info["carried_per_frame"])
        b["saturations"].append(info["saturation_index"])
        b["saturation_max_seen"] = max(b["saturation_max_seen"], info["saturation_mean"], info["saturation_index"])
        b["class_counter"].update(info["classes_per_frame"])
        # detections totals (sum frame counts)
        total_dets = sum(info["classes_per_frame"].values())
        tourist_hits = sum(info["classes_per_frame"].get(k, 0) for k in TOURIST_PROXY_CLASSES)
        commerce_hits = sum(info["classes_per_frame"].get(k, 0) for k in COMMERCE_PROXY_CLASSES)
        b["tourist_hits"] += tourist_hits
        b["commerce_hits"] += commerce_hits
        b["tourist_total_dets"] += total_dets
        b["commerce_total_dets"] += total_dets

    # ---- compute final M1 / M3 maps ----
    m1: Dict[str, Any] = {}
    m3: Dict[str, Any] = {}

    for (node, window), b in bucket.items():
        key = f"{node}|{window}"
        persons = b["person_counts_per_frame"]
        vehicles = b["vehicle_counts_per_frame"]
        carried = b["carried_counts_per_frame"]

        person_total = sum(persons)
        vehicle_total = sum(vehicles)

        # M1 — physical/material
        m1[key] = {
            "node": node,
            "window": window,
            "n_photos": b["n_photos"],
            "n_videos": b["n_videos"],
            "n_frames": len(persons),
            "human_density_p50": _percentile([float(x) for x in persons], 50),
            "human_density_p75": _percentile([float(x) for x in persons], 75),
            "human_density_max": float(max(persons) if persons else 0),
            "human_density_mean": float(statistics.mean(persons)) if persons else 0.0,
            "obstacle_proxy_count": int(sum(carried)),
            "vehicle_intensity": (vehicle_total / person_total) if person_total > 0 else (float(vehicle_total) if vehicle_total else 0.0),
            "vehicle_total": int(vehicle_total),
            "person_total": int(person_total),
            "material_diversity": int(len([c for c in b["class_counter"].values() if c > 0])),
            "saturation_p75": _percentile([float(x) for x in b["saturations"]], 75),
            "saturation_max": float(b["saturation_max_seen"]),
        }

        # M3 — social / heterotopía
        cls = b["class_counter"]
        het = _shannon_entropy(cls.values())
        # max entropy bound for normalization (log2 of nb classes)
        nb_classes = max(1, len([c for c in cls.values() if c > 0]))
        het_norm = het / math.log2(nb_classes) if nb_classes > 1 else 0.0
        tourist_ratio = (b["tourist_hits"] / b["tourist_total_dets"]) if b["tourist_total_dets"] else 0.0
        commerce_ratio = (b["commerce_hits"] / b["commerce_total_dets"]) if b["commerce_total_dets"] else 0.0

        m3[key] = {
            "node": node,
            "window": window,
            "n_photos": b["n_photos"],
            "n_videos": b["n_videos"],
            "tourist_proxy_ratio": tourist_ratio,
            "tourist_proxy_hits": int(b["tourist_hits"]),
            "commerce_proxy": commerce_ratio,
            "commerce_proxy_hits": int(b["commerce_hits"]),
            "heterogeneity_index_visual": het,
            "heterogeneity_index_visual_norm": het_norm,
            "n_distinct_classes": nb_classes,
            "class_distribution": dict(cls),
            "police_proxy": None,  # TODO: requiere uniforme/contexto, no inferible con YOLO COCO básico
            "police_proxy_note": "TODO: YOLO COCO no distingue uniforme; requiere clasificador adicional o anotación manual.",
        }

    # Wrap with metadata
    meta = {
        "_meta": {
            "generator": "investigacion/hpc/extract_visual_aggregates.py",
            "n_buckets": len(bucket),
            "sources": {
                "photo_summary_files": len(glob.glob(PHOTO_SUMMARY_GLOB)),
                "video_saturation_files": len(glob.glob(VIDEO_SAT_GLOB)),
            },
            "vehicle_classes": sorted(VEHICLE_CLASSES),
            "carried_obstacle_classes": sorted(CARRIED_OBSTACLE_CLASSES),
            "tourist_proxy_classes": sorted(TOURIST_PROXY_CLASSES),
            "commerce_proxy_classes": sorted(COMMERCE_PROXY_CLASSES),
        }
    }
    m1_out = {**meta, "by_node_window": m1}
    m3_out = {**meta, "by_node_window": m3}
    return m1_out, m3_out


def main() -> None:
    m1, m3 = aggregate()
    with open(OUT_M1, "w", encoding="utf-8") as fh:
        json.dump(m1, fh, ensure_ascii=False, indent=2)
    with open(OUT_M3, "w", encoding="utf-8") as fh:
        json.dump(m3, fh, ensure_ascii=False, indent=2)
    print(f"[ok] wrote {OUT_M1} ({len(m1['by_node_window'])} buckets)")
    print(f"[ok] wrote {OUT_M3} ({len(m3['by_node_window'])} buckets)")

    # quick stdout summary: top by density and heterogeneity
    by_dens = sorted(m1["by_node_window"].items(), key=lambda kv: kv[1]["human_density_p75"], reverse=True)[:5]
    by_het = sorted(m3["by_node_window"].items(), key=lambda kv: kv[1]["heterogeneity_index_visual"], reverse=True)[:5]
    print("\nTop 5 by human_density_p75:")
    for k, v in by_dens:
        print(f"  {k:40s} p50={v['human_density_p50']:.2f} p75={v['human_density_p75']:.2f} max={v['human_density_max']:.0f} (frames={v['n_frames']})")
    print("\nTop 5 by heterogeneity_index_visual:")
    for k, v in by_het:
        print(f"  {k:40s} H={v['heterogeneity_index_visual']:.3f} norm={v['heterogeneity_index_visual_norm']:.3f} classes={v['n_distinct_classes']}")


if __name__ == "__main__":
    main()
