from __future__ import annotations

from pathlib import Path

from _shared import ensure_dirs
from aggregate_fieldwork import main as aggregate_fieldwork
from build_case_graph import main as build_case_graph
from calibrate_case_model import main as calibrate_case_model
from derive_empirical_data import main as derive_empirical_data
from download_sources import main as download_sources
from ingest_fieldwork import main as ingest_fieldwork
from run_simulation import main as run_simulation
from run_advanced_simulation import main as run_advanced_sim
from train_drl_agents import main as train_drl
from simulate_crowd_dynamics import main as run_sfm
from simulate_environmental_pde import main as run_pde
from analyze_urban_inequality import main as run_inequality_analysis
from render_advanced_clips import main as render_clips
from publish_visual_payload import main as publish_payload


from simulate_historical_evolution import main as run_historical

def main() -> Path:
    ensure_dirs()
    print("1/14 descargando fuentes...")
    download_sources()
    print("2/14 construyendo caso base...")
    build_case_graph()
    print("3/14 derivando capa empirica...")
    derive_empirical_data()
    print("4/14 ingiriendo trabajo de campo...")
    ingest_fieldwork()
    print("5/14 agregando observaciones de campo...")
    aggregate_fieldwork()
    print("6/14 recalibrando caso si hay datos observados...")
    calibrate_case_model()
    print("7/14 ejecutando simulaciones base...")
    run_simulation()
    print("8/14 ejecutando simulaciones avanzadas M-MASS (GPU/CPU Parallel)...")
    run_advanced_sim()
    print("9/14 entrenando agentes Deep Reinforcement Learning (PyTorch)...")
    train_drl()
    print("10/14 ejecutando Micro-simulación (Social Force Model en GPU)...")
    run_sfm()
    print("11/14 resolviendo PDEs ambientales (Dispersión y Ruido)...")
    run_pde()
    print("12/14 analizando desigualdad fenomenológica...")
    run_inequality_analysis()
    print("13/14 simulando evolución histórica longitudinal...")
    run_historical()
    print("14/14 publicando payload para visual...")
    final_output = publish_payload()
    print("Bonus: renderizando clips avanzados 1080p (Hyper-Parallel)...")
    render_clips()
    print(f"Pipeline completo. Payload listo en: {final_output}")
    return final_output


if __name__ == "__main__":
    main()
