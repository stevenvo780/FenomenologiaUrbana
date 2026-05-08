# Capítulo 2. Metodología y diseño computacional

## 2.1. Enfoque metodológico general

El diseño metodológico combina revisión filosófica, datos públicos, modelación computacional, visualización y una agenda explícita de validación de campo. La simulación no se presenta como reemplazo de la observación urbana ni como instrumento neutral de optimización. Su función es construir escenarios comparables para analizar cómo se articulan densidad peatonal, riesgo percibido, ruido, contaminación, iluminación, accesibilidad, atracción comercial y restricciones de trayectoria.

La investigación se encuentra en fase `baseline_proxy`. Esto significa que existe un pipeline funcional, datos públicos descargados, modelos derivados, simulaciones y salidas visuales; pero todavía no existe una jornada de campo suficiente para recalibrar el modelo. Esta distinción es metodológicamente central: todo resultado debe leerse como exploratorio hasta que `field_calibration_delta.json` deje de estar en `pending_no_capture`.

El método se organiza en seis momentos:

1. **Construcción del caso:** delimitación del corredor y selección de nodos, aristas, perfiles y escenarios horarios.
2. **Ingesta y derivación de datos:** descarga de fuentes públicas, normalización y generación de indicadores urbanos.
3. **Modelación:** construcción del grafo, agentes, campos ambientales, escenarios y métricas de trayectoria.
4. **Análisis:** cálculo de incertidumbre, estrés, entropía, desigualdad relativa y patrones de concentración.
5. **Trabajo de campo y captura multimodal:** observación situada en los nueve nodos y cuatro franjas, encuestas breves de seguridad percibida, entrevistas semiestructuradas sobre habitabilidad declarada, registro fotográfico, recorridos POV y videos de saturación.
6. **Triangulación y detección de colapso:** cruce de criminalidad MEData, encuestas, transcripciones de entrevistas y procesamiento de video en torre HPC con GPU, para producir la matriz de colapso fenomenológico (`collapse_matrix.json`) por nodo y franja.

El estado de cada momento se declara en su sección correspondiente. Al cierre de redacción de este documento, los momentos 1 a 4 están ejecutados, el momento 5 fue completado en campo y se encuentra en fase de ingesta, y el momento 6 está en preparación: las transcripciones las realiza un colaborador externo y los videos serán procesados con GPU en la torre HPC del autor.

## 2.2. Delimitación espacial y unidades de análisis

El caso se concentra en el corredor San Antonio–Junín–Parque Berrío–Plaza Botero, entendido como un eje de centralidad peatonal y transporte. El modelo actual contiene nueve nodos operativos:

1. `san_antonio_metro`
2. `parque_san_antonio`
3. `palacio_nacional`
4. `junin_paseo`
5. `oriental_cruce`
6. `parque_berrio`
7. `carabobo_cultural`
8. `plaza_botero`
9. `museo_antioquia`

Estos nodos no agotan la complejidad del centro; son una discretización mínima para ensayar el modelo. Las aristas representan relaciones de desplazamiento y fricción entre nodos. Los perfiles simulados son: transeúnte rápido, comprador, turista cultural, vendedor ambulante y persona con movilidad reducida. Los escenarios horarios son: pico mañana, franja media, pico tarde y noche.

## 2.3. Fuentes de datos, trazabilidad y estado de captura

El pipeline integra fuentes públicas descargadas y transformadas: MEData, SIATA/AMVA, DANE, Medellín Cómo Vamos, Metro de Medellín y geometría base de OpenStreetMap/Overpass (Alcaldía de Medellín, s. f.; Área Metropolitana del Valle de Aburrá, s. f.; Departamento Administrativo Nacional de Estadística, 2018; Haklay & Weber, 2008; Medellín Cómo Vamos & Invamer, 2024; Metro de Medellín, s. f.; OpenStreetMap contributors, 2026).

