# Guion de presentación para público general

Fecha: 7 de mayo de 2026. Última actualización: 8 de mayo de 2026 (post-oleada 5: Jacob + sensibilidad + cross-validation visual).  
Uso: apoyo oral para el deck React de 16 slides.  
Regla: hablar claro, no inventar resultados de campo, y repetir la distinción **evidencia pública / simulación / campo capturado e ingerido**. La matriz de colapso ya existe pero está deliberadamente austera: hoy no hay celdas en colapso 3-de-4 confirmado, y eso forma parte del argumento. Tras la oleada 5 (segundo observador Jacob, bootstrap de sensibilidad y cross-validation texto-imagen) hay **dos hallazgos defendibles** en lugar de uno, y la divergencia inter-observador (kappa=0.0) se incorpora como dato fenomenológico positivo.

## 0. Idea guía en una frase

Esta tesis estudia cómo se vive caminar un tramo del centro de Medellín. Usa datos públicos y simulación para organizar hipótesis; usa el trabajo de campo (criminalidad registrada, encuestas, entrevistas y videos) para someter a prueba la categoría de **colapso fenomenológico** mediante una regla 3-de-4 explícitamente falsable. El estado actual: la regla se sostiene, el campo confirma su rigor y todavía no produce instancias de colapso confirmadas.

## 1. Apertura — ¿por qué la calle?

**Decir:**

> No parto de la idea de que el centro sea simplemente "bueno" o "malo". La pregunta es más concreta: ¿qué pasa con el cuerpo cuando camina por un corredor con transporte, comercio, ruido, vigilancia, memoria urbana y percepción de riesgo?

**Evitar:**

- "El modelo descubre la verdad del centro".
- "El computador reemplaza el campo".

## 2. Método en tres capas

**Decir:**

> Para ordenar el problema separo tres capas: ambiente, decisión y visibilidad. El punto no es complicar la ciudad, sino mostrar que caminar no depende solo de distancia o tiempo.

**Puente sencillo:**

- Ambiente: aire, ruido, densidad.
- Decisión: cada perfil prioriza distinto.
- Visibilidad: orientarse, exponerse o sentirse observado.

## 3. Mapa del caso

**Decir:**

> El corredor se convierte en 9 nodos y 13 ejes, cruzados con 4 franjas horarias: peak_am, midday, peak_pm y night. Eso da 36 celdas nodo×franja sobre las que la matriz de colapso se evalúa una a una. No agota la ciudad: es una maqueta crítica con resolución suficiente para preguntar dónde se concentra la presión.

## 4. Lugares y tensiones

**Decir:**

> Cada punto tiene una lógica distinta. Una estación no se camina igual que una plaza, un corredor comercial o un lugar patrimonial. Por eso no basta con hablar del "centro" como una sola cosa.

## 5. Perfiles de caminante

**Decir:**

> Los perfiles no son personas reales. Son lentes comparativos: turista, comprador, trabajador, vendedor, movilidad reducida. Sirven para ver si el mismo espacio ofrece más libertad a unos que a otros.

## 6. Horas y presión

**Decir:**

> La ciudad cambia con la hora. La criminalidad de comuna 10 muestra una estructura mensual marcada (mediana ~186 casos/mes, con meses pico muy por encima del p75). El campo proyecta esa serie a franjas horarias usando pesos documentados, y declara explícitamente el supuesto: "C1 evaluado sobre la mediana mensual" produce un escenario conservador. Cualquier cambio de supuesto se reporta antes de leer la matriz.

## 7. Simulación exploratoria

**Decir:**

> Simular no es demostrar la realidad. Es ensayar escenarios controlados. Si el modelo dice que una zona se vuelve crítica, eso no es una conclusión final: es una prioridad para ir a observar y para preguntar.

## 8. Pulso de 24 horas

**Decir:**

