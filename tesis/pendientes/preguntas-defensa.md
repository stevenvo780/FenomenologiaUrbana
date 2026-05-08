# Preguntas previsibles de defensa y respuestas sobrias

Fecha: 25 de abril de 2026. Última actualización: 7 de mayo de 2026 (post-oleada 1 de ingesta de campo).

## 1. ¿La tesis ya está validada en campo?

El campo se realizó antes del 6 de mayo de 2026 y la primera oleada de ingesta ya corrió. La tesis está en fase **`field_ingest_in_progress`** con números concretos sobre la mesa:

- **C1 (criminalidad)**: serie mensual disponible globalmente; proyectada a franjas horarias bajo supuesto declarado (mediana mensual = 186 casos/mes).
- **C2 (encuesta de seguridad percibida)**: 0 / 36 celdas con dato volcado; la captura existe en campo pero no está agregada a `field_observations_aggregate.csv`.
- **C3 (entrevistas codificadas)**: 0 / 36 celdas con dato. Solo **1 transcript con testimonio sustantivo** (plaza_botero); los demás archivos de audio/video son ruido ambiental, no entrevistas.
- **C4 (saturación de video)**: **16 video_saturation procesados** en HPC, 4 celdas con n≥2; **34 fotos asignadas** a nodo×franja.
- **Matriz `collapse_matrix.json` corriendo**: 0 colapsos 3-de-4, 0 zona gris 2/4, **1 fricción acumulada (`junin_paseo|peak_am` por C4)**, 3 flujos ordinarios y 32 inconcluyentes por cobertura < 2.

La validación empírica completa depende de cerrar C2 (volcado de encuesta), C3 (codificación externa) y formalizar el supuesto de C1.

## 2. ¿Por qué usar simulación si falta campo?

Porque la simulación organiza hipótesis, hace explícitos supuestos y permite identificar qué variables deben medirse. No sustituye el campo; lo prepara y lo vuelve más auditable.

## 3. ¿Qué evita que el modelo sea una caja negra?

La trazabilidad: scripts, JSON de salida, tabla de variables, fuentes públicas, anexos de reproducibilidad y sensibilidad. Los resultados se clasifican como defendibles, parciales o no sostenibles, y la matriz se inspecciona celda por celda con `inspect_matrix.py`.

## 4. ¿Por qué mezclar fenomenología con computación?

La fenomenología impide reducir la ciudad a flujo o tiempo de viaje. La computación traduce esa preocupación a variables discutibles: ruido, densidad, riesgo, permanencia, visibilidad y libertad relativa de ruta.

## 5. ¿El modelo mide la conciencia o los qualia urbanos?

No. Los agentes son tipos analíticos simplificados. La tesis no afirma que una red neuronal experimente; usa perfiles y costos para comparar restricciones bajo supuestos explícitos.

## 6. ¿Qué datos faltan para cerrar la brecha empírica?

Conteos peatonales, permanencia, flujo direccional, ruido puntual, iluminación, seguridad percibida, obstáculos y puntos de decisión en los nueve nodos y cuatro franjas horarias. En términos de matriz: C2 y C3 son los huecos cuantificables hoy.

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
- que existe alguna franja-nodo en colapso fenomenológico confirmado a fecha de hoy (la matriz reporta 0 / 36).

## 11. ¿Qué es exactamente el colapso fenomenológico y cómo se mide?

Es una franja-evento (nodo × hora) donde convergen al menos tres de cuatro condiciones independientes: criminalidad MEData por encima del percentil 75 mensual de su serie, seguridad percibida ≤ 2/5 en encuesta breve situada, codificación dominante de habitabilidad declarada negativa en entrevistas (`EVITABLE` / `NO_DESEABLE` / `DIFICIL_DE_VIVIR`) y saturación material por encima del percentil 75 en videos POV procesados en GPU. La regla 3-de-4 es deliberadamente exigente; impide que un dato suelto se vuelva diagnóstico. La definición completa vive en `tesis/pendientes/colapso-fenomenologico.md`.

## 12. ¿Qué pasa si la matriz de colapso sale vacía?

Es exactamente lo que ocurre hoy: 0 / 36 celdas en 3-de-4. La tesis lo reporta así. La categoría queda definida y operacionalizada pero sin instancias confirmadas; eso fortalece el rigor metodológico aunque debilite la afirmación sustantiva. El colapso fenomenológico es una hipótesis falsable y, en su primera evaluación empírica, no se confirmó. Esa es justamente la propiedad que distingue ciencia de retórica.

## 13. ¿No encontrar colapso entonces equivale a que la tesis falla?

