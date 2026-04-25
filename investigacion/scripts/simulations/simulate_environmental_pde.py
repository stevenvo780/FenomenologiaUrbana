from __future__ import annotations

import json
from pathlib import Path
import numpy as np
import torch
from tqdm import tqdm

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# CONFIGURACIÓN HPC: Resolución 4K (4096 x 4096)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
GRID_SIZE = 4096  # 16.7 millones de puntos de datos
DT = 0.02
STEPS = 1500      # Más pasos para permitir la convergencia en malla fina

def laplacian_4k(u):
    """Calcula el laplaciano usando un stencil de 5 puntos optimizado para mallas masivas."""
    lap = torch.zeros_like(u)
    # Vectorización total en GPU
    lap[1:-1, 1:-1] = (
        u[:-2, 1:-1] + u[2:, 1:-1] + u[1:-1, :-2] + u[1:-1, 2:] - 4 * u[1:-1, 1:-1]
    )
    return lap

def solve_environmental_4k(field_name, sources, D, decay):
    print(f"[{DEVICE}] Resolviendo PDE Ambiental 4K: {field_name}...")
    
    # u(x, y, t)
    u = torch.zeros((GRID_SIZE, GRID_SIZE), device=DEVICE, dtype=torch.float32)
    
    # Inyectar fuentes basadas en la geometría del corredor
    # Las fuentes representan tráfico en la Av. Oriental y San Juan
    source_mask = torch.zeros_like(u)
    for sx, sy, intensity in sources:
        cx, cy = int(sx * GRID_SIZE), int(sy * GRID_SIZE)
        # Radio de influencia de la fuente
        y, x = torch.meshgrid(torch.arange(GRID_SIZE, device=DEVICE), torch.arange(GRID_SIZE, device=DEVICE), indexing='ij')
        dist = (x - cx)**2 + (y - cy)**2
        source_mask[dist < 100] = intensity # Radio 10 en escala 4k

    for step in tqdm(range(STEPS)):
        # Ecuación de Difusión-Reacción: du/dt = D*Laplace(u) + S - k*u
        u = u + (D * laplacian_4k(u) + source_mask - decay * u) * DT
        u = torch.clamp(u, min=0.0)

    return u.cpu().numpy()

def main():
    print("Iniciando Simulación Ambiental de Alta Fidelidad (4K PDE Solver)...")
    
    # Fuentes de PM2.5 (Tráfico pesado en los bordes del polígono)
    pm25_sources = [
        (0.1, 0.5, 20.0), # Av. Oriental Norte
        (0.9, 0.5, 20.0), # Av. Oriental Sur
        (0.5, 0.1, 25.0), # Calle San Juan
    ]
    
    # Fuentes de Ruido (Nodos Metro y Cruces principales)
    noise_sources = [
        (0.5, 0.5, 80.0), # Estación San Antonio
        (0.5, 0.8, 60.0), # Parque Berrío
        (0.2, 0.5, 50.0), # Junín con Colombia
    ]

    # Resolver con constantes físicas realistas
    pm25_map = solve_environmental_4k("PM2.5 Dispersion", pm25_sources, D=0.15, decay=0.02)
    noise_map = solve_environmental_4k("Acoustic Propagation", noise_sources, D=0.05, decay=0.12)
    
    # Guardar en formato binario para análisis HPC posterior
    np.save(OUTPUTS_DIR / "hpc_4k_pm25.npy", pm25_map)
    np.save(OUTPUTS_DIR / "hpc_4k_noise.npy", noise_map)
    
    # Generar metadatos para la tesis
    report = {
        "generated_at": now_iso(),
        "resolution": "4096x4096 (16.7M cells)",
        "pm25": {
            "peak": float(np.max(pm25_map)),
            "ambient_avg": float(np.mean(pm25_map))
        },
        "noise": {
            "peak_db": float(np.max(noise_map)),
            "spatial_variance": float(np.var(noise_map))
        }
    }
    write_json(OUTPUTS_DIR / "hpc_environmental_report.json", report)
    print("Simulación 4K completada exitosamente.")

if __name__ == "__main__":
    main()
