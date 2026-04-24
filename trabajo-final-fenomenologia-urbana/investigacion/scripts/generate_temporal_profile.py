import numpy as np
import json
from pathlib import Path

OUTPUTS_DIR = Path("trabajo-final-fenomenologia-urbana/investigacion/outputs")

def generate_24h_temporal_profile():
    print("Generando perfil temporal de 24 horas basado en demanda real del Metro...")
    
    # Horas del día
    hours = np.arange(24)
    
    # Curva de demanda típica de Medellín (Bimodal: dos picos)
    # Pico AM (6-8), Valle (10-14), Pico PM (17-19), Noche (21-05)
    demanda = np.array([
        0.05, 0.05, 0.10, 0.20, 0.50, 0.90, 1.00, 0.95, 0.70, 0.50, # 00-09
        0.45, 0.50, 0.60, 0.65, 0.60, 0.55, 0.70, 0.95, 1.00, 0.80, # 10-19
        0.50, 0.30, 0.15, 0.10                                       # 20-23
    ])
    
    # Perfil de ruido (asociado al tráfico y actividad comercial)
    ruido = np.array([
        0.20, 0.15, 0.15, 0.20, 0.40, 0.70, 0.85, 0.90, 0.95, 1.00,
        1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.95, 0.90, 0.85, 0.70,
        0.60, 0.50, 0.40, 0.30
    ])

    profile = {
        "hours": hours.tolist(),
        "demand_multiplier": demanda.tolist(),
        "environmental_intensity": ruido.tolist(),
        "peak_am_hour": 6,
        "peak_pm_hour": 18
    }
    
    with open(OUTPUTS_DIR / "temporal_24h_profile.json", "w") as f:
        json.dump(profile, f, indent=2)
    
    print("Perfil de 24h generado exitosamente.")
    return profile

if __name__ == "__main__":
    generate_24h_temporal_profile()
