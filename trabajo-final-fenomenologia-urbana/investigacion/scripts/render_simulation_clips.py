from __future__ import annotations

import json
import math
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
VISUAL_DATA = ROOT / "visual" / "public" / "data"
PAYLOAD_PATH = VISUAL_DATA / "frontend_payload.json"
OUTPUT_DIR = VISUAL_DATA / "simulations"
FRAME_RATE = 18
DURATION_SECONDS = 4
FRAME_COUNT = FRAME_RATE * DURATION_SECONDS
WIDTH = 960
HEIGHT = 540
PADDING_X = 88
PADDING_Y = 76

CLAY = (224, 122, 70)
SAND = (244, 200, 122)
TEAL = (31, 127, 121)
INK = (20, 16, 15)
CREAM = (255, 248, 236)
MUTED = (180, 163, 135)


def load_payload() -> dict[str, object]:
    return json.loads(PAYLOAD_PATH.read_text(encoding="utf-8"))


def ensure_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


FONT_TITLE = ensure_font(30, bold=True)
FONT_SUBTITLE = ensure_font(17)
FONT_LABEL = ensure_font(12, bold=True)
FONT_MONO = ensure_font(11)


def bounds(nodes: list[dict[str, object]]) -> dict[str, float]:
    lats = [float(node["lat"]) for node in nodes]
    lons = [float(node["lon"]) for node in nodes]
    return {
        "min_lat": min(lats),
        "max_lat": max(lats),
        "min_lon": min(lons),
        "max_lon": max(lons),
    }


def project(node: dict[str, object], b: dict[str, float]) -> tuple[float, float]:
    x_ratio = (float(node["lon"]) - b["min_lon"]) / (b["max_lon"] - b["min_lon"] or 1)
    y_ratio = (float(node["lat"]) - b["min_lat"]) / (b["max_lat"] - b["min_lat"] or 1)
    return (
        PADDING_X + x_ratio * (WIDTH - PADDING_X * 2),
        PADDING_Y + (1 - y_ratio) * (HEIGHT - PADDING_Y * 2),
    )


def lerp(left: float, right: float, t: float) -> float:
    return left + (right - left) * t


def color_lerp(left: tuple[int, int, int], right: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(lerp(left[index], right[index], t)) for index in range(3))


def draw_gradient_background(image: Image.Image, scenario_index: int) -> None:
    pixels = image.load()
    for y in range(HEIGHT):
        t = y / max(HEIGHT - 1, 1)
        base = color_lerp((18, 13, 12), (34, 28, 22), t)
        accent = color_lerp((16, 40, 38), (44, 22, 18), (scenario_index % 4) / 3)
        for x in range(WIDTH):
            radial = math.hypot((x - WIDTH * 0.74) / WIDTH, (y - HEIGHT * 0.22) / HEIGHT)
            mix = max(0, 1 - radial * 2.6) * 0.33
            pixels[x, y] = tuple(int(base[i] * (1 - mix) + accent[i] * mix) for i in range(3))


def draw_grid(draw: ImageDraw.ImageDraw) -> None:
    for x in range(0, WIDTH, 44):
        draw.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 13), width=1)
    for y in range(0, HEIGHT, 44):
        draw.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 11), width=1)


def polyline_points(path: list[str], node_lookup: dict[str, dict[str, object]], b: dict[str, float]) -> list[tuple[float, float]]:
    return [project(node_lookup[node_id], b) for node_id in path if node_id in node_lookup]


def path_lengths(points: list[tuple[float, float]]) -> tuple[list[float], float]:
    lengths = [0.0]
    total = 0.0
    for left, right in zip(points[:-1], points[1:]):
        total += math.dist(left, right)
        lengths.append(total)
    return lengths, total


def point_on_path(points: list[tuple[float, float]], t: float) -> tuple[float, float]:
    if not points:
        return (WIDTH / 2, HEIGHT / 2)
    if len(points) == 1:
        return points[0]

    lengths, total = path_lengths(points)
    if total <= 0:
        return points[0]

    distance = (t % 1) * total
    for index in range(1, len(lengths)):
        if distance <= lengths[index]:
            local = (distance - lengths[index - 1]) / max(lengths[index] - lengths[index - 1], 1)
            left = points[index - 1]
            right = points[index]
            return (lerp(left[0], right[0], local), lerp(left[1], right[1], local))
    return points[-1]


