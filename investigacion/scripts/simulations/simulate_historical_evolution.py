import csv
import numpy as np
import torch
from tqdm import tqdm

from _shared import RAW_DIR, write_json, OUTPUTS_DIR, now_iso

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
GRID_SIZE = 512.0
DT = 0.1

def extract_historical_data(target_year: str):
    print(f"Extrayendo datos históricos para el año {target_year}...")
    
    # 1. Extraer Indicadores (Densidad, Comercio)
    indicators = {
        "densidad": "Densidad poblacional",
        "comercio": "Establecimientos comerciales"
    }
    
    found_values = {k: [] for k in indicators.keys()}
    
    try:
        with open(RAW_DIR / "medata_barrio_csv.csv", mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['Nom_Com'] == 'La Candelaria' and str(row['Anio']) == target_year:
                    for key, search_name in indicators.items():
                        if search_name.lower() in row['Nom_Ind'].lower():
                            try:
                                found_values[key].append(float(row['Valor'].replace(',', '.')))
                            except ValueError:
                                continue
    except Exception as e:
        print(f"Error leyendo barrio_csv: {e}")

    results = {}
    for key, vals in found_values.items():
        results[key] = sum(vals) / len(vals) if vals else 1.0
        
    # 2. Extraer Criminalidad (Riesgo proxy)
    crime_count = 0
    try:
        with open(RAW_DIR / "medata_criminalidad_csv.csv", mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['Fecha_hecho'].startswith(target_year) and row['Codigo_comuna'] == '10':
                    try:
                        crime_count += int(row['Cantidad_casos'])
                    except ValueError:
                        continue
    except Exception as e:
        print(f"Error leyendo criminalidad_csv: {e}")
        
    results["casos_crimen"] = crime_count if crime_count > 0 else 5000 # Proxy fallback

    return results

def simulate_historical_year(year: str, data: dict):
    print(f"[{DEVICE}] Simulando dinámica urbana para {year}...")
    
    # Base configuration modified by historical data
    # Higher density -> more agents
    # Higher crime -> tighter clustering / more turbulence (fear behavior)
    
    base_agents = 80000
    density_factor = data.get("densidad", 150) / 150.0  # Normalize around 150
    num_agents = int(base_agents * density_factor)
    
    crime_factor = data.get("casos_crimen", 5000) / 5000.0
    desired_speeds = 1.2 + (crime_factor * 0.1) + torch.randn(num_agents, device=DEVICE) * 0.25 # Faster in high crime
    
    positions = torch.rand((num_agents, 2), device=DEVICE) * GRID_SIZE
    velocities = torch.zeros((num_agents, 2), device=DEVICE)
    
    targets = torch.tensor([
        [GRID_SIZE * 0.1, GRID_SIZE * 0.9],
        [GRID_SIZE * 0.9, GRID_SIZE * 0.1],
        [GRID_SIZE * 0.5, GRID_SIZE * 0.5],
    ], device=DEVICE)
    
    agent_targets = targets[torch.randint(0, len(targets), (num_agents,), device=DEVICE)]
    trajectory_density = torch.zeros((1024, 1024), device=DEVICE)
    
    steps = 600
    for step in tqdm(range(steps), desc=f"Simulando {year}"):
        direction = agent_targets - positions
        dist_to_target = torch.norm(direction, dim=1, keepdim=True)
        direction = direction / torch.clamp(dist_to_target, min=1e-5)
        
        driving_force = (direction * desired_speeds.unsqueeze(1) - velocities) / 0.5
        noise = torch.randn_like(driving_force) * (0.1 * crime_factor) # More panic/noise in high crime years
        
        velocities = velocities + (driving_force + noise) * DT
        speed = torch.norm(velocities, dim=1, keepdim=True)
        velocities = velocities / torch.clamp(speed, min=1.0) * torch.clamp(speed, max=2.5)
        
        positions = positions + velocities * DT
        positions = torch.clamp(positions, 0, GRID_SIZE - 0.1)
        
        scaled_pos = (positions / GRID_SIZE * 1023).long()
        indices = scaled_pos[:, 0] * 1024 + scaled_pos[:, 1]
        trajectory_density.view(-1).scatter_add_(0, indices, torch.ones_like(indices, dtype=torch.float32))

    density_map = (trajectory_density / steps).cpu().numpy()
    np.save(OUTPUTS_DIR / f"historical_density_{year}.npy", density_map)
    
    entropy = float(-np.sum(density_map * np.log(density_map + 1e-9)))
    
    return {
        "year": year,
        "empirical_data": data,
        "agents_simulated": num_agents,
        "max_density": float(density_map.max()),
        "entropy_spatial": entropy,
        "turbulence": float(torch.var(velocities).cpu().numpy())
    }

def main():
    print("Iniciando Estudio Longitudinal HPC (2012 - 2018 - 2024)...")
    
    years = ["2012", "2018", "2024"]
    historical_results = []
    
    for year in years:
        emp_data = extract_historical_data(year)
        sim_result = simulate_historical_year(year, emp_data)
        historical_results.append(sim_result)
        
    payload = {
        "generated_at": now_iso(),
        "engine": "Historical M-MASS Longitudinal Series",
        "years_analyzed": years,
        "evolution": historical_results
    }
    
    write_json(OUTPUTS_DIR / "historical_evolution_results.json", payload)
    print("Estudio Longitudinal completado.")

if __name__ == "__main__":
    main()
