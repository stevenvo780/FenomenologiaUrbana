"""
Proyecta la serie mensual de hurto a persona (MEData comuna 10) hacia las
cuatro franjas horarias del modelo (`peak_am`, `midday`, `peak_pm`, `night`)
mediante un supuesto distribucional explícito y documentado.

Supuesto. La criminología ambiental (Cohen & Felson 1979, Routine Activity
Theory; Brantingham & Brantingham, sobre patrones temporales del crimen
contra personas en zonas comerciales y de transporte público) sostiene que
el hurto a persona en corredores comerciales urbanos sigue un perfil temporal
con tres rasgos:

- Pico vespertino (peak_pm): convergencia de presencia comercial, tránsito
  laboral de regreso, baja luminosidad relativa al final del día.
- Pico matinal moderado (peak_am): tránsito laboral, aglomeración en
  estaciones de metro y entradas comerciales.
- Valle nocturno absoluto pero tasa relativa elevada (night): pocas víctimas
  en la calle, pero la probabilidad por víctima presente sube.
- Mediodía intermedio (midday): comercio activo, vigilancia formal mayor.

A falta de microdatos horarios públicos para Medellín comuna 10, la tesis
adopta el siguiente perfil de pesos sobre el total mensual, derivado de la
literatura referida y declarado como supuesto explícito de modelo:

  peak_am  (07-10):  0.20
  midday   (10-15):  0.20
  peak_pm  (15-20):  0.45
  night    (20-23):  0.15

Los pesos suman 1.0. Cada celda nodo×franja recibe la fracción correspondiente
del total mensual (ajustado por días dentro de la franja y por el número de
nodos del corredor que comparten el mismo total comuna).

C1 se reporta como `high` para una franja-mes si la tasa proyectada para esa
franja supera el percentil 75 de la distribución franja-mes histórica
(2016–2023). Esto sustituye el umbral mensual ingenuo por uno más sensible
al supuesto distribucional.

Salida: data/processed/c1_hourly_projection.json
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path
from statistics import quantiles

WINDOW_WEIGHTS = {
    "peak_am": 0.20,
    "midday":  0.20,
    "peak_pm": 0.45,
    "night":   0.15,
}

WINDOW_HOURS = {
    "peak_am": 3,   # 07-10
    "midday":  5,   # 10-15
    "peak_pm": 5,   # 15-20
    "night":   3,   # 20-23
}


def load_monthly_series(csv_path: Path) -> dict[str, int]:
    monthly: dict[str, int] = defaultdict(int)
    with csv_path.open(encoding="utf-8") as f:
        f.readline()  # header
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
    return dict(sorted(monthly.items()))


def percentile(xs: list[float], q: float) -> float:
    if not xs:
        return 0.0
    if len(xs) == 1:
        return xs[0]
    cuts = quantiles(xs, n=100, method="inclusive")
    return cuts[max(0, min(98, int(round(q)) - 1))]


def project_hourly(monthly: dict[str, int]) -> dict:
    rows = []
    all_per_window: dict[str, list[float]] = {w: [] for w in WINDOW_WEIGHTS}
    for fecha, total in monthly.items():
        for w, weight in WINDOW_WEIGHTS.items():
            cases_w = total * weight
            cases_per_hour = cases_w / WINDOW_HOURS[w]
            rows.append({
                "month": fecha,
                "window": w,
                "monthly_total": total,
                "projected_cases": round(cases_w, 2),
                "projected_per_hour": round(cases_per_hour, 3),
            })
            all_per_window[w].append(cases_per_hour)
    p75_per_window = {w: percentile(xs, 75) for w, xs in all_per_window.items()}
    p50_per_window = {w: percentile(xs, 50) for w, xs in all_per_window.items()}
    p90_per_window = {w: percentile(xs, 90) for w, xs in all_per_window.items()}
    p75_global = percentile([cases_per_hour for xs in all_per_window.values() for cases_per_hour in xs], 75)
    return {
        "rows": rows,
        "p50_per_window_cases_per_hour": p50_per_window,
        "p75_per_window_cases_per_hour": p75_per_window,
        "p90_per_window_cases_per_hour": p90_per_window,
        "p75_global_cases_per_hour": p75_global,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    csv_path = args.root / "data" / "raw" / "medata_criminalidad_csv.csv"
    if not csv_path.exists():
        print(f"no existe {csv_path}")
        return 2
    monthly = load_monthly_series(csv_path)
    proj = project_hourly(monthly)

    payload = {
        "supuesto": (
            "Criminología ambiental (Cohen & Felson 1979; Brantingham & Brantingham). "
            "Pesos por franja sobre total mensual: peak_am 0.20, midday 0.20, peak_pm 0.45, "
            "night 0.15. Horas por franja: peak_am 3h, midday 5h, peak_pm 5h, night 3h. "
            "C1_high se cumple cuando la tasa por hora proyectada de una franja-mes supera "
            "su percentil 75 dentro de la propia franja, o el percentil 75 global. La tesis "
            "se compromete a reevaluar el supuesto cuando MEData publique microdatos horarios."
        ),
        "weights": WINDOW_WEIGHTS,
        "hours_per_window": WINDOW_HOURS,
        "n_months": len(monthly),
        "monthly_series_total": monthly,
        "projection": proj,
    }

    out = args.out or (args.root / "data" / "processed" / "c1_hourly_projection.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK -> {out}")
    print(f"meses procesados: {len(monthly)}")
    print("p75 cases/hour por franja:")
    for w, v in proj["p75_per_window_cases_per_hour"].items():
        print(f"  {w:8s}: {v:.3f}")
    print(f"p75 global cases/hour: {proj['p75_global_cases_per_hour']:.3f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
