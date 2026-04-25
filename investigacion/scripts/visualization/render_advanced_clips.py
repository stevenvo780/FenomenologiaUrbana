from __future__ import annotations

import json
import math
import shutil
import subprocess
import multiprocessing
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

SCRIPT_ROOT = Path(__file__).resolve().parents[1]
if str(SCRIPT_ROOT) not in sys.path:
    sys.path.insert(0, str(SCRIPT_ROOT))

from _shared import OUTPUTS_DIR, VISUAL_DATA_DIR, now_iso

# Path configuration
VISUAL_DATA = VISUAL_DATA_DIR
PAYLOAD_PATH = VISUAL_DATA / "frontend_payload.json"
ADVANCED_RESULTS_PATH = OUTPUTS_DIR / "advanced_simulation_results.json"
OUTPUT_DIR = VISUAL_DATA / "simulations"

# Video configuration
FRAME_RATE = 24  # Smoother
DURATION_SECONDS = 5
FRAME_COUNT = FRAME_RATE * DURATION_SECONDS
WIDTH = 1920  # Full HD
HEIGHT = 1080
PADDING_X = 180
PADDING_Y = 150

# Aesthetic Palette (Cyber-Phenomenology)
INK = (10, 12, 14)
GLOW_TEAL = (0, 255, 230)
GLOW_AMBER = (255, 180, 0)
GLOW_MAGENTA = (255, 0, 150)
CREAM = (245, 245, 240)
GRID_COLOR = (255, 255, 255, 15)

def ensure_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        try: return ImageFont.truetype(candidate, size=size)
        except OSError: continue
    return ImageFont.load_default()

FONT_TITLE = ensure_font(52, bold=True)
FONT_SUBTITLE = ensure_font(28)
FONT_LABEL = ensure_font(18, bold=True)
FONT_MONO = ensure_font(16)

def project(lat, lon, b, w, h, px, py) -> tuple[float, float]:
    x_ratio = (lon - b["min_lon"]) / (b["max_lon"] - b["min_lon"] or 1)
    y_ratio = (lat - b["min_lat"]) / (b["max_lat"] - b["min_lat"] or 1)
    return (px + x_ratio * (w - px * 2), py + (1 - y_ratio) * (h - py * 2))

