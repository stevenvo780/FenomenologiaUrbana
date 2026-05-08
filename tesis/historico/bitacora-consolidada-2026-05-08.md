# Bitácora consolidada — 2026-05-08

## Propósito

Este documento consolida la narrativa de iteraciones del proyecto
`FenomenologiaUrbana` (campo + pipeline HPC + matriz de colapso
fenomenológico) en un único registro factual. Su función es **mantener
trazabilidad histórica sin contaminar los capítulos de tesis**: los
capítulos 1–4 pueden adelgazarse de referencias temporales y de detalles
de oleadas remitiendo a esta bitácora. No reemplaza ni invalida los
documentos previos (`tesis/historico/2026-05-07-*.md`,
`tesis/pendientes/colapso-validacion-2026-05-07.md`,
`tesis/pendientes/cross-validation-text-image-2026-05-07.md`,
reportes en `investigacion/data/interim/2026-05-05/`); los compendia.

Fecha de consolidación: 2026-05-08. Tono: bitácora factual. Tabla > prosa.

## 1. Línea de tiempo (cronología)

| Fecha | Hito | Commit |
|---|---|---|
| pre-2026-05-04 | Reorientación narrativa: introducción del concepto operacional de colapso fenomenológico (regla 3-de-4 sobre C1/C2/C3/C4); fase pasa a `field_ingest_in_progress`. Diseño del entorno HPC dual-GPU (`investigacion/hpc/`). | `4e31b04` |
| pre-2026-05-04 | Fix CDI dual-GPU: migración de `--gpus all` legacy a `devices: ["nvidia.com/gpu=N"]` por bug eBPF en kernel 6.17 + docker 29 + nvidia-container-toolkit 1.19. Aislamiento per-GPU verificado. | `5074aae` |
| pre-2026-05-04 | Pipeline exhaustivo dual-GPU desplegado en torre `ubuntu-raid` (RTX 5070 Ti sm_120 + RTX 2060 sm_75): video + foto + audio + tracking. | `3b72888` |
| pre-2026-05-04 | NpEncoder + skip de videos cortos (<30 frames) + bloqueo de reintentos sobre `.error` stale. | `fe2c9a1` |
| pre-2026-05-04 | Worker de transcripción Whisper + primer scaffold de `build_collapse_matrix.py`. | `d7d3200` |
| pre-2026-05-04 | `proc-transcribe` migrado a `runtime: runc` (no requiere GPU; evita el bug eBPF en runs ad-hoc). | `64db000` |
| **2026-05-05** | **Captura de campo.** 5 nodos visitados (`san_antonio_metro`, `parque_san_antonio`, `junin_paseo`, `parque_botero`/`plaza_botero`, `parque_berrio` parcial). 14 entrevistas + 1 entrevista adicional de Jacob a *Andrés (vendedor, sub-zona Coltejer-Ayacucho)*. 34 fotos JPG con EXIF GPS (38 totales tras revisión local). 17 videos POV (jornada 8:30–11:46 + un único 21:30). 2 observadores independientes recorriendo en paralelo: **Stev** (referencia) y **Jacob** (contraste). Cobertura temporal: ausente en `peak_pm` y mayoría de `night`. | — |
| pre-2026-05-07 | Asignación auto GPS→nodo (haversine) + resultados preliminares 5-may. | `167d25f` |
| pre-2026-05-07 | Anexo A (memoria, filosofía de la mente) como soporte teórico de C3. | `b8056f5` |
| pre-2026-05-07 | Asignación nodo→video por correlación temporal con fotos GPS (la cámara no embebe GPS en MP4). Confianza por Δt: high <300 s, medium <1800, low <7200, very_low resto. Proyección C1 horaria (Cohen-Felson + Brantingham): pesos `peak_am=0.20, midday=0.20, peak_pm=0.45, night=0.15`. | `3d30852` |
| pre-2026-05-07 | Inclusión de C1 en coverage + script `inspect_matrix.py`. | `da5ad23` |
| pre-2026-05-07 | Cap. 3.12bis con primera matriz computada (placeholder). | `b45ab13` |
| pre-2026-05-07 | Codificación auto de C3 con Ollama qwen3:14b (`code_interviews.py`). | `b9205e2` |
| pre-2026-05-07 | Skip de templates, examples y synthetic en `code_interviews`. | `60acd3c` |
| pre-2026-05-07 | Visualización de la matriz en frontend + publicación de payload (`CollapseMatrixPanel`, `frontend_payload.json`). | `4773b6e` |
| 2026-05-07 ~22:20 (Ciclo 2) | Subida rsync de 7 videos comprimidos a torre (49–209 MB c/u, 0 fallos). Recompute de matriz: `{flujo_ordinario: 3, friccion_acumulada: 1, inconcluyente: 32}`. Única fricción: `junin_paseo|peak_am` (C4 saturada, sat_p75=0.465). | `8a87d05` |
| 2026-05-07 | Cap. 3.12bis actualizado tras ciclo 2 (`junin_paseo|peak_am`). | `519c69b` |
| 2026-05-07 | Handoff completo para retomar desde la torre o desde otro equipo. | `ca60117` |
| 2026-05-07 | Ingesta de campo + matriz de colapso fenomenológico consolidadas. | `b667dba` |
| 2026-05-07 (Ciclo 3) | **Detección de inconsistencia C1.** El bloque `c1_high_by_window` precomputado decía `{peak_am, midday, peak_pm, night} = true`, pero `build_collapse_matrix.py` reevaluaba C1 contra `median_month` y todas las celdas terminaban con `C1_crime_high=false`. **Fix:** eliminar la reevaluación interna y respetar el bloque precomputado. Re-conteo: `{colapso: 0, friccion_acumulada: 4, flujo_ordinario: 0, inconcluyente: 32}`. Celdas que mutaron: `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday` (de `flujo_ordinario` a `friccion_acumulada` 1/4 con C1=1); `junin_paseo|peak_am` consolidada como única 2/4 (C1+C4). | `8dc15e8`, `32fb968` |
| 2026-05-07 | Oleadas 1-2: ingesta de campo, fix C1 y alineación de defensa en cap. 2-4. | `8dc15e8`, `32fb968` |
| 2026-05-07 | Merge desde torre + fix C1 local. | `3bf6437` |
| 2026-05-07 | **Oleada 4:** integración del campo 2026-05-05 a M1/M2/M3 y matriz post-C3. Codificación de transcripts de video (Whisper) revela que **1/19 transcripts contiene testimonio sustantivo**; el resto es ruido o monólogo del observador. **Decisión metodológica:** descartar transcripts de video como fuente C3 y usar entrevistas escritas. | `9a44844` |
| 2026-05-07 | Notas de campo de Jacob ingresan al corpus. | `5426b86` |
| 2026-05-07 | **Oleada 5 (extracción HPC ampliada):** OCR sobre 34 fotos; geometría v2 con sub-zonas opcionales (rescata `la_bastilla` antes vacío); análisis de sensibilidad (1000 bootstrap V1 + 25 escenarios V2 + 15 LOO V3); inter-rater Stev↔Jacob (kappa = 0.0); cross-validation texto↔imagen (10 reclamos → 2 alta, 2 media, 6 no evaluables); audio classification (PANNs sobre 17 videos). | `a4eabef` |
| 2026-05-07 | **Oleada 6:** narrativa actualizada en tesis y web con datos de oleada 5. Consolidación final del texto y la web. | `316a561` |
| 2026-05-08 | Bitácora consolidada (este documento). | — |

