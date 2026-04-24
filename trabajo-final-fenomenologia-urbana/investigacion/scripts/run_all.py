from __future__ import annotations

from pathlib import Path

from _shared import ensure_dirs
from build_case_graph import main as build_case_graph
from download_sources import main as download_sources
from publish_visual_payload import main as publish_payload
from run_simulation import main as run_simulation


def main() -> Path:
    ensure_dirs()
    print("1/4 descargando fuentes...")
    download_sources()
    print("2/4 construyendo caso...")
    build_case_graph()
    print("3/4 ejecutando simulaciones...")
    run_simulation()
    print("4/4 publicando payload para visual...")
    final_output = publish_payload()
    print(f"payload listo en: {final_output}")
    return final_output


if __name__ == "__main__":
    main()
