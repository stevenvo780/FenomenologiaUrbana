from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image

SCRIPT_ROOT = Path(__file__).resolve().parents[1]
if str(SCRIPT_ROOT) not in sys.path:
    sys.path.insert(0, str(SCRIPT_ROOT))

from _shared import OUTPUTS_DIR, VISUAL_DATA_DIR, now_iso, write_json


Color = tuple[int, int, int]


PALETTES: dict[str, tuple[Color, ...]] = {
    "viridis": ((68, 1, 84), (59, 82, 139), (33, 145, 140), (94, 201, 98), (253, 231, 37)),
    "magma": ((0, 0, 4), (74, 16, 107), (146, 38, 103), (221, 81, 58), (252, 253, 191)),
    "plasma": ((13, 8, 135), (84, 3, 160), (139, 10, 165), (204, 71, 120), (240, 249, 33)),
    "inferno": ((0, 0, 4), (66, 10, 104), (147, 38, 103), (230, 92, 44), (252, 255, 164)),
    "turbo": ((48, 18, 59), (40, 164, 217), (50, 216, 117), (245, 219, 63), (164, 18, 18)),
}


@dataclass(frozen=True)
class RasterSpec:
    source: str
    slug: str
    destination: str
    cmap: str
    scale: str
    size: int
    units: str


RASTERS: tuple[RasterSpec, ...] = (
    RasterSpec("hpc_4k_pm25.npy", "pm25", "fields/pm25.png", "viridis", "linear", 1024, "ug/m3"),
    RasterSpec("hpc_4k_noise.npy", "noise", "fields/noise.png", "magma", "linear", 1024, "dB-unit"),
    RasterSpec("hpc_isovist_exposure_real.npy", "isovist", "fields/isovist.png", "plasma", "log", 1024, "exposure"),
    RasterSpec("hpc_24h_density_atlas.npy", "density_24h", "fields/density_24h.png", "inferno", "linear", 1024, "agents"),
    RasterSpec("hpc_density_peak_am.npy", "density_peak_am", "fields/density_peak_am.png", "inferno", "linear", 1024, "agents"),
    RasterSpec("hpc_density_peak_pm.npy", "density_peak_pm", "fields/density_peak_pm.png", "inferno", "linear", 1024, "agents"),
    RasterSpec("hpc_density_valle.npy", "density_valle", "fields/density_valle.png", "inferno", "linear", 1024, "agents"),
    RasterSpec("hpc_density_night.npy", "density_night", "fields/density_night.png", "inferno", "linear", 1024, "agents"),
    RasterSpec("hpc_everyday_chaos_map.npy", "chaos", "fields/chaos.png", "turbo", "linear", 1024, "turbulence"),
    RasterSpec("historical_density_2012.npy", "hist_2012", "fields/hist_2012.png", "inferno", "linear", 1024, "density"),
    RasterSpec("historical_density_2018.npy", "hist_2018", "fields/hist_2018.png", "inferno", "linear", 1024, "density"),
    RasterSpec("historical_density_2024.npy", "hist_2024", "fields/hist_2024.png", "inferno", "linear", 1024, "density"),
    RasterSpec("pde_field_pm25.npy", "pm25_thumb", "fields/pm25_thumb.png", "viridis", "linear", 512, "ug/m3"),
    RasterSpec("pde_field_noise.npy", "noise_thumb", "fields/noise_thumb.png", "magma", "linear", 512, "dB-unit"),
    RasterSpec("crowd_density_peak_pm.npy", "micro_peak_pm", "fields/micro_peak_pm.png", "turbo", "linear", 512, "agents/m2"),
    RasterSpec("crowd_density_valle.npy", "micro_valle", "fields/micro_valle.png", "turbo", "linear", 512, "agents/m2"),
)


def colorize(gray: np.ndarray, palette_name: str) -> np.ndarray:
    palette = np.array(PALETTES[palette_name], dtype=np.float32)
    position = gray.astype(np.float32) / 255.0 * (len(palette) - 1)
    left = np.floor(position).astype(np.int16)
    right = np.clip(left + 1, 0, len(palette) - 1)
    weight = (position - left)[..., None]
    rgb = palette[left] * (1.0 - weight) + palette[right] * weight
    return rgb.astype(np.uint8)


def normalize_array(array: np.ndarray, scale: str) -> tuple[np.ndarray, float, float, float, float]:
    raw = np.nan_to_num(array.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0)
    raw_min = float(np.min(raw))
    raw_max = float(np.max(raw))

    working = np.maximum(raw, 0.0)
    if scale == "log":
        working = np.log1p(working)

    low, high = np.percentile(working, [2, 98])
    low_f = float(low)
    high_f = float(high)
    spread = max(high_f - low_f, 1e-9)
    normalized = np.clip((working - low_f) / spread, 0.0, 1.0)
    return normalized, raw_min, raw_max, low_f, high_f


def export_raster(spec: RasterSpec) -> dict[str, object]:
    source_path = OUTPUTS_DIR / spec.source
    destination_path = VISUAL_DATA_DIR / spec.destination
    destination_path.parent.mkdir(parents=True, exist_ok=True)

    array = np.load(source_path)
    normalized, raw_min, raw_max, clip_min, clip_max = normalize_array(array, spec.scale)
    gray = (normalized * 255).astype(np.uint8)
    gray_image = Image.fromarray(gray)
    target_bytes = 400 * 1024
    exported_size = spec.size
    exported_colors = 128

    for size in (spec.size, 896, 768, 640, 512):
        if size > spec.size:
            continue

        sized_gray = gray_image
        if sized_gray.size != (size, size):
            sized_gray = gray_image.resize((size, size), Image.Resampling.LANCZOS)

        for colors in (128, 64, 32, 16):
            rgb = colorize(np.asarray(sized_gray), spec.cmap)
            image = Image.fromarray(rgb).quantize(colors=colors, method=Image.Quantize.MEDIANCUT)
            image.save(destination_path, optimize=True, compress_level=9)
            exported_size = size
            exported_colors = colors

            if destination_path.stat().st_size <= target_bytes:
                break

        if destination_path.stat().st_size <= target_bytes:
            break

    return {
        "src": f"/data/{spec.destination}",
        "cmap": spec.cmap,
        "min": raw_min,
        "max": raw_max,
        "clip_min": clip_min,
        "clip_max": clip_max,
        "units": spec.units,
        "scale": spec.scale,
        "size": exported_size,
        "colors": exported_colors,
        "source": spec.source,
        "bytes": destination_path.stat().st_size,
    }


def main() -> Path:
    fields_dir = VISUAL_DATA_DIR / "fields"
    fields_dir.mkdir(parents=True, exist_ok=True)

    manifest = {
        "generated_at": now_iso(),
        "engine": "numpy+pillow-raster-exporter",
        "fields": {},
    }

    for spec in RASTERS:
        manifest["fields"][spec.slug] = export_raster(spec)

    manifest_path = fields_dir / "manifest.json"
    write_json(manifest_path, manifest)
    return manifest_path


if __name__ == "__main__":
    print(main())
