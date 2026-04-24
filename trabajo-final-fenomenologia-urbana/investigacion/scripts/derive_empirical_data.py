from __future__ import annotations

import csv
import re
from collections import defaultdict
from pathlib import Path
from statistics import mean
from subprocess import check_output

from _shared import ROOT, RAW_DIR, OUTPUTS_DIR, now_iso, write_json


def parse_number(value: str) -> float:
    if value is None:
        return 0.0
    text = value.strip()
    if not text:
        return 0.0
    text = text.replace(".", "").replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return 0.0


def latest_updated(html_path: Path) -> str | None:
    text = html_path.read_text(encoding="utf-8", errors="replace")
    match = re.search(r"Last updated:\s*([0-9/]+)", text, re.I)
    if match:
        return match.group(1)
    return None


def read_pdf_text(pdf_path: Path) -> str:
    return check_output(["pdftotext", str(pdf_path), "-"], text=True)


def derive_center_perception(pdf_text: str) -> dict[str, object]:
    section_match = re.search(
        r"imagen que tienen los encuestados sobre el centro de Medellín,(.*?)(?:c\.\s*Participación ciudadana|$)",
        pdf_text,
        re.S | re.I,
    )
    section = section_match.group(1) if section_match else pdf_text

    def grab(pattern: str) -> float:
        match = re.search(pattern, section, re.I)
        return parse_number(match.group(1)) if match else 0.0

    return {
        "source": "Medellin Como Vamos EPC 2024",
        "image_favorable_pct": grab(r"([0-9]+,[0-9]+)%\s*tiene una imagen favorable"),
        "image_unfavorable_pct": grab(r"([0-9]+,[0-9]+)%\s*tienen una imagen desfavorable"),
        "visited_monthly_pct": grab(r"([0-9]+,[0-9]+)%\s*de los encuestados visitaron al menos una vez al mes"),
        "visited_several_week_pct": grab(r"([0-9]+,[0-9]+)%\s*lo hizo varias veces en la semana"),
        "visited_weekly_pct": grab(r"([0-9]+,[0-9]+)%\s*lo hizo al menos una vez a la semana"),
        "main_motives": [
            {"label": "comercio", "pct": grab(r"comercio\s*\(([0-9]+,[0-9]+)%\)")},
            {"label": "servicios de salud", "pct": grab(r"servicios de salud\s*\(([0-9]+,[0-9]+)%\)")},
            {"label": "trabajo", "pct": grab(r"trabajo\s*\(([0-9]+,[0-9]+)%\)")},
        ],
        "word_associations": [
            {"dimension": "actividades", "label": "comercio", "pct": grab(r"actividades, el\s*([0-9]+,[0-9]+)%")},
            {"dimension": "seguridad", "label": "inseguro", "pct": grab(r"inseguro con\s*([0-9]+,[0-9]+)%")},
            {"dimension": "empleo", "label": "informalidad", "pct": grab(r"informalidad con\s*([0-9]+,[0-9]+)%")},
            {"dimension": "movilidad", "label": "congestion", "pct": grab(r"([0-9]+,[0-9]+)%\s*asocia movilidad con congestión")},
            {"dimension": "poblacion", "label": "habitantes de calle", "pct": grab(r"habitantes de calle con\s*([0-9]+,[0-9]+)%")},
        ],
    }


def derive_crime_summary(csv_path: Path) -> dict[str, object]:
    yearly_totals: dict[str, int] = defaultdict(int)
    monthly_2023: dict[str, int] = defaultdict(int)
    conduct_2023: dict[str, int] = defaultdict(int)
    latest_month_totals: dict[str, int] = defaultdict(int)
    latest_month = ""

    rows = []
    with csv_path.open(encoding="utf-8", errors="replace") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row["Codigo_comuna"] != "10":
                continue
            rows.append(row)
            yearly_totals[row["Fecha_hecho"][:4]] += int(row["Cantidad_casos"])

    latest_month = max(row["Fecha_hecho"] for row in rows)

    for row in rows:
        period = row["Fecha_hecho"]
        year = period[:4]
        conduct = row["Conducta"]
        amount = int(row["Cantidad_casos"])
        if year == "2023":
            monthly_2023[period] += amount
            conduct_2023[conduct] += amount
        if period == latest_month:
            latest_month_totals[conduct] += amount

    return {
        "source": "MEData criminalidad por comunas",
        "latest_month": latest_month,
        "yearly_totals": [
            {"year": year, "cases": yearly_totals[year]}
            for year in sorted(yearly_totals)
            if year >= "2016"
        ],
        "monthly_2023": [
            {"period": period, "cases": monthly_2023[period]}
            for period in sorted(monthly_2023)
        ],
        "top_conducts_2023": [
            {"label": label, "cases": cases}
            for label, cases in sorted(conduct_2023.items(), key=lambda item: item[1], reverse=True)[:8]
        ],
        "latest_month_top_conducts": [
            {"label": label, "cases": cases}
            for label, cases in sorted(latest_month_totals.items(), key=lambda item: item[1], reverse=True)[:8]
        ],
    }


