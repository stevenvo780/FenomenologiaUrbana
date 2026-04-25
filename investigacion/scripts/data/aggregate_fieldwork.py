from __future__ import annotations

from collections import defaultdict
from pathlib import Path
from statistics import mean

from _shared import (
    FIELDWORK_NODE_COVERAGE_THRESHOLD,
    FIELDWORK_READY_SAMPLE_THRESHOLD,
    OUTPUTS_DIR,
    PROCESSED_DIR,
    ensure_dirs,
    now_iso,
    read_json,
    write_csv_rows,
    write_json,
)
from data.validate_fieldwork import (
    load_case_entities,
    normalize_crowding_ratio,
    normalize_lighting_ratio,
    normalize_noise_ratio,
    normalize_security_ratio,
)


def round_or_none(value: float | None, digits: int = 3) -> float | None:
    if value is None:
        return None
    return round(value, digits)


def average(values: list[float]) -> float | None:
    if not values:
        return None
    return mean(values)


def load_rows() -> list[dict[str, object]]:
    path = PROCESSED_DIR / "field_ingest_rows.json"
    if not path.exists():
        return []
    payload = read_json(path)
    return payload.get("rows", [])


def aggregate_nodes(rows: list[dict[str, object]]) -> list[dict[str, object]]:
    grouped: dict[tuple[str, str, str], list[dict[str, object]]] = defaultdict(list)
    for row in rows:
        key = (str(row["node_id"]), str(row["scenario_id"]), str(row["time_window"]))
        grouped[key].append(row)

    aggregates: list[dict[str, object]] = []
    for (node_id, scenario_id, time_window), group in sorted(grouped.items()):
        pedestrians = [float(item["pedestrians_5min"]) for item in group]
        dwell = [float(item["dwell_seconds_mean"]) for item in group if item["dwell_seconds_mean"] is not None]
        noise = [float(item["noise_db"]) for item in group if item["noise_db"] is not None]
        lighting = [float(item["lighting_lux"]) for item in group if item["lighting_lux"] is not None]
        security = [float(item["security_score"]) for item in group if item["security_score"] is not None]
        obstacle_rate = average([int(item["obstacle_flag"]) for item in group])

        aggregates.append(
            {
                "node_id": node_id,
                "scenario_id": scenario_id,
                "time_window": time_window,
                "sample_count": len(group),
                "pedestrians_mean_5min": round_or_none(average(pedestrians)),
                "pedestrians_total_5min": round(sum(pedestrians), 3),
                "dwell_seconds_mean": round_or_none(average(dwell)),
                "noise_mean_db": round_or_none(average(noise)),
                "lighting_mean_lux": round_or_none(average(lighting)),
                "security_score_mean": round_or_none(average(security)),
                "obstacle_event_rate": round_or_none(obstacle_rate),
                "crowding_observed": normalize_crowding_ratio(average(pedestrians)),
                "security_observed": normalize_security_ratio(average(security)),
            }
        )
    return aggregates


def aggregate_edges(rows: list[dict[str, object]]) -> list[dict[str, object]]:
    grouped: dict[tuple[str, str, str, str], list[dict[str, object]]] = defaultdict(list)
    for row in rows:
        edge_id = str(row.get("edge_id") or "").strip()
        if not edge_id:
            continue
        key = (
            edge_id,
            str(row.get("source_node_id") or ""),
            str(row.get("target_node_id") or ""),
            str(row["scenario_id"]),
        )
        grouped[key].append(row)

    aggregates: list[dict[str, object]] = []
    for (edge_id, source_node_id, target_node_id, scenario_id), group in sorted(grouped.items()):
        pedestrians = [float(item["pedestrians_5min"]) for item in group]
        noise = [float(item["noise_db"]) for item in group if item["noise_db"] is not None]
        lighting = [float(item["lighting_lux"]) for item in group if item["lighting_lux"] is not None]
        obstacle_rate = average([int(item["obstacle_flag"]) for item in group])
        time_window = str(group[0]["time_window"])

        aggregates.append(
            {
                "edge_id": edge_id,
                "source_node_id": source_node_id,
                "target_node_id": target_node_id,
                "scenario_id": scenario_id,
                "time_window": time_window,
                "sample_count": len(group),
                "pedestrians_mean_5min": round_or_none(average(pedestrians)),
                "crowding_observed": normalize_crowding_ratio(average(pedestrians)),
                "noise_mean_db": round_or_none(average(noise)),
                "noise_observed": normalize_noise_ratio(average(noise)),
                "lighting_mean_lux": round_or_none(average(lighting)),
                "lighting_observed": normalize_lighting_ratio(average(lighting)),
                "obstacle_event_rate": round_or_none(obstacle_rate),
            }
        )
    return aggregates


