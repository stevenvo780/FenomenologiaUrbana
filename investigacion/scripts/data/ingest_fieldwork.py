from __future__ import annotations

import csv
from pathlib import Path

from _shared import INTERIM_DIR, PROCESSED_DIR, ensure_dirs, now_iso, read_json, write_json
from data.validate_fieldwork import (
    infer_scenario_id,
    load_case_entities,
    obstacle_flag,
    parse_float,
    validate_count_row,
    validate_geojson_feature,
)

EXCLUDED_INTERIM_DIRS = {"templates", "examples"}


def is_synthetic_session(path: Path) -> bool:
    if "synthetic" in path.name.lower():
        return True

    metadata_path = path / "metadata.json"
    if not metadata_path.exists():
        return False

    metadata = read_json(metadata_path)
    status = str(metadata.get("status", "")).lower()
    session_type = str(metadata.get("type", "")).lower()
    return "synthetic" in status or "synthetic" in session_type


def discover_sessions() -> list[Path]:
    if not INTERIM_DIR.exists():
        return []
    return sorted(
        path
        for path in INTERIM_DIR.iterdir()
        if path.is_dir()
        and path.name not in EXCLUDED_INTERIM_DIRS
        and not is_synthetic_session(path)
    )


def first_match(session_dir: Path, pattern: str) -> Path | None:
    matches = sorted(session_dir.glob(pattern))
    return matches[0] if matches else None


def load_metadata(session_dir: Path) -> dict[str, object]:
    metadata_path = session_dir / "metadata.json"
    if metadata_path.exists():
        return read_json(metadata_path)
    return {
        "date": session_dir.name.replace("_", "-"),
        "observers": [],
        "weather": None,
    }


def ingest_session(session_dir: Path, node_ids: set[str], edge_ids: set[str]) -> tuple[dict[str, object], list[dict[str, object]]]:
    metadata = load_metadata(session_dir)
    counts_path = first_match(session_dir, "field_counts_*.csv")
    notes_path = first_match(session_dir, "field_notes_*.md")
    points_path = first_match(session_dir, "field_points_*.geojson")

    session_errors: list[str] = []
    session_warnings: list[str] = []
    normalized_rows: list[dict[str, object]] = []
    valid_rows = 0
    invalid_rows = 0

    if counts_path is None:
        session_errors.append("no existe archivo field_counts_*.csv")
    else:
        with counts_path.open(encoding="utf-8", errors="replace") as handle:
            reader = csv.DictReader(handle)
            for index, row in enumerate(reader, start=2):
                errors, warnings, resolved_edge_id = validate_count_row(row, node_ids, edge_ids)
                if errors:
                    invalid_rows += 1
                    session_errors.append(f"{counts_path.name}:{index}: {' | '.join(errors)}")
                    continue

                valid_rows += 1
                session_warnings.extend(
                    f"{counts_path.name}:{index}: {warning}" for warning in warnings
                )

                time_window = str(row.get("time_window", "")).strip()
                normalized_rows.append(
                    {
                        "session_id": session_dir.name,
                        "date": metadata.get("date", session_dir.name.replace("_", "-")),
                        "timestamp": row.get("timestamp", "").strip(),
                        "scenario_id": infer_scenario_id(time_window),
                        "time_window": time_window,
                        "node_id": row.get("node_id", "").strip(),
                        "node_label": row.get("node_label", "").strip(),
                        "source_node_id": row.get("source_node_id", "").strip(),
                        "target_node_id": row.get("target_node_id", "").strip(),
                        "edge_id": resolved_edge_id or row.get("edge_id", "").strip(),
                        "subsegment_label": row.get("subsegment_label", "").strip(),
                        "direction": row.get("direction", "").strip(),
                        "observer_id": row.get("observer_id", "").strip(),
                        "pedestrians_5min": parse_float(row.get("pedestrians_5min")) or 0.0,
                        "dwell_seconds_mean": parse_float(row.get("dwell_seconds_mean")),
                        "noise_db": parse_float(row.get("noise_db")),
                        "lighting_lux": parse_float(row.get("lighting_lux")),
                        "security_score": parse_float(row.get("security_score")),
                        "obstacle_flag": obstacle_flag(row.get("obstacle_notes")),
                        "obstacle_notes": row.get("obstacle_notes", "").strip(),
                        "weather_notes": row.get("weather_notes", "").strip(),
                    }
                )

    feature_count = 0
    obstacle_features = 0
    decision_point_features = 0
    if points_path and points_path.exists():
        geojson = read_json(points_path)
        for index, feature in enumerate(geojson.get("features", []), start=1):
            errors, warnings = validate_geojson_feature(feature, node_ids)
            if errors:
                session_errors.extend(f"{points_path.name}:feature_{index}: {error}" for error in errors)
            session_warnings.extend(f"{points_path.name}:feature_{index}: {warning}" for warning in warnings)
            properties = feature.get("properties", {})
            feature_type = str(properties.get("feature_type", "")).strip().lower()
            feature_count += 1
            if feature_type == "obstacle":
                obstacle_features += 1
            if feature_type == "decision_point":
                decision_point_features += 1

    notes_excerpt: list[str] = []
    if notes_path and notes_path.exists():
        notes_excerpt = notes_path.read_text(encoding="utf-8", errors="replace").splitlines()[:12]

    report = {
        "session_id": session_dir.name,
        "date": metadata.get("date", session_dir.name.replace("_", "-")),
        "metadata": metadata,
        "counts_file": counts_path.name if counts_path else None,
        "notes_file": notes_path.name if notes_path else None,
        "points_file": points_path.name if points_path else None,
        "valid_rows": valid_rows,
        "invalid_rows": invalid_rows,
        "feature_count": feature_count,
        "decision_point_features": decision_point_features,
        "obstacle_features": obstacle_features,
        "errors": session_errors,
        "warnings": session_warnings,
        "notes_excerpt": notes_excerpt,
        "status": "ready" if valid_rows and not session_errors else "needs_review",
    }
    return report, normalized_rows


def main() -> Path:
    ensure_dirs()
    node_ids, edge_ids = load_case_entities()
    sessions = discover_sessions()

    session_reports: list[dict[str, object]] = []
    all_rows: list[dict[str, object]] = []

    for session_dir in sessions:
        report, rows = ingest_session(session_dir, node_ids, edge_ids)
        session_reports.append(report)
        all_rows.extend(rows)

    ingest_report = {
        "generated_at": now_iso(),
        "sessions_found": len(sessions),
        "rows_valid": sum(report["valid_rows"] for report in session_reports),
        "rows_invalid": sum(report["invalid_rows"] for report in session_reports),
        "features_total": sum(report["feature_count"] for report in session_reports),
        "status": "pending_no_capture" if not sessions else "capture_detected",
        "sessions": session_reports,
    }

    write_json(PROCESSED_DIR / "field_ingest_report.json", ingest_report)
    write_json(
        PROCESSED_DIR / "field_ingest_rows.json",
        {
            "generated_at": now_iso(),
            "row_count": len(all_rows),
            "rows": all_rows,
        },
    )
    return PROCESSED_DIR / "field_ingest_report.json"


if __name__ == "__main__":
    print(main())