def derive_barrio_summary(csv_path: Path) -> dict[str, object]:
    target_metrics = [
        "Población total",
        "Densidad poblacional",
        "Densidad empresarial",
        "Suelo múltiple (comercio y servicios)",
        "Metros cuadrados construidos en múltiple (comercio y servicios)",
        "Espacio público efectivo por habitante",
        "Déficit espacio público efectivo",
        "Densidad de espacio público efectivo",
    ]
    comparison_barrios = [
        "La Candelaria",
        "Prado",
        "Boston",
        "Villa Nueva",
        "Guayaquil",
        "Perpetuo Socorro",
        "San Diego",
    ]

    la_candelaria_metrics = []
    neighborhood_map: dict[str, dict[str, dict[str, object]]] = defaultdict(dict)

    with csv_path.open(encoding="utf-8", errors="replace") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row["Nom_Com"] != "La Candelaria" or row["Anio"] != "2021":
                continue
            metric = row["Nom_Ind"]
            if metric not in target_metrics:
                continue

            entry = {
                "label": metric,
                "value": parse_number(row["Valor"]),
                "unit": row["UniMed"],
                "theme": row["Tema"],
            }

            neighborhood_map[row["Nom_Barrio"]][metric] = entry

            if row["Nom_Barrio"] == "La Candelaria":
                la_candelaria_metrics.append(entry)

    comparisons = []
    for metric in target_metrics:
        values = []
        for barrio in comparison_barrios:
            metric_entry = neighborhood_map.get(barrio, {}).get(metric)
            if metric_entry:
                values.append(
                    {
                        "barrio": barrio,
                        "value": metric_entry["value"],
                        "unit": metric_entry["unit"],
                    }
                )

        values.sort(key=lambda item: item["value"], reverse=True)
        comparisons.append({"metric": metric, "ranked_values": values})

    all_density = neighborhood_map["La Candelaria"].get("Densidad poblacional", {}).get("value", 0.0)
    all_business = neighborhood_map["La Candelaria"].get("Densidad empresarial", {}).get("value", 0.0)
    all_public_space = neighborhood_map["La Candelaria"].get("Espacio público efectivo por habitante", {}).get("value", 0.0)

    return {
        "source": "MEData bateria barrial 2021",
        "year": 2021,
        "target_barrio": "La Candelaria",
        "la_candelaria_metrics": la_candelaria_metrics,
        "comparison_barrios": comparison_barrios,
        "metric_comparisons": comparisons,
        "highlights": {
            "population_density": all_density,
            "business_density": all_business,
            "public_space_per_capita": all_public_space,
        },
        "comparison_means": {
            "mean_population_density": round(
                mean(
                    item["value"]
                    for item in comparisons[1]["ranked_values"]
                ),
                2,
            ),
            "mean_business_density": round(
                mean(
                    item["value"]
                    for item in comparisons[2]["ranked_values"]
                ),
                2,
            ),
        },
    }


def derive_source_evidence() -> dict[str, object]:
    metro_text = (RAW_DIR / "metro_san_antonio_b.html").read_text(encoding="utf-8", errors="replace")

    metro_evidence = {
        "station": "San Antonio B",
        "high_flow_day": bool(re.search(r"high flow of users throughout the day", metro_text, re.I)),
        "afternoon_rush_pressure": bool(re.search(r"afternoon rush hour", metro_text, re.I)),
        "line_b_running_time_rush_minutes_before": 4.75 if re.search(r"4\.75 min", metro_text) else None,
        "line_b_running_time_rush_minutes_after": 3.8 if re.search(r"3\.8 min", metro_text) else None,
        "waiting_time_increase_mentioned": bool(re.search(r"waiting times increase", metro_text, re.I)),
    }

    return {
        "metro_operational": metro_evidence,
        "freshness": {
            "medata_criminalidad_last_updated": latest_updated(RAW_DIR / "medata_criminalidad_page.html"),
            "medata_barrio_last_updated": latest_updated(RAW_DIR / "medata_barrio_page.html"),
        },
    }


