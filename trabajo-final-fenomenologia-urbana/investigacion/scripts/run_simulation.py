from __future__ import annotations

import math
import random
from collections import Counter, defaultdict
from pathlib import Path

import networkx as nx

from _shared import read_json, write_json, now_iso


def edge_cost(attributes: dict[str, float], scenario: dict[str, object], agent: dict[str, object]) -> float:
    modifiers = scenario["modifiers"]
    weights = agent["weights"]
    speed = float(agent["speed_multiplier"])

    travel = float(attributes["travel_time_min"]) / speed
    crowding = float(attributes["crowding"]) * float(modifiers["crowding"])
    risk = float(attributes["risk"]) * float(modifiers["risk"])
    noise = float(attributes["noise"]) * float(modifiers["noise"])
    lighting_penalty = max(0.0, 1.0 - float(attributes["lighting"]) * float(modifiers["lighting"]))
    obstacle = float(attributes["obstacle"]) * float(modifiers["obstacle"])
    attraction_bonus = float(attributes["attraction"]) * float(modifiers["attraction"])

    raw_cost = (
        float(weights["time"]) * travel
        + float(weights["crowding"]) * crowding
        + float(weights["risk"]) * risk
        + float(weights["noise"]) * noise
        + float(weights["lighting"]) * lighting_penalty
        + float(weights["obstacle"]) * obstacle
        - float(weights["attraction"]) * attraction_bonus
    )
    return max(0.55, round(raw_cost, 4))


def build_graph(case_model: dict[str, object]) -> nx.Graph:
    graph = nx.Graph()

    for node in case_model["nodes"]:
        graph.add_node(node["id"], **node)

    for edge in case_model["edges"]:
        edge_id = f"{edge['source']}__{edge['target']}"
        graph.add_edge(edge["source"], edge["target"], edge_id=edge_id, **edge)

    return graph


def compute_baseline_metrics(graph: nx.Graph) -> dict[str, object]:
    betweenness = nx.betweenness_centrality(graph, weight="distance", normalized=True)
    closeness = nx.closeness_centrality(graph, distance="distance")

    metrics = []
    for node_id in graph.nodes:
        metrics.append(
            {
                "node_id": node_id,
                "betweenness": round(betweenness[node_id], 4),
                "closeness": round(closeness[node_id], 4),
            }
        )

    metrics.sort(key=lambda item: item["betweenness"], reverse=True)
    return {"centrality": metrics}


def entropy(counter: Counter[str]) -> float:
    total = sum(counter.values())
    if total <= 0:
        return 0.0
    value = 0.0
    for count in counter.values():
        probability = count / total
        value -= probability * math.log(probability)
    return value


def normalize_entropy(counter: Counter[str]) -> float:
    if len(counter) <= 1:
        return 0.0
    observed = entropy(counter)
    theoretical = math.log(len(counter))
    return observed / theoretical if theoretical else 0.0


def describe_node_loads(graph: nx.Graph, node_loads: Counter[str], top_n: int = 4) -> list[dict[str, object]]:
    entries = []
    for node_id, load in node_loads.most_common(top_n):
        node = graph.nodes[node_id]
        entries.append(
            {
                "node_id": node_id,
                "label": node["label"],
                "kind": node["kind"],
                "load": load,
                "phenomenology": node["phenomenology"],
            }
        )
    return entries