> La calle tiene ritmos. El campo capturó esa variación con conteos, encuestas y videos POV; la torre HPC procesa los videos para extraer saturación material por franja. Hoy hay 16 videos con saturación medida y 34 fotos asignadas a nodo×franja.

## 9. Prueba de estrés

**Decir:**

> Este número grande no significa que el corredor aguante o no aguante 500 mil personas. Es una prueba de estrés del modelo para saber cuándo la simulación se vuelve inestable. El colapso del que habla esta tesis es otra cosa: no es un umbral computacional, es una franja-evento donde convergen criminalidad, miedo declarado, evitación práctica y saturación visible.

## 10. Límites del modelo

**Decir:**

> Aquí está la autocrítica central: una simulación puede ser precisa internamente y aun así no estar validada empíricamente. El campo se hizo, la matriz `collapse_matrix.json` ya existe y se puede inspeccionar celda por celda. Tras la oleada 5 (incorporación de Jacob como segundo observador) reporta **0 celdas en colapso 3-de-4, 6 celdas en fricción acumulada y 30 celdas inconcluyentes** por cobertura insuficiente. La categoría se sostiene como definición operacional; el campo todavía no produce instancias confirmadas. Eso no es un fracaso: es la regla de falsabilidad funcionando.

## 11. Ambiente urbano

**Decir:**

> El ruido y el aire importan porque caminar también es respirar, escuchar y resistir estímulos. Pero sus magnitudes deben medirse en campo antes de hacer afirmaciones fuertes.

## 12. Visibilidad

**Decir:**

> Ver y sentirse visto cambia la experiencia urbana. El análisis espacial aproxima exposición y orientación, pero debe cruzarse con preguntas a peatones reales.

## 13. Comercio y atracción

**Decir:**

> El comercio atrae recorridos y permanencias. La tesis no lo trata como problema moral, sino como fuerza urbana que organiza trayectorias.

## 14. Historia

**Decir:**

> El corredor no es estático. La comparación histórica es una aproximación para mostrar cambio, no una reconstrucción histórica total.

## 15. Evidencia y faltantes

**Decir:**

> Esta es una de las slides más importantes y la actualizamos contra el JSON real. Tras la oleada 5 (Jacob como segundo observador, bootstrap de sensibilidad y cross-validation visual):
>
> - **C1 (criminalidad horaria)**: post-fix C1 del 2026-05-07, `build_collapse_matrix.py` respeta el bloque precomputado `c1_high_by_window` (corte p75 por franja sobre la serie histórica MEData). Las cuatro franjas quedan activas para el corredor.
> - **C2 (seguridad percibida)**: 0 / 36 celdas con dato volcado al CSV agregado. Sigue siendo el cuello de botella número uno.
> - **C3 (entrevistas codificadas)**: ahora con el aporte de Jacob entran las primeras codificaciones (Andrés en sub-zona Coltejer-Ayacucho, gradiente intra-Junín, plaza_botero, etc.). Sigue siendo cobertura parcial.
> - **C4 (saturación de video)**: 16 registros procesados; el **pasaje_la_bastilla queda rescatado** con 12 fotos reasignadas. Sub-zonas Coltejer-Ayacucho y "calle del consumo" siguen vacías y se reportan como límite de muestreo.
>
> Resultado de la regla 3-de-4 post-oleada 5: **0/36 colapsos confirmados, 6/36 fricción acumulada, 30/36 inconcluyentes**.
>
> **Dos pilares defendibles** que sobreviven al bootstrap de sensibilidad (1000 iteraciones × 25 escenarios de umbrales × leave-one-out C3):
>
> - `junin_paseo|peak_am` — fricción 2/4 (C1 + C4), **share bootstrap 95.6% V1 / 88% V2**. Pilar defendible número uno.
> - `plaza_botero|midday` — fricción 2/4 (C1 + C3), **share bootstrap 97% V1 / 100% V2**. Pilar defendible número dos, sostenido además por la convergencia visual (`human_density_max=30`, la métrica más alta del corpus, valida cuantitativamente la palabra "sofocante" del campo).
>
> **Cuatro celdas frágiles, condicionales al p75 exacto** (caen por debajo del 80% al barrer p70..p90): `parque_san_antonio|midday`, `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday`. Las nombramos como hipótesis abiertas, no como hallazgos.
>
> La tesis gana rigor declarando estos números, no escondiéndolos.

