from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import urlparse

import requests
from urllib3.exceptions import InsecureRequestWarning

from _shared import RAW_DIR, now_iso, slugify, write_json

requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)

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
        "id": "medata_land_use_page",
        "label": "MEData uso general del suelo urbano",
        "url": "https://medata.gov.co/node/16360",
        "kind": "medata_page",
    },
    {
        "id": "medata_equipamientos_page",
        "label": "MEData inventario de equipamientos",
        "url": "https://medata.gov.co/node/41535",
        "kind": "medata_page",
    },
    {
        "id": "medata_pasajeros_mov_page",
        "label": "MEData pasajeros movilizados",
        "url": "https://medata.gov.co/node/16624",
        "kind": "html",
    },
    {
        "id": "medata_pasajeros_mov_csv",
        "label": "MEData pasajeros movilizados CSV",
        "url": "https://medata.gov.co/sites/default/files/distribution/1-023-25-000292/Pasajeros_movilizados.csv",
        "kind": "csv",
    },
    {
        "id": "siata_air_metadata",
        "label": "AMVA/SIATA mediciones estaciones calidad del aire",
        "url": "https://datosabiertos.metropol.gov.co/node/99",
        "kind": "html",
    },
    {
        "id": "siata_air_pm25_json",
        "label": "AMVA/SIATA PM2.5 JSON",
        "url": "https://datosabiertos.metropol.gov.co/sites/default/files/uploaded_resources/Datos_SIATA_Aire_pm25.json",
        "kind": "json",
    },
    {
        "id": "siata_air_pm10_json",
        "label": "AMVA/SIATA PM10 JSON",
        "url": "https://datosabiertos.metropol.gov.co/sites/default/files/uploaded_resources/Datos_SIATA_Aire_pm10.json",
        "kind": "json",
    },
    {
        "id": "siata_noise_metadata",
        "label": "AMVA/SIATA mediciones de ruido",
        "url": "https://datosabiertos.metropol.gov.co/node/102",
        "kind": "html",
    },
    {
        "id": "siata_noise_json",
        "label": "AMVA/SIATA ruido JSON",
        "url": "https://datosabiertos.metropol.gov.co/sites/default/files/uploaded_resources/Datos_SIATA_Ruido_ruido.json",
        "kind": "json",
    },
    {
        "id": "dane_cnpv",
        "label": "DANE Geoportal CNPV 2018",
        "url": "https://geoportal.dane.gov.co/geovisores/sociedad/cnpv-2018/",
        "kind": "html",
    },
    {
        "id": "dane_cnpv_microdatos_catalog",
        "label": "DANE microdatos CNPV 2018 catalogo",
        "url": "https://microdatos.dane.gov.co/index.php/catalog/643",
        "kind": "html",
    },
    {
        "id": "dane_medellin_ficha_cnpv_pdf",
        "label": "DANE ficha municipal CNPV 2018 Medellin",
        "url": "https://sitios.dane.gov.co/cnpv/app/views/informacion/fichas/05001.pdf",
        "kind": "pdf",
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
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-excel": ".xls",
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
    if fallback == "xlsx":
        return ".xlsx"
    return ".html"


def request_url(url: str, headers: dict[str, str], timeout: tuple[int, int]) -> tuple[requests.Response, bool]:
    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=timeout,
            allow_redirects=True,
        )
        return response, False
    except requests.exceptions.SSLError:
        response = requests.get(
            url,
            headers=headers,
            timeout=timeout,
            allow_redirects=True,
            verify=False,
        )
        return response, True


def save_response_entry(
    *,
    source_id: str,
    label: str,
    url: str,
    kind: str,
    response: requests.Response,
    ssl_retry: bool,
    parent_id: str | None = None,
    note: str = "captured",
) -> dict[str, object]:
    content_type = response.headers.get("content-type", "")
    ext = extension_for(content_type, kind)
    file_path = RAW_DIR / f"{slugify(source_id)}{ext}"

    if response.ok:
        file_path.write_bytes(response.content)
        local_path = str(file_path.relative_to(RAW_DIR.parent))
        byte_size = len(response.content)
    else:
        local_path = None
        byte_size = 0
        note = f"http_{response.status_code}"

    payload = {
        "id": source_id,
        "label": label,
        "url": url,
        "kind": kind,
        "status": "downloaded" if response.ok else "failed",
        "http_status": response.status_code,
        "content_type": content_type,
        "bytes": byte_size,
        "local_path": local_path,
        "resolved_url": response.url,
        "note": f"{note}_ssl_retry" if ssl_retry else note,
    }
    if parent_id:
        payload["parent_id"] = parent_id
    return payload


