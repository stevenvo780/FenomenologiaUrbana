"""
Refinamiento de geometría de nodos M-MASS (v2).

Motivación (oleada 4 caveat):
- `pasaje_la_bastilla` se pierde porque sus fotos caen en buckets adyacentes
  (san_antonio_metro / junin_paseo / parque_berrio) bajo la asignación v1
  por haversine a 9 centroides.
- Las notas de campo narran sub-zonas intra-nodo:
    * "Coltejer a Ayacucho" como gradiente intra-Junín (entrevista a Andrés
      registrada por Jacob, 2026-05-05).
    * "Calle del consumo" como sub-zona adyacente a Botero (Jacob,
      2026-05-05): "este parque queda al lado de la calle del consumo".

Este script NO modifica los archivos v1. Genera:
- `data/processed/node_geometry_v2.json`  (centroides + radios v2)
- `data/processed/photo_node_assignments_v2.json`
- `data/processed/video_node_assignments_v2.json`

Coordenadas v2 (referencia geográfica documentada):
- pasaje_la_bastilla:        6.2497, -75.5680  (Cra. 49 c/ Cl. 51-52, Centro)
- junin_coltejer_ayacucho:   6.2477, -75.5681  (eje peatonal Cl. 49 Ayacucho
                              ↔ Cl. 52 Edificio Coltejer, sobre Junín)
- botero_calle_consumo:      6.2520, -75.5722  (Cra. 55 Cundinamarca con
                              Cl. 54-55, "una calle al lado del Bronx")

Los 9 nodos canónicos del case_model.json se conservan; los 3 nuevos se
añaden como sub-zonas con radio máximo 80 m para evitar capturar fotos
lejanas (los nodos canónicos siguen siendo el bucket por defecto).

NO usa GPU ni red.
"""

from __future__ import annotations

import json
import math
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed"
CASE_MODEL = ROOT / "outputs" / "case_model.json"

# Radio máximo de captura para los nuevos nodos sub-zona (m).
SUBZONE_MAX_RADIUS_M = 80.0
# Radio máximo global (m) para considerar una foto "asignable" a v2.
GLOBAL_MAX_RADIUS_M = 400.0

NEW_NODES = [
    {
        "id": "pasaje_la_bastilla",
        "lat": 6.2497,
        "lon": -75.5680,
        "kind": "subzone",
        "parent_hint": "junin_paseo",
        "max_radius_m": SUBZONE_MAX_RADIUS_M,
        "source": "Cra. 49 (Junín) entre Cl. 51 y Cl. 52 — Pasaje comercial La Bastilla, Centro de Medellín. Geocodificación manual basada en cartografía pública de la Comuna 10.",
    },
    {
        "id": "junin_coltejer_ayacucho",
        "lat": 6.2477,
        "lon": -75.5681,
        "kind": "subzone",
        "parent_hint": "junin_paseo",
        "max_radius_m": SUBZONE_MAX_RADIUS_M,
        "source": "Centroide del tramo Junín entre Cl. 49 (Ayacucho) y Cl. 52 (Edificio Coltejer). Referencia: entrevista a 'Andrés' (Jacob, field_notes 2026-05-05).",
    },
    {
        "id": "botero_calle_consumo",
        "lat": 6.2520,
        "lon": -75.5722,
        "kind": "subzone",
        "parent_hint": "plaza_botero",
        "max_radius_m": SUBZONE_MAX_RADIUS_M,
        "source": "Cra. 55 (Cundinamarca) con Cl. 54-55, una cuadra al occidente de Plaza Botero. Referencia: 'la calle del consumo' (Jacob, field_notes 2026-05-05) — desplazamiento Bronx 'movieron una calle' (Stev).",
    },
]


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def load_v2_nodes() -> list[dict]:
    case = json.loads(CASE_MODEL.read_text(encoding="utf-8"))
    canonical = [
        {
            "id": n["id"],
            "lat": n["lat"],
            "lon": n["lon"],
            "kind": "canonical",
            "parent_hint": None,
            "max_radius_m": None,
            "source": "case_model.json (v1)",
        }
        for n in case["nodes"]
    ]
    return canonical + NEW_NODES


def assign_point(lat: float, lon: float, nodes: list[dict]) -> tuple[str, float, str]:
    """Asigna un punto al nodo v2 más cercano respetando radios de sub-zona.

    Estrategia: si el punto está dentro del radio de una sub-zona, gana esa
    sub-zona (incluso si un canónico está más cerca en distancia bruta —
    porque las sub-zonas son explícitamente más finas). Si no, se asigna al
    canónico más cercano. Devuelve (node_id, distance_m, kind).
    """
    best_sub = None
    for n in nodes:
        if n["kind"] != "subzone":
            continue
        d = haversine_m(lat, lon, n["lat"], n["lon"])
        if d <= (n["max_radius_m"] or SUBZONE_MAX_RADIUS_M):
            if best_sub is None or d < best_sub[1]:
                best_sub = (n["id"], d, "subzone")
    if best_sub is not None:
        return best_sub

    best_can = None
    for n in nodes:
        if n["kind"] != "canonical":
            continue
        d = haversine_m(lat, lon, n["lat"], n["lon"])
        if best_can is None or d < best_can[1]:
            best_can = (n["id"], d, "canonical")
    return best_can  # type: ignore[return-value]


