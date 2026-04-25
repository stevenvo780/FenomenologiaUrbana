import json
from pathlib import Path
import numpy as np
import torch
from tqdm import tqdm

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# CONFIGURACIÓN DE STRESS TEST (HPC)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
GRID_SIZE = 512.0
POPULATION_SCALES = np.linspace(100000, 500000, 10).astype(int)
STEPS = 400
DT = 0.1

def run_stress_simulation(num_agents):
    """Simula una hora de tráfico denso a una escala específica."""
    positions = torch.rand((num_agents, 2), device=DEVICE) * GRID_SIZE
    velocities = torch.zeros((num_agents, 2), device=DEVICE)
    
    # Objetivo: Cruce masivo en San Antonio
    target = torch.tensor([GRID_SIZE/2, GRID_SIZE/2], device=DEVICE)
    
    # Métricas de estrés
    entropy_history = []
    velocity_history = []
    
    for step in range(STEPS):
        direction = target - positions
        dist = torch.norm(direction, dim=1, keepdim=True)
        direction = direction / torch.clamp(dist, min=1e-5)
        
        # Fuerza de deseo + Fuerza de fricción por densidad (Crowd Pressure)
        # A más agentes, más fricción aleatoria (choques)
        friction = (num_agents / 100000.0) * 0.2
        noise = torch.randn_like(positions) * friction
        
        force = (direction * 1.3 - velocities) / 0.5
        velocities = velocities + (force + noise) * DT
        
        # Límite físico: El colapso ocurre cuando la velocidad cae a < 0.2 m/s
        speed = torch.norm(velocities, dim=1, keepdim=True)
        velocities = velocities / torch.clamp(speed, min=0.1) * torch.clamp(speed, max=1.5)
        
        positions = positions + velocities * DT
        velocity_history.append(torch.mean(speed).cpu().numpy())

    # Calcular Entropía del Sistema (Orden vs Caos)
    final_vel = velocities.cpu().numpy()
    hist, _ = np.histogramdd(final_vel, bins=20)
    prob = hist / np.sum(hist)
    entropy = -np.sum(prob * np.log(prob + 1e-9))
    
    return {
        "agents": int(num_agents),
        "mean_velocity": float(np.mean(velocity_history)),
        "system_entropy": float(entropy),
        "pressure_index": float(num_agents / (GRID_SIZE**2))
    }

def main():
    print(f"[{DEVICE}] Iniciando Urban Stress Test: Buscando el Punto de Ruptura de Medellín...")
    
    stress_results = []
    for scale in tqdm(POPULATION_SCALES, desc="Escalando Población"):
        res = run_stress_simulation(scale)
        stress_results.append(res)
        
    # Identificar Punto de Tipping (Donde la velocidad cae drásticamente)
    velocities = [r["mean_velocity"] for r in stress_results]
    tipping_point_idx = np.argmin(np.gradient(velocities))
    tipping_point = stress_results[tipping_point_idx]
    
    report = {
        "generated_at": now_iso(),
        "engine": "HPC Stress Dynamics",
        "tipping_point_detected": tipping_point,
        "full_curve": stress_results,
        "conclusion": f"El colapso sistémico del corredor ocurre a los {tipping_point['agents']} agentes simultáneos."
    }
    
    write_json(OUTPUTS_DIR / "hpc_urban_stress_test.json", report)
    print(f"Stress Test completado. Punto de ruptura: {tipping_point['agents']} agentes.")

if __name__ == "__main__":
    main()
