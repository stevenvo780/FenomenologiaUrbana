from __future__ import annotations

import shutil
import sys
from pathlib import Path

SCRIPT_ROOT = Path(__file__).resolve().parents[1]
if str(SCRIPT_ROOT) not in sys.path:
    sys.path.insert(0, str(SCRIPT_ROOT))

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


def load_fieldwork_state() -> dict[str, object]:
    validation_path = OUTPUTS_DIR.parent / "data" / "processed" / "field_validation_report.json"
    delta_path = OUTPUTS_DIR / "field_calibration_delta.json"

    if not validation_path.exists():
        return {
            "status": "pending_partial_capture",
            "pending": FIELDWORK_PENDING,
            "summary": {
                "sessions_count": 0,
                "node_coverage_ratio": 0.0,
                "variables_observed": [],
                "external_dependency": True,
            },
        }

    validation = read_json(validation_path)
    delta = read_json(delta_path) if delta_path.exists() else {"node_changes": [], "edge_changes": [], "scenario_changes": []}
    pending = validation.get("pending_tasks") or []
    status_map = {
        "pending_no_capture": "pending_partial_capture",
        "partial_capture": "partial_field_capture",
        "ready_for_calibration": "field_observed_partial",
    }

    return {
        "status": status_map.get(validation.get("validation_status", "pending_no_capture"), "pending_partial_capture"),
        "pending": pending,
        "summary": {
            "sessions_count": validation.get("sessions_count", 0),
            "node_coverage_ratio": validation.get("coverage", {}).get("node_coverage_ratio", 0.0),
            "variables_observed": validation.get("variables_observed", []),
            "node_changes": len(delta.get("node_changes", [])),
            "edge_changes": len(delta.get("edge_changes", [])),
            "scenario_changes": len(delta.get("scenario_changes", [])),
            "external_dependency": validation.get("sessions_count", 0) == 0,
        },
    }


def build_closure_state(
    *,
    case_model: dict[str, object],
    sources: dict[str, object],
    fieldwork_state: dict[str, object],
) -> dict[str, object]:
    failed_sources = [
        {
            "id": entry["id"],
            "label": entry["label"],
            "note": entry.get("note"),
            "url": entry["url"],
        }
        for entry in sources.get("sources", [])
        if entry.get("status") == "failed"
    ]
    has_field_capture = int(fieldwork_state["summary"].get("sessions_count", 0)) > 0
    public_data_ready = int(sources.get("downloaded_count", 0)) >= int(sources.get("source_count", 0)) - 3

    gates = [
        {
            "id": "argumento_academico",
            "label": "Argumento academico",
            "status": "complete",
            "evidence": "Documento principal, marco teorico, hallazgos base y guion estan versionados.",
        },
        {
            "id": "pipeline_reproducible",
            "label": "Pipeline reproducible",
            "status": "complete",
            "evidence": "run_all.py genera modelo, capa empirica, simulacion y payload visual.",
        },
        {
            "id": "datos_publicos",
            "label": "Datos publicos",
            "status": "complete_with_limits" if public_data_ready else "partial",
            "evidence": f"{sources.get('downloaded_count', 0)}/{sources.get('source_count', 0)} fuentes descargadas; los fallos quedan trazados.",
        },
        {
            "id": "campo",
            "label": "Trabajo de campo",
            "status": "external_required" if not has_field_capture else "field_observed",
            "evidence": "No se fabrican observaciones: el cierre empirico fuerte exige captura fisica en sitio." if not has_field_capture else "Hay sesiones de campo cargadas y procesadas.",
        },
        {
            "id": "web_demo",
            "label": "Demo web",
            "status": "complete",
            "evidence": "La interfaz consume frontend_payload.json y muestra mapa, rutas, fuentes, campo y evidencia.",
        },
    ]

    return {
        "status": "final_repo_ready_with_external_fieldwork_dependency"
        if not has_field_capture
        else "field_calibrated_ready",
        "case_status": case_model["meta"].get("status"),
        "gates": gates,
        "failed_sources": failed_sources,
        "remaining_external_activities": fieldwork_state.get("pending", []),
        "non_fabrication_note": "El repositorio queda cerrado como baseline reproducible; la observacion fisica de campo se declara como dependencia externa, no como dato simulado.",
    }


def build_drl_inventory() -> dict[str, object]:
    models = sorted(OUTPUTS_DIR.glob("drl_agent_*.pth"))
    total_bytes = sum(model.stat().st_size for model in models)
    profiles = []

    for model in models:
        stem = model.stem.removeprefix("drl_agent_")
        parts = stem.rsplit("_", 2)

        if len(parts) == 3:
            profile_id = parts[0]
            scenario_id = f"{parts[1]}_{parts[2]}"
        else:
            profile_id = stem
            scenario_id = "unknown"

        profiles.append(
            {
                "file": model.name,
                "profile_id": profile_id,
                "scenario_id": scenario_id,
                "bytes": model.stat().st_size,
            }
        )

    return {
        "trained_models": len(models),
        "total_bytes": total_bytes,
        "profiles": profiles,
    }


