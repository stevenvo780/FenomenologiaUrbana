# Desarrollo investigativo

Esta carpeta ejecuta el plan analítico del proyecto y publica artefactos consumibles por la app React en `../visual`.

## Estructura

```text
investigacion/
├── data/
│   ├── raw/
│   ├── interim/
│   └── processed/
├── docs/
├── notebooks/
├── outputs/
├── scripts/
│   ├── _shared.py
│   ├── download_sources.py
│   ├── build_case_graph.py
│   ├── run_simulation.py
│   ├── publish_visual_payload.py
│   └── run_all.py
└── README.md
```

## Qué hace el pipeline

1. Intenta descargar fuentes publicas y deja trazabilidad de exito o fallo.
2. Construye un modelo base del corredor `San Antonio - Junin - Parque Berrio - Plaza Botero`.
3. Ejecuta simulaciones de agentes para cuatro escenarios horarios.
4. Calcula metricas de centralidad, friccion, concentracion y restriccion decisional.
5. Deriva una capa empirica real desde criminalidad, bateria barrial y percepcion ciudadana.
6. Integra pasajeros SITVA, SIATA/AMVA PM2.5/PM10/ruido y fallback DANE municipal/microdatos.
7. Exporta un `frontend_payload.json` a `../visual/public/data/`.

## Estado epistemico

Esta primera version mezcla dos capas:

- `documented`: fuentes y hechos apoyados en paginas o datasets publicos identificados.
- `proxy`: variables y pesos de subtramo construidos para poder correr el sistema de punta a punta sin esperar trabajo de campo completo.

Todo proxy queda marcado en los JSON de salida y en la UI.

## Comando principal

```bash
python3 scripts/run_all.py
```

## Salidas clave

- `outputs/source_status.json`
- `outputs/case_model.json`
- `outputs/empirical_summary.json`
- `outputs/simulation_results.json`
- `outputs/frontend_payload.json`
- `outputs/field_calibration_delta.json`

## Siguiente iteracion recomendada

La versión actual queda como `0.2.0-baseline`. Para pasar a `0.2.0-field`, cargar observaciones reales en `data/interim/` y reemplazar progresivamente los pesos `proxy` por:

- conteos peatonales reales;
- mediciones puntuales de ruido e iluminacion;
- trazados de rutas observadas;
- series o capas georreferenciadas descargadas y limpiadas.