def write_empirical_markdown(payload: dict[str, object]) -> Path:
    center = payload["center_perception"]
    crime = payload["crime_comuna_10"]
    barrio = payload["barrio_la_candelaria"]
    evidence = payload["source_evidence"]

    lines = [
        "# Estado empírico del proyecto",
        "",
        "## Resumen ejecutivo",
        "",
        "- El centro de Medellín tiene una imagen social ambivalente: 53,3% favorable y 44,5% desfavorable según EPC 2024.",
        "- La principal asociación con el centro es comercio, pero también inseguridad, informalidad, congestión y habitantes de calle.",
        f"- La última fecha disponible en criminalidad para comuna 10 es {crime['latest_month']}.",
        f"- En 2023, la conducta dominante fue {crime['top_conducts_2023'][0]['label']} con {crime['top_conducts_2023'][0]['cases']} casos agregados.",
        "- El barrio La Candelaria combina densidad poblacional moderada con densidad empresarial muy alta y bajo espacio público efectivo por habitante.",
        "",
        "## Percepción ciudadana del centro",
        "",
        f"- Imagen favorable: {center['image_favorable_pct']}%",
        f"- Imagen desfavorable: {center['image_unfavorable_pct']}%",
        f"- Visita al menos mensual: {center['visited_monthly_pct']}%",
        f"- Motivo principal de visita: {center['main_motives'][0]['label']} ({center['main_motives'][0]['pct']}%)",
        "",
        "Asociaciones dominantes:",
        "",
    ]

    for item in center["word_associations"]:
        lines.append(f"- {item['dimension']}: {item['label']} ({item['pct']}%)")

    lines.extend(
        [
            "",
            "## Criminalidad comuna 10",
            "",
        ]
    )

    for item in crime["yearly_totals"]:
        lines.append(f"- {item['year']}: {item['cases']} casos")

    lines.extend(
        [
            "",
            "Top conductas 2023:",
            "",
        ]
    )

    for item in crime["top_conducts_2023"][:5]:
        lines.append(f"- {item['label']}: {item['cases']}")

    lines.extend(
        [
            "",
            "## Indicadores 2021 del barrio La Candelaria",
            "",
        ]
    )

    for item in barrio["la_candelaria_metrics"]:
        lines.append(f"- {item['label']}: {round(item['value'], 2)} {item['unit']}")

    lines.extend(
        [
            "",
            "## Evidencia operacional",
            "",
            f"- San Antonio B presenta alto flujo durante el día: {evidence['metro_operational']['high_flow_day']}.",
            f"- San Antonio B presenta presión en hora pico de la tarde: {evidence['metro_operational']['afternoon_rush_pressure']}.",
            f"- Optimización reportada de Línea B en hora pico: {evidence['metro_operational']['line_b_running_time_rush_minutes_before']} min a {evidence['metro_operational']['line_b_running_time_rush_minutes_after']} min.",
            "",
            "## Lo que sigue dependiendo de campo",
            "",
            "- Conteo peatonal fino por nodo.",
            "- Permanencia y microzonas de pausa.",
            "- Seguridad percibida por subtramo.",
            "- Obstáculos y fricción en tiempo real.",
            "- Ruido e iluminación puntual.",
        ]
    )

    path = ROOT / "docs" / "estado-empirico.md"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def main() -> Path:
    pdf_text = read_pdf_text(RAW_DIR / "medellin_como_vamos_centro_pdf.pdf")

    payload = {
        "generated_at": now_iso(),
        "center_perception": derive_center_perception(pdf_text),
        "crime_comuna_10": derive_crime_summary(RAW_DIR / "medata_criminalidad_csv.csv"),
        "barrio_la_candelaria": derive_barrio_summary(RAW_DIR / "medata_barrio_csv.csv"),
        "source_evidence": derive_source_evidence(),
    }

    output_path = OUTPUTS_DIR / "empirical_summary.json"
    write_json(output_path, payload)
    write_empirical_markdown(payload)
    return output_path


if __name__ == "__main__":
    print(main())