## 2. Decisiones metodológicas clave

| # | Decisión | Justificación | Archivo de referencia |
|---|---|---|---|
| D1 | **Regla 3-de-4** (C1+C2+C3+C4) para colapso fenomenológico; 1–2 ⇒ fricción acumulada; 0 ⇒ flujo ordinario; cobertura <2 ⇒ inconcluyente. | Falsabilidad explícita (Popper) + triangulación: ningún plano único declara colapso. | `tesis/pendientes/colapso-fenomenologico.md` |
| D2 | **C1 respeta `c1_high_by_window` precomputado** (corte p75 por franja sobre serie histórica MEData), no se reevalúa contra `median_month`. | El bloque precomputado es la operacionalización formal en §1 del doc de colapso. La reevaluación interna producía un desfase artificial (todas `false`). | `colapso-validacion-2026-05-07.md` §2 + Anexo |
| D3 | **Transcripts de video descartados como fuente C3**; se usan entrevistas escritas. | 1/19 con testimonio sustantivo; 18/19 ruido o monólogo del observador. ROI insuficiente para defensa. | Oleada 4 (`9a44844`) |
| D4 | **Geometría v2 con sub-zonas opcionales.** Re-geocoding fino que rescata `la_bastilla` (antes vacío) y deja sub-zonas no muestreadas como huecos declarados. | Permite sub-gradientes intra-nodo (Coltejer-Ayacucho dentro de Junín) sin contaminar agregados nodales. | Oleada 5 (`a4eabef`) |
| D5 | **Agregados visuales con entropía Shannon** sobre clases YOLO COCO (`heterogeneity_index_visual_norm`). | Convierte la diversidad de objetos co-presentes en métrica continua comparable entre nodos×franjas. | Oleada 5 (`a4eabef`) |
| D6 | **Asignación video→nodo por correlación temporal** con fotos GPS, no por GPS embebido. | La cámara del celular no embebe GPS en contenedor MP4. Confianza tipificada por Δt. | `assign_videos_by_time.py` |
| D7 | **Inter-rater binarizado** `≥3 → alto`, `<3 → bajo` y reportar `kappa=0.0` explícitamente. | El propio resultado refuerza la tesis nuclear (subjetividad cultivada como dato fenomenológico positivo, no ruido). | `inter_rater_reliability.md` |
| D8 | **Difuminado de rostros** y procesamiento HPC local (torre propia, no nube). | Ética de campo + control de cadena de custodia. | `tesis/02-metodologia-y-diseno-hpc.md` §2.11 |

