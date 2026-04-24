from __future__ import annotations

import shutil
from pathlib import Path

from _shared import OUTPUTS_DIR, VISUAL_DATA_DIR, now_iso, read_json, write_json


FIELDWORK_PENDING = [
    {
        "task": "Conteo peatonal fino por nodo",
        "variable": "densidad peatonal",
        "method": "conteo manual cada 15 minutos",
    },
    {
        "task": "Registro de tiempos de permanencia",
        "variable": "permanencia",
        "method": "muestreo con cronometro",
    },
    {
        "task": "Encuesta breve de seguridad percibida",
        "variable": "seguridad percibida",
        "method": "escala 1-5 por subtramo",
    },
    {
        "task": "Medicion puntual de ruido e iluminacion",
        "variable": "presion ambiental",
        "method": "sonometro o app calibrada y luxometro",
    },
]


def merge_nodes_with_centrality(case_model: dict[str, object], simulation: dict[str, object]) -> list[dict[str, object]]:
    index = {
        metric["node_id"]: {
            "betweenness": metric["betweenness"],
            "closeness": metric["closeness"],
        }
        for metric in simulation["baseline_metrics"]["centrality"]
    }

    merged = []
    for node in case_model["nodes"]:
        item = dict(node)
        item["centrality"] = index.get(node["id"], {"betweenness": 0.0, "closeness": 0.0})
        merged.append(item)
    return merged


def main() -> Path:
    case_model = read_json(OUTPUTS_DIR / "case_model.json")
    simulation = read_json(OUTPUTS_DIR / "simulation_results.json")
    sources = read_json(OUTPUTS_DIR / "source_status.json")
    empirical = read_json(OUTPUTS_DIR / "empirical_summary.json")

    payload = {
        "meta": {
            "generated_at": now_iso(),
            "pipeline_version": "0.1.0",
            "status": "research_to_visual_synced",
        },
        "case_study": case_model["meta"],
        "nodes": merge_nodes_with_centrality(case_model, simulation),
        "edges": case_model["edges"],
        "agents": case_model["agents"],
        "scenarios": simulation["scenarios"],
        "sources": sources["sources"],
        "source_summary": {
            "downloaded": sources["downloaded_count"],
            "failed": sources["failed_count"],
            "total": sources["source_count"],
        },
        "fieldwork": {
            "status": "pending_partial_capture",
            "pending": FIELDWORK_PENDING,
        },
        "baseline_metrics": simulation["baseline_metrics"],
        "empirical": empirical,
        "docs": {
            "principal": "../00-documento-principal.md",
            "modelo": "../04-modelado/05-modelo-computacional.md",
            "metricas": "../04-modelado/06-metricas.md",
            "estado_empirico": "../investigacion/docs/estado-empirico.md",
        },
    }

    output_path = OUTPUTS_DIR / "frontend_payload.json"
    write_json(output_path, payload)

    VISUAL_DATA_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(output_path, VISUAL_DATA_DIR / "frontend_payload.json")
    shutil.copy2(OUTPUTS_DIR / "source_status.json", VISUAL_DATA_DIR / "source_status.json")
    shutil.copy2(OUTPUTS_DIR / "simulation_results.json", VISUAL_DATA_DIR / "simulation_results.json")
    shutil.copy2(OUTPUTS_DIR / "empirical_summary.json", VISUAL_DATA_DIR / "empirical_summary.json")
    return output_path


if __name__ == "__main__":
    print(main())
