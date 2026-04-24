from __future__ import annotations

from pathlib import Path

from _shared import ensure_dirs
from aggregate_fieldwork import main as aggregate_fieldwork
from build_case_graph import main as build_case_graph
from calibrate_case_model import main as calibrate_case_model
from derive_empirical_data import main as derive_empirical_data
from download_sources import main as download_sources
from ingest_fieldwork import main as ingest_fieldwork
from publish_visual_payload import main as publish_payload
from run_simulation import main as run_simulation


def main() -> Path:
    ensure_dirs()
    print("1/8 descargando fuentes...")
    download_sources()
    print("2/8 construyendo caso base...")
    build_case_graph()
    print("3/8 derivando capa empirica...")
    derive_empirical_data()
    print("4/8 ingiriendo trabajo de campo...")
    ingest_fieldwork()
    print("5/8 agregando observaciones de campo...")
    aggregate_fieldwork()
    print("6/8 recalibrando caso si hay datos observados...")
    calibrate_case_model()
    print("7/8 ejecutando simulaciones...")
    run_simulation()
    print("8/8 publicando payload para visual...")
    final_output = publish_payload()
    print(f"payload listo en: {final_output}")
    return final_output


if __name__ == "__main__":
    main()