def draw_glow_line(layer: Image.Image, points: list[tuple[float, float]], color: tuple[int, int, int], width: int, alpha: int) -> None:
    if len(points) < 2:
        return
    draw = ImageDraw.Draw(layer, "RGBA")
    draw.line(points, fill=(*color, alpha), width=width, joint="curve")


def draw_text_with_backplate(draw: ImageDraw.ImageDraw, xy: tuple[float, float], text: str, font: ImageFont.ImageFont) -> None:
    x, y = xy
    bbox = draw.textbbox((x, y), text, font=font)
    pad_x = 7
    pad_y = 4
    draw.rounded_rectangle(
        (bbox[0] - pad_x, bbox[1] - pad_y, bbox[2] + pad_x, bbox[3] + pad_y),
        radius=8,
        fill=(10, 8, 7, 168),
        outline=(255, 255, 255, 26),
        width=1,
    )
    draw.text((x, y), text, fill=CREAM, font=font)


def draw_frame(payload: dict[str, object], scenario: dict[str, object], scenario_index: int, frame: int) -> Image.Image:
    nodes = payload["nodes"]
    edges = payload["edges"]
    node_lookup = {str(node["id"]): node for node in nodes}
    b = bounds(nodes)
    max_node_load = max([float(value) for value in scenario["node_loads"].values()] + [1.0])
    max_edge_load = max([float(value) for value in scenario["edge_loads"].values()] + [1.0])
    time = frame / FRAME_COUNT

    image = Image.new("RGB", (WIDTH, HEIGHT), INK)
    draw_gradient_background(image, scenario_index)
    draw = ImageDraw.Draw(image, "RGBA")
    draw_grid(draw)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    route_glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))

    for edge in edges:
        source = node_lookup.get(str(edge["source"]))
        target = node_lookup.get(str(edge["target"]))
        if not source or not target:
            continue
        source_point = project(source, b)
        target_point = project(target, b)
        edge_key = f"{edge['source']}__{edge['target']}"
        reverse_key = f"{edge['target']}__{edge['source']}"
        load = float(scenario["edge_loads"].get(edge_key, scenario["edge_loads"].get(reverse_key, 0)))
        width = int(2 + 10 * (load / max_edge_load))
        draw.line([source_point, target_point], fill=(255, 248, 236, 56), width=max(2, width // 2))
        draw.line([source_point, target_point], fill=(*TEAL, 70), width=max(1, width // 3))

    top_routes = scenario["top_routes"][:8]
    for route_index, route in enumerate(top_routes):
        points = polyline_points(route["path"], node_lookup, b)
        route_color = color_lerp(SAND, TEAL if route_index % 2 else CLAY, min(1, route_index / 7))
        draw_glow_line(route_glow, points, route_color, 20, 46)
        draw_glow_line(route_glow, points, route_color, 7, 166)

        particle_count = max(2, min(8, round(float(route["share"]) * 24)))
        for particle in range(particle_count):
            t = time * (0.72 + route_index * 0.035) + particle / particle_count + route_index * 0.06
            point = point_on_path(points, t)
            radius = int(4 + float(route["share"]) * 13)
            draw.ellipse(
                (point[0] - radius * 2.8, point[1] - radius * 2.8, point[0] + radius * 2.8, point[1] + radius * 2.8),
                fill=(*route_color, 34),
            )
            draw.ellipse(
                (point[0] - radius, point[1] - radius, point[0] + radius, point[1] + radius),
                fill=(*CREAM, 230),
                outline=(*route_color, 240),
                width=2,
            )

    route_glow = route_glow.filter(ImageFilter.GaussianBlur(3))
    image = Image.alpha_composite(image.convert("RGBA"), route_glow)
    draw = ImageDraw.Draw(image, "RGBA")

    for node in nodes:
        point = project(node, b)
        load = float(scenario["node_loads"].get(node["id"], 0))
        pulse = 0.92 + math.sin((time * math.tau * 2.1) + load * 0.02) * 0.08
        radius = (12 + 30 * load / max_node_load) * pulse
        draw.ellipse(
            (point[0] - radius * 2.4, point[1] - radius * 2.4, point[0] + radius * 2.4, point[1] + radius * 2.4),
            fill=(*CLAY, 32),
        )
        draw.ellipse(
            (point[0] - radius, point[1] - radius, point[0] + radius, point[1] + radius),
            fill=(*color_lerp(TEAL, CLAY, load / max_node_load), 222),
            outline=(*CREAM, 174),
            width=2,
        )
        draw_text_with_backplate(draw, (point[0] + radius + 8, point[1] - 11), str(node["label"]), FONT_LABEL)

    draw.rounded_rectangle((28, 24, WIDTH - 28, 92), radius=22, fill=(12, 9, 8, 182), outline=(255, 255, 255, 28), width=1)
    draw.text((48, 36), f"Simulación grabada · {scenario['label']}", fill=CREAM, font=FONT_TITLE)
    draw.text((50, 70), f"{scenario['time_window']} · presión {scenario['metrics']['mean_pressure']} · restricción {round(float(scenario['metrics']['decision_restriction']) * 100)}%", fill=(*MUTED, 255), font=FONT_SUBTITLE)

    draw.rounded_rectangle((WIDTH - 280, HEIGHT - 82, WIDTH - 28, HEIGHT - 26), radius=18, fill=(12, 9, 8, 176), outline=(244, 200, 122, 62), width=1)
    draw.text((WIDTH - 260, HEIGHT - 68), "render desde run_simulation.py", fill=(*SAND, 255), font=FONT_MONO)
    draw.text((WIDTH - 260, HEIGHT - 48), f"frame {frame + 1:03d}/{FRAME_COUNT} · {FRAME_RATE} fps", fill=(*CREAM, 210), font=FONT_MONO)

    return image.convert("RGB")


def run_ffmpeg(frames_dir: Path, output_path: Path) -> None:
    command = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-framerate",
        str(FRAME_RATE),
        "-i",
        str(frames_dir / "%04d.png"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(output_path),
    ]
    subprocess.run(command, check=True)


def render_scenario(payload: dict[str, object], scenario: dict[str, object], scenario_index: int) -> dict[str, object]:
    scenario_id = str(scenario["id"])
    frames_dir = OUTPUT_DIR / f"frames_{scenario_id}"
    output_path = OUTPUT_DIR / f"{scenario_id}.mp4"
    poster_path = OUTPUT_DIR / f"{scenario_id}_poster.png"

    if frames_dir.exists():
        shutil.rmtree(frames_dir)
    frames_dir.mkdir(parents=True, exist_ok=True)

    for frame in range(FRAME_COUNT):
        image = draw_frame(payload, scenario, scenario_index, frame)
        frame_path = frames_dir / f"{frame + 1:04d}.png"
        image.save(frame_path, optimize=True)
        if frame == 0:
            image.save(poster_path, optimize=True)

    run_ffmpeg(frames_dir, output_path)
    shutil.rmtree(frames_dir)

    return {
        "scenario_id": scenario_id,
        "label": scenario["label"],
        "time_window": scenario["time_window"],
        "src": f"/data/simulations/{output_path.name}",
        "poster": f"/data/simulations/{poster_path.name}",
        "duration_seconds": DURATION_SECONDS,
        "frame_rate": FRAME_RATE,
        "frames": FRAME_COUNT,
        "metrics": scenario["metrics"],
    }


def write_manifest(clips: Iterable[dict[str, object]]) -> Path:
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_payload": "/data/frontend_payload.json",
        "renderer": "investigacion/scripts/render_simulation_clips.py",
        "note": "Clips MP4 renderizados desde resultados de run_simulation.py para uso como recursos visuales de presentación.",
        "clips": list(clips),
    }
    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest_path


def main() -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for stale in OUTPUT_DIR.glob("frames_*"):
        if stale.is_dir():
            shutil.rmtree(stale)
    for stale in [*OUTPUT_DIR.glob("*.mp4"), *OUTPUT_DIR.glob("*_poster.png")]:
        stale.unlink()
    payload = load_payload()
    clips = [
        render_scenario(payload, scenario, index)
        for index, scenario in enumerate(payload["scenarios"])
    ]
    return write_manifest(clips)


if __name__ == "__main__":
    print(main())
