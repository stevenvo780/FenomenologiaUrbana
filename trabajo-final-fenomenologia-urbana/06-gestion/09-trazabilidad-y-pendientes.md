# Trazabilidad y pendientes

## Corte auditado 2026-04-24

### Ya implementado y verificable

- documento principal, marco filosófico y justificación del caso ya cerrados en versión sólida;
- pipeline Python ejecutable de punta a punta: descarga fuentes, construye caso, deriva capa empírica, corre simulaciones y publica payload visual;
- outputs generados y sincronizados: `case_model.json`, `empirical_summary.json`, `simulation_results.json`, `source_status.json`, `frontend_payload.json`;
- simulación base operativa con 4 escenarios horarios y 5 perfiles de agente;
- frontend React funcional, consumiendo payload real y validado en compilación y lint;
- mapa geográfico del corredor integrado en la web con selección de nodos y superposición de rutas dominantes;
- comparación de perfiles y rutas visible en la web con deltas básicos de costo, tiempo, entropía y viajes;
- badges epistemológicos `documented`, `proxy` y `pending` ya integrados en la UI;
- protocolo mínimo de campo ya formalizado en `investigacion/docs/protocolo-campo-minimo.md` y acompañado de plantillas reutilizables en `investigacion/data/interim/templates/`;
- infraestructura de ingesta, validación, agregación y recalibración de campo ya creada;
- fuentes públicas ampliadas: pasajeros SITVA, SIATA/AMVA PM2.5, PM10 y ruido, DANE ficha municipal y catálogo de microdatos;
- 16 de 19 fuentes configuradas descargadas con trazabilidad explícita.

### Estado epistemológico real

- el proyecto ya no está en fase conceptual; está en fase **baseline proxy demostrable**;
- la parte más madura hoy es la integración teoría + pipeline + visual;
- la principal deuda ya no es de estructura técnica sino de **captura física de campo** y **acceso automatizado a tres fuentes bloqueadas**.

### Bloqueos y alertas abiertos

- DANE CNPV geovisor fino falló por `403`, aunque ya existe fallback documentado con ficha municipal y catálogo de microdatos;
- MEData uso del suelo y MEData inventario de equipamientos siguen bloqueando descarga automatizada por `403`;
- `processed/` ya existe con reportes reproducibles, pero `sessions_count = 0`: no hay observaciones físicas cargadas en `interim/`;
- la UI actual ya muestra cierre operativo, mapa, comparación de rutas, fuentes, señalización epistemológica y dependencia externa de campo.

## Matriz operativa

| Ítem | Estado | Responsable sugerido | Cómo se captura o consigue | Formato | Variable o salida que alimenta |
| --- | --- | --- | --- | --- | --- |
| Observatorio de Movilidad | disponible | equipo datos | descarga web oficial | CSV / XLSX | flujos, congestión |
| Datos Metro San Antonio | parcial | equipo datos | revisión web e informes | PDF / notas / CSV si aparece | centralidad de transporte |
| Criminalidad por comuna | disponible | equipo datos | descarga MEData | CSV | riesgo objetivo |
| Capacidad de soporte barrial | disponible | equipo datos | descarga MEData | CSV | contexto estructural |
| Uso del suelo | disponible | equipo datos | descarga MEData | CSV / GIS | atracción funcional |
| Equipamientos colectivos | disponible | equipo datos | descarga MEData | CSV / GIS | densidad institucional |
| Aire y ruido | disponible macro / campo pendiente | equipo datos | AMVA/SIATA JSON | JSON | presión ambiental macro |
| Población y hogares | fallback documentado | equipo datos | DANE ficha municipal + microdatos | PDF / HTML | densidad demográfica municipal |
| Percepción ciudadana del centro | disponible | equipo filosofía-datos | informe Medellín Cómo Vamos | PDF / tabla manual | percepción macro |
| Red peatonal y POI | disponible | equipo geodatos | OSM / Overpass | GeoJSON | grafo base |
| Conteo peatonal fino | pendiente | equipo campo | observación estructurada | CSV | calibración de flujo |
| Tiempos de permanencia | pendiente | equipo campo | cronometraje por nodo | CSV | permanencia |
| Puntos de decisión | pendiente | equipo campo | cartografía y observación | GeoJSON | restricción decisional |
| Obstáculos temporales | pendiente | equipo campo | observación y foto | GeoJSON | fricción espacial |
| Seguridad percibida por subtramo | pendiente | equipo campo | encuesta breve | CSV | seguridad percibida |
| Ruido puntual de campo | pendiente | equipo campo | sonómetro o app calibrada | CSV | validación ambiental |
| Iluminación nocturna | pendiente | equipo campo | checklist y luxómetro | CSV | accesibilidad nocturna |
| Notas fenomenológicas | pendiente | equipo filosofía-campo | ficha estructurada | Markdown / CSV | panel interpretativo |
| Modelo de agentes | baseline proxy v0.2 implementado | equipo modelado | calibración con datos y supuestos | JSON / Python | simulación |
| Web React | cierre operativo implementado | equipo web | implementación incremental | código | visualización final |

## Prioridad de ejecución

### Prioridad alta

- ejecutar primera jornada física de campo;
- cargar CSV/GeoJSON/notas reales en `investigacion/data/interim/`;
- resolver manualmente o documentar definitivamente los tres `403` restantes;
- recalibrar con datos observados y regenerar payload `field_calibrated`.

### Prioridad media

- mejorar cartografía base con OSM/Overpass si el tiempo del curso lo exige;
- añadir fotos o notas situadas reales a la UI;
- comparar baseline vs. campo cuando existan observaciones.

### Prioridad baja

