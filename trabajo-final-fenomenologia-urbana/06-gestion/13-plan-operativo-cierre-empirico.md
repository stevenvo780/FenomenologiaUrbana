# Plan operativo de cierre empírico

**Fecha de corte:** 2026-04-24  
**Origen:** consolidación de 4 agentes `Explore` en paralelo  
**Estado del proyecto:** `0.2.0-baseline` / `final_repo_ready_with_external_fieldwork_dependency`

## 1. Propósito

Este documento consolida la segunda ola de exploración paralela enfocada ya no en plan general ni backlog visual, sino en el **cierre empírico real** del proyecto. La pregunta ya no es si el proyecto existe o funciona: eso ya está resuelto. La pregunta es **qué falta exactamente para convertirlo en una versión final defendible**.

## 2. Hallazgos consolidados por frente

### 2.1. Fuentes y geodatos

#### Huecos verificados

- `DANE CNPV` geovisor fino sigue bloqueado por `403`, pero ya existe fallback con ficha municipal y catálogo de microdatos;
- `MEData uso del suelo` y `MEData inventario de equipamientos` siguen bloqueando automatización por `403`;
- `SIATA / AMVA` aire ya entra como JSON PM2.5/PM10 y ruido entra como JSON macro no geolocalizado;
- `OSM / Overpass` todavía no participa de la topología realmente ejecutada;
- el `Observatorio de Movilidad` se descarga como HTML; pasajeros SITVA ya entra por CSV MEData.

#### Archivos del repo a tocar

- `investigacion/scripts/download_sources.py`
- `investigacion/scripts/derive_empirical_data.py`
- `investigacion/scripts/build_case_graph.py`
- `investigacion/data/interim/` (capas derivadas)

#### Decisión operativa

Antes del siguiente salto grande de modelado conviene ejecutar un **Sprint 0 de datos**:

1. resolver manualmente o documentar definitivamente los tres `403`;
2. decidir si OSM entra ya como validación topológica mínima o como refactor posterior;
3. mantener SIATA/AMVA y SITVA como fuentes públicas macro, no como sustituto de campo.

### 2.2. Ingestión de trabajo de campo

#### Estado real del repo

- `investigacion/data/interim/` solo contiene `templates/`;
- `investigacion/data/processed/` contiene reportes reproducibles en estado `pending_no_capture`;
- ya existe cadena de ingesta, validación, agregación y recalibración desde captura cruda hacia datos consolidados;
- `publish_visual_payload.py` expone resumen de campo, cambios de calibración y dependencia externa.

#### Scripts ya creados

- `investigacion/scripts/ingest_fieldwork.py`
- `investigacion/scripts/validate_fieldwork.py`
- `investigacion/scripts/aggregate_fieldwork.py`
- `investigacion/scripts/calibrate_case_model.py`

#### Archivos existentes a modificar

- `investigacion/scripts/run_all.py`
- `investigacion/scripts/_shared.py`
- `investigacion/scripts/publish_visual_payload.py`

#### Estructura mínima esperada

##### `interim/`

- una carpeta por jornada: `YYYY_MM_DD/`
- `field_counts_YYYY_MM_DD.csv`
- `field_notes_YYYY_MM_DD.md`
- `field_points_YYYY_MM_DD.geojson`
- `metadata.json`

##### `processed/`

- `field_observations_aggregate.csv`
- `field_edges_computed.csv`
- `field_scenarios_calibration.json`
- `field_validation_report.json`

#### Mapeos más críticos

- `dwell_count` → `nodes.base_dwell`
- `pedestrians_5min` + flujo direccional → `edges.crowding`
- `security_score` → `nodes.security` y eventual ajuste de `agents.weights.risk`
- `noise_db` / `lighting_lux` → `scenarios.modifiers`
- obstáculos / puntos de decisión → `edges.obstacle` + validación interpretativa

### 2.3. Recalibración del modelo

#### Lo que hoy sigue siendo proxy

- los 9 nodos siguen marcados como `proxy: true`;
- todas las aristas del corredor tienen pesos hardcodeados;
- los modificadores de escenario siguen siendo teóricos hasta que entren CSV de campo;
- los perfiles de agente siguen sin calibración empírica.

#### Cambio epistemológico recomendado

En vez de usar solo `documented / proxy / pending`, conviene evolucionar el pipeline y el payload hacia estados más explícitos:

- `baseline_proxy`
- `field_observed`
- `field_calibrated`
- `field_validated`
- `public_data`
- `pending`

#### Estrategia recomendada

No romper la demo actual. Mantener un esquema de **doble payload**:

- `v0.1.0` = baseline proxy inicial
- `v0.2.0-baseline` = baseline final de repo con fuentes públicas ampliadas y límites explícitos
- `v0.2.0-field` = primera capa con observación de campo o calibración parcial