def main() -> int:
    v2_nodes = load_v2_nodes()

    # --- Geometry export ---
    geometry_out = {
        "version": "v2",
        "rationale": "Refina la asignación de nodos para rescatar pasaje_la_bastilla y modelar dos sub-zonas narradas en campo (Coltejer-Ayacucho intra-Junín; calle del consumo adyacente a Botero).",
        "subzone_max_radius_m": SUBZONE_MAX_RADIUS_M,
        "global_max_radius_m": GLOBAL_MAX_RADIUS_M,
        "nodes": v2_nodes,
    }
    (PROC / "node_geometry_v2.json").write_text(
        json.dumps(geometry_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # --- Photos: reasignar desde v1 (que ya tiene gps por foto) ---
    v1 = json.loads((PROC / "photo_node_assignments.json").read_text(encoding="utf-8"))
    v2_photo_assignments = []
    reassigned = 0
    out_of_range = 0
    for a in v1["assignments"]:
        lat, lon = a["gps"]
        nid, dist, kind = assign_point(lat, lon, v2_nodes)
        in_range = dist <= GLOBAL_MAX_RADIUS_M
        if not in_range:
            out_of_range += 1
        if nid != a["nearest_node"]:
            reassigned += 1
        v2_photo_assignments.append({
            "photo": a["photo"],
            "captured_at": a.get("captured_at"),
            "gps": [lat, lon],
            "v1_node": a["nearest_node"],
            "v1_distance_m": a.get("distance_m"),
            "v2_node": nid,
            "v2_distance_m": round(dist, 1),
            "v2_kind": kind,
            "in_global_range": in_range,
            "inferred_window": a.get("inferred_window"),
            "persons": a.get("persons"),
            "saturation_index": a.get("saturation_index"),
            "edge_density": a.get("edge_density"),
            "brightness": a.get("brightness"),
        })

    by_v2 = Counter(x["v2_node"] for x in v2_photo_assignments)
    by_v1 = Counter(x["v1_node"] for x in v2_photo_assignments)

    # Distancia mínima de cualquier foto al pasaje_la_bastilla
    bastilla = next(n for n in v2_nodes if n["id"] == "pasaje_la_bastilla")
    bastilla_dists = sorted(
        haversine_m(a["gps"][0], a["gps"][1], bastilla["lat"], bastilla["lon"])
        for a in v1["assignments"]
    )
    min_bastilla = bastilla_dists[0] if bastilla_dists else None

    photo_out = {
        "version": "v2",
        "method": "Re-asignación con 9 nodos canónicos + 3 sub-zonas (radio 80 m). Sub-zona gana si la foto cae dentro de su radio; si no, canónico más cercano.",
        "n_photos": len(v2_photo_assignments),
        "n_reassigned_vs_v1": reassigned,
        "n_out_of_global_range": out_of_range,
        "by_v2_node": dict(by_v2),
        "by_v1_node": dict(by_v1),
        "bastilla_min_distance_m": round(min_bastilla, 1) if min_bastilla else None,
        "bastilla_dist_quintiles_m": [round(bastilla_dists[i * len(bastilla_dists) // 5], 1)
                                       for i in range(5)] if bastilla_dists else [],
        "assignments": v2_photo_assignments,
    }
    (PROC / "photo_node_assignments_v2.json").write_text(
        json.dumps(photo_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # --- Videos: heredan el nodo v2 de la reference_photo ---
    vpath = PROC / "video_node_assignments.json"
    if vpath.exists():
        v1v = json.loads(vpath.read_text(encoding="utf-8"))
        photo_to_v2 = {x["photo"]: x for x in v2_photo_assignments}
        v2_video_assignments = []
        v_reassigned = 0
        for vid in v1v["assignments"]:
            ref = vid.get("reference_photo")
            mapped = photo_to_v2.get(ref) if ref else None
            v2_node = mapped["v2_node"] if mapped else vid.get("node")
            v2_kind = mapped["v2_kind"] if mapped else "canonical"
            if v2_node != vid.get("node"):
                v_reassigned += 1
            entry = dict(vid)
            entry["v1_node"] = vid.get("node")
            entry["v2_node"] = v2_node
            entry["v2_kind"] = v2_kind
            entry["v2_via_reference_photo"] = ref
            v2_video_assignments.append(entry)

        video_out = {
            "version": "v2",
            "method": "Hereda v2_node de la reference_photo usada en v1 (correlación temporal).",
            "n_videos": len(v2_video_assignments),
            "n_reassigned_vs_v1": v_reassigned,
            "by_v2_node": dict(Counter(x["v2_node"] for x in v2_video_assignments)),
            "assignments": v2_video_assignments,
        }
        (PROC / "video_node_assignments_v2.json").write_text(
            json.dumps(video_out, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    # --- Reporte stdout ---
    print("=== refine_node_geometry v2 ===")
    print(f"nodos v2 totales: {len(v2_nodes)} (canónicos 9 + sub-zonas 3)")
    print(f"fotos: {len(v2_photo_assignments)} | reasignadas vs v1: {reassigned}")
    print(f"distribución v1: {dict(by_v1)}")
    print(f"distribución v2: {dict(by_v2)}")
    print(f"distancia mínima de cualquier foto a pasaje_la_bastilla: "
          f"{round(min_bastilla,1) if min_bastilla else 'NA'} m")
    if vpath.exists():
        print(f"videos reasignados: {v_reassigned}/{len(v2_video_assignments)}")
    bastilla_pop = by_v2.get("pasaje_la_bastilla", 0)
    if bastilla_pop == 0:
        print("[evidencia] pasaje_la_bastilla queda VACÍO en v2 (>80 m de toda foto).")
    else:
        print(f"[evidencia] pasaje_la_bastilla queda POBLADO en v2 con {bastilla_pop} fotos.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
