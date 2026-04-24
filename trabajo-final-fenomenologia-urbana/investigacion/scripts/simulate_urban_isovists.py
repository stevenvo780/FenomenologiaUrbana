import json
from pathlib import Path
import numpy as np
import torch
from tqdm import tqdm

from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

# CONFIGURACIÓN HPC: Visibilidad sobre Morfología Real
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
GRID_RES = 2048  # Resolución 2K para precisión sub-métrica
NUM_RAYS = 720   # 0.5 grados de resolución visual
MAX_DIST = 250.0 # Alcance visual de un observador urbano

def simulate_real_isovists():
    print(f"[{DEVICE}] Iniciando Simulación de Isovistas sobre Morfología Real de Medellín...")
    
    # 1. Cargar Nodos Reales para reconstruir la morfología
    case_model = read_json(OUTPUTS_DIR / "case_model.json")
    nodes = case_model["nodes"]
    
    # 2. Crear Mapa de Obstáculos (Rasterización de la morfología del corredor)
    obstacles = torch.zeros((GRID_RES, GRID_RES), device=DEVICE)
    
    # Proyectar nodos y crear "muros" virtuales entre ellos para simular las fachadas de Junín
    lats = [n["lat"] for n in nodes]
    lons = [n["lon"] for n in nodes]
    b = {"min_lat": min(lats), "max_lat": max(lats), "min_lon": min(lons), "max_lon": max(lons)}
    
    def project(lat, lon):
        x = (lon - b["min_lon"]) / (b["max_lon"] - b["min_lon"] or 1) * (GRID_RES - 1)
        y = (lat - b["min_lat"]) / (b["max_lat"] - b["min_lat"] or 1) * (GRID_RES - 1)
        return int(x), int(y)

    # Dibujar la morfología de las manzanas (Bloques reales del centro)
    # Junín es un cañón urbano, San Antonio es una plaza abierta
    for node in nodes:
        if node["kind"] in ["commercial", "interchange"]:
            px, py = project(node["lat"], node["lon"])
            # Crear un bloque de "edificio" alrededor del nodo comercial
            obstacles[max(0, px-40):min(GRID_RES, px+40), max(0, py-40):min(GRID_RES, py+40)] = 1.0

    # 3. Puntos de observación (Dónde están los peatones)
    sample_points = torch.rand((5000, 2), device=DEVICE) * (GRID_RES - 1)
    # Filtrar puntos que caen dentro de edificios
    valid_mask = obstacles[sample_points[:, 0].long(), sample_points[:, 1].long()] == 0
    sample_points = sample_points[valid_mask]

    # 4. Ray-Tracing Masivo en GPU
    angles = torch.linspace(0, 2 * np.pi, NUM_RAYS, device=DEVICE)
    cos_a = torch.cos(angles).view(1, -1, 1)
    sin_a = torch.sin(angles).view(1, -1, 1)
    dists = torch.linspace(0, MAX_DIST, 100, device=DEVICE).view(1, 1, -1)

    exposure_map = torch.zeros((GRID_RES, GRID_RES), device=DEVICE)
    
    print(f"   Analizando {len(sample_points)} puntos de vista con {NUM_RAYS} rayos cada uno...")
    
    for i in tqdm(range(0, len(sample_points), 50)):
        batch = sample_points[i:i+50]
        bx = batch[:, 0].view(-1, 1, 1)
        by = batch[:, 1].view(-1, 1, 1)
        
        rx = torch.clamp(bx + cos_a * dists, 0, GRID_RES-1).long()
        ry = torch.clamp(by + sin_a * dists, 0, GRID_RES-1).long()
        
        # Colisión de rayos
        hits = obstacles[rx, ry]
        
        # El área de la isovista es la suma de celdas no obstruidas
        # Métrica fenomenológica: "Openness Index"
        openness = torch.sum(1.0 - hits, dim=(1, 2)) / (NUM_RAYS * 100)
        
        # Acumular exposición (cuántas veces es visto un punto)
        # Esto simula el "Panóptico Urbano"
        exposure_map.view(-1).scatter_add_(0, (rx * GRID_RES + ry).view(-1), torch.ones(rx.numel(), device=DEVICE))

    # Normalizar y guardar
    exposure_np = exposure_map.cpu().numpy()
    np.save(OUTPUTS_DIR / "hpc_isovist_exposure_real.npy", exposure_np)
    
    report = {
        "generated_at": now_iso(),
        "resolution": f"{GRID_RES}x{GRID_RES}",
        "points_sampled": len(sample_points),
        "ray_count": len(sample_points) * NUM_RAYS,
        "max_panoptic_exposure": float(np.max(exposure_np)),
        "mean_openness": float(torch.mean(openness).cpu().numpy())
    }
    
    write_json(OUTPUTS_DIR / "perceptual_visibility_results.json", report)
    print("Investigación de Visibilidad (Real Morph) completada.")

if __name__ == "__main__":
    simulate_real_isovists()
