# Trazabilidad tesis: afirmación, fuente y estado

Fecha de consolidación: 25 de abril de 2026.

## 1. Regla de lectura

Toda afirmación importante debe poder ubicarse en una de estas categorías:

- **Fuente pública:** dato institucional o público descargado.
- **Salida computacional:** resultado de script del repositorio.
- **Marco teórico:** fuente filosófica, urbana o computacional.
- **Pendiente de campo:** requiere observación situada.
- **Interpretación:** lectura crítica que no debe presentarse como medición.

## 2. Trazabilidad de afirmaciones centrales

| Afirmación | Tipo | Archivo/fuente | Estado | Límite |
| --- | --- | --- | --- | --- |
| La tesis está en `baseline_proxy` | salida computacional | `outputs/field_calibration_delta.json`, `outputs/case_model.json` | defendible | no equivale a validación empírica |
| El campo está `pending_no_capture` | salida computacional | `outputs/field_calibration_delta.json` | defendible | no debe modificarse con sintéticos |
| El centro tiene percepción ambivalente | fuente pública | `outputs/empirical_summary.json`, MCV/Invamer 2024 | defendible | escala ciudad/centro, no nodo fino |
| La inseguridad aparece como asociación dominante | fuente pública | `outputs/empirical_summary.json` | defendible | no prueba miedo individual |
| El caso usa 9 nodos y 13 aristas | salida computacional | `outputs/case_model.json` | defendible | discretización mínima |
| La simulación ambiental usa malla 4096x4096 | salida computacional | `outputs/hpc_environmental_report.json` | defendible | valores pico no calibrados |
| La incertidumbre relativa es baja bajo supuestos | salida computacional | `outputs/hpc_uncertainty_quantification.json` | defendible | estabilidad numérica, no verdad empírica |
| El stress test llega a 500k agentes | salida computacional | `outputs/hpc_urban_stress_test.json` | defendible como escenario | no capacidad real del corredor |
| Hay desigualdad relativa de rutas entre perfiles | salida computacional | `outputs/urban_inequality_analysis.json` | parcial | falta sensibilidad y campo |
| Movilidad reducida aparece “más libre” en simulación | salida computacional | `outputs/urban_inequality_analysis.json` | alerta metodológica | posible efecto de especificación |
| La experiencia real requiere conteos y percepción situada | pendiente de campo | `docs/protocolo-campo-minimo.md`, `tesis/pendientes/tareas-campo.md` | defendible | no hay datos reales aún |
| La validación debe ser situada | marco teórico | Haraway (1995), protocolo ético | defendible | no reemplaza medición |
| La ciudad no se reduce a flujo | marco teórico | Husserl, Merleau-Ponty, Lefebvre, Harvey | defendible | requiere traducción operacional clara |

## 3. Fuentes públicas y estado

| Fuente | Archivo derivado | Estado |
| --- | --- | --- |
| Medellín Cómo Vamos/Invamer 2024 | `outputs/empirical_summary.json`; `data/raw/medellin_como_vamos_centro_pdf.pdf` | disponible |
| DANE CNPV Medellín | `data/raw/dane_medellin_ficha_cnpv_pdf.pdf` | disponible como ficha; geovisor con bloqueo 403 |
| MEData | `outputs/source_status.json` | parcial, con timeouts |
| SIATA/AMVA | outputs ambientales | parcial, requiere calibración puntual |
| OpenStreetMap/Overpass | geometría del caso | disponible como aproximación |
| Metro de Medellín | referencia San Antonio B | disponible como fuente contextual |

## 4. Scripts y salidas

| Script | Salida | Uso |
| --- | --- | --- |
| `data/download_sources.py` | `outputs/source_status.json` | trazabilidad de fuentes |
| `models/build_case_graph.py` | `outputs/case_model.json` | nodos, aristas, escenarios |
| `data/derive_empirical_data.py` | `outputs/empirical_summary.json` | indicadores públicos derivados |
| `data/ingest_fieldwork.py` | `data/processed/field_ingest_report.json` | valida sesiones reales de campo |
| `data/aggregate_fieldwork.py` | `data/processed/field_validation_report.json` | cobertura y estado de campo |
| `models/calibrate_case_model.py` | `outputs/field_calibration_delta.json` | recalibración si hay campo real |
| `simulations/run_monte_carlo_uq.py` | `outputs/hpc_uncertainty_quantification.json` | incertidumbre |
| `simulations/run_urban_stress_test.py` | `outputs/hpc_urban_stress_test.json` | estrés urbano interno |
| `analysis/analyze_urban_inequality.py` | `outputs/urban_inequality_analysis.json` | desigualdad de rutas |
| `visualization/publish_visual_payload.py` | `outputs/frontend_payload.json` | publicación visual |

## 5. Afirmaciones prohibidas hasta tener campo

- “El corredor está empíricamente calibrado”.
- “El modelo midió la experiencia real”.
- “El ruido real supera X umbral sanitario en todos los nodos”.
- “500k agentes es capacidad real del corredor”.
- “Los perfiles simulados representan sujetos reales completos”.

## 6. Fórmula recomendada

> Bajo las fuentes públicas disponibles y los supuestos del modelo, el pipeline permite construir un baseline proxy para formular hipótesis sobre fricción, presión y habitabilidad. La validación empírica queda pendiente hasta incorporar datos de campo reales.
