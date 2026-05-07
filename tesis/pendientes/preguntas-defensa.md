# Preguntas previsibles de defensa y respuestas sobrias

Fecha: 25 de abril de 2026.

## 1. ¿La tesis ya está validada en campo?

El campo se realizó antes del 6 de mayo de 2026. La tesis está en fase **`field_ingest_in_progress`**: hay conteos, encuestas, entrevistas, fotos, recorridos POV y videos de saturación, pero la triangulación todavía no produce `collapse_matrix.json`. La contribución actual son: un marco y pipeline exploratorio, un baseline con datos públicos y simulación, y un campo multimodal capturado bajo protocolo. La validación empírica completa depende de que la matriz quede construida y auditada.

## 2. ¿Por qué usar simulación si falta campo?

Porque la simulación organiza hipótesis, hace explícitos supuestos y permite identificar qué variables deben medirse. No sustituye el campo; lo prepara y lo vuelve más auditable.

## 3. ¿Qué evita que el modelo sea una caja negra?

La trazabilidad: scripts, JSON de salida, tabla de variables, fuentes públicas, anexos de reproducibilidad y sensibilidad. Además, los resultados se clasifican como defendibles, parciales o no sostenibles.

## 4. ¿Por qué mezclar fenomenología con computación?

La fenomenología impide reducir la ciudad a flujo o tiempo de viaje. La computación traduce esa preocupación a variables discutibles: ruido, densidad, riesgo, permanencia, visibilidad y libertad relativa de ruta.

## 5. ¿El modelo mide la conciencia o los qualia urbanos?

No. Los agentes son tipos analíticos simplificados. La tesis no afirma que una red neuronal experimente; usa perfiles y costos para comparar restricciones bajo supuestos explícitos.

## 6. ¿Qué datos faltan para cerrar la brecha empírica?

Conteos peatonales, permanencia, flujo direccional, ruido puntual, iluminación, seguridad percibida, obstáculos y puntos de decisión en los nueve nodos y cuatro franjas horarias.

## 7. ¿Qué pasa si el campo contradice el modelo?

Debe corregirlo. Esa es una condición de rigor, no un fracaso. El baseline proxy es una hipótesis organizada, no una verdad cerrada.

## 8. ¿Por qué usar Haraway?

Para justificar que la validación no es una mirada neutral desde ninguna parte. Los datos de campo dependen de posición, hora, instrumento, observador y protocolo; por eso se documentan como conocimiento situado.

## 9. ¿Qué resultado computacional es más fuerte?

La estabilidad interna del pipeline y la capacidad de comparar escenarios bajo supuestos. Lo más débil es cualquier lectura sustantiva sin sensibilidad y sin campo.

## 10. ¿Qué no debe afirmarse en la sustentación?

- que el corredor está calibrado empíricamente;
- que 500k agentes es capacidad real;
- que los perfiles simulados son sujetos reales;
- que ruido/PM2.5 simulados son mediciones normativas;
- que la tesis agotó literatura empírica reciente;
- que existen franjas-nodo en colapso fenomenológico antes de tener `collapse_matrix.json` construida.

## 11. ¿Qué es exactamente el colapso fenomenológico y cómo se mide?

Es una franja-evento (nodo × hora) donde convergen al menos tres de cuatro condiciones independientes: criminalidad MEData por encima del percentil 75 mensual de su serie, seguridad percibida ≤ 2/5 en encuesta breve situada, codificación dominante de habitabilidad declarada negativa en entrevistas (`EVITABLE` / `NO_DESEABLE` / `DIFICIL_DE_VIVIR`) y saturación material por encima del percentil 75 en videos POV procesados en GPU. La regla 3-de-4 es deliberadamente exigente; impide que un dato suelto se vuelva diagnóstico. La definición completa vive en `tesis/pendientes/colapso-fenomenologico.md`.

## 12. ¿Qué pasa si la matriz de colapso sale vacía?

Si ninguna celda alcanza la convergencia mínima, la tesis lo reporta así. La categoría queda definida y operacionalizada pero sin instancias confirmadas; eso fortalece el rigor metodológico aunque debilite la afirmación sustantiva. El colapso fenomenológico es una hipótesis falsable y el campo puede falsarla.