def build_scenario_calibration(
    node_rows: list[dict[str, object]],
    edge_rows: list[dict[str, object]],
) -> dict[str, object]:
    baseline_case = read_json(OUTPUTS_DIR / "case_model.json") if (OUTPUTS_DIR / "case_model.json").exists() else {"edges": []}
    base_edge_count = max(1, len(baseline_case.get("edges", [])))
    base_crowding = average([float(edge["crowding"]) for edge in baseline_case.get("edges", [])]) or 0.5
    base_noise = average([float(edge["noise"]) for edge in baseline_case.get("edges", [])]) or 0.5
    base_lighting = average([float(edge["lighting"]) for edge in baseline_case.get("edges", [])]) or 0.75
    base_obstacle = average([float(edge["obstacle"]) for edge in baseline_case.get("edges", [])]) or 0.25

    by_scenario_nodes: dict[str, list[dict[str, object]]] = defaultdict(list)
    by_scenario_edges: dict[str, list[dict[str, object]]] = defaultdict(list)
    for row in node_rows:
        by_scenario_nodes[str(row["scenario_id"])].append(row)
    for row in edge_rows:
        by_scenario_edges[str(row["scenario_id"])].append(row)

    scenarios: list[dict[str, object]] = []
    for scenario_id in sorted(set(by_scenario_nodes) | set(by_scenario_edges)):
        node_group = by_scenario_nodes.get(scenario_id, [])
        edge_group = by_scenario_edges.get(scenario_id, [])

        crowding_values = [float(row["crowding_observed"]) for row in edge_group if row["crowding_observed"] is not None]
        noise_values = [float(row["noise_observed"]) for row in edge_group if row["noise_observed"] is not None]
        lighting_values = [float(row["lighting_observed"]) for row in edge_group if row["lighting_observed"] is not None]
        obstacle_values = [float(row["obstacle_event_rate"]) for row in edge_group if row["obstacle_event_rate"] is not None]
        security_values = [float(row["security_observed"]) for row in node_group if row["security_observed"] is not None]

        crowding_mean = average(crowding_values)
        noise_mean = average(noise_values)
        lighting_mean = average(lighting_values)
        obstacle_mean = average(obstacle_values)
        security_mean = average(security_values)

        scenarios.append(
            {
                "scenario_id": scenario_id,
                "observed_metrics": {
                    "overall_crowding": round_or_none(crowding_mean),
                    "noise_index": round_or_none(noise_mean),
                    "lighting_index": round_or_none(lighting_mean),
                    "obstacle_index": round_or_none(obstacle_mean),
                    "security_index": round_or_none(security_mean),
                    "node_samples": len(node_group),
                    "edge_samples": len(edge_group),
                    "baseline_edge_count": base_edge_count,
                },
                "modifiers": {
                    "crowding": round((crowding_mean or base_crowding) / base_crowding, 3),
                    "noise": round((noise_mean or base_noise) / base_noise, 3),
                    "lighting": round((lighting_mean or base_lighting) / base_lighting, 3),
                    "obstacle": round((obstacle_mean or base_obstacle) / base_obstacle, 3),
                    "risk": round(1.0 + ((0.5 - (security_mean or 0.5)) * 0.5), 3),
                },
                "epistemic_status": "field_observed_partial",
            }
        )

    return {
        "generated_at": now_iso(),
        "scenarios": scenarios,
    }


