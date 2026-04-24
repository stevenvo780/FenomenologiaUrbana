# Visualización React

Esta carpeta contiene la interfaz interactiva del proyecto.

## Qué muestra

- grafo operativo del corredor `San Antonio - Junin - Parque Berrio - Plaza Botero`;
- escenarios horarios de simulación;
- perfiles de agente;
- inspector fenomenológico por nodo;
- evidencia empírica real del centro:
  - percepción ciudadana 2024;
  - criminalidad de comuna 10;
  - indicadores 2021 del barrio La Candelaria;
- trazabilidad de fuentes y pendientes de campo.

## Requisitos

- Node.js 22+
- npm 10+

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Origen de datos

La app no inventa su payload. Lee:

- `public/data/frontend_payload.json`

Ese archivo se genera desde:

- `../investigacion/scripts/run_all.py`

## Flujo correcto

1. Correr el pipeline de `investigacion/`.
2. Confirmar que `public/data/frontend_payload.json` fue actualizado.
3. Levantar la app con `npm run dev`.

## Nota de entorno

En este repo los scripts de `package.json` llaman explícitamente a `node ./node_modules/...` porque los wrappers ejecutables de `node_modules/.bin` no son fiables en este mount.