No. Falla la **afirmación fuerte** ("hay colapso en X celda"), no la tesis. La tesis sostiene cuatro contribuciones independientes: (i) marco teórico actualizado con nueve referencias 2020-2025 (Arellana, Rodriguez-Valencia, Soto, Quistberg, Heroy, Velásquez Ocampo, Kinkaid, Garcia, Peden), (ii) pipeline HPC reproducible, (iii) campo multimodal capturado bajo protocolo y (iv) categoría operacional falsable con regla 3-de-4. La cuarta es la que se somete a prueba; las tres primeras se sostienen con o sin instancias de colapso. Una categoría que **podía** fallar y **no falló trivialmente** (porque sí encontró fricción acumulada en Junín peak_am) es más defendible que una categoría que confirma todo lo que toca.

## 14. Hubo una inconsistencia detectada en C1 entre `c1_high_by_window` y `C1_crime_high` por celda. ¿Cómo se resolvió?

Sí, se detectó en la validación del 7 de mayo de 2026. El bloque global de C1 reportaba `{peak_am, midday, peak_pm, night} = true` pero ninguna celda de la matriz terminaba con `C1_crime_high: true`. La causa, documentada en `tesis/pendientes/colapso-validacion-2026-05-07.md` §2, es que `build_collapse_matrix.py` (líneas 252-268) reevalúa C1 por franja usando `recent_avg = c1.median_month` (186 casos/mes) y compara contra el p75 horario por franja: con la mediana ningún mes "promedio" cruza el umbral. Si se usara `max_month` (1707) o el promedio de meses ya marcados sobre p75 (62 meses), las cuatro franjas saltarían a `true`. Decisión documentada antes de la defensa: declarar explícitamente el supuesto "C1 evaluado sobre la mediana mensual" como escenario conservador, o presentar dos lecturas etiquetadas (mediana vs. mes pico) y discutir cuál es defendible para el corredor estudiado. Anticiparse al jurado en este punto evita que la inconsistencia parezca un descuido.

## 15. ¿Por qué los videos no aportan testimonio verbal? ¿No deberían incluir entrevistas grabadas?

Los videos POV se diseñaron para capturar **saturación material** (densidad visible de personas, vehículos, mobiliario, vendedores), no testimonio. Su pista de audio es ruido ambiental urbano (tráfico, comercio, voces cruzadas) y no constituye corpus entrevistable. Las entrevistas verbales son un instrumento separado del protocolo de campo; de ese instrumento, hoy hay **un solo transcript con testimonio sustantivo** (plaza_botero). El resto de archivos audiovisuales son material C4 (visión por computadora) o material descartado por baja inteligibilidad. Confundir las dos pistas sería metodológicamente impropio: cada fuente tiene su instrumento, su umbral y su sesgo declarado. Por eso C3 sigue en 0 / 36: no porque falten videos, sino porque faltan transcripciones de entrevistas codificadas.

## 16. ¿Qué hallazgo material defendible hay hoy?

Exactamente uno, y se nombra en voz alta: `junin_paseo|peak_am` cumple C4 con n=4 registros de video, saturación p75=0.465 y max=0.474, sobre un p75 global de 0.413. Eso es **fricción acumulada matinal** (1/4 con cobertura ≥ 2), no colapso fenomenológico. La narrativa correcta para el jurado: "Junín en la mañana muestra fricción material documentada en video; pendiente convergencia con C2 (encuesta) y C3 (entrevistas) para hablar de colapso". Es modesto y trazable.

## 17. ¿Qué pasa con las 32 celdas "inconcluyente"? ¿Son zonas tranquilas?

No. "Inconcluyente" significa cobertura < 2 fuentes con dato; no es un veredicto sobre la celda, es un veredicto sobre la base de evidencia. Confundir "sin dato suficiente" con "sin colapso" sería un error metodológico simétrico al de afirmar colapso sin evidencia. De forma análoga, las 3 celdas en `flujo_ordinario` (san_antonio_metro|peak_am, junin_paseo|midday, parque_berrio|midday) tienen exactamente dos fuentes (C1 proyectado y C4 video) marcando 0; son contraste empírico útil, no certificado de tranquilidad.

---

**Nota condicional (2026-05-07):** un flujo paralelo está corrigiendo la inconsistencia C1 descrita en Q14. Si tras el fix la matriz post-corrección muestra **X celdas en colapso 3-de-4** o en zona gris 2/4, las preguntas 1, 12, 13, 16 y 17 deben re-actualizarse antes de la defensa con los nuevos conteos, y la respuesta de Q14 debe pasar de "inconsistencia identificada y declarada" a "inconsistencia corregida; supuesto vigente: <el que quede>".
