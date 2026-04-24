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
fecha,franja,entity_type,entity_id,timestamp,variable,valor,observador,notas
2026-04-24,07-09,node,san_antonio_metro,07:15,headcount,145,ObsA,congestion alta
2026-04-24,07-09,edge,san_antonio_metro__junin_paseo,07:30,flow_forward,89,ObsA,salida hacia Junin
2026-04-24,12-14,node,junin_paseo,12:45,dwell_seconds,180,ObsB,compradores con pausa
2026-04-24,20-22,node,san_antonio_metro,20:30,noise_db,72,ObsA,medicion puntual
2026-04-24,20-22,node,parque_berrio,20:30,lighting_lux,46,ObsB,iluminacion media
```

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
