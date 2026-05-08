"""
Aplica las asignaciones de `video_node_assignments.json` a:

1. los sidecars `.meta.json` junto a cada video crudo (para que reprocesos
   futuros nazcan con node/window correctos).
2. los `video_saturation_*.json` ya generados (para que el cruce de la
   matriz consuma node/window sin reprocesar).

Idempotente. No modifica nada si la asignación está vacía.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--min-confidence", default="medium",
                    choices=["high", "medium", "low", "very_low"])
    args = ap.parse_args()

    proc = args.root / "data" / "processed"
    assign_path = proc / "video_node_assignments.json"
    if not assign_path.exists():
        print(f"falta {assign_path}; corre primero assign_videos_by_time.py")
        return 2

    data = json.loads(assign_path.read_text(encoding="utf-8"))
    rank = ["high", "medium", "low", "very_low"]
    min_idx = rank.index(args.min_confidence)

    updated_sidecars = 0
    updated_summaries = 0

    for a in data["assignments"]:
        node = a.get("node")
        window = a.get("window")
        conf = a.get("confidence") or "very_low"
        if not node:
            continue
        if rank.index(conf) > min_idx:
            continue

        video_name = a["video"]
        # 1) sidecar
        sidecar = args.root / "data" / "raw" / "video" / f"{video_name}.meta.json"
        if sidecar.exists():
            try:
                meta = json.loads(sidecar.read_text(encoding="utf-8"))
            except Exception:
                meta = {}
        else:
            meta = {}
        meta.update({
            "node": node,
            "window": window,
            "node_assignment_method": a.get("method"),
            "node_assignment_confidence": conf,
            "node_assignment_delta_seconds": a.get("delta_seconds"),
            "node_assignment_reference_photo": a.get("reference_photo"),
        })
        if "captured_at" not in meta and a.get("ts"):
            meta["captured_at"] = a["ts"]
        sidecar.parent.mkdir(parents=True, exist_ok=True)
        sidecar.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        updated_sidecars += 1

        # 2) video_saturation_*.json
        stem = video_name.rsplit(".", 1)[0]
        summary_path = proc / f"video_saturation_{stem}.json"
        if summary_path.exists():
            try:
                blob = json.loads(summary_path.read_text(encoding="utf-8"))
            except Exception:
                continue
            s = blob.get("summary") or {}
            s["node"] = node
            s["window"] = window
            s["node_assignment_method"] = a.get("method")
            s["node_assignment_confidence"] = conf
            s["node_assignment_delta_seconds"] = a.get("delta_seconds")
            s["node_assignment_reference_photo"] = a.get("reference_photo")
            blob["summary"] = s
            summary_path.write_text(json.dumps(blob, ensure_ascii=False, indent=2), encoding="utf-8")
            updated_summaries += 1

    print(f"sidecars actualizados: {updated_sidecars}")
    print(f"video_saturation actualizados: {updated_summaries}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
