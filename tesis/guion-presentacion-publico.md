# Guion de presentación para público general

Fecha: 7 de mayo de 2026.  
Uso: apoyo oral para el deck React de 16 slides.  
Regla: hablar claro, no inventar resultados de campo, y repetir la distinción **evidencia pública / simulación / campo capturado e ingerido**. La matriz de colapso ya existe pero está deliberadamente austera: hoy no hay celdas en colapso 3-de-4 confirmado, y eso forma parte del argumento.

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

> Aquí está la autocrítica central: una simulación puede ser precisa internamente y aun así no estar validada empíricamente. El campo se hizo, la matriz `collapse_matrix.json` ya existe y se puede inspeccionar celda por celda. Hoy reporta 0 celdas en colapso 3-de-4, 1 celda en fricción acumulada y 32 celdas inconcluyentes por cobertura insuficiente. La categoría se sostiene como definición operacional; el campo todavía no produce instancias confirmadas. Eso no es un fracaso: es la regla de falsabilidad funcionando.

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

> Esta es una de las slides más importantes y la actualizamos contra el JSON real. Hoy:
>
> - **C1 (criminalidad horaria)**: serie mensual disponible globalmente; bajo el supuesto conservador (mediana mensual), ninguna franja cruza el p75 horario por nodo. El supuesto se declara en voz alta.
> - **C2 (seguridad percibida)**: 0 / 36 celdas con dato. La encuesta fue capturada en campo pero todavía no está ingerida en `field_observations_aggregate.csv`. Es el cuello de botella número uno.
> - **C3 (entrevistas codificadas)**: 0 / 36 celdas con dato. Solo un transcript tiene testimonio sustantivo (plaza_botero); los demás videos son ruido ambiental, no entrevistas. La codificación `*.coded.json` está pendiente del colega externo.
> - **C4 (saturación de video)**: 16 registros procesados, 4 celdas con n≥2. Único hallazgo material defendible: `junin_paseo|peak_am` con saturación p75=0.465 sobre p75 global de 0.413.
>
> Resultado de la regla 3-de-4 hoy: 0 colapsos confirmados, 1 fricción acumulada (Junín, mañana), 3 flujos ordinarios y 32 celdas inconcluyentes por cobertura. La tesis gana rigor declarando estos números, no escondiéndolos.

## 16. Cierre crítico

**Decir:**

> La contribución actual no es decir "ya resolvimos el centro". Es dejar (a) un modelo trazable y reproducible, (b) un campo cumplido y multimodal, (c) una matriz de colapso que ya corre y que hoy reporta cero instancias confirmadas, y (d) una categoría —el colapso fenomenológico— definida con suficiente exigencia para fallar. Si la matriz dice que ninguna celda colapsa, lo decimos. Si tras cerrar C2 y C3 algunas celdas saltan al umbral, también, con todas sus condiciones a la vista.

## Preguntas difíciles y respuesta corta

### ¿Entonces la tesis está incompleta?

No incompleta: está honestamente delimitada. Tiene marco, pipeline corriendo, simulación, campo realizado e ingerido parcialmente, anexos y trazabilidad. La triangulación final está bloqueada por dos huecos identificados (encuesta C2 sin volcar a CSV, transcripciones C3 sin codificar) y por un supuesto declarado en C1 (mediana mensual). Cualquier afirmación de colapso depende de cerrar al menos esos tres frentes.

### ¿Qué es exactamente el colapso fenomenológico?

Una **franja-evento** —una hora en un nodo concreto— donde convergen al menos tres de cuatro condiciones independientes: criminalidad por encima del percentil 75, seguridad percibida ≤ 2/5, habitabilidad declarada negativa en entrevistas y saturación material alta en videos. Si solo se cumplen una o dos, no es colapso: es fricción acumulada. La regla 3-de-4 es deliberadamente exigente y hoy no se cumple en ninguna celda.

### ¿No haber encontrado colapso significa que la tesis falla?

No. Significa que la regla funciona. Una hipótesis que no puede fallar no es científica. La matriz, hoy, falsa la afirmación sustantiva de colapso y simultáneamente confirma la falsabilidad de la categoría. La defensa pública distingue claramente "categoría operacional sostenida" de "instancia empírica confirmada".

### ¿Por qué medir el colapso con cuatro fuentes y no con una?

Porque cada fuente, sola, tiene un sesgo conocido: la criminalidad tiene subregistro, la encuesta depende del momento, la entrevista tiene deseabilidad social, el video no captura el afecto. La triangulación no elimina los sesgos; los obliga a coincidir.

### ¿Qué hallazgo material defendible hay hoy?

Uno solo, sobrio: `junin_paseo|peak_am` cumple C4 (saturación de video sobre p75) con n=4 registros, p75=0.465 y max=0.474. Eso es **fricción acumulada matinal documentada**, no colapso. Para hablar de colapso ahí faltaría que C2 y/o C3 también marquen condición en esa misma celda.

### ¿Qué no se debe afirmar?

- Que el corredor ya está calibrado empíricamente.
- Que los agentes son personas reales.
- Que el stress test es capacidad urbana real.
- Que ruido o PM2.5 simulados son mediciones oficiales del punto.
- Que existe alguna franja-nodo en colapso fenomenológico confirmado a fecha de hoy.

## Calendario para el cierre

1. **C2**: volcar la encuesta capturada en campo a `field_observations_aggregate.csv` con `security_score` por nodo×franja. Bloqueante. Sin esto, ninguna celda puede pasar de 1/4 a 3/4.
2. **C3**: recibir las transcripciones codificadas (`*.coded.json`) del colega externo y agregarlas. Mínimo prioritario: `junin_paseo|peak_am` y nodos vecinos.
3. **C1**: decidir y documentar la política definitiva (mediana vs. mes pico) antes de re-correr la matriz para la defensa.
4. **Re-correr** `build_collapse_matrix.py` y rehacer la slide 15 con los conteos finales.

## Cierre oral recomendado

> Esta presentación no cierra el centro de Medellín como objeto resuelto. Lo deja abierto de una manera más rigurosa: con hipótesis visibles, una categoría operacional —el colapso fenomenológico— que se deja medir sin dejarse reducir, un campo realizado con cuatro fuentes independientes, y una matriz de triangulación que ya corre y que hoy dice, celda por celda, que la evidencia no alcanza para afirmar colapso. Esa honestidad es la tesis.

---

**Nota condicional (2026-05-07):** mientras se redacta este guion, otro flujo de trabajo está revisando la inconsistencia de C1 (la matriz dice `c1_high_by_window: all true` pero ninguna celda termina con `C1_crime_high: true` porque el motor recalcula sobre la mediana mensual). Si tras el fix la matriz post-corrección muestra X celdas en colapso o en zona gris 2/4, las secciones 10, 15, 16 y las "Preguntas difíciles" deben re-actualizarse antes de la defensa con los conteos nuevos y reemplazar el hallazgo único de Junín por la lista actualizada.