def medata_download_links(html_text: str) -> list[str]:
    links = re.findall(r'href="(http://medata\.gov\.co/sites/default/files/distribution/[^"]+)"', html_text, re.I)
    return list(dict.fromkeys(links))


def ckan_resource_links(payload: dict[str, object]) -> list[dict[str, str]]:
    result = payload.get("result", {}) if isinstance(payload, dict) else {}
    resources = result.get("resources") if isinstance(result, dict) else None
    if resources is None and isinstance(result, dict) and result.get("results"):
        first = result["results"][0] if result["results"] else {}
        resources = first.get("resources", [])

    extracted: list[dict[str, str]] = []
    for resource in resources or []:
        if not isinstance(resource, dict):
            continue
        resource_url = str(resource.get("url") or "").strip()
        if not resource_url:
            continue
        resource_format = str(resource.get("format") or "").strip().lower()
        if resource_format not in {"csv", "json", "geojson", "xlsx", "xls"} and not resource_url.lower().endswith((".csv", ".json", ".geojson", ".xlsx", ".xls")):
            continue
        extracted.append(
            {
                "url": resource_url,
                "name": str(resource.get("name") or Path(urlparse(resource_url).path).name or "resource").strip(),
                "format": resource_format or Path(resource_url).suffix.lstrip("."),
            }
        )
    return extracted


def download_derived_resource(
    *,
    parent_id: str,
    parent_label: str,
    resource_url: str,
    resource_name: str,
    resource_kind: str,
    headers: dict[str, str],
    timeout: tuple[int, int],
) -> dict[str, object]:
    response, ssl_retry = request_url(resource_url, headers=headers, timeout=timeout)
    resource_id = f"{parent_id}_{slugify(resource_name)}"
    return save_response_entry(
        source_id=resource_id,
        label=f"{parent_label} · {resource_name}",
        url=resource_url,
        kind=resource_kind,
        response=response,
        ssl_retry=ssl_retry,
        parent_id=parent_id,
    )


def download_source_entries(source: dict[str, str]) -> list[dict[str, object]]:
    headers = {"User-Agent": "Mozilla/5.0 Codex research pipeline"}
    timeout = (8, 20)
    if source["id"] in {"medata_land_use_page", "medata_equipamientos_page", "dane_cnpv"}:
        timeout = (6, 10)

    try:
        response, ssl_retry = request_url(source["url"], headers=headers, timeout=timeout)
        entries = [
            save_response_entry(
                source_id=source["id"],
                label=source["label"],
                url=source["url"],
                kind=source["kind"],
                response=response,
                ssl_retry=ssl_retry,
            )
        ]

        if not response.ok:
            return entries

        if source["kind"] == "medata_page":
            for link in medata_download_links(response.text):
                resource_name = Path(urlparse(link).path).name
                resource_kind = Path(resource_name).suffix.lstrip(".") or "csv"
                entries.append(
                    download_derived_resource(
                        parent_id=source["id"],
                        parent_label=source["label"],
                        resource_url=link,
                        resource_name=resource_name,
                        resource_kind=resource_kind,
                        headers=headers,
                        timeout=timeout,
                    )
                )

        if source["kind"] == "ckan_package":
            package_payload = response.json()
            for resource in ckan_resource_links(package_payload):
                entries.append(
                    download_derived_resource(
                        parent_id=source["id"],
                        parent_label=source["label"],
                        resource_url=resource["url"],
                        resource_name=resource["name"],
                        resource_kind=resource["format"] or "csv",
                        headers=headers,
                        timeout=timeout,
                    )
                )

        return entries
    except Exception as exc:  # noqa: BLE001
        return [
            {
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
        ]


def main() -> Path:
    entries: list[dict[str, object]] = []
    for source in SOURCES:
        entries.extend(download_source_entries(source))
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
