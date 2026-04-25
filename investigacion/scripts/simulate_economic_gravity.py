import json
from pathlib import Path
import numpy as np
import torch
from tqdm import tqdm

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# CONFIGURACIÓN HPC: Economía Espacial (Gravitación)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
GRID_SIZE = 512

def simulate_economic_gravity():
    print(f"[{DEVICE}] Iniciando Simulación de Dinámicas de Economía Espacial...")
    
    # 1. Definir Centros Económicos (Basado en MEData establecimientos comerciales)
    # x, y, potencia_comercial (número de locales / atracción)
    economic_hubs = torch.tensor([
        [0.5, 0.5, 100.0], # Nodo Junín (Alta atracción comercial)
        [0.2, 0.3, 80.0],  # Palacio Nacional
        [0.8, 0.8, 60.0],  # Parque Berrío (Comercio informal/formal)
    ], device=DEVICE)
    
    # 2. Generar Campo de Potencial Económico
    # U(x,y) = sum( Potencia_i / dist(i, (x,y))^alpha )
    grid_y, grid_x = torch.meshgrid(torch.linspace(0, 1, GRID_SIZE, device=DEVICE), torch.linspace(0, 1, GRID_SIZE, device=DEVICE), indexing='ij')
    
    economic_field = torch.zeros((GRID_SIZE, GRID_SIZE), device=DEVICE)
    
    for hub in economic_hubs:
        dist_sq = (grid_x - hub[0])**2 + (grid_y - hub[1])**2
        # Evitar singularidad en el centro del hub
        economic_field += hub[2] / torch.sqrt(dist_sq + 0.01)
    
    # 3. Simular Agentes "Compradores" (Siguen el gradiente del campo)
    num_agents = 50000
    agent_pos = torch.rand((num_agents, 2), device=DEVICE)
    
    # Calcular gradiente del campo económico (Fuerza de atracción)
    # dU/dx, dU/dy
    diff_x = torch.diff(economic_field, dim=1, prepend=economic_field[:, 0:1])
    diff_y = torch.diff(economic_field, dim=0, prepend=economic_field[0:1, :])
    
    # Resultados de la simulación
    economic_capture_rate = []
    
    # Los agentes se mueven hacia zonas de alta energía económica
    for _ in range(100):
        # Muestrear gradiente en la posición actual
        idx_x = (agent_pos[:, 0] * (GRID_SIZE - 1)).long()
        idx_y = (agent_pos[:, 1] * (GRID_SIZE - 1)).long()
        
        force_x = diff_x[idx_y, idx_x]
        force_y = diff_y[idx_y, idx_x]
        
        # Actualizar posición (hacia el comercio)
        agent_pos += torch.stack([force_x, force_y], dim=1) * 0.0001
        agent_pos = torch.clamp(agent_pos, 0, 1)

    # Calcular Índice de "Centralidad Económica Fenomenológica"
    final_density, _, _ = np.histogram2d(
        agent_pos[:, 0].cpu().numpy(), 
        agent_pos[:, 1].cpu().numpy(), 
        bins=100
    )
    
    report = {
        "generated_at": now_iso(),
        "engine": "HPC Economic Gravity Model",
        "hubs_analyzed": len(economic_hubs),
        "total_commercial_pull": float(torch.sum(economic_field).cpu().numpy()),
        "spatial_concentration_gini": float(np.std(final_density) / np.mean(final_density)) if np.mean(final_density) > 0 else 0
    }
    
    write_json(OUTPUTS_DIR / "economic_gravity_results.json", report)
    print("Simulación de Economía Espacial completada.")

if __name__ == "__main__":
    simulate_economic_gravity()
