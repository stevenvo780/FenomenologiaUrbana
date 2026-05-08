"""
Análisis de sensibilidad por bootstrap de la matriz de colapso fenomenológico.

Genera tres variantes:
  V1 - Bootstrap clásico: resamplea con reemplazo (1000 iter) las series por
       celda (C1 horario, C4 saturación, C3 entrevistas) y recomputa la
       decisión nodo×franja en cada iteración.
  V2 - Sensibilidad de umbrales: barre el percentil de corte de C1 (horario por
       franja) y de C4 (global) en {p70, p75, p80, p85, p90} -> 25 escenarios.
  V3 - Leave-one-out de entrevistas C3: quita cada entrevista una por una y
       reevalúa la dimensión C3 -> sensibilidad de las celdas con C3 activo.

Salidas (NUEVAS, no reescriben baseline):
  - investigacion/data/processed/collapse_matrix_sensitivity.json
  - investigacion/data/interim/2026-05-05/sensitivity_report.md

REGLA: lectura solamente del baseline. No modifica build_collapse_matrix.py
ni los JSON existentes en data/processed/.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path
from statistics import median, quantiles

NEGATIVE_HABITABILITY = {"EVITABLE", "NO_DESEABLE", "DIFICIL_DE_VIVIR"}
POSITIVE_HABITABILITY = {"HABITABLE", "DESEABLE"}

NODES = [
    "san_antonio_metro", "parque_san_antonio", "palacio_nacional",
    "junin_paseo", "oriental_cruce", "parque_berrio",
    "carabobo_cultural", "plaza_botero", "museo_antioquia",
]
WINDOWS = ["peak_am", "midday", "peak_pm", "night"]

DECISIONS = ["colapso_fenomenologico", "friccion_acumulada", "flujo_ordinario", "inconcluyente"]


# ---------- helpers ----------

def percentile(xs: list[float], q: float) -> float:
    if not xs:
        return 0.0
    if len(xs) == 1:
        return float(xs[0])
    cuts = quantiles(xs, n=100, method="inclusive")
    idx = max(0, min(98, int(round(q)) - 1))
    return cuts[idx]


def decide_cell(c1_high: bool, c2_low: bool, c3_neg: bool, c4_sat: bool, coverage: int) -> str:
    if coverage < 2:
        return "inconcluyente"
    n = sum([c1_high, c2_low, c3_neg, c4_sat])
    if n >= 3:
        return "colapso_fenomenologico"
    if n >= 1:
        return "friccion_acumulada"
    return "flujo_ordinario"


# ---------- carga de datos ----------

def load_c1_hourly_series(proj_path: Path) -> dict:
    """Devuelve series horarias por franja: window -> list[projected_per_hour]."""
    d = json.loads(proj_path.read_text(encoding="utf-8"))
    rows = (d.get("projection") or {}).get("rows") or []
    by_window: dict[str, list[float]] = defaultdict(list)
    for r in rows:
        w = r.get("window")
        v = r.get("projected_per_hour")
        if w and v is not None:
            by_window[w].append(float(v))
    p75_per_window = (d.get("projection") or {}).get("p75_per_window_cases_per_hour") or {}
    return {"by_window": dict(by_window), "p75_per_window": dict(p75_per_window)}


def load_c4_videos(processed_dir: Path) -> dict:
    """Devuelve por celda lista de saturation_index y pool global."""
    by_cell: dict[str, list[float]] = defaultdict(list)
    pool: list[float] = []
    for f in processed_dir.glob("video_saturation_*.json"):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        s = d.get("summary") or {}
        idx = s.get("saturation_index")
        n = s.get("node"); w = s.get("window")
        if idx is None:
            continue
        pool.append(float(idx))
        if n and w:
            by_cell[f"{n}|{w}"].append(float(idx))
    return {"by_cell": dict(by_cell), "pool": pool}


def load_c3_interviews(processed_dir: Path) -> list[dict]:
    """Lista plana de entrevistas {node, window, codes, source}."""
    out = []
    for f in sorted(processed_dir.glob("c3_field_interviews_*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for it in d.get("interviews") or []:
            n = it.get("node"); w = it.get("window")
            codes = [c.upper() for c in (it.get("codes") or [])]
            if not n or not w:
                continue
            out.append({"node": n, "window": w, "codes": codes, "source": f.name})
    return out


def c3_cells_from_interviews(interviews: list[dict]) -> dict[str, dict]:
    bucket: dict[str, Counter] = defaultdict(Counter)
    for it in interviews:
        key = f"{it['node']}|{it['window']}"
        for c in it["codes"]:
            bucket[key][c] += 1
    out = {}
    for k, ctr in bucket.items():
        neg = sum(ctr[x] for x in NEGATIVE_HABITABILITY)
        pos = sum(ctr[x] for x in POSITIVE_HABITABILITY)
        out[k] = {"neg": neg, "pos": pos, "dominant_negative": neg > pos}
    return out


# ---------- construcción de matriz parametrizada ----------

def build_matrix_param(
    *,
    c1_p75_per_window: dict[str, float],
    c1_high_by_window: dict[str, bool],
    c4_by_cell: dict[str, list[float]],
    c4_threshold: float,
    c3_cells: dict[str, dict],
) -> dict[str, str]:
    """Devuelve cell_key -> decision usando parámetros dados.
    No depende de C2 (ausente en baseline) -> c2_low=False siempre.
    """
    cells: dict[str, str] = {}
    c1_available = bool(c1_p75_per_window)
    for n in NODES:
        for w in WINDOWS:
            key = f"{n}|{w}"
            c1_high = bool(c1_high_by_window.get(w, False))
            c4_vals = c4_by_cell.get(key) or []
            c4_p75 = percentile(c4_vals, 75) if c4_vals else 0.0
            c4_sat = bool(c4_vals) and c4_p75 >= c4_threshold
            c3_cell = c3_cells.get(key)
            c3_neg = bool(c3_cell and c3_cell.get("dominant_negative"))
            coverage = sum([c1_available, False, c3_cell is not None, bool(c4_vals)])
            cells[key] = decide_cell(c1_high, False, c3_neg, c4_sat, coverage)
    return cells


# ---------- variantes ----------

def variant1_bootstrap(c1: dict, c4: dict, interviews: list[dict], n_iter: int = 1000, seed: int = 7) -> dict:
    """Resampleo con reemplazo de C1 (por franja), C4 (por celda) y C3 (lista global).
    En cada iteración:
      - Para C1: resamplea series horarias por franja, recomputa p75 -> compara
        con p75 baseline para decidir c1_high (igual que baseline: c1_high_by_window
        original = True para todas las franjas con datos; bootstrap evalúa si la
        proyección bootstrap supera el p75 mensual histórico).
        Operacionalización aquí: c1_high[w] = (p75_boot[w] >= p75_orig[w]).
        Permite que en réplicas con muestra baja la franja salga False.
      - Para C4: resamplea con reemplazo los saturation_index por celda y
        recomputa p75 por celda; usa el p75 global del pool baseline como umbral.
      - Para C3: resamplea con reemplazo el set total de entrevistas (mismo n).
    """
    rnd = random.Random(seed)
    by_window = c1["by_window"]
    p75_orig = c1["p75_per_window"]
    pool_c4 = c4["pool"]
    p75_global_c4 = percentile(pool_c4, 75) if pool_c4 else 1e9
    by_cell_c4 = c4["by_cell"]

    counts: dict[str, Counter] = defaultdict(Counter)

    for _ in range(n_iter):
        # C1 bootstrap por franja
        c1_high_w = {}
        for w, xs in by_window.items():
            if not xs:
                c1_high_w[w] = False
                continue
            sample = [xs[rnd.randrange(len(xs))] for _ in range(len(xs))]
            p75_b = percentile(sample, 75)
            c1_high_w[w] = (p75_b >= p75_orig.get(w, 0.0))
        # C4 bootstrap por celda
        c4_boot: dict[str, list[float]] = {}
        for k, xs in by_cell_c4.items():
            if not xs:
                c4_boot[k] = []
                continue
            c4_boot[k] = [xs[rnd.randrange(len(xs))] for _ in range(len(xs))]
        # C3 bootstrap sobre entrevistas (resample con reemplazo)
        if interviews:
            c3_sample = [interviews[rnd.randrange(len(interviews))] for _ in range(len(interviews))]
        else:
            c3_sample = []
        c3_cells = c3_cells_from_interviews(c3_sample)

        decisions = build_matrix_param(
            c1_p75_per_window=p75_orig,
            c1_high_by_window=c1_high_w,
            c4_by_cell=c4_boot,
            c4_threshold=p75_global_c4,
            c3_cells=c3_cells,
        )
        for k, dec in decisions.items():
            counts[k][dec] += 1

    out = {}
    for k, ctr in counts.items():
        total = sum(ctr.values())
        out[k] = {d: ctr.get(d, 0) / total for d in DECISIONS}
        out[k]["_n_iter"] = total
    return out


def variant2_thresholds(c1: dict, c4: dict, interviews: list[dict]) -> dict:
    """25 escenarios = 5 percentiles C1 x 5 percentiles C4."""
    by_window = c1["by_window"]
    pool_c4 = c4["pool"]
    c3_cells = c3_cells_from_interviews(interviews)
    by_cell_c4 = c4["by_cell"]

    pcts = [70, 75, 80, 85, 90]
    counts: dict[str, Counter] = defaultdict(Counter)
    scenarios = []

    for pc1 in pcts:
        # umbrales C1 horario por franja al percentil pc1
        c1_thr = {w: percentile(xs, pc1) for w, xs in by_window.items()}
        # baseline asume "hay datos => alto"; aquí evaluamos: hay datos en la
        # franja superior al threshold => True (todas con datos quedan True
        # porque la proyección agregada usa el mismo histograma; emulamos
        # comportamiento baseline marcando True si el p75 de la serie supera
        # el threshold del percentil pc1 — i.e. cuando pc1 baja, más franjas
        # quedan True; cuando sube, menos).
        c1_high_w = {}
        for w, xs in by_window.items():
            if not xs:
                c1_high_w[w] = False
                continue
            # franja "alta" si su p75 supera el percentil pc1 de la propia
            # serie (autoreferencial) — para pc1=75 da True, para pc1=90
            # típicamente False salvo franjas con cola pesada.
            p75_w = percentile(xs, 75)
            c1_high_w[w] = p75_w >= c1_thr[w]
        for pc4 in pcts:
            c4_thr = percentile(pool_c4, pc4) if pool_c4 else 1e9
            decisions = build_matrix_param(
                c1_p75_per_window=c1["p75_per_window"],
                c1_high_by_window=c1_high_w,
                c4_by_cell=by_cell_c4,
                c4_threshold=c4_thr,
                c3_cells=c3_cells,
            )
            scenarios.append({"c1_pct": pc1, "c4_pct": pc4})
            for k, dec in decisions.items():
                counts[k][dec] += 1

    n = len(scenarios)
    out = {}
    for k, ctr in counts.items():
        out[k] = {d: ctr.get(d, 0) / n for d in DECISIONS}
        out[k]["_n_scenarios"] = n
    return {"per_cell": out, "n_scenarios": n}


def variant3_loo_c3(c1: dict, c4: dict, interviews: list[dict]) -> dict:
    """Leave-one-out sobre entrevistas: para cada entrevista quitada, recomputa
    C3 y la matriz; reporta sensibilidad de las celdas con C3 activo."""
    by_window = c1["by_window"]
    pool_c4 = c4["pool"]
    p75_global_c4 = percentile(pool_c4, 75) if pool_c4 else 1e9
    by_cell_c4 = c4["by_cell"]
    p75_orig = c1["p75_per_window"]
    # baseline c1_high_by_window: todas las franjas con datos = True
    c1_high_w = {w: bool(xs) for w, xs in by_window.items()}

    counts: dict[str, Counter] = defaultdict(Counter)
    cells_with_c3 = set()
    for it in interviews:
        cells_with_c3.add(f"{it['node']}|{it['window']}")

    for i in range(len(interviews)):
        sub = interviews[:i] + interviews[i+1:]
        c3_cells = c3_cells_from_interviews(sub)
        decisions = build_matrix_param(
            c1_p75_per_window=p75_orig,
            c1_high_by_window=c1_high_w,
            c4_by_cell=by_cell_c4,
            c4_threshold=p75_global_c4,
            c3_cells=c3_cells,
        )
        for k, dec in decisions.items():
            counts[k][dec] += 1

    n = len(interviews)
    out = {}
    for k, ctr in counts.items():
        out[k] = {d: ctr.get(d, 0) / n for d in DECISIONS}
        out[k]["_n_loo"] = n
    return {"per_cell": out, "n_interviews": n, "cells_with_c3": sorted(cells_with_c3)}


# ---------- robustez / fragilidad ----------

def classify_robustness(baseline: dict[str, str], v1: dict, v2: dict) -> dict:
    """Robusta: misma decisión que baseline en >=80% bootstrap y >=80% umbrales.
    Frágil: cambia decisión en >=20% de cualquiera de las dos variantes.
    """
    out = {}
    v2_per_cell = v2["per_cell"]
    for k, base_dec in baseline.items():
        v1_share = (v1.get(k) or {}).get(base_dec, 0.0)
        v2_share = (v2_per_cell.get(k) or {}).get(base_dec, 0.0)
        robust = (v1_share >= 0.80) and (v2_share >= 0.80)
        fragile = (v1_share < 0.80) or (v2_share < 0.80)
        out[k] = {
            "baseline_decision": base_dec,
            "v1_share_baseline": round(v1_share, 4),
            "v2_share_baseline": round(v2_share, 4),
            "robust": robust,
            "fragile": fragile,
            "min_share": round(min(v1_share, v2_share), 4),
        }
    return out


# ---------- main ----------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--n-iter", type=int, default=1000)
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()

    root = args.root
    processed = root / "data" / "processed"
    baseline_path = processed / "collapse_matrix.json"
    proj_path = processed / "c1_hourly_projection.json"

    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    baseline_decisions = {k: v["decision"] for k, v in baseline["cells"].items()}

    c1 = load_c1_hourly_series(proj_path)
    c4 = load_c4_videos(processed)
    interviews = load_c3_interviews(processed)

    print(f"[bootstrap] C1 windows={list(c1['by_window'].keys())} "
          f"C4 cells={len(c4['by_cell'])} C3 interviews={len(interviews)}")

    v1 = variant1_bootstrap(c1, c4, interviews, n_iter=args.n_iter, seed=args.seed)
    v2 = variant2_thresholds(c1, c4, interviews)
    v3 = variant3_loo_c3(c1, c4, interviews)
    robustness = classify_robustness(baseline_decisions, v1, v2)

    out_json = processed / "collapse_matrix_sensitivity.json"
    payload = {
        "meta": {
            "n_iter_bootstrap": args.n_iter,
            "seed": args.seed,
            "n_threshold_scenarios": v2["n_scenarios"],
            "n_interviews_loo": v3["n_interviews"],
            "baseline_path": str(baseline_path.relative_to(root.parent)) if baseline_path.is_relative_to(root.parent) else str(baseline_path),
            "rule": "robusta=share>=0.80 en V1 y V2; frágil=share<0.80 en V1 o V2",
        },
        "baseline_decisions": baseline_decisions,
        "variant1_bootstrap": v1,
        "variant2_thresholds": v2,
        "variant3_loo_c3": v3,
        "robustness": robustness,
    }
    out_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {out_json}")

    # ---- sensitivity_report.md ----
    report_dir = root / "data" / "interim" / "2026-05-05"
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = report_dir / "sensitivity_report.md"

    # Tablas
    rows_robust = sorted(robustness.items(), key=lambda kv: -kv[1]["min_share"])
    rows_fragile = sorted(robustness.items(), key=lambda kv: kv[1]["min_share"])

    fric_baseline = [k for k, d in baseline_decisions.items() if d == "friccion_acumulada"]
    incon_to_collapse = []
    for k, dist in v2["per_cell"].items():
        if baseline_decisions.get(k) == "inconcluyente" and dist.get("colapso_fenomenologico", 0.0) > 0.30:
            incon_to_collapse.append((k, dist["colapso_fenomenologico"]))

    lines = []
    lines.append("# Análisis de sensibilidad - matriz de colapso")
    lines.append("")
    lines.append(f"Generado: {args.n_iter} iteraciones bootstrap, "
                 f"{v2['n_scenarios']} escenarios de umbrales (C1 x C4), "
                 f"{v3['n_interviews']} entrevistas leave-one-out.")
    lines.append("")
    lines.append("## Definiciones")
    lines.append("- **Celda robusta**: mantiene la decisión baseline en >=80% del bootstrap V1 "
                 "y >=80% de las 25 combinaciones de umbrales V2.")
    lines.append("- **Celda frágil**: la decisión baseline aparece en <80% en al menos una variante.")
    lines.append("")
    lines.append("## Top-5 celdas más robustas")
    lines.append("")
    lines.append("| celda | decisión baseline | V1 share | V2 share |")
    lines.append("|---|---|---|---|")
    for k, info in rows_robust[:5]:
        lines.append(f"| `{k}` | {info['baseline_decision']} | {info['v1_share_baseline']:.3f} | {info['v2_share_baseline']:.3f} |")
    lines.append("")
    lines.append("## Top-5 celdas más frágiles")
    lines.append("")
    lines.append("| celda | decisión baseline | V1 share | V2 share | min |")
    lines.append("|---|---|---|---|---|")
    for k, info in rows_fragile[:5]:
        lines.append(f"| `{k}` | {info['baseline_decision']} | {info['v1_share_baseline']:.3f} | {info['v2_share_baseline']:.3f} | {info['min_share']:.3f} |")
    lines.append("")
    lines.append("## Veredicto sobre las 6 celdas en fricción acumulada baseline")
    lines.append("")
    lines.append("| celda | V1 fricción | V2 fricción | LOO C3 fricción | clasificación |")
    lines.append("|---|---|---|---|---|")
    for k in fric_baseline:
        v1s = (v1.get(k) or {}).get("friccion_acumulada", 0.0)
        v2s = ((v2["per_cell"]).get(k) or {}).get("friccion_acumulada", 0.0)
        v3s = ((v3["per_cell"]).get(k) or {}).get("friccion_acumulada", 0.0)
        clase = "robusta" if (v1s >= 0.8 and v2s >= 0.8) else ("frágil" if (v1s < 0.8 or v2s < 0.8) else "media")
        lines.append(f"| `{k}` | {v1s:.3f} | {v2s:.3f} | {v3s:.3f} | {clase} |")
    lines.append("")
    lines.append("## Celdas inconcluyentes con riesgo de colapso (>30% en V2)")
    lines.append("")
    if incon_to_collapse:
        lines.append("| celda | share colapso V2 |")
        lines.append("|---|---|")
        for k, s in sorted(incon_to_collapse, key=lambda x: -x[1]):
            lines.append(f"| `{k}` | {s:.3f} |")
    else:
        lines.append("Ninguna celda inconcluyente cruza el umbral del 30% de colapso bajo V2.")
    lines.append("")
    lines.append("## Discusión metodológica")
    lines.append("")
    lines.append("- **V1 (bootstrap clásico)** captura la incertidumbre de muestreo dentro de "
                 "cada serie (C1 horario por franja, C4 saturación por celda y C3 entrevistas). "
                 "Las celdas con n bajo (especialmente C4 con n<=2 o C3 con <=3 entrevistas) "
                 "muestran shares menos estables, lo que es esperable y debe declararse en defensa.")
    lines.append("- **V2 (sensibilidad de umbrales)** evalúa si la decisión depende del corte "
                 "p75 elegido; barrer p70..p90 muestra qué celdas son artefactos del umbral y "
                 "cuáles sobreviven a deformaciones moderadas del criterio.")
    lines.append("- **V3 (leave-one-out C3)** mide si una sola entrevista determina el "
                 "carácter negativo dominante de un nodo. Si quitar una entrevista mueve la "
                 "decisión, esa celda se reporta como dependiente de testigo único.")
    lines.append("- **Limitación**: C2 (security_score de campo) no está disponible en el "
                 "baseline (cells_with_data=0), por lo que la regla 3-de-4 opera de facto "
                 "como 3-de-3 con C2=False. Esto sesga decisiones hacia 'fricción' antes que "
                 "'colapso' — declarar explícitamente.")
    lines.append("")
    report_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"OK -> {report_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
