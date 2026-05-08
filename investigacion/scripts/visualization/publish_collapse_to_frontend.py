"""
Inyecta la matriz de colapso fenomenológico, las asignaciones de fotos por GPS
y las asignaciones de videos por correlación temporal al
`public/data/frontend_payload.json`, sin reescribir el resto del payload.

Idempotente: si los archivos fuente no existen, deja el payload intacto.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(p: Path) -> dict | None:
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[3])
    args = ap.parse_args()

    repo = args.repo
    payload_path = repo / "public" / "data" / "frontend_payload.json"
    if not payload_path.exists():
        print(f"falta {payload_path}", flush=True)
        return 2

    payload = json.loads(payload_path.read_text(encoding="utf-8"))

    inv = repo / "investigacion"
    matrix = load_json(inv / "data" / "processed" / "collapse_matrix.json")
    photo_assign = load_json(inv / "data" / "processed" / "photo_node_assignments.json")
    video_assign = load_json(inv / "data" / "processed" / "video_node_assignments.json")
    c1_proj = load_json(inv / "data" / "processed" / "c1_hourly_projection.json")

    field = {
        "status": "field_ingest_in_progress",
        "captured_on": "2026-05-05",
        "ingested_at_iso": payload.get("meta", {}).get("generated_at"),
    }

    if matrix:
        cells_compact = []
        for key, c in (matrix.get("cells") or {}).items():
            cells_compact.append({
                "key": key,
                "node": c.get("node"),
                "window": c.get("window"),
                "decision": c.get("decision"),
                "C1": c.get("C1_crime_high"),
                "C2": c.get("C2_security_low"),
                "C3": c.get("C3_habitability_negative"),
                "C4": c.get("C4_saturation_high"),
                "conditions_met": c.get("conditions_met"),
                "coverage": c.get("coverage_sources"),
            })
        field["collapse_matrix"] = {
            "rule": matrix.get("rule"),
            "decisions": matrix.get("decisions"),
            "cells": cells_compact,
        }

    if photo_assign:
        field["photo_assignments"] = {
            "n_total": photo_assign.get("n_photos_total"),
            "n_with_gps": photo_assign.get("n_with_gps"),
            "by_node": photo_assign.get("aggregates_by_node"),
            "by_node_window": photo_assign.get("aggregates_by_node_window"),
        }

    if video_assign:
        field["video_assignments"] = {
            "n_videos": video_assign.get("n_videos"),
            "n_with_node": video_assign.get("n_with_node"),
            "by_confidence": video_assign.get("by_confidence"),
            "assignments": [
                {
                    "video": a.get("video"),
                    "ts": a.get("ts"),
                    "window": a.get("window"),
                    "node": a.get("node"),
                    "confidence": a.get("confidence"),
                    "delta_seconds": a.get("delta_seconds"),
                }
                for a in (video_assign.get("assignments") or [])
            ],
        }

    if c1_proj:
        field["c1_hourly_projection"] = {
            "supuesto": c1_proj.get("supuesto"),
            "weights": c1_proj.get("weights"),
            "p75_per_window_cases_per_hour": (c1_proj.get("projection") or {}).get("p75_per_window_cases_per_hour"),
        }

    payload["field_calibration"] = field
    payload.setdefault("meta", {})["field_published_at"] = (
        matrix.get("generated_at") if matrix else None
    )

    payload_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {payload_path}", flush=True)
    if matrix:
        print(f"decisiones: {matrix.get('decisions')}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
