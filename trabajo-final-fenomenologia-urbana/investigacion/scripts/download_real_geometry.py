import requests
import json
from pathlib import Path

OUTPUTS_DIR = Path("trabajo-final-fenomenologia-urbana/investigacion/outputs")

def download_medellin_geometry():
    print("Descargando geometría real de edificios (Medellín Centro) desde Overpass...")
    
    # Bounding box del corredor: San Antonio a Plaza Botero
    # [south, west, north, east]
    bbox = "6.244,-75.573,6.254,-75.561"
    
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      way["building"]({bbox});
      relation["building"]({bbox});
    );
    out body;
    >;
    out skel qt;
    """
    
    response = requests.get(overpass_url, params={'data': overpass_query})
    data = response.json()
    
    with open(OUTPUTS_DIR / "medellin_buildings.json", "w") as f:
        json.dump(data, f, indent=2)
        
    print(f"Geometría descargada: {len(data['elements'])} elementos urbanos capturados.")
    return data

if __name__ == "__main__":
    download_medellin_geometry()
