# Cierre final del repositorio

**Fecha de corte:** 2026-04-24  
**Estado:** `0.2.0-baseline`  
**Criterio:** repositorio listo para defensa como baseline reproducible, con dependencia física de campo declarada.

## Resultado

El proyecto queda cerrado en el repositorio como una versión demostrable y defendible:

- documento académico y argumento filosófico consolidados;
- pipeline Python reproducible de punta a punta;
- datos públicos descargados, versionados y trazados;
- capa empírica derivada desde MEData, Medellín Cómo Vamos, Metro/SITVA, SIATA/AMVA y fallback DANE;
- simulación de agentes operativa;
- dashboard React conectado a payload real `0.2.0-baseline`;
- cierre operativo visible en la UI;
- límite de campo declarado sin fabricar observaciones.

## Evidencia del último corte

| Frente | Estado | Evidencia |
| --- | --- | --- |
| Pipeline | completo | `python3 scripts/run_all.py` genera `frontend_payload.json` |
| Fuentes | completo con límites | 16/19 fuentes descargadas |
| Simulación | completo baseline | 4 escenarios y 5 perfiles de agente |
| Web | completa baseline | `npm run build` y `npm run lint` pasan |
| Campo | dependencia externa | `sessions_count = 0`, `node_coverage_ratio = 0.0` |

## Fuentes todavía bloqueadas

Estas fuentes quedan registradas como bloqueo de acceso automatizado, no como olvido del proyecto:

- `DANE Geoportal CNPV 2018`: `403`;
- `MEData uso general del suelo urbano`: `403`;
- `MEData inventario de equipamientos`: `403`.

El fallback DANE ya queda incorporado mediante:

- catálogo de microdatos CNPV 2018;
- ficha municipal CNPV 2018 Medellín.

## Actividades externas restantes

Para convertir el baseline en versión `field_calibrated`, falta ejecutar físicamente:

1. Conteo peatonal fino por nodo y franja.
2. Registro de permanencia y microzonas de pausa.
3. Seguridad percibida por subtramo.
4. Ruido e iluminación puntual.

Después de cargar esos archivos en `investigacion/data/interim/`, el pipeline ya está preparado para validar, agregar, recalibrar y publicar el payload recalibrado.

## Comandos finales

```bash
cd trabajo-final-fenomenologia-urbana/investigacion
python3 scripts/run_all.py

cd ../visual
npm run lint
npm run build
```

## Cierre metodológico

Esta versión no finge completitud empírica. Su fortaleza es que separa tres niveles:

- `documented`: fuentes públicas y derivaciones verificables;
- `proxy`: pesos analíticos necesarios para correr el modelo;
- `pending`: observación física que exige trabajo de campo.

Por eso el proyecto queda finalizado como entrega de curso reproducible, y el único salto restante es empírico, no arquitectónico.
