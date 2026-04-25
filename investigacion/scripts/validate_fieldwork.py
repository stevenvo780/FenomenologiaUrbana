from __future__ import annotations

from datetime import datetime
from pathlib import Path
import re
from typing import Any

from _shared import OUTPUTS_DIR, read_json

COUNT_REQUIRED_COLUMNS = {
    "timestamp",
    "node_id",
    "time_window",
    "observer_id",
    "pedestrians_5min",
}

COUNT_OPTIONAL_COLUMNS = {
    "node_label",
    "source_node_id",
    "target_node_id",
    "edge_id",
    "subsegment_label",
    "direction",
    "dwell_seconds_mean",
    "noise_db",
    "lighting_lux",
    "security_score",
    "obstacle_notes",
    "weather_notes",
}

TIME_WINDOW_PATTERN = re.compile(r"^(\d{2}):(\d{2})-(\d{2}):(\d{2})$")

DEFAULT_NODE_IDS = {
    "san_antonio_metro",
    "parque_san_antonio",
    "palacio_nacional",
    "junin_paseo",
    "oriental_cruce",
    "parque_berrio",
    "carabobo_cultural",
    "plaza_botero",
    "museo_antioquia",
}

DEFAULT_EDGE_IDS = {
    "san_antonio_metro__parque_san_antonio",
    "san_antonio_metro__junin_paseo",
    "san_antonio_metro__palacio_nacional",
    "parque_san_antonio__junin_paseo",
    "palacio_nacional__junin_paseo",
    "junin_paseo__oriental_cruce",
    "junin_paseo__parque_berrio",
    "oriental_cruce__parque_berrio",
    "parque_berrio__carabobo_cultural",
    "carabobo_cultural__plaza_botero",
    "plaza_botero__museo_antioquia",
    "parque_berrio__plaza_botero",
    "palacio_nacional__parque_berrio",
}


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def parse_float(value: str | None) -> float | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def parse_timestamp(value: str) -> datetime | None:
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def load_case_entities(case_model_path: Path | None = None) -> tuple[set[str], set[str]]:
    path = case_model_path or OUTPUTS_DIR / "case_model.json"
    if not path.exists():
        return set(DEFAULT_NODE_IDS), set(DEFAULT_EDGE_IDS)

    payload = read_json(path)
    node_ids = {node["id"] for node in payload.get("nodes", [])}
    edge_ids = {
        f"{edge['source']}__{edge['target']}"
        for edge in payload.get("edges", [])
    }
    return node_ids or set(DEFAULT_NODE_IDS), edge_ids or set(DEFAULT_EDGE_IDS)


def infer_scenario_id(time_window: str) -> str | None:
    match = TIME_WINDOW_PATTERN.match(time_window.strip())
    if not match:
        return None

    start_hour = int(match.group(1))
    if 7 <= start_hour < 10:
        return "peak_am"
    if 12 <= start_hour < 15:
        return "midday"
    if 17 <= start_hour < 20:
        return "peak_pm"
    if 20 <= start_hour < 23:
        return "night"
    return None


def canonical_edge_id(
    source_node_id: str | None,
    target_node_id: str | None,
    explicit_edge_id: str | None,
    edge_ids: set[str],
) -> str | None:
    source = (source_node_id or "").strip()
    target = (target_node_id or "").strip()
    explicit = (explicit_edge_id or "").strip()

    if explicit:
        if explicit in edge_ids:
            return explicit
        reverse = "__".join(reversed(explicit.split("__", 1))) if "__" in explicit else ""
        if reverse in edge_ids:
            return reverse

    if not source or not target:
        return None

    direct = f"{source}__{target}"
    reverse = f"{target}__{source}"
    if direct in edge_ids:
        return direct
    if reverse in edge_ids:
        return reverse
    return None


def normalize_security_ratio(value: float | None) -> float | None:
    if value is None:
        return None
    return round(clamp((value - 1.0) / 4.0, 0.0, 1.0), 3)