El archivo `source_status.json` reporta 19 fuentes intentadas, 15 descargadas y 4 fallidas. Las fallas registradas incluyen páginas de MEData con tiempo de espera y acceso 403 al geovisor DANE. Esta información no debe ocultarse: forma parte de la trazabilidad de la investigación y permite diferenciar datos efectivamente incorporados de datos no disponibles.

La evidencia pública actualmente integrada incluye, entre otros elementos:

- percepción ciudadana del centro: imagen favorable de 53.3% e imagen desfavorable de 44.5% según Medellín Cómo Vamos;
- asociaciones dominantes: comercio, inseguridad, informalidad, congestión y habitantes de calle;
- criminalidad agregada de comuna 10 con última fecha disponible en 2023-11;
- indicadores barriales de La Candelaria: densidad empresarial alta, bajo espacio público efectivo por habitante y fuerte concentración de suelo múltiple;
- datos ambientales SIATA/AMVA para PM2.5, PM10 y ruido, con limitaciones de georreferenciación y actualidad;
- geometría urbana aproximada desde OpenStreetMap/Overpass.

La captura que todavía falta es de otro tipo: conteo peatonal fino, permanencia, flujo direccional, ruido puntual, iluminación, obstáculos temporales y percepción de seguridad por subtramo. Esos datos no pueden inventarse desde el computador.

## 2.4. Operacionalización de variables

La traducción entre teoría y modelo requiere declarar variables, unidades y límites. La tabla siguiente resume la operacionalización actual:

| Dimensión | Variable operativa | Fuente actual | Estado | Límite principal |
| --- | --- | --- | --- | --- |
| Flujo peatonal | densidad/crowding | simulación + proxies | `baseline_proxy` | falta conteo por nodo y franja |
| Permanencia | `base_dwell` | supuestos del modelo | `pending_field` | falta muestreo con cronómetro |
| Riesgo/percepción | seguridad percibida | proxies + EPC agregada | `baseline_proxy` | falta encuesta situada |
| Ambiente | PM2.5/PM10 | SIATA/AMVA | parcial | desfase temporal y escala estación-corredor |
| Ruido | campo acústico | SIATA + PDE | parcial | falta medición puntual georreferenciada |
| Iluminación | lux nocturno | no capturado | `pending_field` | falta medición por nodo |
| Accesibilidad | nodos/aristas | grafo del caso | funcional | requiere validación de obstáculos reales |
| Libertad de ruta | entropía/divergencia | simulación | exploratorio | depende de supuestos de agentes |
| Criminalidad objetiva (C1) | bandera `c1_high` por franja, derivada de proyección horaria de hurto a persona | MEData criminalidad (serie histórica comuna 10) | precomputado en `c1_hourly_projection.json` | desfase temporal, escala comuna, no por nodo |
| Seguridad percibida situada (C2) | `security_score` 1–5 | encuesta breve en campo | pendiente de encuesta | dependiente de hora, observador y muestreo |
| Habitabilidad declarada (C3) | códigos `HABITABLE/EVITABLE/NO_DESEABLE/DIFICIL_DE_VIVIR` | entrevistas escritas en `data/interim/` | pendiente de codificación | autoselección, deseabilidad social |
| Saturación material (C4) | densidad por frame y conteo YOLO11; umbral global p75 = 0.413 | videos POV / time-lapse procesados en torre HPC dual-GPU | procesado | encuadre, recorte, ausencia de afecto |

Esta tabla cumple una función de control: impide presentar todas las variables con el mismo grado de evidencia. Las cuatro últimas filas (C1–C4) son los insumos del cruce que produce la matriz de colapso fenomenológico discutida más abajo.

## 2.5. Modelo M-MASS y arquitectura de capas

La combinación de agentes, dinámica peatonal, redes y ciudad computacional se apoya en el modelo **M-MASS**, nomenclatura que designa una **Simulación Espacial Multi-Agente de Capas Múltiples** (*Multi-layer Multi-Agent Spatial Simulation*). Este acrónimo describe la integración de tres niveles de complejidad:

