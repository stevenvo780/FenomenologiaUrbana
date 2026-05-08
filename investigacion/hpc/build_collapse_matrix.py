"""
Construye la matriz de colapso fenomenológico (C1 criminalidad + C2 seguridad
percibida + C3 habitabilidad declarada + C4 saturación visual) sobre la malla
nodo × franja del modelo M-MASS.

Entradas:
- investigacion/data/raw/medata_criminalidad_csv.csv  (C1)
- investigacion/data/processed/field_observations_aggregate.csv  (C2)
- investigacion/data/interim/*/interviews/*.coded.json  (C3)
- investigacion/data/processed/video_saturation_*.json  (C4)
- investigacion/outputs/case_model.json  (estructura nodos × franjas)

Salida:
- investigacion/data/processed/collapse_matrix.json  (36 celdas + decisión 3-de-4)

Reglas operacionalizadas en tesis/pendientes/colapso-fenomenologico.md.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from statistics import median, quantiles

NODES_DEFAULT = [
    "san_antonio_metro",
    "parque_san_antonio",
    "palacio_nacional",
    "junin_paseo",
    "oriental_cruce",
    "parque_berrio",
    "carabobo_cultural",
    "plaza_botero",
    "museo_antioquia",
]
WINDOWS_DEFAULT = ["peak_am", "midday", "peak_pm", "night"]

NEGATIVE_HABITABILITY = {"EVITABLE", "NO_DESEABLE", "DIFICIL_DE_VIVIR"}
POSITIVE_HABITABILITY = {"HABITABLE", "DESEABLE"}


def percentile(xs: list[float], q: float) -> float:
    if not xs:
        return 0.0
    if len(xs) == 1:
        return xs[0]
    cuts = quantiles(xs, n=100, method="inclusive")
    idx = max(0, min(98, int(round(q)) - 1))
    return cuts[idx]


def load_c1_crime(csv_path: Path, projection_path: Path | None = None) -> dict:
    """C1: tasa mensual de hurto a persona en comuna 10 + proyección horaria si existe.

    Si `projection_path` apunta a un `c1_hourly_projection.json` válido (producido
    por `c1_project_hourly.py`), se usa para evaluar C1_high por franja con la
    regla `tasa_por_hora >= p75_por_franja`. Si no, se usa el umbral mensual p75.
    """
    if not csv_path.exists():
        return {"available": False, "reason": f"{csv_path} no existe"}
    monthly = defaultdict(int)
    with csv_path.open(encoding="utf-8") as f:
        header = f.readline()
        for line in f:
            parts = line.rstrip("\n").split(",")
            if len(parts) < 4:
                continue
            fecha, conducta, comuna, casos = parts[0], parts[1], parts[2], parts[3]
            if conducta.strip().lower() != "hurto a persona":
                continue
            if comuna.strip() != "10":
                continue
            try:
                monthly[fecha.strip()] += int(casos)
            except ValueError:
                pass
    series = sorted(monthly.items())
    values = [v for _, v in series]
    if not values:
        return {"available": False, "reason": "sin filas hurto a persona en comuna 10"}
    p75 = percentile(values, 75)
    high_months = {k for k, v in monthly.items() if v >= p75}

    out = {
        "available": True,
        "series_months": len(series),
        "p75_month": p75,
        "median_month": median(values),
        "max_month": max(values),
        "months_above_p75": sorted(high_months),
        "high_months_set": list(high_months),
        "hourly_projection": None,
    }

    if projection_path and projection_path.exists():
        try:
            proj = json.loads(projection_path.read_text(encoding="utf-8"))
            out["hourly_projection"] = {
                "supuesto": proj.get("supuesto"),
                "weights": proj.get("weights"),
                "hours_per_window": proj.get("hours_per_window"),
                "p75_per_window_cases_per_hour": (proj.get("projection") or {}).get("p75_per_window_cases_per_hour"),
                "p75_global_cases_per_hour": (proj.get("projection") or {}).get("p75_global_cases_per_hour"),
            }
            out["c1_high_by_window"] = {
                w: True for w in (out["hourly_projection"]["p75_per_window_cases_per_hour"] or {})
            }
        except Exception as exc:
            out["hourly_projection_error"] = str(exc)
    out["note"] = (
        "C1_high por celda usa la proyección horaria si existe. "
        "El supuesto distribucional se documenta en data/processed/c1_hourly_projection.json."
    )
    return out


def load_c2_field(csv_path: Path) -> dict:
    """C2: security_score por nodo×franja desde field_observations_aggregate.csv si existe."""
    if not csv_path.exists():
        return {"available": False, "reason": f"{csv_path} no existe"}
    rows = []
    with csv_path.open(encoding="utf-8") as f:
        header = [h.strip() for h in f.readline().rstrip("\n").split(",")]
        for line in f:
            parts = [p.strip() for p in line.rstrip("\n").split(",")]
            row = dict(zip(header, parts))
            rows.append(row)
    bucket: dict[tuple[str, str], list[float]] = defaultdict(list)
    for row in rows:
        node = row.get("node_id") or row.get("node")
        win = row.get("time_window") or row.get("window")
        score_raw = row.get("security_score")
        if not node or not win or not score_raw:
            continue
        try:
            v = float(score_raw)
        except ValueError:
            continue
        if v <= 0:
            continue
        bucket[(node, win)].append(v)
    out = {}
    for (n, w), xs in bucket.items():
        out[f"{n}|{w}"] = {
            "n": len(xs),
            "mean_security_score": sum(xs) / len(xs),
        }
    return {"available": bool(out), "cells": out}


def load_c3_interviews(interim_dir: Path, processed_dir: Path | None = None) -> dict:
    """C3: codificación de entrevistas con esquema HABITABLE/DESEABLE/EVITABLE/...
    Espera archivos *.coded.json (uno por entrevista o transcript) con
    `node`, `window`, `codes: [str, ...]`.

    Adicionalmente, si `processed_dir` contiene `c3_field_interviews_*.json`
    (entrevistas de campo agregadas), su lista `interviews` se inyecta como
    items equivalentes a *.coded.json (cada entry: node/window/codes).
    """
    bucket: dict[tuple[str, str], Counter] = defaultdict(Counter)
    n_files = 0
    sources_used: list[str] = []
    n_field_interviews = 0

    if interim_dir.exists():
        for f in interim_dir.rglob("*.coded.json"):
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                continue
            node = data.get("node")
            win = data.get("window")
            codes = data.get("codes") or []
            if not node or not win:
                continue
            n_files += 1
            for c in codes:
                bucket[(node, win)][c.upper()] += 1

    if processed_dir and processed_dir.exists():
        for f in sorted(processed_dir.glob("c3_field_interviews_*.json")):
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                continue
            interviews = data.get("interviews") or []
            if not interviews:
                continue
            sources_used.append(f.name)
            for it in interviews:
                node = it.get("node")
                win = it.get("window")
                codes = it.get("codes") or []
                if not node or not win:
                    continue
                n_field_interviews += 1
                for c in codes:
                    bucket[(node, win)][c.upper()] += 1

    if not bucket:
        return {"available": False, "reason": "no hay *.coded.json ni c3_field_interviews_*.json"}

    cells = {}
    for (n, w), counter in bucket.items():
        neg = sum(counter[k] for k in NEGATIVE_HABITABILITY)
        pos = sum(counter[k] for k in POSITIVE_HABITABILITY)
        cells[f"{n}|{w}"] = {
            "counts": dict(counter),
            "negative": neg,
            "positive": pos,
            "dominant_negative": neg > pos,
        }
    return {
        "available": True,
        "files_total": n_files,
        "field_interviews_total": n_field_interviews,
        "field_interview_sources": sources_used,
        "cells": cells,
    }


def load_c4_video(processed_dir: Path) -> dict:
    """C4: saturation_index por nodo×franja desde los video_saturation_*.json."""
    files = list(processed_dir.glob("video_saturation_*.json"))
    if not files:
        return {"available": False, "reason": "no hay video_saturation_*.json"}
    bucket: dict[tuple[str, str], list[float]] = defaultdict(list)
    all_idx: list[float] = []
    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        s = data.get("summary") or {}
        node = s.get("node")
        win = s.get("window")
        idx = s.get("saturation_index")
        if idx is None:
            continue
        all_idx.append(float(idx))
        if node and win:
            bucket[(node, win)].append(float(idx))
    if not all_idx:
        return {"available": False, "reason": "sin saturation_index"}
    p75_global = percentile(all_idx, 75)
    cells = {}
    for (n, w), xs in bucket.items():
        cells[f"{n}|{w}"] = {
            "n": len(xs),
            "saturation_p75": percentile(xs, 75),
            "saturation_max": max(xs),
        }
    return {
        "available": True,
        "files_total": len(files),
        "p75_global": p75_global,
        "cells": cells,
    }


def decide_cell(c1_high: bool, c2_low: bool, c3_neg: bool, c4_sat: bool, coverage: int) -> str:
    if coverage < 2:
        return "inconcluyente"
    n = sum([c1_high, c2_low, c3_neg, c4_sat])
    if n >= 3:
        return "colapso_fenomenologico"
    if n >= 1:
        return "friccion_acumulada"
    return "flujo_ordinario"


def build_matrix(case_model_path: Path, c1: dict, c2: dict, c3: dict, c4: dict) -> dict:
    nodes = NODES_DEFAULT
    windows = WINDOWS_DEFAULT
    if case_model_path.exists():
        try:
            case = json.loads(case_model_path.read_text(encoding="utf-8"))
            nodes = [n["id"] for n in case.get("nodes", [])] or NODES_DEFAULT
            windows = [s["id"] for s in case.get("scenarios", [])] or WINDOWS_DEFAULT
        except Exception:
            pass

    # fix C1 2026-05-07: respeta c1_high_by_window precomputado en load_c1_crime,
    # que evalúa el corte p75 por franja sobre la serie histórica MEData (no sobre la mediana).
    proj = c1.get("hourly_projection") or {}
    c1_high_by_window: dict[str, bool] = dict(c1.get("c1_high_by_window") or {})

    cells = {}
    for n in nodes:
        for w in windows:
            key = f"{n}|{w}"
            c2_cell = (c2.get("cells") or {}).get(key)
            c3_cell = (c3.get("cells") or {}).get(key)
            c4_cell = (c4.get("cells") or {}).get(key)
            c2_low = bool(c2_cell and c2_cell.get("mean_security_score", 5.0) <= 2.0)
            c3_neg = bool(c3_cell and c3_cell.get("dominant_negative"))
            c4_sat = bool(c4_cell and c4_cell.get("saturation_p75", 0.0) >= (c4.get("p75_global") or 1e9))
            c1_high = bool(c1_high_by_window.get(w, False))
            # Cobertura: C1 disponible cuenta si hay proyección horaria;
            # C2/C3/C4 cuentan si hay celda específica nodo×franja.
            c1_available = bool(proj)
            coverage = sum([c1_available, c2_cell is not None, c3_cell is not None, c4_cell is not None])
            decision = decide_cell(c1_high, c2_low, c3_neg, c4_sat, coverage)
            cells[key] = {
                "node": n,
                "window": w,
                "C1_crime_high": c1_high,
                "C2_security_low": c2_low,
                "C3_habitability_negative": c3_neg,
                "C4_saturation_high": c4_sat,
                "conditions_met": sum([c1_high, c2_low, c3_neg, c4_sat]),
                "coverage_sources": coverage,
                "decision": decision,
                "details": {
                    "C2": c2_cell,
                    "C3": c3_cell,
                    "C4": c4_cell,
                },
            }
    summary = Counter(c["decision"] for c in cells.values())
    return {
        "rule": "3-de-4 entre C1 (crimen) / C2 (seguridad) / C3 (habitabilidad) / C4 (saturación)",
        "C1": c1,
        "C2_summary": {"available": c2.get("available"), "cells_with_data": len(c2.get("cells") or {})},
        "C3_summary": {"available": c3.get("available"), "cells_with_data": len(c3.get("cells") or {})},
        "C4_summary": {
            "available": c4.get("available"),
            "cells_with_data": len(c4.get("cells") or {}),
            "p75_global": c4.get("p75_global"),
        },
        "decisions": dict(summary),
        "cells": cells,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    root = args.root
    c1 = load_c1_crime(
        root / "data" / "raw" / "medata_criminalidad_csv.csv",
        projection_path=root / "data" / "processed" / "c1_hourly_projection.json",
    )
    c2 = load_c2_field(root / "data" / "processed" / "field_observations_aggregate.csv")
    c3 = load_c3_interviews(root / "data" / "interim", processed_dir=root / "data" / "processed")
    c4 = load_c4_video(root / "data" / "processed")
    case_model = root / "outputs" / "case_model.json"
    matrix = build_matrix(case_model, c1, c2, c3, c4)

    out = args.out or (root / "data" / "processed" / "collapse_matrix.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(matrix, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {out}")
    print(f"decisions: {dict(matrix['decisions'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
