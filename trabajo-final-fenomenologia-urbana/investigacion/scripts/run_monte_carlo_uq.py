import json
from pathlib import Path
import numpy as np
import torch
from tqdm import tqdm
import multiprocessing

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# CONFIGURACIÓN MONTE CARLO UQ (Doctoral Level)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
ITERATIONS = 50  # 50 corridas por escenario para validez estadística
NUM_AGENTS = 100000 
STEPS = 500
GRID_SIZE = 512.0

def run_single_seed(args):
    scenario_id, seed, multiplier = args
    torch.manual_seed(seed)
    np.random.seed(seed)
    
    n_agents = int(NUM_AGENTS * multiplier)
    positions = torch.rand((n_agents, 2), device=DEVICE) * GRID_SIZE
    velocities = torch.zeros((n_agents, 2), device=DEVICE)
    target = torch.tensor([GRID_SIZE/2, GRID_SIZE/2], device=DEVICE)
    
    vel_history = []
    for _ in range(STEPS):
        direction = target - positions
        dist = torch.norm(direction, dim=1, keepdim=True)
        direction = direction / torch.clamp(dist, min=1e-5)
        
        # Inyectamos Fricción de Informalidad (Ruido dinámico)
        force = (direction * 1.3 - velocities) / 0.5
        noise = torch.randn_like(positions) * 0.15
        
        velocities = velocities + (force + noise) * 0.1
        speed = torch.norm(velocities, dim=1, keepdim=True)
        velocities = velocities / torch.clamp(speed, min=0.1) * torch.clamp(speed, max=1.5)
        positions = positions + velocities * 0.1
        vel_history.append(torch.mean(speed).cpu().numpy())
    
    return float(np.mean(vel_history))

def main():
    print(f"[{DEVICE}] Iniciando Cuantificación de Incertidumbre (Monte Carlo 50x)...")
    
    profile = read_json(OUTPUTS_DIR / "temporal_24h_profile.json")
    uq_results = {}

    # Solo escenarios críticos para ahorrar tiempo (Pico AM, Valle, Pico PM)
    target_hours = [6, 12, 18]
    
    for h in target_hours:
        print(f"--- Analizando Variabilidad Hora {h:02d}:00 ---")
        multiplier = profile["demand_multiplier"][h]
        
        seeds = np.random.randint(0, 1000000, ITERATIONS)
        tasks = [(h, int(s), multiplier) for s in seeds]
        
        # Ejecución serial en GPU (PyTorch es más eficiente así que lanzando multiprocesos que compitan por VRAM)
        results = []
        for task in tqdm(tasks):
            results.append(run_single_seed(task))
            
        mu = np.mean(results)
        sigma = np.std(results)
        ci_95 = 1.96 * (sigma / np.sqrt(ITERATIONS))
        
        uq_results[f"hour_{h}"] = {
            "mean_velocity": float(mu),
            "std_dev": float(sigma),
            "confidence_interval_95": [float(mu - ci_95), float(mu + ci_95)],
            "relative_uncertainty": float(sigma / mu if mu > 0 else 0)
        }

    report = {
        "generated_at": now_iso(),
        "iterations_per_sample": ITERATIONS,
        "results": uq_results,
        "note": "Intervalos de confianza calculados mediante Monte Carlo para blindar la tesis contra críticas de variabilidad."
    }
    
    write_json(OUTPUTS_DIR / "hpc_uncertainty_quantification.json", report)
    print("Cuantificación de Incertidumbre completada.")

if __name__ == "__main__":
    main()