1.  **Multi-layer (Multi-capa):** Refiere a la superposición de los campos materiales ($M_1$), decisionales ($M_2$) y normativos ($M_3$). El modelo no solo calcula trayectorias físicas, sino que las hace circular a través de "mallas" de ruido, contaminación y visibilidad.
2.  **Multi-Agent (Multi-agente):** El uso de agentes autónomos con diferentes perfiles (comprador, turista, trabajador) que compiten y colaboran por el espacio, permitiendo que emerjan patrones de congestión no lineales.
3.  **Spatial Simulation (Simulación Espacial):** La ejecución del modelo sobre una topología real georreferenciada (grafo Junín-San Antonio), garantizando que las métricas resultantes tengan una base métrica y geográfica concreta.

La arquitectura M-MASS se apoya en literatura de modelos basados en agentes, ciencia urbana y dinámica social de peatones (Batty, 2013; Bonabeau, 2002; Epstein, 2006; Helbing & Molnár, 1995). Estas referencias orientan la arquitectura del prototipo, pero no eliminan la necesidad de validación situada.

El modelo se organiza según tres planos de la *symploké*:

- **$M_1$ material:** campos ambientales, densidad, ruido, PM2.5, visibilidad, geometría y obstáculos.
- **$M_2$ decisional/fenomenológico:** perfiles de agentes, preferencias, costos, recompensa, riesgo, tiempo y exposición.
- **$M_3$ normativo/socioespacial:** reglas implícitas, vigilancia, infraestructura, comercio, centralidad, informalidad y diseño urbano.

La integración de estas capas no busca afirmar que la ciudad sea un sistema cerrado. Al contrario, permite mostrar qué variables fueron incluidas, cuáles quedaron por fuera y qué supuestos gobiernan cada resultado.

## 2.6. Campos ambientales y PDE ($M_1$)

Para representar la materialidad ambiental se implementó un solucionador vectorizado de ecuaciones diferenciales parciales sobre mallas de alta resolución. En los experimentos ambientales se usó una cuadrícula 4K (4096x4096), equivalente a 16.7 millones de celdas. Esta escala computacional debe leerse como capacidad analítica del prototipo, no como garantía de exactitud empírica.

La distribución espacio-temporal del material particulado y de la presión acústica se aproxima mediante una ecuación de reacción-difusión:

$$ \frac{\partial u(x,t)}{\partial t} = D \nabla^2 u(x,t) - \kappa u(x,t) + S(x,t) $$

Donde $u(x,t)$ representa la concentración aproximada del estresor, $D$ el parámetro de difusión, $\kappa$ la tasa de decaimiento y $S(x,t)$ la distribución de fuentes emisoras. En el marco de los sistemas emergentes (Johnson, 2001), estos campos se interpretan como señales estigmérgicas negativas: condiciones ambientales que modifican la probabilidad de elegir una ruta sin necesidad de imponer una orden centralizada.

La salida `hpc_environmental_report.json` muestra valores pico muy altos para ruido y PM2.5. Esos valores deben tratarse como unidades internas del modelo o indicadores relativos de intensidad, no como mediciones ambientales listas para comparación normativa. Antes de cualquier afirmación sanitaria o regulatoria se requiere calibración con mediciones reales.

## 2.7. Agentes, perfiles y aprendizaje por refuerzo ($M_2$)

El transeúnte urbano se formaliza como un agente con información limitada, preferencias ponderadas y costos de desplazamiento. Para estimar políticas de navegación se entrenaron agentes mediante aprendizaje por refuerzo profundo (DRL), apoyado en la ecuación de Bellman (Bellman, 1957; Sutton & Barto, 2018):

