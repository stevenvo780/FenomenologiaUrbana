from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

from _shared import OUTPUTS_DIR, PROCESSED_DIR, now_iso, read_json, write_json
from validate_fieldwork import (
    clamp,
    normalize_dwell_ratio,
    normalize_lighting_ratio,
    normalize_noise_ratio,
    normalize_security_ratio,
)


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(encoding="utf-8", errors="replace") as handle:
        return list(csv.DictReader(handle))


def summarize_node_rows(rows: list[dict[str, str]]) -> dict[str, dict[str, float]]:
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        grouped[row["node_id"]].append(row)

    summaries: dict[str, dict[str, float]] = {}
    for node_id, group in grouped.items():
        sample_count = sum(int(float(item.get("sample_count") or 0)) for item in group)
        dwell_values = [float(item["dwell_seconds_mean"]) for item in group if item.get("dwell_seconds_mean")]
        security_values = [float(item["security_score_mean"]) for item in group if item.get("security_score_mean")]
        noise_values = [float(item["noise_mean_db"]) for item in group if item.get("noise_mean_db")]
        lighting_values = [float(item["lighting_mean_lux"]) for item in group if item.get("lighting_mean_lux")]
        obstacle_values = [float(item["obstacle_event_rate"]) for item in group if item.get("obstacle_event_rate")]

        summaries[node_id] = {
            "sample_count": float(sample_count),
            "dwell_ratio": sum(normalize_dwell_ratio(value) or 0.0 for value in dwell_values) / len(dwell_values) if dwell_values else None,
            "security_ratio": sum(normalize_security_ratio(value) or 0.0 for value in security_values) / len(security_values) if security_values else None,
            "noise_ratio": sum(normalize_noise_ratio(value) or 0.0 for value in noise_values) / len(noise_values) if noise_values else None,
            "lighting_ratio": sum(normalize_lighting_ratio(value) or 0.0 for value in lighting_values) / len(lighting_values) if lighting_values else None,
            "obstacle_rate": sum(obstacle_values) / len(obstacle_values) if obstacle_values else None,
        }
    return summaries


def summarize_edge_rows(rows: list[dict[str, str]]) -> dict[str, dict[str, float]]:
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        grouped[row["edge_id"]].append(row)

    summaries: dict[str, dict[str, float]] = {}
    for edge_id, group in grouped.items():
        crowding_values = [float(item["crowding_observed"]) for item in group if item.get("crowding_observed")]
        noise_values = [float(item["noise_observed"]) for item in group if item.get("noise_observed")]
        lighting_values = [float(item["lighting_observed"]) for item in group if item.get("lighting_observed")]
        obstacle_values = [float(item["obstacle_event_rate"]) for item in group if item.get("obstacle_event_rate")]

        summaries[edge_id] = {
            "crowding": sum(crowding_values) / len(crowding_values) if crowding_values else None,
            "noise": sum(noise_values) / len(noise_values) if noise_values else None,
            "lighting": sum(lighting_values) / len(lighting_values) if lighting_values else None,
            "obstacle": sum(obstacle_values) / len(obstacle_values) if obstacle_values else None,
        }
    return summaries


