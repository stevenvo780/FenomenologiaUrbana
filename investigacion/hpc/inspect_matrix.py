"""Imprime un resumen legible de collapse_matrix.json."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = ap.parse_args()

    matrix_path = args.root / "data" / "processed" / "collapse_matrix.json"
    if not matrix_path.exists():
        print(f"falta {matrix_path}")
        return 2
    m = json.loads(matrix_path.read_text(encoding="utf-8"))
    print("=== Decisions ===")
    for k, v in m.get("decisions", {}).items():
        print(f"  {k}: {v}")
    print()
    print("=== Cells with C4_saturation_high or C1_crime_high ===")
    for key, c in m.get("cells", {}).items():
        if c.get("C4_saturation_high") or c.get("C1_crime_high"):
            flags = []
            if c.get("C1_crime_high"):
                flags.append("C1")
            if c.get("C2_security_low"):
                flags.append("C2")
            if c.get("C3_habitability_negative"):
                flags.append("C3")
            if c.get("C4_saturation_high"):
                flags.append("C4")
            print(f"  {key:36s}  decision={c['decision']:24s}  flags={','.join(flags) or '-':10s}  cov={c['coverage_sources']}")
    print()
    print("=== Cells with non-inconcluyente decision ===")
    for key, c in m.get("cells", {}).items():
        if c.get("decision") != "inconcluyente":
            print(f"  {key:36s}  decision={c['decision']:24s}  conditions_met={c['conditions_met']}  cov={c['coverage_sources']}")
    print()
    print("=== C1 hourly summary ===")
    proj = (m.get("C1") or {}).get("hourly_projection") or {}
    print(f"  weights: {proj.get('weights')}")
    print(f"  p75/window cases/hour: {proj.get('p75_per_window_cases_per_hour')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
