# Arquitectura de la web en React

## Objetivo de producto

Construir una web interactiva profesional para explorar el caso de estudio, comparar escenarios, leer la interpretación filosófica y visualizar cómo el espacio urbano aparece bajo condiciones estructurales específicas.

## Stack recomendado

- `React 19`
- `TypeScript`
- `Vite`
- `MapLibre GL JS`
- `deck.gl`
- `Zustand`
- `TanStack Query`
- `DuckDB-WASM`
- `graphology + sigma.js`
- `d3`
- `Comlink + Web Workers`
- `Tailwind CSS` o CSS Modules con variables propias

## Principio de diseño

La interfaz no debe parecer una presentación académica plana. Debe operar como laboratorio visual:

- mapa al centro;
- capas activables;
- panel lateral con interpretación;
- timeline;
- simulador;
- panel de métricas;
- inspector de nodos;
- trazabilidad de fuentes.

## Estructura de carpetas sugerida

```text
web/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── stores/
│   ├── workers/
│   ├── lib/
│   └── types/
├── public/
│   └── data/
└── scripts/
```

## Features principales

### 1. Map Explorer

- mapa base vectorial;
- capas de flujo, ruido, aire, seguridad, comercio, equipamientos;
- heatmaps por hora;
- trips layer para trayectorias;
- choropleths por subtramo o nodo.

### 2. Graph Explorer

- visualización de nodos y aristas;
- resaltado de centralidad;
- filtro por capa;
- comparación entre red geométrica y red friccionada.

### 3. Hypergraph Inspector

- panel que muestre situaciones compuestas;
- ejemplo: lugar + hora + cuerpo + atmósfera + control.

### 4. Simulation Lab

- selector de escenario;
- control de hora;
- selector de perfil de agente;
- ejecución o reproducción de simulaciones precalculadas;
- comparación lado a lado.

### 5. Phenomenology Panel

- notas de campo;
- citas operativas del marco filosófico;
- lectura interpretativa del nodo seleccionado;
- evidencia fotográfica si luego se agrega.

### 6. Traceability Panel

- fuente de cada capa;
- fecha de actualización;
- qué es observado;
- qué es proxy;
- qué es inferido.

## Estado global

Mantener en `Zustand`:

- escenario activo;
- hora;
- perfil de agente;
- capas activas;
- métrica seleccionada;
- nodo o subtramo seleccionado;
- modo mapa / grafo / comparación.

## Carga de datos

Usar `TanStack Query` para:

- `manifest.json`;
- capas GeoJSON o PMTiles;
- tablas Parquet consultadas con `DuckDB-WASM`;
- resultados de simulación.

## Componentes clave

```text
AppShell
MapCanvas
LayerControls
TimelineSlider
MetricCards
NodeInspector
PhenomenologyPanel
SimulationPanel
GraphCanvas
TraceabilityDrawer
ScenarioCompareView
```

## Formatos de datos

- `GeoJSON` para capas pequeñas y observaciones de campo;
- `Parquet` para tablas medianas y series temporales;
- `JSON` para resultados de simulación y diccionarios;
- `TopoJSON` o `PMTiles` si la cartografía crece.

## Pipeline recomendado

1. Procesar datasets en Python.
2. Exportar productos limpios y versionados.
3. Generar `manifest.json` con metadatos de fuente, fecha y esquema.
4. Consumir desde React sin lógica pesada duplicada.

## Reglas técnicas

- no hacer joins costosos en cada render;
- mover simulación y cálculo pesado a Workers;
- cachear capas por escenario;
- versionar cada dataset;
- separar claramente datos observados, derivados e inferidos.

## Experiencia de usuario esperada

El usuario debe poder hacer en menos de dos minutos:

1. ubicar el polígono;
2. activar una capa;
3. cambiar la hora;
4. comparar dos perfiles de agente;
5. leer la interpretación filosófica del cambio observado;
6. rastrear la fuente de los datos.
