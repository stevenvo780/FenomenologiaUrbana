from __future__ import annotations

import math
import random
import multiprocessing
from collections import Counter
from pathlib import Path
from typing import Any

import networkx as nx
import numpy as np
import torch

from _shared import read_json, write_json, now_iso

# Configuration for "Top LVL" Hardware
AGENT_MULTIPLIER = 100  # 100x more agents than base simulation
STOCHASTIC_ITERATIONS = 50  # Monte Carlo iterations per scenario
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def load_siata_data() -> dict[str, Any]:
    # Placeholder for SIATA interpolation logic
    # In a real top-lvl scenario, we would parse the 18MB JSONs and interpolate
    # for now we assume values are already proxy-calibrated in case_model
    return {}

def calculate_stochastic_cost(edge_data: dict, scenario_mods: dict, agent_weights: dict, agent_speed: float, noise_level: float = 0.15) -> float:
    # Base cost calculation (similar to run_simulation.py but with noise)
    travel = float(edge_data["travel_time_min"]) / agent_speed
    crowding = float(edge_data["crowding"]) * float(scenario_mods["crowding"])
    risk = float(edge_data["risk"]) * float(scenario_mods["risk"])
    noise = float(edge_data["noise"]) * float(scenario_mods["noise"])
    lighting = max(0.0, 1.0 - float(edge_data["lighting"]) * float(scenario_mods["lighting"]))
    
    cost = (
        float(agent_weights["time"]) * travel +
        float(agent_weights["crowding"]) * crowding +
        float(agent_weights["risk"]) * risk +
        float(agent_weights["noise"]) * noise +
        float(agent_weights["lighting"]) * lighting
    )
    
    # Apply Perceptual Noise (Log-normal distribution for cost is more realistic)
    noise_factor = np.random.lognormal(0, noise_level)
    return max(0.1, cost * noise_factor)

def run_single_mc_iteration(args):
    graph, scenario, agent, trips, noise_level = args
    node_loads = Counter()
    edge_loads = Counter()
    paths = []
    
    scenario_mods = scenario["modifiers"]
    agent_weights = agent["weights"]
    agent_speed = float(agent["speed_multiplier"])
    
    for _ in range(trips):
        origin = random.choice(agent["origins"])
        target = random.choice([t for t in agent["targets"] if t != origin])
        
        try:
            # Dijkstra with stochastic weights
            path = nx.dijkstra_path(
                graph,
                origin,
                target,
                weight=lambda u, v, d: calculate_stochastic_cost(d, scenario_mods, agent_weights, agent_speed, noise_level)
            )
            paths.append(path)
            for node in path:
                node_loads[node] += 1
            for u, v in zip(path[:-1], path[1:]):
                edge_id = graph[u][v].get("edge_id", f"{u}__{v}")
                edge_loads[edge_id] += 1
        except nx.NetworkXNoPath:
            continue
            
    return node_loads, edge_loads, paths

def simulate_advanced_scenario(graph: nx.Graph, scenario: dict, agents: list, trip_counts: dict):
    print(f"Executing Advanced M-MASS for scenario: {scenario['label']}")
    
    total_node_loads = Counter()
    total_edge_loads = Counter()
    all_profile_stats = []
    
    # Parallelize iterations using all CPU cores
    pool = multiprocessing.Pool(processes=multiprocessing.cpu_count())
    
    for agent in agents:
        base_trips = int(trip_counts[agent["id"]])
        total_trips = base_trips * AGENT_MULTIPLIER
        trips_per_iter = total_trips // STOCHASTIC_ITERATIONS
        
        tasks = [
            (graph, scenario, agent, trips_per_iter, 0.15) 
            for _ in range(STOCHASTIC_ITERATIONS)
        ]
        
        results = pool.map(run_single_mc_iteration, tasks)
        
        agent_node_loads = Counter()
        agent_paths = []
        for n_load, e_load, p_list in results:
            total_node_loads.update(n_load)
            total_edge_loads.update(e_load)
            agent_node_loads.update(n_load)
            agent_paths.extend(p_list)
            
        # Advanced Metric: Path Entropy (Diversity of choices)
        path_signatures = ["->".join(p) for p in agent_paths]
        path_counts = Counter(path_signatures)
        total_p = sum(path_counts.values())
        entropy = -sum((c/total_p) * math.log(c/total_p) for c in path_counts.values()) if total_p > 0 else 0
        
        all_profile_stats.append({
            "agent_id": agent["id"],
            "label": agent["label"],
            "total_trips": total_trips,
            "path_entropy": round(entropy, 4),
            "diversity_index": round(len(path_counts) / total_trips, 4)
        })

    pool.close()
    pool.join()

    # Normalize loads for visualization
    max_node = max(total_node_loads.values()) if total_node_loads else 1
    normalized_node_loads = {k: round(v / max_node, 4) for k, v in total_node_loads.items()}
    
    return {
        "id": scenario["id"],
        "label": scenario["label"],
        "metrics": {
            "m_mass_entropy": round(np.mean([p["path_entropy"] for p in all_profile_stats]), 4),
            "systemic_pressure": round(sum(total_node_loads.values()) / len(graph.nodes), 2)
        },
        "node_loads": normalized_node_loads,
        "edge_loads": {k: v for k, v in total_edge_loads.items()}, # keep raw for edge processing
        "profile_stats": all_profile_stats
    }

def main():
    case_model = read_json(Path(__file__).resolve().parents[1] / "outputs" / "case_model.json")
    
    # Build Graph
    graph = nx.Graph()
    for node in case_model["nodes"]:
        graph.add_node(node["id"], **node)
    for edge in case_model["edges"]:
        graph.add_edge(edge["source"], edge["target"], edge_id=f"{edge['source']}__{edge['target']}", **edge)
        
    results = []
    for scenario in case_model["scenarios"]:
        results.append(simulate_advanced_scenario(
            graph, 
            scenario, 
            case_model["agents"], 
            case_model["trip_counts"][scenario["id"]]
        ))
        
    output_payload = {
        "generated_at": now_iso(),
        "engine": "Advanced M-MASS GPU/CPU Hyper-Parallel",
        "scenarios": results
    }
    
    write_json(Path(__file__).resolve().parents[1] / "outputs" / "advanced_simulation_results.json", output_payload)
    print("Advanced simulation complete. Outputs saved to advanced_simulation_results.json")

if __name__ == "__main__":
    main()