Esto permite:

1. conservar la app actual como versión estable;
2. comparar baseline vs. recalibrado;
3. usar el cambio mismo como hallazgo analítico.

### 2.4. Cierre integral de la investigación

#### Ya listo

- arquitectura teórica y filosófica;
- caso de estudio;
- pipeline base funcional;
- simulación base;
- frontend demostrable;
- protocolo de campo;
- trazabilidad explícita;
- guion de exposición y conclusiones base.

#### Aún incompleto

- captura de campo real;
- integración completa de fuentes críticas;
- recalibración del modelo;
- comparación entre escenarios recalibrados;
- integración visible de datos/notas de campo en la UI;
- cierre analítico final sobre resultados recalibrados.

## 3. Ruta crítica consolidada

### Sprint 0 — resolución de datos

**Duración estimada:** 1 semana

#### Objetivo

Cerrar el frente de fuentes que no depende del trabajo de campo.

#### Entregables

- fallback o explicitación final de DANE;
- SIATA/AMVA estructurado;
- uso del suelo integrado;
- equipamientos integrados;
- verificación básica de cobertura topológica con OSM si da tiempo.

#### Archivos centrales

- `investigacion/scripts/download_sources.py`
- `investigacion/scripts/derive_empirical_data.py`
- `investigacion/scripts/build_case_graph.py`

### Sprint 1 — captura y consolidación de campo

**Duración estimada:** 1 semana (jornada + procesamiento)

#### Objetivo

Capturar al menos una base mínima defendible para empezar recalibración.

#### Entregables

- CSV reales en `interim/`;
- notas fenomenológicas por franja;
- GeoJSON de puntos/obstáculos;
- primer `processed/` con agregados y validación.

#### Archivos centrales

- `investigacion/data/interim/...`
- `investigacion/data/processed/...`
- scripts nuevos de ingesta/validación/agregación

### Sprint 2 — recalibración y payload v0.2

**Duración estimada:** 1.5 a 2 semanas

#### Objetivo

Sustituir parte del baseline proxy por evidencia empírica y publicar una nueva versión del payload.

#### Entregables

- `case_model` recalibrado parcial;
- simulaciones rehechas;
- `frontend_payload` versión `v0.2.0` o equivalente;
- comparación baseline vs. recalibrado;
- badges epistemológicos más finos.

#### Archivos centrales

- `investigacion/scripts/build_case_graph.py`
- `investigacion/scripts/run_simulation.py`
- `investigacion/scripts/publish_visual_payload.py`
- frontend `visual/`

### Sprint 3 — cierre analítico y demo final

**Duración estimada:** 1 semana

#### Objetivo

Cerrar el proyecto como investigación, no solo como laboratorio visual.

#### Entregables

- conclusiones recalibradas;
- guion final con capturas reales;
- demo de 12–15 minutos;
- documento de límites y alcance;
- revisión final de trazabilidad.

## 4. Dependencias reales

### Bloqueos duros

- sin datos de campo no hay recalibración empírica seria;
- sin acceso automatizado o cierre metodológico de DANE geovisor fino, MEData uso del suelo y equipamientos queda una debilidad de fuente abierta;
- aire/ruido ya están estructurados como red pública macro, pero siguen sin medición situada por subtramo.

### Dependencias blandas

- OSM puede entrar como mejora crítica, pero no necesariamente bloquea la primera recalibración si el caso mantiene el mismo corredor mínimo;
- la UI ya es suficiente para demo, así que no necesita otra gran ola antes de campo y datos.

## 5. Orden recomendado del agente principal

Con base en esta ola paralela, el siguiente movimiento más rentable del agente principal debería ser:

1. cargar campo físico real en `interim/`;
2. correr `python3 scripts/run_all.py`;
3. revisar `field_calibration_delta.json`;
4. rematar la app con comparación baseline vs. campo cuando exista `field_calibrated`.

## 6. Recomendación final

La decisión correcta no es abrir más planeación. Es empezar a mover el proyecto en dos carriles coordinados:

### Carril A — datos estructurales

- DANE geovisor fino, si se consigue acceso no bloqueado;
- uso del suelo y equipamientos, si se descarga manualmente o por otra API;
- validación topológica mínima.

### Carril B — campo e ingestión

- captura real;
- validación de calidad;
- agregación;
- recalibración.

Eso es lo que permite pasar de:

> `0.2.0-baseline`

hacia:

> `0.2.0-field` / `field_calibrated_defendible`

## 7. Próximo corte sugerido

En el siguiente corte ya no deberíamos volver a preguntar “qué falta”, sino verificar si ya quedaron resueltos estos tres hitos:

- sesiones de campo cargadas;
- `field_calibration_delta.json` con cambios reales;
- UI mostrando comparación entre baseline y datos observados.
