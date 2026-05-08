# Guion de presentación para público general

Fecha: 7 de mayo de 2026.  
Uso: apoyo oral para el deck React de 16 slides.  
Regla: hablar claro, no inventar resultados de campo, y repetir la distinción **evidencia pública / simulación / campo realizado en ingesta**.

## 0. Idea guía en una frase

Esta tesis estudia cómo se vive caminar un tramo del centro de Medellín. Usa datos públicos y simulación para organizar hipótesis; usa el trabajo de campo (criminalidad registrada, encuestas, entrevistas y videos) para detectar **franjas-evento de colapso fenomenológico**: momentos y lugares en los que habitar el corredor se vuelve costoso.

## 1. Apertura — ¿por qué la calle?

**Decir:**

> No parto de la idea de que el centro sea simplemente “bueno” o “malo”. La pregunta es más concreta: ¿qué pasa con el cuerpo cuando camina por un corredor con transporte, comercio, ruido, vigilancia, memoria urbana y percepción de riesgo?

**Evitar:**

- “El modelo descubre la verdad del centro”.
- “El computador reemplaza el campo”.

## 2. Método en tres capas

**Decir:**

> Para ordenar el problema separo tres capas: ambiente, decisión y visibilidad. El punto no es complicar la ciudad, sino mostrar que caminar no depende solo de distancia o tiempo.

**Puente sencillo:**

- Ambiente: aire, ruido, densidad.
- Decisión: cada perfil prioriza distinto.
- Visibilidad: orientarse, exponerse o sentirse observado.

## 3. Mapa del caso

**Decir:**

> El corredor se convierte en 9 nodos y 13 ejes. Esto no agota la ciudad: es una maqueta crítica para preguntar dónde se concentra la presión y dónde faltan observaciones.

## 4. Lugares y tensiones

**Decir:**

> Cada punto tiene una lógica distinta. Una estación no se camina igual que una plaza, un corredor comercial o un lugar patrimonial. Por eso no basta con hablar del “centro” como una sola cosa.

## 5. Perfiles de caminante

**Decir:**

> Los perfiles no son personas reales. Son lentes comparativos: turista, comprador, trabajador, vendedor, movilidad reducida. Sirven para ver si el mismo espacio ofrece más libertad a unos que a otros.

## 6. Horas y presión

**Decir:**

> La ciudad cambia con la hora. La mañana, el mediodía, la tarde y la noche producen condiciones distintas para caminar. La hora no es un detalle: es donde aparece o se disuelve el colapso. La criminalidad de comuna 10 ya muestra una estructura mensual marcada y el campo intenta proyectarla a franjas horarias para cruzarla con seguridad percibida, entrevistas y video.

## 7. Simulación exploratoria

**Decir:**

> Simular no es demostrar la realidad. Es ensayar escenarios controlados. Si el modelo dice que una zona se vuelve crítica, eso no es una conclusión final: es una prioridad para ir a observar y para preguntar. Las personas a las que entrevistamos saben cuándo el centro es vivible y cuándo no; la simulación nos llevó a las preguntas correctas.

## 8. Pulso de 24 horas

**Decir:**

> La calle tiene ritmos. El objetivo de esta slide es mostrar que la experiencia peatonal no es igual durante todo el día. El campo capturó esa variación con conteos, encuestas y videos POV; la torre HPC procesa ahora los videos para extraer saturación material por franja.

## 9. Prueba de estrés

**Decir:**

> Este número grande no significa que el corredor aguante o no aguante 500 mil personas. Es una prueba de estrés del modelo para saber cuándo la simulación se vuelve inestable. El colapso del que habla esta tesis es otra cosa: no es un umbral computacional, es una franja-evento donde convergen criminalidad, miedo declarado, evitación práctica y saturación visible.

## 10. Límites del modelo

**Decir:**

> Aquí está la autocrítica central: una simulación puede ser precisa internamente y aun así no estar validada empíricamente. El campo ya se hizo, pero la matriz de colapso —el cruce de las cuatro fuentes— está en construcción. Hasta que `collapse_matrix.json` exista y se pueda inspeccionar celda por celda, la categoría queda definida y operacionalizada, no afirmada como hallazgo.

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

> Esta es una de las slides más importantes: muestra qué datos existen, qué fuentes fallaron, qué se capturó en campo y qué queda por procesar. La tesis gana rigor no por ocultar vacíos, sino por declararlos. Hoy estamos entre el campo y la matriz: tenemos los conteos, las entrevistas grabadas y los videos; falta cerrar la triangulación.

## 16. Cierre crítico

**Decir:**

> La contribución actual no es decir “ya resolvimos el centro”. Es dejar un modelo trazable, reproducible y éticamente preparado, un campo cumplido y una categoría —el colapso fenomenológico— definida con suficiente exigencia para que pueda fallar. Si la matriz dice que ninguna celda colapsa, lo decimos. Si dice que algunas sí, también, con todas sus condiciones y advertencias a la vista.

## Preguntas difíciles y respuesta corta

### ¿Entonces la tesis está incompleta?

No incompleta: está honestamente delimitada. Tiene marco, pipeline, simulación, campo realizado, anexos y trazabilidad. La triangulación final (criminalidad + encuesta + entrevista + video) está en proceso de ingesta y procesamiento GPU; cualquier afirmación de colapso depende de que termine.

### ¿Qué es exactamente el colapso fenomenológico?

Una **franja-evento** —una hora en un nodo concreto— donde convergen al menos tres de cuatro condiciones independientes: criminalidad por encima del percentil 75, seguridad percibida ≤ 2/5, habitabilidad declarada negativa en entrevistas y saturación material alta en videos. Si solo se cumplen una o dos, no es colapso: es fricción acumulada. La regla 3-de-4 es deliberadamente exigente.

### ¿Por qué medir el colapso con cuatro fuentes y no con una?

Porque cada fuente, sola, tiene un sesgo conocido: la criminalidad tiene subregistro, la encuesta depende del momento, la entrevista tiene deseabilidad social, el video no captura el afecto. La triangulación no elimina los sesgos; los obliga a coincidir.

### ¿Por qué sirve si falta cerrar la matriz?

Porque ya define qué cuenta como evidencia, qué umbrales hay que cruzar y qué decisiones se toman si la evidencia falta. El campo no fue una pesca: fue una captura dirigida a contestar una pregunta empírica formulada con anticipación.

### ¿Qué no se debe afirmar?

- Que el corredor ya está calibrado empíricamente.
- Que los agentes son personas reales.
- Que el stress test es capacidad urbana real.
- Que ruido o PM2.5 simulados son mediciones oficiales del punto.
- Que existen franjas-nodo en colapso fenomenológico antes de que la matriz exista.

## Cierre oral recomendado

> Esta presentación no cierra el centro de Medellín como objeto resuelto. Lo deja abierto de una manera más rigurosa: con hipótesis visibles, una categoría operacional —el colapso fenomenológico— que se deja medir sin dejarse reducir, un campo realizado con cuatro fuentes independientes, y una matriz de triangulación que pronto dirá, celda por celda, en qué hora y en qué lugar habitar el corredor se vuelve costoso.