## 3. Iteraciones de la matriz

Cada fila refleja un estado snapshot del `collapse_matrix.json` y qué cambió respecto al anterior.

| Iteración | Fecha | Estado (counts) | Cambio respecto al anterior | Nota |
|---|---|---|---|---|
| M0 (baseline) | 2026-05-07 (pre-ciclo 2) | `{flujo_ordinario: ?, friccion_acumulada: 1 (parque_berrio\|midday), inconcluyente: ~34}` | Primera matriz computada con ingesta parcial. | `b45ab13` / `4773b6e` |
| M1 (ciclo 2) | 2026-05-07 22:20 | `{flujo_ordinario: 3, friccion_acumulada: 1, inconcluyente: 32}` | +7 videos comprimidos; fricción se desplaza a `junin_paseo\|peak_am` (sat_p75=0.465). Estabilidad relativa documentada como resultado defendible. | `8a87d05`, `519c69b` |
| M2 (post-fix C1) | 2026-05-07 (ciclo 3) | `{colapso: 0, friccion_acumulada: 4, flujo_ordinario: 0, inconcluyente: 32}` | Fix de inconsistencia C1 (D2). 3 celdas suben de `flujo_ordinario` a fricción 1/4 (C1=1). `junin_paseo\|peak_am` consolida 2/4 (C1+C4). | `8dc15e8`, `32fb968` |
| M3 (post-C3) | 2026-05-07 oleada 4 | matriz alimentada con C3 escrito (entrevistas Stev + Jacob); transcripts de video excluidos. | Aparece dato C3 en celdas con entrevistas; `plaza_botero\|midday` y `parque_san_antonio\|midday` empiezan a tener cobertura cruzada. | `9a44844` |
| M4 (oleada 5) | 2026-05-07 | 6 celdas en fricción baseline; sensibilidad evaluada (V1+V2+V3); 2 robustas, 4 frágiles. Cross-val texto↔imagen alimenta la lectura cualitativa. | OCR/geometría/audio/sensibilidad/cross-val añadidos; `la_bastilla` rescatado vía geometría v2. | `a4eabef` |
| M5 (snapshot 2026-05-08) | 2026-05-08 | **2 pilares defendibles** (`junin_paseo\|peak_am`, `plaza_botero\|midday`) + 4 frágiles + 30 inconcluyentes; kappa=0; cross-val 2 alta/2 media. | Consolidación narrativa final (oleada 6). | `316a561` |

