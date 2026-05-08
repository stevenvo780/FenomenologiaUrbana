# Colapso fenomenológico: definición operacional

Este documento fija la categoría de **colapso fenomenológico** que la tesis incorpora a partir de la fase de campo. Se redacta antes de la ingesta completa para evitar que el concepto se contamine con confirmaciones a posteriori.

## 1. Idea general

El colapso fenomenológico **no es** un estado estable del corredor ni una propiedad del lugar en abstracto. Es una **franja-evento** definida por la convergencia, en una misma ventana espacio-temporal (un nodo y una hora), de cuatro condiciones empíricamente trazables:

1. **C1 — Carga objetiva de criminalidad.** Tasa de hurto a persona en comuna 10 / nodo cercano por encima de su propio percentil 75 mensual de la serie pública (MEData).
2. **C2 — Seguridad percibida deprimida.** Puntaje promedio ≤ 2/5 en encuesta breve situada y/o codificación recurrente de `RIESGO_PERCIBIDO` en notas de campo y transcripciones.
3. **C3 — Habitabilidad declarada negativa.** En las entrevistas, predominio de codificación `EVITABLE`, `NO_DESEABLE` o `DIFICIL_DE_VIVIR` por encima de `HABITABLE`/`DESEABLE` en esa franja.
4. **C4 — Saturación material.** Pico de densidad o exposición ambiental en los videos POV / time-lapse / recorridos procesados en la torre HPC (conteo automático + fricción visual).

Cuando **al menos tres de las cuatro** condiciones se cumplen en la misma franja-nodo, esa franja-nodo se reporta como **colapso fenomenológico**. Cuando se cumplen solo una o dos, se reporta como **fricción acumulada** sin colapso.

Esta definición tiene un costo deliberado: no permite hablar de colapso sin convergencia. Esa restricción es el control de rigor; impide que un dato suelto (una cifra de hurto, una entrevista incómoda, un video saturado) se convierta en diagnóstico.

## 2. Por qué cuatro fuentes y no una

Cada fuente, leída sola, tiene un sesgo conocido:

| Fuente | Mide | Sesgo principal |
| --- | --- | --- |
| Criminalidad MEData | conducta registrada en denuncia | subregistro, escala comuna, desfase temporal |
| Encuesta breve situada | percepción puntual | dependencia de hora, observador y contexto inmediato |
| Entrevista cualitativa | habitabilidad narrada | autoselección, deseabilidad social, memoria |
| Video / foto / POV | saturación material observable | encuadre, recorte, ausencia del afecto |

La triangulación no elimina los sesgos; los obliga a coincidir. Lo que ninguna fuente sola puede decir, la convergencia sí lo permite afirmar con prudencia.

## 3. Unidad de análisis

La unidad mínima es la celda **(nodo × franja horaria)**. Los nueve nodos del modelo (`san_antonio_metro`, `parque_san_antonio`, `palacio_nacional`, `junin_paseo`, `oriental_cruce`, `parque_berrio`, `carabobo_cultural`, `plaza_botero`, `museo_antioquia`) cruzados con las cuatro franjas (`peak_am`, `midday`, `peak_pm`, `night`) producen 36 celdas. El colapso se reporta celda por celda, no como propiedad global del corredor.

## 4. Pipeline de evidencia

Cada condición tiene un archivo o conjunto de archivos asociados:

- **C1:** `investigacion/data/raw/medata_criminalidad_csv.csv` filtrado a comuna 10 y reproyectado a ventanas horarias mediante supuesto distribucional documentado en `investigacion/scripts/data/`.
- **C2:** `investigacion/data/interim/YYYY_MM_DD/field_counts_*.csv` (columna `security_score`) + agregación en `investigacion/data/processed/field_observations_aggregate.csv`.
- **C3:** transcripciones de entrevistas en `investigacion/data/interim/YYYY_MM_DD/interviews/` (a generar por el colega que transcribe), codificadas con esquema `HABITABLE / DESEABLE / EVITABLE / NO_DESEABLE / DIFICIL_DE_VIVIR / AMBIVALENTE`.
- **C4:** videos crudos en `investigacion/data/raw/video/` procesados en la torre HPC (GPU) hacia `investigacion/data/processed/video_saturation_*.json` con métricas de densidad por frame y conteo automático.

El cruce de las cuatro condiciones se ensamblará en `investigacion/data/processed/collapse_matrix.json` (pendiente de generación) y se integrará al payload de visualización.

## 5. Lo que el colapso no afirma

Para evitar sobreinterpretación, conviene declarar lo que **no** se sostiene aun cuando una franja-nodo cumpla las cuatro condiciones:

- No se afirma que esa franja-nodo sea inhabitable en sentido absoluto.
- No se afirma que las personas que la transitan estén sufriendo en términos clínicos.
- No se afirma una causalidad única (criminalidad → miedo → evitación).
- No se afirma que el colapso se repita idéntico el día siguiente: la franja-evento es una observación situada.

## 6. Vínculo con el marco teórico

El colapso fenomenológico, así definido, dialoga con cuatro corrientes ya presentes en el capítulo 1:

- **Husserl / Merleau-Ponty:** el colapso ocurre en el cuerpo vivido, no en el mapa. Su evidencia está en la trayectoria que se acorta, en el paso que se acelera, en el lugar que se evita.
- **Simmel:** el colapso convoca y desborda la actitud blasé. El filtrado deja de ser suficiente; aparece la evitación práctica.
- **Foucault / Deleuze:** el colapso revela los dispositivos de modulación cuando fallan o se intensifican: vigilancia que no contiene, comercio que no compensa, infraestructura que no orienta.
- **Lefebvre / Harvey:** el colapso es la suspensión local del derecho a la ciudad. No prohíbe el paso, pero encarece la apropiación, la pausa y la presencia.

## 7. Falsabilidad

La definición es falsable de tres maneras:

1. Si la criminalidad por hora no muestra estructura clara (ruido aleatorio), C1 no puede sostenerse y el colapso debe redefinirse sin ese eje.
2. Si las entrevistas y la encuesta breve discrepan sistemáticamente, C2 y C3 deben separarse y el modelo se vuelve más conservador.
3. Si los videos no permiten extraer saturación de manera reproducible, C4 debe rebajarse a evidencia ilustrativa y no condicionante.

La tesis debe estar dispuesta a aceptar cualquiera de estos tres resultados.

## 8. Estado al momento de escribir este documento

- Campo: realizado antes del 2026-05-06.
- Transcripciones de entrevistas: en proceso (colega externo).
- Videos: pendientes de procesar en la torre HPC con GPU.
- Notas, conteos, fotos y GeoJSON: a ingestar a `investigacion/data/interim/`.
- Matriz de colapso (`collapse_matrix.json`): no generada.

Hasta que esa matriz exista, los capítulos 3 y 4 deben hablar de **fase de ingesta**, no de **resultados validados**.