$$ Q^*(s, a) = \mathbb{E} \left[ R(s, a) + \gamma \max_{a'} Q^*(s', a') \right] $$

La función de recompensa $R(s,a)$ codifica costos de tiempo, riesgo y exposición ambiental. La arquitectura `UrbanPhenomenologyDQN` incorpora capas densas, normalización y regularización (*LayerNorm* y *Dropout*) siguiendo prácticas comunes en redes profundas (Mnih et al., 2015). Técnicamente, estas capas estabilizan el entrenamiento y reducen sobreajuste; interpretativamente, permiten discutir la noción de filtrado perceptivo sin afirmar que reproduzcan la conciencia ni los *qualia* de los transeúntes.

Los perfiles no representan identidades completas. Son tipos analíticos para comparar sensibilidad a costos. Esta precaución es importante: una persona con movilidad reducida, un vendedor o un turista no se reducen a pesos en una función de recompensa. El modelo solo evalúa cómo ciertos supuestos modifican trayectorias.

## 2.8. Condiciones normativas y lectura crítica ($M_3$)

La integración de $M_1$ y $M_2$ se interpreta en el plano $M_3$: reglas, vigilancia, infraestructura, comercio, informalidad y hábitos de tránsito. La expresión “Panóptico de Flujo” se usa con cautela: no designa una entidad empírica cerrada, sino una lente inspirada en Foucault para describir cómo ciertas condiciones orientan el movimiento sin prohibirlo de forma explícita.

Esta capa es la más difícil de formalizar porque incluye poder, expectativa, vigilancia, costumbre y desigualdad. Por eso el modelo actual solo la aproxima mediante variables de control, riesgo, atracción y conectividad. La observación cualitativa de campo deberá corregir esa simplificación.

## 2.9. Métricas de análisis

Las métricas principales son:

- **Velocidad media:** indicador de fluidez simulada, no equivalente directo a comodidad.
- **Entropía de trayectorias:** medida de dispersión del repertorio de rutas; valores mayores sugieren mayor diversidad o desorden según contexto.
- **Divergencia de Kullback-Leibler:** diferencia entre una distribución de referencia y una distribución bajo fricción (Kullback & Leibler, 1951).
- **Gini de entropía:** desigualdad relativa entre perfiles respecto a diversidad de ruta.
- **Índice de presión:** relación entre cantidad de agentes y superficie de simulación.
- **Intervalos de confianza Monte Carlo:** estabilidad de resultados bajo repeticiones con variación aleatoria.

La divergencia KL se define como:

$$ D_{KL}(P \parallel Q) = \sum_{x \in \mathcal{X}} P(x) \log \left( \frac{P(x)}{Q(x)} \right) $$

Estas métricas no deben confundirse con juicios normativos automáticos. Un valor alto puede indicar restricción, diversidad, ruido o mala especificación, según el diseño del experimento. La interpretación exige contraste con observación y teoría.

## 2.9.1. Operacionalización del colapso fenomenológico

Las métricas anteriores describen comportamiento simulado. El colapso fenomenológico, en cambio, es una condición observable en la franja-evento (nodo × ventana horaria) y se construye por triangulación de cuatro fuentes empíricas independientes. La definición completa, con sus salvaguardas y supuestos de falsabilidad, se encuentra en `tesis/pendientes/colapso-fenomenologico.md`; aquí se resume su forma operacional.

Para cada celda $(n, w)$ —donde $n$ es uno de los nueve nodos del modelo y $w$ una de las cuatro franjas (`peak_am`, `midday`, `peak_pm`, `night`)— se evalúan cuatro condiciones binarias:

- **C1 — Carga objetiva de criminalidad.** Se cumple si la franja $w$ aparece marcada como `c1_high` en `c1_hourly_projection.json`. El cálculo se hace una sola vez sobre la **serie histórica completa** de hurto a persona de la comuna 10 publicada en MEData: el script `c1_project_hourly.py` proyecta los registros mensuales a las cuatro franjas mediante un supuesto distribucional documentado, calcula el corte por **percentil 75 de la serie histórica** y emite un mapa `c1_high_by_window` con un booleano por franja. El ensamblador `build_collapse_matrix.py` consulta ese mapa en lugar de recalcular la condición celda por celda. Esta decisión metodológica (documentada el 2026-05-07 en `tesis/pendientes/colapso-validacion-2026-05-07.md`) evita que el corte se desplace con cada subconjunto de datos y mantiene C1 como una propiedad estable del corredor en su escala disponible (comuna 10), reconociendo explícitamente que MEData no resuelve el detalle por nodo.
- **C2 — Seguridad percibida deprimida.** Se cumple si el promedio del `security_score` recogido en `field_counts_*.csv` para esa celda es ≤ 2/5 o si las notas de campo registran `RIESGO_PERCIBIDO` como código dominante. Esta condición está **pendiente** al cierre de redacción: depende del levantamiento de la encuesta breve situada por nodo y franja.
- **C3 — Habitabilidad declarada negativa.** Se cumple si las **entrevistas escritas** archivadas en `investigacion/data/interim/YYYY_MM_DD/interviews/` codifican mayoritariamente `EVITABLE`, `NO_DESEABLE` o `DIFICIL_DE_VIVIR` por encima de `HABITABLE`/`DESEABLE` en esa franja, según el esquema procesado por `code_interviews.py`. Se descartan deliberadamente las transcripciones automáticas de los videos POV: dichas transcripciones recogen ruido ambiente y comentarios del observador, no constituyen testimonio elicitado y no pueden tratarse como entrevista. Las salvaguardas para el manejo de testimonios —protocolo de entrevista con preguntas neutras antes de términos cargados, registro literal de la formulación, código `AMBIVALENTE` reservado para no forzar respuestas binarias, no tratar la convicción subjetiva como prueba— derivan de la teoría reconstructiva de la memoria desarrollada en el anexo A (especialmente §A.13.2 sobre el *misinformation effect* de Loftus 1993 y §A.17.2).
- **C4 — Saturación material.** Se cumple si los videos POV / time-lapse procesados en la torre HPC reportan un `saturation_index` por encima del **umbral global p75 = 0.413**, calculado sobre el conjunto total de videos procesados con YOLO11 en las dos GPUs disponibles (RTX 5070 Ti y RTX 2060). El umbral se fija de forma global, no por celda, para que la condición sea comparable entre nodos.

La regla de decisión es deliberadamente exigente: la celda se reporta como **colapso fenomenológico** solo si **al menos tres de las cuatro condiciones** se cumplen simultáneamente. Si se cumplen una o dos, se reporta como **fricción acumulada**. Si no se cumple ninguna, se reporta como **flujo ordinario**. Esta regla impide que un dato suelto se convierta en diagnóstico y obliga a la triangulación.

La salida de este cruce es la matriz `collapse_matrix.json` con 36 celdas (9 nodos × 4 franjas) y un campo de estado por celda. La regla **3-de-4** opera sobre esa malla y se evalúa por celda, lo que implica que basta con que una sola condición no se cumpla para que la franja-nodo deje de reportarse como colapso. La matriz se reconstruye al cierre de la fase de ingesta, conservando los `.bak.<timestamp>` de versiones previas para auditoría.

## 2.9.2. Tabla de fuentes de datos por criterio

| Criterio | Fuente primaria | Script de ingesta/derivación | Salida procesada | Estado |
| --- | --- | --- | --- | --- |
| C1 — Criminalidad | MEData (serie histórica hurto a persona, comuna 10) | `c1_project_hourly.py` | `investigacion/data/processed/c1_hourly_projection.json` (mapa `c1_high_by_window`) | precomputado, corte p75 fijo |
| C2 — Seguridad percibida | encuesta breve `security_score` 1–5 en campo | (pendiente, ingreso manual a `field_counts_*.csv`) | `investigacion/data/processed/field_observations_aggregate.csv` | pendiente de encuesta |
| C3 — Habitabilidad declarada | entrevistas **escritas** en `investigacion/data/interim/YYYY_MM_DD/interviews/` | `code_interviews.py` (esquema `HABITABLE/DESEABLE/EVITABLE/NO_DESEABLE/DIFICIL_DE_VIVIR/AMBIVALENTE`) | códigos agregados por celda en `data/processed/` | pendiente de codificación; transcripciones de video no se usan como testimonio |
| C4 — Saturación material | videos POV / time-lapse en `data/raw/video/` | `process_video.py` (YOLO11 dual-GPU) → `assign_videos_by_time.py` | `video_saturation_*.json` (umbral global p75 = 0.413) | procesado |
| Asignación espacial | EXIF de fotos + GPS + timestamps de video | `process_photos.py`, `assign_nodes.py` (haversine), `assign_videos_by_time.py` | `photo_node_assignments.json`, `photo_summary_*.json` | procesado |
| Audio (no usado como C3) | pista de audio de videos POV | `transcribe_audio.py` | transcripciones marcadas como ruido ambiente | descartado para C3 |
| Ensamblaje final | salidas C1–C4 anteriores | `build_collapse_matrix.py`, `inspect_matrix.py` | `collapse_matrix.json` | en construcción |

## 2.10. Pipeline HPC real ejecutado

La sección 2.7 describe el modelo M-MASS de simulación. Este apartado documenta el **pipeline HPC real** que produce los insumos C1–C4 de la matriz de colapso, distinto y previo a la simulación: opera sobre datos de campo reales (fotos EXIF-georreferenciadas, videos POV y entrevistas escritas) y se ejecuta en la torre `ubuntu-raid` del autor con dos GPUs en paralelo.

### 2.10.1. Hardware y orquestación

- **GPU 0:** NVIDIA RTX 5070 Ti (Blackwell, sm_120), modelo primario YOLO11x.
- **GPU 1:** NVIDIA RTX 2060 (Turing, sm_75), modelo secundario YOLO11s.
- **CPU/RAM:** 32 cores, 123 GiB.
- **Stack:** Docker Engine 29.1.3 con runtime `nvidia` por defecto, NVIDIA Container Toolkit 1.19.0, CDI specs en `/var/run/cdi/nvidia.yaml`. La asignación per-GPU se hace mediante `devices: ["nvidia.com/gpu=N"]` en `docker-compose.yml` para evitar el bug de eBPF device-filter detectado con `--gpus all` en kernel 6.17.
- **Cooperación entre workers:** cada video crea un lock en `investigacion/hpc/jobs/`; ambas GPUs leen de la misma cola sin solapamiento. Las fotos se distribuyen análogamente a través de `jobs_photos/`.

### 2.10.2. Scripts del pipeline

El directorio `investigacion/hpc/` contiene nueve scripts que cubren la cadena completa de ingesta-derivación-ensamblaje:

1. **`process_photos.py`** — extrae EXIF (timestamp, GPS) de cada foto, calcula descriptores agregados y emite `photo_summary_<basename>.json` por imagen.
2. **`process_video.py`** — muestrea frames de cada video, corre YOLO11 sobre la GPU asignada, calcula `saturation_index`, p50/p75/p90 de personas por frame y emite `video_saturation_<basename>.json`. La convención de nombres `NODE__WINDOW__YYYY-MM-DD__libre.mp4` permite ubicar la celda sin sidecar.
3. **`transcribe_audio.py`** — transcribe la pista de audio de los videos POV. Las transcripciones se conservan como ruido ambiente y **no** alimentan C3 (ver §2.9.1).
4. **`code_interviews.py`** — codifica entrevistas **escritas** (no transcripciones de video) según el esquema `HABITABLE/DESEABLE/EVITABLE/NO_DESEABLE/DIFICIL_DE_VIVIR/AMBIVALENTE` y agrega por celda nodo × franja para C3.
5. **`assign_nodes.py`** — asigna cada foto al nodo más cercano por distancia haversine sobre el GPS EXIF, y genera `photo_node_assignments.json`.
6. **`assign_videos_by_time.py`** — asigna videos a celdas (nodo × franja) cuando la convención de nombre o el sidecar no son suficientes, usando timestamp y proximidad espacial.
7. **`c1_project_hourly.py`** — proyecta la serie histórica MEData de hurto a persona de comuna 10 a las cuatro franjas horarias mediante un supuesto distribucional documentado, calcula el corte p75 sobre la serie completa y emite `c1_hourly_projection.json` con el mapa `c1_high_by_window`. Este es el script que materializa la decisión metodológica de C1: el corte se calcula una vez sobre la serie histórica, no celda a celda.
8. **`build_collapse_matrix.py`** — consume las salidas C1 (`c1_hourly_projection.json`), C2 (encuesta), C3 (entrevistas codificadas) y C4 (`video_saturation_*.json`), aplica la regla 3-de-4 por celda y emite `collapse_matrix.json`. Conserva la versión previa como `collapse_matrix.json.bak.<timestamp>` para auditoría diacrónica.
9. **`inspect_matrix.py`** — utilidad de revisión que imprime por consola el estado de cada celda, los criterios cumplidos y los archivos que alimentaron cada condición. Se usa para verificación manual antes de exponer la matriz a la visualización.

Scripts auxiliares no contados en los nueve principales pero presentes en el directorio: `make_sidecars.py` (genera `*.meta.json` para videos sin convención de nombre) y `update_video_metadata.py` (corrige metadatos en lote).

### 2.10.3. Diferencia respecto a M-MASS

El pipeline HPC y M-MASS no comparten datos en una sola dirección: el pipeline HPC produce la matriz empírica que **contrasta** la simulación M-MASS, no la alimenta. M-MASS (secciones 2.5–2.7) genera trayectorias y campos sintéticos; el pipeline HPC genera una malla de evidencia situada. Su cruce se discute en el capítulo 3.

## 2.11. Reproducibilidad y trazabilidad técnica

La reproducibilidad se apoya en tres elementos ya presentes en el repositorio:

- scripts de ingesta, derivación, modelado, simulación, análisis y publicación visual;
- archivos JSON de salida en `investigacion/outputs/`;
- documentación metodológica en `investigacion/docs/` y plantillas de campo.

Sin embargo, una tesis evaluable debe documentar todavía con más precisión:

- versiones de Python, PyTorch, NumPy y dependencias geoespaciales;
- disponibilidad o no de GPU/CUDA;
- semillas aleatorias usadas en simulaciones;
- tiempos aproximados de ejecución;
- parámetros sensibles: número de agentes, pasos, tamaño de malla, tasas de difusión, recompensas, pesos de riesgo y ruido;
- modo reducido para reproducir resultados en CPU.

Estos elementos pueden resolverse en el computador antes del trabajo de campo y deberían quedar como anexo técnico. Sin esa documentación, el pipeline puede funcionar, pero no ser suficientemente auditable por terceros.

## 2.12. Validación, sensibilidad y falsabilidad

El modelo debe someterse a cuatro tipos de prueba:

1. **Validación interna:** comprobar que los scripts producen salidas consistentes, que las métricas se calculan correctamente y que no hay errores de pipeline.
2. **Sensibilidad:** variar parámetros clave para observar cuánto cambian velocidad, entropía, concentración de rutas y desigualdad entre perfiles.
3. **Validación empírica:** comparar salidas con conteos, permanencias, mediciones y encuestas de campo.
4. **Triangulación de colapso:** cruzar las cuatro fuentes empíricas independientes (criminalidad, encuesta, entrevista, video) sobre la malla nodo × franja para producir y auditar `collapse_matrix.json`. Esta prueba no busca confirmar la simulación; busca decidir, celda por celda, si la convergencia mínima de tres condiciones se sostiene.

La validación interna y parte de la sensibilidad pueden hacerse ya en PC. La validación empírica y la triangulación requieren ingesta de campo y procesamiento de video en la torre HPC con GPU. Por tanto, el modelo debe ser falsable: si los conteos reales muestran flujos distintos, si la percepción de seguridad contradice los proxies, si el ruido puntual no corresponde a los campos simulados, o si las cuatro fuentes del colapso no convergen en ninguna celda, el modelo y la categoría deben recalibrarse o retraerse.

Esta validación no debe entenderse como simple confirmación numérica. En términos epistemológicos, la fase de campo debe producir conocimiento situado: cada conteo, medición o encuesta depende de hora, posición, instrumento, observador y protocolo. Esta cautela sigue la advertencia de Haraway (1995): no existe una mirada neutral “desde ninguna parte”; hay perspectivas parciales que deben declararse para ser discutibles.

## 2.13. Consideraciones éticas

La fase de campo y la fase de ingesta multimedia introducen obligaciones éticas adicionales. Las encuestas de seguridad percibida y las entrevistas sobre habitabilidad declarada deben evitar recoger datos personales identificables. Las fotografías y los videos POV deben centrarse en obstáculos, flujos agregados, geometría y condiciones espaciales, no en rostros ni en exposición de individuos vulnerables. Cualquier mención a habitantes de calle, informalidad o inseguridad debe tratarse como categoría urbana agregada, no como estigma de grupos.

El protocolo de campo y de procesamiento debe incluir:

- consentimiento verbal o escrito para encuestas y entrevistas;
- anonimización de observadores y participantes;
- no registro de rostros identificables sin autorización; cuando aparezcan en video, deben difuminarse antes del procesamiento o mantenerse fuera del entregable público;
- almacenamiento seguro de archivos (videos, fotos y audios crudos no publicables);
- uso académico limitado de los datos y supresión de fragmentos sensibles antes de cualquier difusión;
- posibilidad de no responder ni autorizar uso, sin consecuencia alguna;
- transcripción anonimizada por colaborador externo, bajo acuerdo de confidencialidad;
- procesamiento de video en torre HPC local del autor, sin envío a servicios de terceros.

## 2.14. Diagrama del método

```mermaid
graph TD
    A[Fuentes públicas] --> B[Ingesta y normalización]
    B --> C[Modelo de caso: nodos, aristas, perfiles]
    C --> D[M1 Campos ambientales]
    C --> E[M2 Agentes y DRL]
    C --> F[M3 Condiciones normativas]
    D --> G[Simulación y métricas]
    E --> G
    F --> G
    G --> H[Resultados baseline_proxy]
    H --> I{Validación de campo}
    I -->|en ingesta| J[Conteos, encuestas, fotos, GeoJSON]
    I -->|en transcripción| K[Entrevistas: habitabilidad declarada]
    I -->|en torre HPC| L[Videos POV: saturación material]
    M[Criminalidad MEData] --> N{Triangulación de colapso}
    J --> N
    K --> N
    L --> N
    N --> O[collapse_matrix.json: nodo x franja]
    O --> P[Modelo recalibrado y discusión final]
```

## 2.15. Balance metodológico

El método es suficientemente robusto para una fase exploratoria: integra fuentes públicas, variables urbanas, simulación, lectura filosófica y un protocolo de campo cumplido. Lo que aún no puede sostenerse es la afirmación empírica fuerte sobre el corredor, porque el cruce de las cuatro fuentes del colapso (criminalidad, encuesta, entrevista, video) está en fase de ingesta. La fortaleza del trabajo está en declarar esta diferencia y convertirla en plan: primero baseline trazable, después campo realizado, ahora ingesta y triangulación, y solo entonces discusión final con la matriz de colapso a la vista.
