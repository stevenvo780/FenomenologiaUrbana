# Preguntas previsibles de defensa y respuestas sobrias

Uso: apoyo para el examen oral. Cada respuesta ≤ 6 líneas, sin meta-narrativa de proceso.

---

## Estado y números actuales

### Q1. ¿Cuál es el estado actual de la matriz de colapso?

La matriz `collapse_matrix.json` reporta **0/36 celdas en colapso 3-de-4, 6/36 en fricción acumulada (2/4) y 30/36 inconcluyentes** por cobertura < 2 fuentes con dato. Dos pilares defendibles: `junin_paseo|peak_am` (C1+C4) y `plaza_botero|midday` (C1+C3). Cuatro celdas frágiles condicionales al p75 exacto: `parque_san_antonio|midday`, `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday`. Validación empírica completa pendiente de cerrar C2 y C3.

### Q2. ¿Qué hallazgo material defendible hay hoy?

Dos pilares 2/4, ambos sobrevivientes al bootstrap de sensibilidad: `junin_paseo|peak_am` con C1+C4 (share V1=95.6%, V2=88%) y `plaza_botero|midday` con C1+C3 (V1=97%, V2=100%), este último respaldado por las métricas visuales más altas del corpus (`human_density_max=30`, `saturation_max=71`). Son **fricción acumulada documentada**, no colapso. Para hablar de colapso 3-de-4 faltaría que C2 marque condición en esas mismas celdas.

---

## Operacionalización y rigor

### Q3. ¿Qué es exactamente el colapso fenomenológico y cómo se mide?

Una franja-evento (nodo × hora) donde convergen al menos **tres de cuatro** condiciones independientes: C1 criminalidad MEData > p75 horario, C2 seguridad percibida ≤ 2/5, C3 codificación dominante de habitabilidad negativa en entrevistas, C4 saturación material en video POV > p75. La regla 3-de-4 es deliberadamente exigente: impide que un dato suelto se vuelva diagnóstico.

### Q4. ¿Por qué un kappa = 0 entre observadores no descalifica todo?

Porque la atmósfera urbana es ineliminablemente subjetiva y eso es exactamente lo que la fenomenología predice. La divergencia Stev/Jacob en `parque_san_antonio` (4/5 vs 2/5) no es ruido: es dato. La triangulación con C1, C3 y C4 está diseñada precisamente para esto — no eliminar la subjetividad sino obligarla a coincidir con anclajes independientes. Una tesis fenomenológica con kappa alto sería sospechosa de haber estandarizado la mirada.

### Q5. ¿Qué pasa si se mueve el umbral p75?

El bootstrap responde celda a celda: 1000 iteraciones × 25 combinaciones (p70..p90 en C1 × C4) × LOO C3. Dos pilares sobreviven al barrido: `junin_paseo|peak_am` y `plaza_botero|midday`. Cuatro celdas son **frágiles condicionales** al p75 exacto (V2≈0.40) y se reportan como hipótesis abiertas, no hallazgos. El bootstrap no salva los pilares de la fragilidad; la **identifica**, y eso es la sensibilidad funcionando.

### Q6. La cross-validation texto↔imagen, ¿no es post-hoc?

No en el sentido peyorativo. Las métricas YOLO se calcularon **antes** de leer las narrativas del campo. Resultados: convergencia alta en `san_antonio_metro|peak_am` (riesgo vial ↔ `vehicle_intensity=0.378`, máximo del corpus) y "Botero sofocante" (↔ `human_density_max=30`, `saturation_max=71`). Convergencia ≠ confirmación causal: descarta el azar, no demuestra causalidad. El reclamo es exactamente ese: convergencia inter-method donde el pipeline puede ver, delimitación honesta donde no.

### Q7. ¿Qué evita que el modelo sea una caja negra?

La trazabilidad: scripts versionados, JSON de salida inspeccionables, tabla de variables, fuentes públicas, anexos de reproducibilidad y bootstrap de sensibilidad. Los resultados se clasifican explícitamente como defendibles, frágiles o inconcluyentes. La matriz se inspecciona celda por celda con `inspect_matrix.py`.

---

## Filosofía

### Q8. ¿Por qué la fenomenología sola no basta?