## 15.a Inter-rater como fortaleza metodológica

**Decir:**

> El 5 de mayo Jacob recorrió el mismo corredor el mismo día como segundo observador independiente. Sobre los cuatro nodos coincidentes, el acuerdo binarizado de seguridad percibida da **Cohen's kappa = 0.0** — formalmente *poor agreement* en la escala Landis-Koch. Caso paradigmático: `parque_san_antonio`, donde Stev anota 4/5 (tranquilidad contemplativa, "no está rota la ventana", arte) y Jacob anota 2/5 ("paso histórico del terror", subalternos, vandalismo religioso).
>
> Dos lecturas posibles: ¿es eso un fracaso de fiabilidad, o es exactamente lo que la fenomenología predice?
>
> Esta tesis sostiene la segunda. La atmósfera urbana es ineliminablemente subjetiva y depende de la sensibilidad cultivada del observador; la divergencia no contamina el dato, **es el dato**. Por eso la matriz no descansa sobre un solo observador: triangula con C1 (criminalidad oficial), C3 (testimonio in-situ de quien habita la celda) y C4 (saturación visual objetivable). Cuando dos AF divergen, el habitante desempata. Eso es la fenomenología funcionando, no rompiéndose.
>
> Decisión metodológica: todo nodo con divergencia binaria pasa a bandera "fenomenológicamente disputado" y exige al menos una entrevista C3 para resolución.

## 15.b Validación cruzada texto-imagen

**Decir:**

> La oleada 5 también cruzó cada reclamo cuantificable del campo contra los agregados YOLO calculados en HPC **antes de leer las narrativas**. La imagen confirma cuantitativamente lo que el campo narra, donde el pipeline tiene capacidad para verlo:
>
> - "Riesgo vial alto en `san_antonio_metro|peak_am`" del campo coincide con `vehicle_intensity = 0.378`, **el máximo de todo el corpus**.
> - "Plaza Botero / Berrío sofocante" del campo coincide con `human_density_max = 30` y `saturation_max = 71`, **las métricas más altas del corpus**. Esta es la convergencia más fuerte texto↔imagen del estudio.
> - Junín — la divergencia Stev ("comercio casi nulo") vs Jacob ("heterotópico") se disuelve en datos: 0 hits de comida callejera (apoya a Stev) pero 240 maletas + 102 bolsos en peak_am (apoya a Jacob). Ambos describen facetas reales del mismo nodo.
>
> Donde no hay convergencia es por **límite del pipeline**, no por contradicción del campo: YOLO COCO no detecta uniformes, indigencia, consumo ni grafiti. Eso se reporta como TODO de pipeline, no como debilidad del reclamo. Y `parque_san_antonio` aún no tiene bucket visual asignado: tarea HPC pendiente.

## 16. Cierre crítico y agenda real

**Decir:**

