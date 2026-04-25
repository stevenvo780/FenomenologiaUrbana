# Protocolo mínimo de campo

## Objetivo

Capturar una base mínima de observación situada para recalibrar el modelo actual del corredor `San Antonio - Junin - Parque Berrio - Plaza Botero` y mover el proyecto desde `baseline_proxy` hacia una versión `field_calibrated`.

## Nodos prioritarios

Trabajar sobre los 9 nodos ya presentes en `outputs/case_model.json`:

- `san_antonio_metro`
- `parque_san_antonio`
- `palacio_nacional`
- `junin_paseo`
- `oriental_cruce`
- `parque_berrio`
- `carabobo_cultural`
- `plaza_botero`
- `museo_antioquia`

## Subtramos críticos

Priorizar estas aristas para observación de flujo y fricción:

- `san_antonio_metro -> junin_paseo`
- `junin_paseo -> parque_berrio`
- `parque_berrio -> plaza_botero`

## Franjas mínimas

- 07:00–09:00
- 12:00–14:00
- 17:00–19:00
- 20:00–22:00

## Variables mínimas obligatorias

### 1. Conteo peatonal fino

- unidad: personas por ventana de 15 minutos
- granularidad: nodo + franja
- propósito: recalibrar `crowding` y presión de trayectorias

### 2. Flujo direccional

- unidad: personas por sentido
- granularidad: subtramo + franja
- propósito: contrastar rutas simuladas vs. uso observado

### 3. Permanencia

- unidad: segundos por caso observado
- granularidad: nodo + franja
- propósito: recalibrar `base_dwell`

### 4. Ruido puntual

- unidad: dB
- granularidad: nodo + franja
- propósito: recalibrar `noise`

### 5. Iluminación nocturna

- unidad: lux
- granularidad: nodo + franja nocturna
- propósito: recalibrar `lighting`

## Variables recomendadas

- seguridad percibida (escala 1–5)
- obstáculos temporales
- presencia de vendedores
- vigilancia visible
- puntos de decisión y desvío

## Formato CSV mínimo

Nombre sugerido: `field_counts_YYYY_MM_DD.csv`

```csv
timestamp,node_id,node_label,source_node_id,target_node_id,edge_id,subsegment_label,direction,time_window,observer_id,pedestrians_5min,dwell_seconds_mean,noise_db,lighting_lux,security_score,obstacle_notes,weather_notes
2026-04-24T07:15:00-05:00,san_antonio_metro,San Antonio Metro,san_antonio_metro,junin_paseo,san_antonio_metro__junin_paseo,San Antonio Metro -> Junin Peatonal,northbound,07:00-08:00,obs_01,145,25,72,820,4,congestion puntual,despejado
2026-04-24T12:45:00-05:00,junin_paseo,Junin Peatonal,junin_paseo,parque_berrio,junin_paseo__parque_berrio,Junin Peatonal -> Parque Berrio,northbound,12:00-13:00,obs_02,210,180,68,1200,4,,soleado
2026-04-24T20:30:00-05:00,parque_berrio,Parque Berrio,parque_berrio,plaza_botero,parque_berrio__plaza_botero,Parque Berrio -> Plaza Botero,northbound,20:00-21:00,obs_02,88,65,74,46,2,venta informal bloqueando paso,llovizna
```

### Columnas mínimas que debe respetar el pipeline

- `node_id` debe coincidir con los IDs de `outputs/case_model.json`;
- `source_node_id`, `target_node_id` y `edge_id` deben usar el formato exacto del corredor (`source__target`);
- `pedestrians_5min` es el conteo de la ventana observada;
- `dwell_seconds_mean` es la permanencia media observada en segundos;
- `security_score` usa escala 1–5;
- `noise_db` y `lighting_lux` se capturan como numéricos;
- `obstacle_notes` puede dejarse vacío, pero si tiene contenido el pipeline lo cuenta como evidencia de obstáculo.

## Formato Markdown fenomenológico

Nombre sugerido: `field_notes_YYYY_MM_DD.md`

Cada franja debe dejar:

- densidad percibida;
- aparecer fenomenológico del nodo;
- heterotopía dominante;
- obstáculos y mediaciones visibles;
- lectura breve de restricción decisional.

## Formato GeoJSON mínimo

Nombre sugerido: `field_points_YYYY_MM_DD.geojson`

Debe contener, al menos:

- nodos observados;
- puntos de decisión;
- obstáculos temporales relevantes;
- subtramos con observación destacada.

Campos recomendados en `properties`:

- `feature_type` (`decision_point`, `obstacle`, `pause_zone`);
- `node_id`;
- `source_node_id` / `target_node_id` si la observación es de arista;
- `edge_id` si ya se conoce la arista exacta;
- `timestamp`, `time_window`, `observer_id`, `notes`.

## Muestra mínima razonable

### Por nodo y por franja

- 4 ventanas de conteo de 15 minutos
- 15 a 20 observaciones de permanencia
- 1 medición puntual de ruido por bloque
- 1 medición de iluminación en la franja nocturna

### Por franja

- 20 a 30 respuestas rápidas de seguridad percibida distribuidas en nodos críticos

## Equipo sugerido

- 2 observadores
- cronómetro o app de timing
- app de conteo manual
- sonómetro o app calibrada
- luxómetro o app de iluminación
- celular con cámara y ubicación

## Secuencia mínima de una jornada

### Antes de salir

- llevar plantilla CSV preparada;
- definir observador por nodo o por bloque;
- sincronizar reloj y convención de nombres.

### En campo

1. conteo por ventanas de 15 minutos;
2. registro de flujo direccional;
3. muestreo de permanencia;
4. notas fenomenológicas cortas por nodo;
5. ruido e iluminación cuando aplique;
6. foto y ubicación de obstáculos o puntos de decisión.

### Al cierre de cada franja

- verificar que no haya IDs inconsistentes;
- consolidar CSV del bloque;
- respaldar notas y geojson;
- marcar huecos de captura inmediatamente.

## Traducción al modelo actual

| Variable de campo | Campo objetivo en modelo |
| --- | --- |
| conteo peatonal | `crowding` |
| flujo direccional | cargas de arista / comparación de rutas |
| permanencia | `base_dwell` |
| ruido | `noise` |
| iluminación | `lighting` |
| seguridad percibida | validación o ajuste de `security` |
| obstáculos | `obstacle` |

### Pipeline implementado a partir de este protocolo

El repositorio ya debe asumir esta cadena cuando existan datos reales:

1. `scripts/ingest_fieldwork.py` valida y normaliza jornadas en `interim/`;
2. `scripts/aggregate_fieldwork.py` consolida observaciones en `processed/`;
3. `scripts/calibrate_case_model.py` ajusta `case_model.json` sin romper la baseline;
4. `scripts/run_all.py` vuelve a correr simulaciones y publica payload actualizado.

## Criterio mínimo de jornada válida

Una jornada puede considerarse útil si logra:

- 75% o más de los conteos previstos;
- al menos 15 observaciones de permanencia por franja;
- mediciones de ruido en los nodos principales;
- mediciones de iluminación en la franja nocturna;
- notas fenomenológicas en mínimo 2 nodos por franja;
- consistencia entre IDs del CSV y nodos del `case_model`.

## Siguiente paso tras la captura

1. guardar datos en `investigacion/data/interim/`;
2. generar una versión consolidada en `processed/`;
3. recalibrar nodos y aristas;
4. volver a correr `scripts/run_all.py` o un script específico de recalibración;
5. publicar nuevo `frontend_payload.json`.