def main() -> Path:
    case_model_path = OUTPUTS_DIR / "case_model.json"
    validation_path = PROCESSED_DIR / "field_validation_report.json"
    node_csv = PROCESSED_DIR / "field_observations_aggregate.csv"
    edge_csv = PROCESSED_DIR / "field_edges_computed.csv"
    scenario_json = PROCESSED_DIR / "field_scenarios_calibration.json"

    case_model = read_json(case_model_path)
    validation = read_json(validation_path) if validation_path.exists() else {"validation_status": "pending_no_capture"}
    status = validation.get("validation_status", "pending_no_capture")

    baseline_snapshot_path = OUTPUTS_DIR / "case_model_baseline_proxy.json"
    write_json(baseline_snapshot_path, case_model)

    if status == "pending_no_capture":
        write_json(
            OUTPUTS_DIR / "field_calibration_delta.json",
            {
                "generated_at": now_iso(),
                "status": status,
                "node_changes": [],
                "edge_changes": [],
                "scenario_changes": [],
            },
        )
        return case_model_path

    node_summaries = summarize_node_rows(read_csv_rows(node_csv))
    edge_summaries = summarize_edge_rows(read_csv_rows(edge_csv))
    scenario_payload = read_json(scenario_json) if scenario_json.exists() else {"scenarios": []}

    node_changes: list[dict[str, object]] = []
    edge_changes: list[dict[str, object]] = []
    scenario_changes: list[dict[str, object]] = []

    for node in case_model.get("nodes", []):
        summary = node_summaries.get(node["id"])
        if not summary:
            continue

        if summary.get("dwell_ratio") is not None:
            old_value = node["base_dwell"]
            node["base_dwell"] = round(clamp(float(summary["dwell_ratio"]), 0.05, 0.95), 3)
            node_changes.append({"node_id": node["id"], "field": "base_dwell", "before": old_value, "after": node["base_dwell"]})

        if summary.get("security_ratio") is not None:
            old_value = node["security"]
            node["security"] = round(clamp(float(summary["security_ratio"]), 0.05, 0.95), 3)
            node_changes.append({"node_id": node["id"], "field": "security", "before": old_value, "after": node["security"]})

        lighting_ratio = summary.get("lighting_ratio")
        noise_ratio = summary.get("noise_ratio")
        if lighting_ratio is not None or noise_ratio is not None:
            old_value = node["comfort"]
            node["comfort"] = round(
                clamp(
                    ((lighting_ratio if lighting_ratio is not None else old_value) + (1.0 - (noise_ratio if noise_ratio is not None else 1.0 - old_value))) / 2.0,
                    0.05,
                    0.95,
                ),
                3,
            )
            node_changes.append({"node_id": node["id"], "field": "comfort", "before": old_value, "after": node["comfort"]})

        node["proxy"] = False
        node["epistemic_status"] = "field_observed_partial"
        node["field_observation"] = {
            "sample_count": int(summary.get("sample_count") or 0),
            "status": "field_observed_partial",
        }

    for edge in case_model.get("edges", []):
        edge_id = f"{edge['source']}__{edge['target']}"
        summary = edge_summaries.get(edge_id)
        if not summary:
            continue

        for field in ("crowding", "noise", "lighting", "obstacle"):
            if summary.get(field) is None:
                continue
            old_value = edge[field]
            edge[field] = round(clamp(float(summary[field]), 0.05, 0.98), 3)
            edge_changes.append({"edge_id": edge_id, "field": field, "before": old_value, "after": edge[field]})

        edge["epistemic_status"] = "field_observed_partial"

    scenario_index = {scenario["id"]: scenario for scenario in case_model.get("scenarios", [])}
    for scenario_update in scenario_payload.get("scenarios", []):
        scenario = scenario_index.get(scenario_update["scenario_id"])
        if scenario is None:
            continue
        for field, new_value in scenario_update.get("modifiers", {}).items():
            if field not in scenario["modifiers"]:
                continue
            old_value = scenario["modifiers"][field]
            scenario["modifiers"][field] = round(clamp(float(new_value), 0.4, 1.6), 3)
            scenario_changes.append({"scenario_id": scenario["id"], "field": field, "before": old_value, "after": scenario["modifiers"][field]})
        scenario["epistemic_status"] = "field_observed_partial"

    if node_changes or edge_changes or scenario_changes:
        case_model["meta"]["status"] = "field_observed_partial"
        case_model["meta"]["epistemic_note"] = "El corredor mantiene baseline proxy como referencia, pero ya incorpora observaciones de campo parciales para recalibrar nodos, aristas y escenarios." 
        case_model["meta"]["fieldwork_summary"] = {
            "validation_status": status,
            "sessions_count": validation.get("sessions_count", 0),
            "node_coverage_ratio": validation.get("coverage", {}).get("node_coverage_ratio", 0),
            "variables_observed": validation.get("variables_observed", []),
        }

    write_json(
        OUTPUTS_DIR / "field_calibration_delta.json",
        {
            "generated_at": now_iso(),
            "status": status,
            "node_changes": node_changes,
            "edge_changes": edge_changes,
            "scenario_changes": scenario_changes,
        },
    )
    write_json(case_model_path, case_model)
    return case_model_path


if __name__ == "__main__":
    print(main())