Porque dos observadores formados producen kappa = 0 sobre el mismo corredor el mismo día. Si la atmósfera no se estabiliza con una sola mirada, una tesis fenomenológica honesta tiene que triangular: C1 (criminalidad oficial, exterior al observador), C3 (testimonio del habitante de la celda) y C4 (saturación visual objetivable). La fenomenología provee la pregunta y el marco; sin anclaje empírico-computacional colapsa en impresionismo.

### Q9. ¿Por qué mezclar fenomenología con computación?

La fenomenología (Husserl, Merleau-Ponty, Lefebvre) impide reducir la ciudad a flujo o tiempo de viaje. La computación traduce esa preocupación a variables discutibles —ruido, densidad, riesgo, permanencia, visibilidad, libertad relativa— y permite reproducibilidad. No es eclecticismo: es la única forma de someter una categoría experiencial (la atmósfera) a falsación.

### Q10. ¿No encontrar colapso significa que la tesis falla?

No. Falla la **afirmación fuerte** ("hay colapso en X celda"), no la tesis. Una hipótesis que no puede fallar no es científica. La tesis sostiene cuatro contribuciones independientes: marco teórico actualizado, pipeline HPC reproducible, campo multimodal capturado bajo protocolo, y categoría operacional falsable. Las tres primeras se sostienen con o sin instancias confirmadas; la cuarta se somete a prueba y, en su primera evaluación, no se confirmó. Eso es exactamente la propiedad que distingue ciencia de retórica.

### Q11. ¿El modelo mide la conciencia o los qualia urbanos?

No. Los agentes son tipos analíticos simplificados; los perfiles (turista, comprador, trabajador, vendedor, movilidad reducida) son lentes comparativos, no sujetos reales. La tesis no afirma que una red neuronal experimente: usa perfiles y costos para comparar restricciones bajo supuestos explícitos, y deja la dimensión experiencial al campo (entrevistas, observación participante).

---

## Limitaciones

### Q12. ¿Qué datos faltan para cerrar la brecha empírica?

**C2** (encuesta de seguridad percibida) sigue en 0/36 celdas con dato volcado al CSV agregado: la captura existe pero falta agregar. **C3** (entrevistas codificadas) tiene cobertura parcial; faltan transcripciones en `*.coded.json` para nodos clave. Cerrar ambos es bloqueante para mover celdas de 2/4 a 3/4. C1 y C4 ya están operativos para todo el corredor.

### Q13. ¿Por qué los videos no aportan testimonio verbal?

Los videos POV se diseñaron para **saturación material** (densidad visible de personas, vehículos, mobiliario), no testimonio. Su pista de audio es ruido ambiental urbano sin protocolo entrevistable. Las entrevistas verbales son un instrumento separado; confundir las dos pistas sería metodológicamente impropio. C3 sigue parcial no porque falten videos sino porque faltan transcripciones codificadas con protocolo.

### Q14. ¿Por qué hay sub-zonas definidas que no se muestrearon?

Coltejer-Ayacucho y "calle del consumo" surgen del campo, no del modelo: Jacob las nombra a partir de la entrevista a Andrés (vendedor), Stev nombra la calle adyacente a Botero. Que el corpus visual no las cubra es **evidencia de sesgo de muestreo declarado**, no inexistencia del fenómeno. Una tesis que silenciara las sub-zonas para evitar el vacío sería peor que una que las nombra como límite.

### Q15. ¿Qué pasa con las 30 celdas "inconcluyente"? ¿Son zonas tranquilas?

No. "Inconcluyente" significa cobertura < 2 fuentes con dato; es un veredicto sobre la base de evidencia, no sobre la celda. Confundir "sin dato suficiente" con "tranquilo" sería el error metodológico simétrico al de afirmar colapso sin evidencia. Refleja límite de cobertura del campo, no ausencia de fenómeno.

---

## Aplicación

### Q16. ¿Qué no debe afirmarse en la sustentación?

- Que el corredor está calibrado empíricamente.
- Que 500k agentes es capacidad urbana real.
- Que los perfiles simulados son sujetos reales.
- Que ruido y PM2.5 simulados son mediciones normativas.
- Que existe alguna franja-nodo en colapso fenomenológico confirmado.
- Que la cross-validation texto↔imagen es prueba causal.
