from __future__ import annotations

from pathlib import Path

import requests

from _shared import RAW_DIR, now_iso, slugify, write_json

SOURCES = [
    {
        "id": "movilidad_observatorio",
        "label": "Observatorio de Movilidad de Medellin",
        "url": "https://www.medellin.gov.co/es/secretaria-de-movilidad/observatorio-de-movilidad/",
        "kind": "html",
    },
    {
        "id": "metro_san_antonio_b",
        "label": "Metro de Medellin - San Antonio B",
        "url": "https://www.metrodemedellin.gov.co/en/challenge-mobility-in-san-antonio-b",
        "kind": "html",
    },
    {
        "id": "medata_criminalidad_page",
        "label": "MEData criminalidad",
        "url": "https://medata.gov.co/node/16667",
        "kind": "html",
    },
    {
        "id": "medata_criminalidad_csv",
        "label": "MEData criminalidad CSV",
        "url": "https://medata.gov.co/sites/default/files/distribution/1-027-23-000304/consolidado_cantidad_casos_criminalidad_en_comunas_por_anio_mes.csv",
        "kind": "csv",
    },
    {
        "id": "medata_barrio_page",
        "label": "MEData bateria de indicadores barriales",
        "url": "https://medata.gov.co/node/16899",
        "kind": "html",
    },
    {
        "id": "medata_barrio_csv",
        "label": "MEData bateria de indicadores barriales CSV",
        "url": "https://medata.gov.co/sites/default/files/distribution/1-002-26-000595/base_datos_bateria_indicadores_capacidad_soporte_barrio.csv",
        "kind": "csv",
    },
    {
        "id": "siata_air_dataset",
        "label": "AMVA mediciones estaciones calidad del aire",
        "url": "https://datosabiertos.metropol.gov.co/dataset/mediciones-estaciones-calidad-del-aire",
        "kind": "html",
    },
    {
        "id": "siata_noise_dataset",
        "label": "AMVA mediciones de ruido ambiental",
        "url": "https://datosabiertos.metropol.gov.co/dataset/mediciones-de-ruido-ambiental",
        "kind": "html",
    },
    {
        "id": "dane_cnpv",
        "label": "DANE Geoportal CNPV 2018",
        "url": "https://geoportal.dane.gov.co/geovisores/sociedad/cnpv-2018/",
        "kind": "html",
    },
    {
        "id": "medellin_como_vamos_centro_pdf",
        "label": "Medellin Como Vamos EPC 2024",
        "url": "https://www.medellincomovamos.org/wp-content/uploads/2025/08/20241223_Informe-metodologico-EPC-2024.pdf",
        "kind": "pdf",
    },
]

EXTENSIONS = {
    "text/html": ".html",
    "text/csv": ".csv",
    "application/pdf": ".pdf",
    "application/json": ".json",
}


def extension_for(content_type: str, fallback: str) -> str:
    base = (content_type or "").split(";")[0].strip().lower()
    if base in EXTENSIONS:
        return EXTENSIONS[base]
    if fallback == "csv":
        return ".csv"
    if fallback == "pdf":
        return ".pdf"
    if fallback == "json":
        return ".json"
    return ".html"


def download_source(source: dict[str, str]) -> dict[str, object]:
    headers = {"User-Agent": "Mozilla/5.0 Codex research pipeline"}
    timeout = (8, 20)

    try:
        try:
            response = requests.get(
                source["url"],
                headers=headers,
                timeout=timeout,
                allow_redirects=True,
            )
            ssl_retry = False
        except requests.exceptions.SSLError:
            response = requests.get(
                source["url"],
                headers=headers,
                timeout=timeout,
                allow_redirects=True,
                verify=False,
            )
            ssl_retry = True
        status = "downloaded" if response.ok else "failed"
        content_type = response.headers.get("content-type", "")
        ext = extension_for(content_type, source["kind"])
        file_path = RAW_DIR / f"{slugify(source['id'])}{ext}"

        if response.ok:
            file_path.write_bytes(response.content)
            note = "captured"
            local_path = str(file_path.relative_to(RAW_DIR.parent))
            byte_size = len(response.content)
        else:
            note = f"http_{response.status_code}"
            local_path = None
            byte_size = 0

        return {
            "id": source["id"],
            "label": source["label"],
            "url": source["url"],
            "kind": source["kind"],
            "status": status,
            "http_status": response.status_code,
            "content_type": content_type,
            "bytes": byte_size,
            "local_path": local_path,
            "resolved_url": response.url,
            "note": f"{note}_ssl_retry" if ssl_retry else note,
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "id": source["id"],
            "label": source["label"],
            "url": source["url"],
            "kind": source["kind"],
            "status": "failed",
            "http_status": None,
            "content_type": None,
            "bytes": 0,
            "local_path": None,
            "resolved_url": source["url"],
            "note": repr(exc),
        }


def main() -> Path:
    entries = [download_source(source) for source in SOURCES]
    payload = {
        "generated_at": now_iso(),
        "source_count": len(entries),
        "downloaded_count": sum(1 for entry in entries if entry["status"] == "downloaded"),
        "failed_count": sum(1 for entry in entries if entry["status"] == "failed"),
        "sources": entries,
    }
    output_path = RAW_DIR.parent.parent / "outputs" / "source_status.json"
    write_json(output_path, payload)
    return output_path


if __name__ == "__main__":
    print(main())
