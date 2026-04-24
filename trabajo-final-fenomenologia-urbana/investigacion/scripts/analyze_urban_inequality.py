from __future__ import annotations

import json
from pathlib import Path
import numpy as np
from _shared import read_json, write_json, OUTPUTS_DIR, now_iso

def analyze_inequality():
    advanced_results = read_json(OUTPUTS_DIR / "advanced_simulation_results.json")
    case_model = read_json(OUTPUTS_DIR / "case_model.json")
    
    analysis = []
    
    for scenario in advanced_results["scenarios"]:
        stats = scenario["profile_stats"]
        # Group by agent
        entropies = [s["path_entropy"] for s in stats]
        
        # Calculate Gini Coefficient of Entropy (Inequality of freedom)
        def gini(x):
            x = np.array(x)
            if len(x) == 0: return 0
            n = len(x)
            diffs = np.sum(np.abs(x[:, None] - x))
            return diffs / (2 * n**2 * np.mean(x)) if np.mean(x) > 0 else 0

        entropy_inequality = gini(entropies)
        
        # Find the most restricted profile (lowest entropy)
        restricted = min(stats, key=lambda x: x["path_entropy"])
        free = max(stats, key=lambda x: x["path_entropy"])
        
        analysis.append({
            "scenario_id": scenario["id"],
            "label": scenario["label"],
            "entropy_gini": round(entropy_inequality, 4),
            "most_restricted_profile": restricted["label"],
            "most_free_profile": free["label"],
            "inequity_ratio": round(free["path_entropy"] / restricted["path_entropy"], 2) if restricted["path_entropy"] > 0 else 0
        })

    summary = {
        "generated_at": now_iso(),
        "key_findings": "Análisis de desigualdad fenomenológica basado en M-MASS x100.",
        "scenarios": analysis,
        "conclusion": "La desigualdad en la libertad de ruta (entropía) es un indicador de la calidad democrática del espacio urbano."
    }
    
    write_json(OUTPUTS_DIR / "urban_inequality_analysis.json", summary)
    print("Inequality analysis complete.")

if __name__ == "__main__":
    analyze_inequality()