def normalize_noise_ratio(value: float | None) -> float | None:
    if value is None:
        return None
    return round(clamp((value - 45.0) / 45.0, 0.0, 1.0), 3)


def normalize_lighting_ratio(value: float | None) -> float | None:
    if value is None:
        return None
    return round(clamp(value / 1000.0, 0.0, 1.0), 3)


def normalize_dwell_ratio(value: float | None) -> float | None:
    if value is None:
        return None
    return round(clamp(value / 300.0, 0.0, 1.0), 3)


def normalize_crowding_ratio(value: float | None) -> float | None:
    if value is None:
        return None
    return round(clamp(value / 200.0, 0.0, 1.0), 3)


def obstacle_flag(value: str | None) -> int:
    text = (value or "").strip().lower()
    return 1 if text else 0


def validate_count_row(
    row: dict[str, str],
    node_ids: set[str],
    edge_ids: set[str],
) -> tuple[list[str], list[str], str | None]:
    errors: list[str] = []
    warnings: list[str] = []

    missing = sorted(column for column in COUNT_REQUIRED_COLUMNS if not row.get(column, "").strip())
    if missing:
        errors.append(f"faltan columnas obligatorias: {', '.join(missing)}")

    node_id = row.get("node_id", "").strip()
    if node_id and node_id not in node_ids:
        errors.append(f"node_id desconocido: {node_id}")

    timestamp = row.get("timestamp", "").strip()
    if timestamp and parse_timestamp(timestamp) is None:
        errors.append(f"timestamp invalido: {timestamp}")

    time_window = row.get("time_window", "").strip()
    if time_window and infer_scenario_id(time_window) is None:
        errors.append(f"time_window fuera de las franjas soportadas: {time_window}")

    pedestrians = parse_float(row.get("pedestrians_5min"))
    if pedestrians is None:
        errors.append("pedestrians_5min debe ser numerico")
    elif not 0 <= pedestrians <= 500:
        warnings.append(f"pedestrians_5min fuera de rango esperado: {pedestrians}")

    dwell = parse_float(row.get("dwell_seconds_mean"))
    if dwell is not None and dwell < 0:
        warnings.append(f"dwell_seconds_mean negativo: {dwell}")

    noise = parse_float(row.get("noise_db"))
    if noise is not None and not 45 <= noise <= 100:
        warnings.append(f"noise_db fuera de rango esperado: {noise}")

    lighting = parse_float(row.get("lighting_lux"))
    if lighting is not None and not 0 <= lighting <= 2000:
        warnings.append(f"lighting_lux fuera de rango esperado: {lighting}")

    security = parse_float(row.get("security_score"))
    if security is not None and not 1 <= security <= 5:
        warnings.append(f"security_score fuera de rango esperado: {security}")

    resolved_edge_id = canonical_edge_id(
        row.get("source_node_id"),
        row.get("target_node_id"),
        row.get("edge_id"),
        edge_ids,
    )

    if (row.get("source_node_id") or row.get("target_node_id") or row.get("edge_id")) and resolved_edge_id is None:
        warnings.append("edge_id o source/target no mapean a una arista conocida")

    return errors, warnings, resolved_edge_id


def validate_geojson_feature(feature: dict[str, Any], node_ids: set[str]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    properties = feature.get("properties", {})
    geometry = feature.get("geometry", {})
    node_id = str(properties.get("node_id", "")).strip()

    if node_id and node_id not in node_ids:
        errors.append(f"node_id desconocido en GeoJSON: {node_id}")

    if geometry.get("type") != "Point":
        warnings.append("feature GeoJSON no es Point; se conservara como observacion")

    coordinates = geometry.get("coordinates") or []
    if len(coordinates) < 2:
        errors.append("feature GeoJSON sin coordenadas validas")

    return errors, warnings