def load_fields_manifest() -> dict[str, object]:
    manifest_path = VISUAL_DATA_DIR / "fields" / "manifest.json"

    if not manifest_path.exists():
        return {}

    manifest = read_json(manifest_path)
    return manifest.get("fields", {})


def main() -> Path:
    case_model = read_json(OUTPUTS_DIR / "case_model.json")
    simulation = read_json(OUTPUTS_DIR / "simulation_results.json")
    advanced_sim = read_json(OUTPUTS_DIR / "advanced_simulation_results.json")
    micro_sim = read_json(OUTPUTS_DIR / "micro_simulation_results.json")
    pde_sim = read_json(OUTPUTS_DIR / "pde_environmental_results.json")
    historical_sim = read_json(OUTPUTS_DIR / "historical_evolution_results.json")
    isovist_sim = read_json(OUTPUTS_DIR / "perceptual_visibility_results.json")
    economic_sim = read_json(OUTPUTS_DIR / "economic_gravity_results.json")
    urban_inequality = read_json(OUTPUTS_DIR / "urban_inequality_analysis.json")
    temporal_24h = read_json(OUTPUTS_DIR / "temporal_24h_profile.json")
    hpc_day_report = read_json(OUTPUTS_DIR / "hpc_24h_simulation_report.json")
    hpc_environmental_report = read_json(OUTPUTS_DIR / "hpc_environmental_report.json")
    hpc_stress_test = read_json(OUTPUTS_DIR / "hpc_urban_stress_test.json")
    hpc_uncertainty = read_json(OUTPUTS_DIR / "hpc_uncertainty_quantification.json")
    hpc_multipoint_calibration = read_json(OUTPUTS_DIR / "hpc_multipoint_calibration.json")
    hpc_chaos_report = read_json(OUTPUTS_DIR / "hpc_chaos_simulation_report.json")
    hpc_micro_report = read_json(OUTPUTS_DIR / "hpc_micro_results.json")
    calibration_report = read_json(OUTPUTS_DIR / "hpc_calibration_report.json")
    sources = read_json(OUTPUTS_DIR / "source_status.json")
    empirical = read_json(OUTPUTS_DIR / "empirical_summary.json")
    fields_manifest = load_fields_manifest()
    fieldwork_state = load_fieldwork_state()
    drl_inventory = build_drl_inventory()
    closure_state = build_closure_state(
        case_model=case_model,
        sources=sources,
        fieldwork_state=fieldwork_state,
    )
    
    # Merge advanced metrics into scenarios
    advanced_map = {s["id"]: s for s in advanced_sim["scenarios"]}
    for scenario in simulation["scenarios"]:
        adv = advanced_map.get(scenario["id"])
        if adv:
            # Override with M-MASS high-fidelity metrics
            scenario["metrics"]["route_entropy"] = adv["metrics"]["m_mass_entropy"]
            scenario["metrics"]["mean_pressure"] = adv["metrics"]["systemic_pressure"]
            # Decision restriction is inversely proportional to entropy
            scenario["metrics"]["decision_restriction"] = max(0, 1.0 - adv["metrics"]["m_mass_entropy"])
            scenario["node_loads"] = adv["node_loads"]
            scenario["edge_loads"] = adv["edge_loads"]
            scenario["advanced_stats"] = adv["profile_stats"]

    has_field_calibration = str(case_model["meta"].get("status", "")).startswith("field_")

    payload = {
        "meta": {
            "generated_at": now_iso(),
            "pipeline_version": "0.4.0-top-lvl",
            "status": closure_state["status"],
            "engine": "M-MASS + DRL + SFM (GPU/CUDA)"
        },
        "case_study": case_model["meta"],
        "nodes": merge_nodes_with_centrality(case_model, simulation),
        "edges": case_model["edges"],
        "agents": case_model["agents"],
        "scenarios": simulation["scenarios"],
        "advanced_models": {
            "micro_simulation": micro_sim,
            "environmental_pde": pde_sim,
            "historical_evolution": historical_sim,
            "perceptual_visibility": isovist_sim,
            "economic_gravity": economic_sim
        },
        "advanced_reports": {
            "urban_inequality": urban_inequality,
            "hpc_24h": hpc_day_report,
            "hpc_environmental": hpc_environmental_report,
            "hpc_stress": hpc_stress_test,
            "hpc_uncertainty": hpc_uncertainty,
            "hpc_multipoint_calibration": hpc_multipoint_calibration,
            "hpc_chaos": hpc_chaos_report,
            "drl_inventory": drl_inventory,
        },
        "fields_manifest": fields_manifest,
        "temporal_24h": temporal_24h,
        "raw_reports": {
            "chaos": hpc_chaos_report,
            "multipoint_calibration": hpc_multipoint_calibration,
            "uncertainty": hpc_uncertainty,
            "micro": hpc_micro_report,
            "advanced_scenarios": advanced_sim["scenarios"],
        },
        "sources": sources["sources"],
        "source_summary": {
            "downloaded": sources["downloaded_count"],
            "failed": sources["failed_count"],
            "total": sources["source_count"],
        },
        "fieldwork": {
            "status": fieldwork_state["status"],
            "pending": fieldwork_state["pending"],
            "summary": fieldwork_state["summary"],
        },
        "closure": closure_state,
        "calibration": calibration_report,
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