def build_validation_report(
    rows: list[dict[str, object]],
    node_rows: list[dict[str, object]],
    edge_rows: list[dict[str, object]],
    session_count: int,
) -> dict[str, object]:
    node_ids, _ = load_case_entities()
    nodes_with_data = {str(row["node_id"]) for row in rows}
    scenarios_with_data = {str(row["scenario_id"]) for row in rows if row.get("scenario_id")}
    observed_candidates: list[str] = []
    if rows:
        observed_candidates.append("pedestrians_5min")
    if any(row.get("dwell_seconds_mean") is not None for row in rows):
        observed_candidates.append("dwell_seconds_mean")
    if any(row.get("noise_db") is not None for row in rows):
        observed_candidates.append("noise_db")
    if any(row.get("lighting_lux") is not None for row in rows):
        observed_candidates.append("lighting_lux")
    if any(row.get("security_score") is not None for row in rows):
        observed_candidates.append("security_score")

    observed_variables = sorted(set(observed_candidates))

    coverage_nodes = round(len(nodes_with_data) / max(1, len(node_ids)), 3)
    enough_samples = len(rows) >= FIELDWORK_READY_SAMPLE_THRESHOLD

    if not rows:
        status = "pending_no_capture"
    elif coverage_nodes >= FIELDWORK_NODE_COVERAGE_THRESHOLD and enough_samples:
        status = "ready_for_calibration"
    else:
        status = "partial_capture"

    pending_tasks = []
    if "pedestrians_5min" not in observed_variables:
        pending_tasks.append({"task": "Conteo peatonal fino por nodo", "variable": "densidad peatonal", "method": "conteo manual cada 15 minutos"})
    if "dwell_seconds_mean" not in observed_variables:
        pending_tasks.append({"task": "Registro de tiempos de permanencia", "variable": "permanencia", "method": "muestreo con cronometro"})
    if "security_score" not in observed_variables:
        pending_tasks.append({"task": "Encuesta breve de seguridad percibida", "variable": "seguridad percibida", "method": "escala 1-5 por subtramo"})
    if "noise_db" not in observed_variables or "lighting_lux" not in observed_variables:
        pending_tasks.append({"task": "Medicion puntual de ruido e iluminacion", "variable": "presion ambiental", "method": "sonometro o app calibrada y luxometro"})

    return {
        "generated_at": now_iso(),
        "sessions_count": session_count,
        "row_count": len(rows),
        "node_groups": len(node_rows),
        "edge_groups": len(edge_rows),
        "coverage": {
            "nodes_with_data": len(nodes_with_data),
            "node_coverage_ratio": coverage_nodes,
            "scenarios_with_data": len(scenarios_with_data),
        },
        "variables_observed": observed_variables,
        "validation_status": status,
        "pending_tasks": pending_tasks,
    }


def write_empty_outputs() -> None:
    write_csv_rows(
        PROCESSED_DIR / "field_observations_aggregate.csv",
        [
            "node_id",
            "scenario_id",
            "time_window",
            "sample_count",
            "pedestrians_mean_5min",
            "pedestrians_total_5min",
            "dwell_seconds_mean",
            "noise_mean_db",
            "lighting_mean_lux",
            "security_score_mean",
            "obstacle_event_rate",
            "crowding_observed",
            "security_observed",
        ],
        [],
    )
    write_csv_rows(
        PROCESSED_DIR / "field_edges_computed.csv",
        [
            "edge_id",
            "source_node_id",
            "target_node_id",
            "scenario_id",
            "time_window",
            "sample_count",
            "pedestrians_mean_5min",
            "crowding_observed",
            "noise_mean_db",
            "noise_observed",
            "lighting_mean_lux",
            "lighting_observed",
            "obstacle_event_rate",
        ],
        [],
    )


def main() -> Path:
    ensure_dirs()
    rows = load_rows()
    ingest_report = read_json(PROCESSED_DIR / "field_ingest_report.json") if (PROCESSED_DIR / "field_ingest_report.json").exists() else {"sessions_found": 0}

    if not rows:
        write_empty_outputs()
        validation_report = build_validation_report([], [], [], int(ingest_report.get("sessions_found", 0)))
        write_json(PROCESSED_DIR / "field_scenarios_calibration.json", {"generated_at": now_iso(), "scenarios": []})
        write_json(PROCESSED_DIR / "field_validation_report.json", validation_report)
        return PROCESSED_DIR / "field_validation_report.json"

    node_rows = aggregate_nodes(rows)
    edge_rows = aggregate_edges(rows)
    scenario_payload = build_scenario_calibration(node_rows, edge_rows)
    validation_report = build_validation_report(rows, node_rows, edge_rows, int(ingest_report.get("sessions_found", 0)))

    write_csv_rows(
        PROCESSED_DIR / "field_observations_aggregate.csv",
        list(node_rows[0].keys()) if node_rows else ["node_id"],
        node_rows,
    )
    write_csv_rows(
        PROCESSED_DIR / "field_edges_computed.csv",
        list(edge_rows[0].keys()) if edge_rows else ["edge_id"],
        edge_rows,
    )
    write_json(PROCESSED_DIR / "field_scenarios_calibration.json", scenario_payload)
    write_json(PROCESSED_DIR / "field_validation_report.json", validation_report)
    return PROCESSED_DIR / "field_validation_report.json"


if __name__ == "__main__":
    print(main())