> La contribución actual no es decir "ya resolvimos el centro". Es dejar (a) un modelo trazable y reproducible, (b) un campo cumplido y multimodal con dos observadores independientes y triangulación texto↔imagen, (c) una matriz de colapso que ya corre y que hoy reporta cero instancias 3-de-4 pero **dos pilares 2/4 robustos al bootstrap**, y (d) una categoría —el colapso fenomenológico— definida con suficiente exigencia para fallar.
>
> **Agenda real para cerrar el ciclo, no aspiracional:**
>
> 1. **C2 — encuesta de seguridad percibida**: volcar los formularios capturados en campo a `field_observations_aggregate.csv`. Sin esto ninguna celda puede pasar de 2/4 a 3/4.
> 2. **Sub-zonas vacías — Coltejer-Ayacucho y "calle del consumo"**: muestreo dirigido. Estas sub-zonas no surgieron del modelo: surgieron del campo (Andrés-Jacob las nombra, Stev las nombra) y su vacío en el corpus es evidencia de sesgo de muestreo, no de inexistencia del fenómeno.
> 3. **Audio — entrevistas verbales codificadas**: los archivos de audio de los videos POV son ruido ambiental, no entrevistas. Falta capturar entrevistas verbales con protocolo y codificarlas `*.coded.json`.
>
> Si tras esa agenda algunas celdas saltan al umbral 3-de-4, lo decimos con todas sus condiciones a la vista. Si no saltan, lo decimos también.

## Preguntas difíciles y respuesta corta

### ¿Entonces la tesis está incompleta?

No incompleta: está honestamente delimitada. Tiene marco, pipeline corriendo, simulación, campo realizado e ingerido parcialmente, anexos y trazabilidad. La triangulación final está bloqueada por dos huecos identificados (encuesta C2 sin volcar a CSV, transcripciones escritas C3 sin codificar). C1 ya fue resuelto el 2026-05-07 con el fix que respeta `c1_high_by_window` precomputado. Cualquier afirmación de colapso depende de cerrar C2 y C3.

### ¿Qué es exactamente el colapso fenomenológico?

Una **franja-evento** —una hora en un nodo concreto— donde convergen al menos tres de cuatro condiciones independientes: criminalidad por encima del percentil 75, seguridad percibida ≤ 2/5, habitabilidad declarada negativa en entrevistas y saturación material alta en videos. Si solo se cumplen una o dos, no es colapso: es fricción acumulada. La regla 3-de-4 es deliberadamente exigente y hoy no se cumple en ninguna celda.

### ¿No haber encontrado colapso significa que la tesis falla?

No. Significa que la regla funciona. Una hipótesis que no puede fallar no es científica. La matriz, hoy, falsa la afirmación sustantiva de colapso y simultáneamente confirma la falsabilidad de la categoría. La defensa pública distingue claramente "categoría operacional sostenida" de "instancia empírica confirmada".

### ¿Por qué medir el colapso con cuatro fuentes y no con una?

Porque cada fuente, sola, tiene un sesgo conocido: la criminalidad tiene subregistro, la encuesta depende del momento, la entrevista tiene deseabilidad social, el video no captura el afecto. La triangulación no elimina los sesgos; los obliga a coincidir.

### ¿Qué hallazgo material defendible hay hoy?

**Dos pilares, no uno** (post-oleada 5):

- `junin_paseo|peak_am` con C1+C4, share bootstrap **95.6% V1 / 88% V2**.
- `plaza_botero|midday` con C1+C3, share bootstrap **97% V1 / 100% V2**, y además respaldado por la métrica visual más alta del corpus (`human_density_max=30`, `saturation_max=71`).

Ambos son **fricción acumulada documentada**, no colapso. Para hablar de colapso 3-de-4 faltaría que C2 (encuesta) marque condición en esas mismas celdas.

### ¿Por qué un kappa = 0 entre los dos observadores no descalifica todo?

Porque la atmósfera urbana es ineliminablemente subjetiva y eso es exactamente lo que la fenomenología predice. La divergencia entre Stev y Jacob en `parque_san_antonio` (4/5 vs 2/5) no es ruido: es dato. La triangulación con C1, C3 y C4 está diseñada precisamente para esto — no para eliminar la subjetividad sino para obligarla a coincidir con anclajes independientes.

### ¿Qué pasa si se mueve el umbral p75?