- visualizaciones avanzadas no necesarias para defensa básica;
- simulaciones complejas posteriores a campo;
- refinamiento estético menor.

## Riesgos abiertos

- escalas espaciales incompatibles;
- variables oficiales demasiado agregadas para el subtramo;
- ausencia de conteos peatonales oficiales finos;
- sobreinterpretación de proxies;
- subestimación del trabajo de limpieza geoespacial.

## Criterio de cierre real

El proyecto ya queda completo como **baseline reproducible de curso** cuando existan:

- datos públicos descargados y versionados;
- grafo e hipergrafo ejecutables;
- métricas calculadas;
- una simulación validada al menos de forma básica;
- una web navegable con trazabilidad de fuentes.

El cierre **empírico fuerte** exige además una base de campo consistente. Esa parte queda declarada como dependencia física externa y no se simula.

## Brechas reales para cerrar el proyecto

### 1. Validación de campo

Falta capturar físicamente y versionar, al menos, cuatro capas mínimas:

- conteo peatonal fino por nodo y por franja;
- tiempos de permanencia;
- seguridad percibida por subtramo;
- medición puntual de ruido e iluminación.

Sin esa capa, el proyecto funciona como demostración seria y defendible de baseline, pero no como cierre empírico fuerte.

### 2. Recalibración del modelo

El sistema corre bien en payload `0.2.0-baseline`, pero todavía con pesos `proxy` en nodos y aristas. La siguiente versión debe sustituir progresivamente esos pesos por:

- observación estructurada;
- limpieza de datasets públicos descargados;
- supuestos explícitos de calibración y sensibilidad.

### 3. Madurez visual

La interfaz actual ya comunica baseline, escenarios, mapa geográfico, comparación de perfiles, trazabilidad epistemológica, cierre operativo y dependencia externa de campo. Para una versión final con campo todavía faltan tres piezas:

- comparación explícita entre escenarios recalibrados, no solo entre perfiles en un mismo escenario;
- ingestión visible de datos de campo y/o fotos/notas situadas dentro de la experiencia web;
- ajuste fino de narrativa final para demo y lectura de resultados.

### 4. Cierre argumentativo

Falta escribir un documento corto de hallazgos y conclusiones que traduzca simulación + fenomenología + heterotopía en una tesis defendible y presentable.

## Ruta crítica de cierre

### Sprint 1 — validación empírica mínima

- hacer una jornada de campo multihoraria;
- limpiar y consolidar los CSV realmente útiles;
- definir sustituciones para la fuente DANE o dejar explícito el límite.

### Sprint 2 — recalibración y visualización fuerte

- recalibrar pesos del grafo y volver a correr simulaciones;
- publicar `frontend_payload.json` versión `0.2.0` o equivalente;
- integrar datos de campo y comparación entre escenarios recalibrados en la web.

### Sprint 3 — cierre académico

- redactar hallazgos y conclusiones;
- preparar demo guiada de la app;
- cerrar guion de exposición con capturas, comparativas y limitaciones explícitas.

## Plan MCP / agentes en paralelo

### Principio de trabajo

En este workspace el subagente disponible es `Explore`, útil para exploración y auditoría read-only. La estrategia correcta es usar varios frentes de investigación/especificación en paralelo, mientras el agente principal implementa y consolida cambios en código y documentos.

### Ola 1 — investigación paralela inmediata

| Carril | Agente | Objetivo | Entregable esperado |
| --- | --- | --- | --- |
| A | Explore | auditar fuentes y rutas alternativas para geodatos y DANE | lista priorizada de fuentes, bloqueos y reemplazos |
| B | Explore | diseñar protocolo mínimo de campo por nodo/franja | formato de captura, variables y secuencia de observación |
| C | Explore | revisar la capa visual deseada vs. la implementada | backlog UX/UI priorizado para mapa, rutas y trazabilidad |
| D | Explore | preparar estructura de conclusiones académicas | outline de hallazgos, tesis y demo final |
| E | agente principal | avanzar implementación visual y limpieza de trazabilidad | features concretas en React + actualización documental |

### Ola 2 — integración paralela después del campo

| Carril | Responsable | Objetivo | Dependencia |
| --- | --- | --- | --- |
| F | Explore | validar consistencia entre datos de campo y modelo actual | requiere CSV de campo |
| G | agente principal | recalibrar pesos y regenerar outputs | requiere datos de campo mínimos |
| H | agente principal | actualizar UI con métricas recalibradas y badges epistemológicos | requiere nuevo payload |
| I | Explore | revisar demo final y detectar huecos narrativos | requiere build visual actualizado |

### Prompts sugeridos para lanzar en paralelo

- **Explore / Fuentes**: “Revisa el repo y propone alternativas concretas para completar geodatos, DANE y cobertura espacial de aire/ruido sin romper el pipeline actual”.
- **Explore / Campo**: “Diseña un protocolo mínimo de observación para 8 a 10 nodos del corredor con franjas horarias, conteo peatonal, permanencia, ruido, iluminación y seguridad percibida”.
- **Explore / Visual**: “Compara `05-web/08-web-react.md` con la implementación actual en `visual/` y devuelve el backlog priorizado para llegar a una demo final”.
- **Explore / Cierre académico**: “Propón estructura de conclusiones y narrativa de exposición basadas en los outputs actuales del proyecto”.

### Resultado esperado de esta estrategia

Si se trabaja por carriles, el proyecto puede pasar de **baseline proxy demostrable** a **versión final defendible** sin rehacerlo desde cero. La clave no es abrir más frentes caóticos, sino sincronizar:

1. validación de datos;
2. recalibración del modelo;
3. fortalecimiento visual;
4. cierre argumentativo.