def draw_advanced_frame(args):
    payload, scenario, frame, scenario_index, output_path = args
    
    nodes = payload["nodes"]
    edges = payload["edges"]
    node_lookup = {node["id"]: node for node in nodes}
    
    lats = [n["lat"] for n in nodes]
    lons = [n["lon"] for n in nodes]
    b = {"min_lat": min(lats), "max_lat": max(lats), "min_lon": min(lons), "max_lon": max(lons)}
    
    time_pct = frame / FRAME_COUNT
    
    # Base Image
    image = Image.new("RGB", (WIDTH, HEIGHT), INK)
    draw = ImageDraw.Draw(image, "RGBA")
    
    # 1. Background Atmosphere (Driven by Entropy)
    entropy = scenario["metrics"]["m_mass_entropy"]
    pulse = (math.sin(time_pct * math.tau + scenario_index) + 1) / 2
    bg_alpha = int(20 + 30 * entropy * pulse)
    draw.ellipse([WIDTH*0.2, HEIGHT*0.2, WIDTH*0.8, HEIGHT*0.8], fill=(0, 100, 255, bg_alpha))
    
    # 2. Grid
    for x in range(0, WIDTH, 80):
        draw.line([(x, 0), (x, HEIGHT)], fill=GRID_COLOR, width=1)
    for y in range(0, HEIGHT, 80):
        draw.line([(0, y), (WIDTH, y)], fill=GRID_COLOR, width=1)

    # 3. Edges (Systemic Flows)
    for edge in edges:
        s = node_lookup.get(edge["source"])
        t = node_lookup.get(edge["target"])
        if not s or not t: continue
        sp = project(s["lat"], s["lon"], b, WIDTH, HEIGHT, PADDING_X, PADDING_Y)
        tp = project(t["lat"], t["lon"], b, WIDTH, HEIGHT, PADDING_X, PADDING_Y)
        
        edge_key = f"{edge['source']}__{edge['target']}"
        load = scenario["edge_loads"].get(edge_key, 0)
        max_load = max(scenario["edge_loads"].values()) if scenario["edge_loads"] else 1
        
        intensity = load / max_load
        color = (0, 180, 255, int(40 + 160 * intensity))
        draw.line([sp, tp], fill=color, width=int(1 + 6 * intensity))

    # 4. Nodes (Phenomenological Anchors)
    for node in nodes:
        p = project(node["lat"], node["lon"], b, WIDTH, HEIGHT, PADDING_X, PADDING_Y)
        load = scenario["node_loads"].get(node["id"], 0)
        
        # Glow layer
        glow_size = 20 + 40 * load + 5 * math.sin(time_pct * math.tau * 2)
        draw.ellipse([p[0]-glow_size, p[1]-glow_size, p[0]+glow_size, p[1]+glow_size], fill=(255, 100, 0, 40))
        
        # Core
        core_size = 8 + 12 * load
        draw.ellipse([p[0]-core_size, p[1]-core_size, p[0]+core_size, p[1]+core_size], fill=CREAM, outline=GLOW_AMBER, width=3)
        
        # Label with shadow
        draw.text((p[0]+core_size+10, p[1]-15), node["label"], fill=(0,0,0,180), font=FONT_LABEL)
        draw.text((p[0]+core_size+8, p[1]-17), node["label"], fill=CREAM, font=FONT_LABEL)

    # 5. Information HUD
    draw.rectangle([0, 0, WIDTH, 120], fill=(0,0,0,150))
    draw.text((60, 30), f"ADVANCED PHENOMENOLOGICAL SIMULATION · {scenario['label'].upper()}", fill=GLOW_TEAL, font=FONT_TITLE)
    
    hud_y = HEIGHT - 120
    draw.rectangle([0, hud_y, WIDTH, HEIGHT], fill=(0,0,0,180))
    metrics_text = f"Entropy: {entropy:.4f} | Systemic Pressure: {scenario['metrics']['systemic_pressure']:.2f} | Agents: M-MASS x100"
    draw.text((60, hud_y + 40), metrics_text, fill=GLOW_AMBER, font=FONT_SUBTITLE)
    draw.text((WIDTH - 400, hud_y + 45), f"FRAME {frame:03d} / {FRAME_COUNT} | {FRAME_RATE} FPS", fill=CREAM, font=FONT_MONO)

    image.save(output_path, "PNG")

def render_scenario_parallel(payload, scenario, scenario_index):
    sid = scenario["id"]
    frames_dir = OUTPUT_DIR / f"frames_{sid}"
    frames_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Rendering scenario {sid} in parallel...")
    
    tasks = []
    for f in range(FRAME_COUNT):
        output_path = frames_dir / f"{f:04d}.png"
        tasks.append((payload, scenario, f, scenario_index, output_path))
    
    with multiprocessing.Pool(processes=multiprocessing.cpu_count()) as pool:
        pool.map(draw_advanced_frame, tasks)
    
    # Encode with FFmpeg
    video_path = OUTPUT_DIR / f"{sid}.mp4"
    poster_path = OUTPUT_DIR / f"{sid}_poster.png"
    
    # Copy first frame as poster
    shutil.copy(frames_dir / "0000.png", poster_path)
    
    cmd = [
        "ffmpeg", "-y", "-framerate", str(FRAME_RATE),
        "-i", str(frames_dir / "%04d.png"),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
        str(video_path)
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.rmtree(frames_dir)
    return {
        "scenario_id": sid,
        "src": f"/data/simulations/{sid}.mp4",
        "poster": f"/data/simulations/{sid}_poster.png"
    }

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = json.loads(PAYLOAD_PATH.read_text())
    advanced_results = json.loads(ADVANCED_RESULTS_PATH.read_text())
    
    # Merge advanced results into payload for the renderer
    scenario_map = {s["id"]: s for s in advanced_results["scenarios"]}
    
    clips = []
    for i, s_base in enumerate(payload["scenarios"]):
        adv_s = scenario_map.get(s_base["id"])
        if adv_s:
            clip = render_scenario_parallel(payload, adv_s, i)
            clips.append(clip)
            
    # Write manifest
    manifest = {
        "generated_at": now_iso(),
        "engine": "Advanced Parallel Renderer V2",
        "clips": clips
    }
    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print("Advanced rendering complete.")

if __name__ == "__main__":
    main()