El bootstrap de sensibilidad lo dice celda a celda: dos pilares sobreviven al barrido p70..p90 (Junín peak_am y Botero midday); cuatro celdas son **frágiles condicionales** al p75 exacto (`parque_san_antonio|midday`, `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday`) y se reportan como tales.

### ¿Por qué hay sub-zonas definidas que no se muestrearon?

Coltejer-Ayacucho y "calle del consumo" surgen del campo, no del modelo: Jacob las nombra a partir de la entrevista a Andrés (vendedor en Coltejer-Ayacucho) y Stev nombra la calle del consumo adyacente a Botero. Que el corpus visual no las cubra es evidencia de sesgo de muestreo declarado, no del fenómeno inexistente.

### ¿La cross-validation texto-imagen es post-hoc?

No en el sentido peyorativo. Las métricas YOLO se calcularon **antes** de leer las narrativas del campo. La convergencia entre `vehicle_intensity=0.378` (máximo del corpus en san_antonio_metro|peak_am) y "riesgo vial alto" del campo, o entre `human_density_max=30` (máximo del corpus en Berrío) y "Botero sofocante" del campo, no se construye para confirmar; se observa después. Eso no es prueba causal pero sí descarta el azar.

### ¿Qué no se debe afirmar?

- Que el corredor ya está calibrado empíricamente.
- Que los agentes son personas reales.
- Que el stress test es capacidad urbana real.
- Que ruido o PM2.5 simulados son mediciones oficiales del punto.
- Que existe alguna franja-nodo en colapso fenomenológico confirmado a fecha de hoy.

## Calendario para el cierre

1. **C2**: volcar la encuesta capturada en campo a `field_observations_aggregate.csv` con `security_score` por nodo×franja. Bloqueante. Sin esto, ninguna celda puede pasar de 1/4 a 3/4.
2. **C3**: recibir las transcripciones codificadas (`*.coded.json`) del colega externo y agregarlas. Mínimo prioritario: `junin_paseo|peak_am` y nodos vecinos.
3. **C1**: ya resuelto el 2026-05-07; `build_collapse_matrix.py` respeta el bloque precomputado `c1_high_by_window`.
4. **Re-correr** `build_collapse_matrix.py` cuando entren C2/C3 y rehacer la slide 15 con los conteos finales.

## Cierre oral recomendado

> Esta presentación no cierra el centro de Medellín como objeto resuelto. Lo deja abierto de una manera más rigurosa: con hipótesis visibles, una categoría operacional —el colapso fenomenológico— que se deja medir sin dejarse reducir, un campo realizado con cuatro fuentes independientes, y una matriz de triangulación que ya corre y que hoy dice, celda por celda, que la evidencia no alcanza para afirmar colapso. Esa honestidad es la tesis.

---

**Nota (2026-05-07, post-fix C1):** la inconsistencia previa de C1 quedó resuelta. `build_collapse_matrix.py` ahora respeta `c1_high_by_window` precomputado en `c1_hourly_projection.json` en lugar de reevaluar contra la mediana mensual.

**Nota (2026-05-08, post-oleada 5):** se incorpora a Jacob como segundo observador (kappa=0.0 sobre 4 nodos coincidentes), bootstrap de sensibilidad (1000 iteraciones × 25 escenarios × LOO C3) y cross-validation texto-imagen. La matriz post-oleada 5 muestra **0/36 colapso, 6/36 fricción acumulada y 30/36 inconcluyente**. Hay **dos pilares defendibles**: `junin_paseo|peak_am` (C1+C4, bootstrap 95.6%) y `plaza_botero|midday` (C1+C3, bootstrap 97%). Cuatro celdas frágiles condicionales al p75 exacto (parque_san_antonio|midday, san_antonio_metro|peak_am, junin_paseo|midday, parque_berrio|midday). Pasaje_la_bastilla rescatado con 12 fotos; sub-zonas Coltejer-Ayacucho y calle-del-consumo siguen vacías y se reportan como límite de muestreo.