def simulate_scenario(
    graph: nx.Graph,
    scenario: dict[str, object],
    agents: list[dict[str, object]],
    trip_counts: dict[str, int],
    case_status: str,
) -> dict[str, object]:
    seed = sum(ord(ch) for ch in scenario["id"]) + 20260424
    rng = random.Random(seed)

    scenario_routes: Counter[str] = Counter()
    node_loads: Counter[str] = Counter()
    edge_loads: Counter[str] = Counter()
    profile_stats = []
    top_routes = []

    total_trip_count = 0
    total_cost = 0.0
    total_travel = 0.0

    for agent in agents:
        trips = int(trip_counts[agent["id"]])
        route_counter: Counter[str] = Counter()
        agent_cost = 0.0
        agent_travel = 0.0

        for _ in range(trips):
            origin = rng.choice(agent["origins"])
            target_options = [node_id for node_id in agent["targets"] if node_id != origin]
            target = rng.choice(target_options)

            path = nx.dijkstra_path(
                graph,
                origin,
                target,
                weight=lambda u, v, data: edge_cost(data, scenario, agent),
            )
            path_signature = " -> ".join(path)
            route_counter[path_signature] += 1
            scenario_routes[path_signature] += 1

            total_trip_count += 1
            total_cost_trip = 0.0
            total_travel_trip = 0.0

            for node_id in path:
                node_loads[node_id] += 1

            for source, target in zip(path[:-1], path[1:]):
                edge_data = graph.edges[source, target]
                edge_loads[edge_data["edge_id"]] += 1
                total_cost_trip += edge_cost(edge_data, scenario, agent)
                total_travel_trip += float(edge_data["travel_time_min"]) / float(agent["speed_multiplier"])

            total_cost += total_cost_trip
            total_travel += total_travel_trip
            agent_cost += total_cost_trip
            agent_travel += total_travel_trip

        profile_stats.append(
            {
                "agent_id": agent["id"],
                "label": agent["label"],
                "trip_count": trips,
                "avg_cost": round(agent_cost / trips, 3),
                "avg_travel_minutes": round(agent_travel / trips, 3),
                "route_entropy": round(normalize_entropy(route_counter), 3),
            }
        )

        for route, count in route_counter.most_common(2):
            top_routes.append(
                {
                    "agent_id": agent["id"],
                    "label": agent["label"],
                    "path": route.split(" -> "),
                    "count": count,
                    "share": round(count / trips, 3),
                }
            )

    concentration = 0.0
    if total_trip_count:
        for load in node_loads.values():
            probability = load / sum(node_loads.values())
            concentration += probability * probability

    normalized_entropy = round(normalize_entropy(scenario_routes), 3)
    decision_restriction = round(1.0 - normalized_entropy, 3)
    mean_pressure = round(sum(node_loads.values()) / max(1, len(node_loads)), 2)

    scenario_status = "field_calibrated" if case_status.startswith("field_") else "proxy_calibrated"
    scenario_note = (
        "Escenario ejecutado sobre grafo recalibrado con observaciones de campo parciales."
        if scenario_status == "field_calibrated"
        else "Escenario ejecutado sobre grafo base proxy, listo para recalibracion con trabajo de campo."
    )

    return {
        "id": scenario["id"],
        "label": scenario["label"],
        "time_window": scenario["time_window"],
        "metrics": {
            "avg_path_cost": round(total_cost / total_trip_count, 3),
            "avg_travel_minutes": round(total_travel / total_trip_count, 3),
            "route_entropy": normalized_entropy,
            "decision_restriction": decision_restriction,
            "mean_pressure": mean_pressure,
            "concentration_index": round(concentration, 3),
        },
        "top_bottlenecks": describe_node_loads(graph, node_loads),
        "profile_stats": sorted(profile_stats, key=lambda item: item["trip_count"], reverse=True),
        "top_routes": sorted(top_routes, key=lambda item: item["count"], reverse=True)[:8],
        "node_loads": dict(node_loads),
        "edge_loads": dict(edge_loads),
        "epistemic_status": scenario_status,
        "note": scenario_note,
    }


def main() -> Path:
    case_model = read_json(Path(__file__).resolve().parents[1] / "outputs" / "case_model.json")
    graph = build_graph(case_model)
    baseline_metrics = compute_baseline_metrics(graph)
    scenarios = []

    for scenario in case_model["scenarios"]:
        scenarios.append(
            simulate_scenario(
                graph=graph,
                scenario=scenario,
                agents=case_model["agents"],
                trip_counts=case_model["trip_counts"][scenario["id"]],
                case_status=str(case_model["meta"].get("status", "")),
            )
        )

    payload = {
        "generated_at": now_iso(),
        "case_focus": case_model["meta"]["focus"],
        "scenario_count": len(scenarios),
        "baseline_metrics": baseline_metrics,
        "scenarios": scenarios,
    }
    output_path = Path(__file__).resolve().parents[1] / "outputs" / "simulation_results.json"
    write_json(output_path, payload)
    return output_path


if __name__ == "__main__":
    print(main())