## 4. Hallazgos consolidados (snapshot al 2026-05-08)

### 4.1. Pilares defendibles (robustos bajo V1+V2+V3)

| Celda | Decisión | Evidencia | V1 share | V2 share | LOO C3 | Estatus |
|---|---|---|---|---|---|---|
| `junin_paseo|peak_am` | fricción acumulada (2/4: C1+C4) | C4 sat_p75=0.465 (max corpus 0.474), C1 high; n=4 videos. | 0.956 | 0.880 | 1.000 | **robusta** |
| `plaza_botero|midday` | fricción acumulada | human_density_max=30, saturation_max=71 (máximos del corpus); convergencia texto↔imagen alta ("sofocante/colapsa"). | 0.970 | 1.000 | 1.000 | **robusta** |

### 4.2. Celdas frágiles (decisión sensible al muestreo o al umbral)

| Celda | Decisión baseline | V1 share | V2 share | Motivo de fragilidad |
|---|---|---|---|---|
| `san_antonio_metro|peak_am` | fricción acumulada | 0.477 | 0.400 | Decisión depende del corte p75 y de pocas fuentes (C1 solo). |
| `parque_san_antonio|midday` | fricción acumulada | 0.668 | 0.400 | Sensible a umbral; sin bucket visual asignado → cross-val no falsable. |
| `junin_paseo|midday` | fricción acumulada | 0.499 | 0.400 | Cerca del coin-flip en V1; fricción subordinada a C1 únicamente. |
| `parque_berrio|midday` | fricción acumulada | 0.497 | 0.400 | Cerca del coin-flip en V1; reportar como contraste empírico, no como pilar. |

### 4.3. Resto

- **30 celdas inconcluyentes** por cobertura <2 fuentes (muchas con C1 disponible globalmente pero sin C2/C3/C4 nodales).
- **0 celdas en colapso fenomenológico** (regla 3-de-4 nunca instanciada en el corpus actual).
- **Ninguna celda inconcluyente cruza el umbral del 30% de colapso bajo V2** (sensibilidad no oculta colapsos latentes).

### 4.4. Inter-rater

- `kappa = 0.0` sobre 4 nodos compartidos Stev↔Jacob (2/4 acuerdo bruto, exactamente esperable por azar dada la distribución 50/50).
- Caso paradigmático de divergencia radical: `parque_san_antonio` (Stev=4 alto / Jacob=2 bajo).
- Lectura defensiva: el resultado **no invalida** el estudio; **confirma** la subjetividad cultivada como dato fenomenológico positivo y justifica triangulación multi-observador como necesaria.

### 4.5. Cross-validation texto↔imagen (10 reclamos)

| Tipo | Conteo | Ejemplos |
|---|---:|---|
| Convergencia alta | 2 | `san_antonio_metro\|peak_am` riesgo vial (`vehicle_intensity=0.378`); `plaza_botero/parque_berrio` "colapsa" (`human_density_max=30`, `saturation_max=71`). |
| Convergencia media | 2 | turistas en Botero (`tourist_proxy_ratio≈0.036` ≈ 5% reportado); comercio Junín (Stev "casi nulo" + Jacob "heterotópico" se reconcilian: mono-uso formal con flujo portátil de suitcases/handbags). |
| No evaluable | 6 | vandalismo, indigencia, consumo, presencia policial, tono `parque_san_antonio`, obstáculos `parque_san_antonio`. Limitaciones del pipeline (YOLO COCO sin clases para uniformes/grafiti/indigencia + nodos sin bucket visual). |

## 5. Limitaciones declaradas

