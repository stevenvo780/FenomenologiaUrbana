# Tablas listas para incorporar en la tesis

Fecha: 25 de abril de 2026.

Estas tablas pueden pegarse o adaptarse en los capítulos 2 y 3. Su función es evitar afirmaciones sueltas: cada tabla separa evidencia, salida computacional, límite y estado.

## Tabla A. Fuentes, uso y límite

| Fuente | Tipo | Uso en tesis | Límite declarado |
| --- | --- | --- | --- |
| Medellín Cómo Vamos & Invamer 2024 | percepción ciudadana | contexto de seguridad, movilidad, ambiente y calidad de vida | escala agregada; no sustituye conteo por nodo |
| DANE CNPV | demografía | contexto poblacional municipal | no mide experiencia peatonal fina |
| MEData | datos públicos municipales | aproximación institucional | acceso parcial/timeouts |
| SIATA/AMVA | ambiente | contexto ambiental relativo | no equivale a medición puntual en corredor |
| OpenStreetMap/Overpass | geometría | grafo espacial inicial | requiere verificación situada |
| Trabajo de campo | observación situada | validación y recalibración | pendiente; estado `pending_no_capture` |

## Tabla B. Variables operacionales

| Dimensión | Variable | Proxy actual | Validación necesaria |
| --- | --- | --- | --- |
| Fluidez | conteo peatonal | simulación y fuentes públicas | conteos por nodo/franja |
| Permanencia | tiempo de estancia | `base_dwell` modelado | cronometraje puntual |
| Riesgo | seguridad percibida | proxy institucional y pesos del modelo | encuesta breve 1–5 |
| Ambiente | ruido/PM2.5 | campo PDE simulado | medición dB y contraste ambiental |
| Accesibilidad | fricción/obstáculo | obstáculos modelados | GeoJSON y notas de campo |
| Orientación | puntos de decisión | estructura de grafo | observación fenomenológica |

## Tabla C. Resultados defendibles y no defendibles

| Resultado | Estado | Cómo redactarlo |
| --- | --- | --- |
| Pipeline reproducible | defendible | “se documentó la ruta de ejecución y sus salidas auditables” |
| Baseline proxy | defendible | “se construyó un escenario base con fuentes públicas y supuestos explícitos” |
| Simulación 24h | defendible como escenario | “explora patrones bajo supuestos, no mide ocupación real” |
| Stress test 500k | defendible como prueba interna | “evalúa estabilidad computacional, no capacidad urbana real” |
| Desigualdad de rutas | parcial | “sugiere diferencias relativas entre perfiles simulados” |
| Calibración empírica | no defendible aún | “queda pendiente por falta de campo real” |
| Causalidad urbana fuerte | no defendible | evitar afirmaciones causales sin diseño empírico |

## Tabla D. Campo mínimo para cambiar estado

| Requisito | Mínimo piloto | Motivo |
| --- | --- | --- |
| Conteos | nodos principales en 4 franjas | recalibrar crowding |
| Ruido | 1 medición por nodo/franja observada | contrastar PDE acústica |
| Iluminación | nodos críticos nocturnos | validar fricción nocturna |
| Seguridad percibida | 20–30 respuestas por franja | contrastar proxy de riesgo |
| GeoJSON | obstáculos y decisiones | recalibrar fricción espacial |
| Notas | códigos fenomenológicos | interpretar más allá del flujo |

## Tabla E. Criterios de suficiencia ante jurado

| Criterio | Cumplimiento actual | Qué falta |
| --- | --- | --- |
| Marco crítico | alto | mantener tono sobrio |
| Reproducibilidad | documentada | probar en otro equipo |
| Transparencia de límites | alta | sostener `pending_no_capture` |
| Sensibilidad | protocolo listo | ejecutar corridas cuando haya tiempo de cómputo |
| Ética | protocolo listo | verificar aval institucional |
| Campo | pendiente | jornada piloto y calibración |
