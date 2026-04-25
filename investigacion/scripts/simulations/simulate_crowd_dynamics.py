import json
from pathlib import Path
import numpy as np
import torch
from tqdm import tqdm

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# CONFIGURACIÓN HPC 24H
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
GRID_SIZE = 512.0
BASE_NUM_AGENTS = 50000  # Se multiplicará por el factor horario (Max 150k)
STEPS_PER_HOUR = 300    # Snapshots representativos por hora
DT = 0.1

def simulate_hpc_24h():
    print(f"[{DEVICE}] Iniciando Simulación de Ciclo Completo 24h (HPC Mode)...")
    
    # Cargar perfil temporal
    profile = read_json(OUTPUTS_DIR / "temporal_24h_profile.json")
    
    # Resultados acumulados
    hourly_results = []
    total_density_24h = torch.zeros((1024, 1024), device=DEVICE)

    for h in range(24):
        multiplier = profile["demand_multiplier"][h]
        num_agents = int(BASE_NUM_AGENTS * multiplier)
        
        if num_agents < 100: continue # Saltar horas muertas de madrugada
        
        print(f"--- Simulando Hora {h:02d}:00 | Agentes: {num_agents} ---")
        
        # Inicialización
        positions = torch.rand((num_agents, 2), device=DEVICE) * GRID_SIZE
        velocities = torch.zeros((num_agents, 2), device=DEVICE)
        
        # Objetivos dinámicos según hora (Simplificado)
        targets = torch.tensor([
            [GRID_SIZE * 0.1, GRID_SIZE * 0.9],
            [GRID_SIZE * 0.9, GRID_SIZE * 0.1],
            [GRID_SIZE * 0.5, GRID_SIZE * 0.5],
        ], device=DEVICE)
        agent_targets = targets[torch.randint(0, len(targets), (num_agents,), device=DEVICE)]
        
        hourly_density = torch.zeros((1024, 1024), device=DEVICE)

        for step in range(STEPS_PER_HOUR):
            # Fuerza de Deseo
            direction = agent_targets - positions
            dist = torch.norm(direction, dim=1, keepdim=True)
            direction = direction / torch.clamp(dist, min=1e-5)
            force = (direction * 1.3 - velocities) / 0.5
            
            # Integración
            velocities = velocities + force * DT
            positions = positions + velocities * DT
            positions = torch.clamp(positions, 0, GRID_SIZE - 0.1)
            
            # Acumular densidad
            scaled_pos = (positions / GRID_SIZE * 1023).long()
            indices = scaled_pos[:, 0] * 1024 + scaled_pos[:, 1]
            hourly_density.view(-1).scatter_add_(0, indices, torch.ones_like(indices, dtype=torch.float32))

        # Promediar hora
        hourly_density = hourly_density / STEPS_PER_HOUR
        total_density_24h += hourly_density
        
        hourly_results.append({
            "hour": h,
            "agents": num_agents,
            "max_load": float(hourly_density.max().cpu().numpy()),
            "mean_energy": float(torch.mean(velocities**2).cpu().numpy())
        })

    # Guardar mapa de calor consolidado de 24h
    np.save(OUTPUTS_DIR / "hpc_24h_density_atlas.npy", total_density_24h.cpu().numpy())
    
    report = {
        "generated_at": now_iso(),
        "total_simulated_agents_day": sum(r["agents"] for r in hourly_results),
        "hourly_metrics": hourly_results
    }
    write_json(OUTPUTS_DIR / "hpc_24h_simulation_report.json", report)
    print("Simulación de 24 horas completada.")

if __name__ == "__main__":
    simulate_hpc_24h()