| # | Limitación | Detalle | Implicación para defensa |
|---|---|---|---|
| L1 | **C2 ausente** (0/36) | Encuesta `security_score 1–5` no aplicada; no hay `field_observations_aggregate.csv` poblado. | Regla 3-de-4 opera de facto como 3-de-3 con C2=False, sesgando hacia fricción antes que colapso. Declarar explícitamente. |
| L2 | **Sub-zonas no muestreadas** | Geometría v2 expone sub-zonas con cobertura 0 (intra-nodo, p. ej. interior de `parque_san_antonio` sin bucket visual asignado). | Cross-validation no falsable en esos sub-bloques; se reporta como hueco, no como negativo. |
| L3 | **OCR sesgado diurno** | OCR sobre 34 fotos cubre solo jornada 8:30–11:46 + 21:30 (un único registro nocturno). | No hay base para inferir letreros/grafitis/marcadores comerciales en `peak_pm` ni `night`. |
| L4 | **Audio celular** | PANNs sobre 17 videos, captura con micrófono integrado de smartphone (no array calibrado). | Niveles dB-FS son relativos, no absolutos; clasificación de eventos sonoros indicativa, no certificable. |
| L5 | **Cobertura temporal asimétrica** | Sin fotos GPS en `peak_pm` y mayoría de `night`; asignaciones video→nodo en esas franjas con `conf=very_low` (Δt>17000 s). | Las 30 celdas inconcluyentes en esas franjas no pueden interpretarse como "sin colapso". |
| L6 | **C3 dependiente de testigo único en LOO** | LOO V3 muestra que en celdas con n=1–3 entrevistas, quitar una desplaza la decisión (LOO fricción share = 1.000 en todas las celdas baseline). | Reportar como "decisión dependiente de testigo único" donde aplique; no usar como evidencia robusta sin redundancia. |
| L7 | **Inter-rater kappa=0** | Acuerdo bruto 0.50 = acuerdo por azar; Landis & Koch 1977: *poor agreement*. | Convertido en argumento metodológico (D7), no en debilidad oculta. |
| L8 | **Compresión de video** | 11 videos `.compressed.mp4` (CRF) procesados en HPC; los 17 originales (~11 GB) no llegaron a reprocesarse en alta calidad antes del cierre. | Saturación visual podría estar marginalmente subestimada; pendiente de verificación. |
| L9 | **YOLO COCO** | Sin clases para uniformes, indigencia, consumo de sustancias, grafiti, presencia policial. | 6/10 reclamos del campo no falsables visualmente; documentado como TODO de pipeline, no como debilidad del reclamo. |

## 6. Punteros (no duplicar contenido)

- Definición operacional del colapso: `tesis/pendientes/colapso-fenomenologico.md`
- Validación detallada de la matriz (incluye tabla 36 celdas + anexo post-fix C1): `tesis/pendientes/colapso-validacion-2026-05-07.md`
- Cross-validation texto↔imagen: `tesis/pendientes/cross-validation-text-image-2026-05-07.md`
- Sensibilidad (V1+V2+V3): `investigacion/data/interim/2026-05-05/sensitivity_report.md`
- Inter-rater Stev↔Jacob (kappa=0): `investigacion/data/interim/2026-05-05/inter_rater_reliability.md`
- Orquestación HPC (3 ciclos): `tesis/historico/2026-05-07-orquestacion.md`
- Progreso reorientación + entorno: `tesis/historico/2026-05-07-progreso-colapso-fenomenologico.md`
- Handoff operativo (SSH torre, recetas, prioridades): `tesis/historico/2026-05-07-handoff-otro-equipo.md`

## 7. TODO / pendientes para futuras iteraciones

- C2 (encuesta de seguridad percibida) sigue vacío; bloquea por sí solo la posibilidad de que cualquier celda alcance la regla 3-de-4.
- Reprocesar 17 videos originales sin comprimir (LAN gigabit a torre) para confirmar que la fricción detectada no es artefacto de CRF.
- Refinar `CollapseMatrixPanel` con tooltips ricos (baja prioridad).
- Limpiar `*.bak.*` en torre tras git pull (baja prioridad).
- Ampliar bibliografía empírica 2020–2025 sobre Medellín, percepción de seguridad y movilidad peatonal.
