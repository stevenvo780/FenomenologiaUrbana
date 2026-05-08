# Preguntas previsibles de defensa y respuestas sobrias

Fecha: 25 de abril de 2026. Última actualización: 7 de mayo de 2026 (post-oleada 1 de ingesta de campo).

## 1. ¿La tesis ya está validada en campo?

El campo se realizó antes del 6 de mayo de 2026 y la primera oleada de ingesta ya corrió. La tesis está en fase **`field_ingest_in_progress`** con números concretos sobre la mesa (post-fix C1, 2026-05-07):

- **C1 (criminalidad)**: serie histórica MEData proyectada a franjas; `c1_high_by_window` precomputado con corte p75 por franja en `c1_hourly_projection.json`. `build_collapse_matrix.py` post-fix respeta ese bloque sin reevaluar contra la mediana mensual.
- **C2 (encuesta de seguridad percibida)**: 0 / 36 celdas con dato volcado; la captura existe en campo pero no está agregada a `field_observations_aggregate.csv`.
- **C3 (entrevistas codificadas)**: 0 / 36 celdas con dato. Solo **1 transcript con testimonio sustantivo** (plaza_botero); los demás archivos de audio/video son ruido ambiental, no entrevistas.
- **C4 (saturación de video)**: **16 video_saturation procesados** en HPC, 4 celdas con n≥2; **34 fotos asignadas** a nodo×franja.
- **Matriz `collapse_matrix.json` post-fix**: 0/36 colapsos 3-de-4, **4/36 fricción acumulada** (`san_antonio_metro|peak_am`, `junin_paseo|peak_am` única 2/4 con C1+C4 (p75=0.465), `junin_paseo|midday`, `parque_berrio|midday`), 0/36 flujo ordinario y **32/36 inconcluyentes** por cobertura < 2.

La validación empírica completa depende de cerrar C2 (volcado de encuesta) y C3 (codificación de entrevistas escritas).

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
- que existe alguna franja-nodo en colapso fenomenológico confirmado a fecha de hoy (la matriz post-fix reporta 0/36 colapso, 4/36 fricción, 32/36 inconcluyente).

## 11. ¿Qué es exactamente el colapso fenomenológico y cómo se mide?

Es una franja-evento (nodo × hora) donde convergen al menos tres de cuatro condiciones independientes: criminalidad MEData por encima del percentil 75 mensual de su serie, seguridad percibida ≤ 2/5 en encuesta breve situada, codificación dominante de habitabilidad declarada negativa en entrevistas (`EVITABLE` / `NO_DESEABLE` / `DIFICIL_DE_VIVIR`) y saturación material por encima del percentil 75 en videos POV procesados en GPU. La regla 3-de-4 es deliberadamente exigente; impide que un dato suelto se vuelva diagnóstico. La definición completa vive en `tesis/pendientes/colapso-fenomenologico.md`.

## 12. ¿Qué pasa si la matriz de colapso sale vacía?

Es exactamente lo que ocurre hoy (post-fix C1): 0/36 celdas en 3-de-4, 4/36 en fricción acumulada, 32/36 inconcluyente. La tesis lo reporta así. La categoría queda definida y operacionalizada pero sin instancias de colapso confirmadas; eso fortalece el rigor metodológico aunque debilite la afirmación sustantiva. El colapso fenomenológico es una hipótesis falsable y, en su primera evaluación empírica, no se confirmó. Esa es justamente la propiedad que distingue ciencia de retórica.

## 13. ¿No encontrar colapso entonces equivale a que la tesis falla?

No. Falla la **afirmación fuerte** ("hay colapso en X celda"), no la tesis. La tesis sostiene cuatro contribuciones independientes: (i) marco teórico actualizado con nueve referencias 2020-2025 (Arellana, Rodriguez-Valencia, Soto, Quistberg, Heroy, Velásquez Ocampo, Kinkaid, Garcia, Peden), (ii) pipeline HPC reproducible, (iii) campo multimodal capturado bajo protocolo y (iv) categoría operacional falsable con regla 3-de-4. La cuarta es la que se somete a prueba; las tres primeras se sostienen con o sin instancias de colapso. Una categoría que **podía** fallar y **no falló trivialmente** (porque sí encontró fricción acumulada en Junín peak_am) es más defendible que una categoría que confirma todo lo que toca.

## 14. Hubo una inconsistencia detectada en C1 entre `c1_high_by_window` y `C1_crime_high` por celda. ¿Cómo se resolvió?

Sí, se detectó en la validación del 7 de mayo de 2026 y se corrigió ese mismo día. El bloque global de C1 reportaba `{peak_am, midday, peak_pm, night} = true` pero ninguna celda de la matriz terminaba con `C1_crime_high: true`. La causa, documentada en `tesis/pendientes/colapso-validacion-2026-05-07.md` §2, era que `build_collapse_matrix.py` reevaluaba C1 por franja usando `recent_avg = c1.median_month` (186 casos/mes) y comparaba contra el p75 horario por franja: con la mediana ningún mes "promedio" cruzaba el umbral. **Decisión metodológica fix C1 del 2026-05-07:** `build_collapse_matrix.py` ahora **respeta el bloque precomputado `c1_high_by_window`** generado por `c1_project_hourly.py` (corte p75 por franja sobre la serie histórica completa) en lugar de reevaluar celda a celda contra la mediana mensual. Tras el fix, C1 queda activo en las cuatro franjas para todos los nodos del corredor; la matriz pasa de 1/36 fricción a 4/36 fricción y mantiene 0/36 colapso confirmado.

## 15. ¿Por qué los videos no aportan testimonio verbal? ¿No deberían incluir entrevistas grabadas?

Los videos POV se diseñaron para capturar **saturación material** (densidad visible de personas, vehículos, mobiliario, vendedores), no testimonio. Su pista de audio es ruido ambiental urbano (tráfico, comercio, voces cruzadas) y no constituye corpus entrevistable. Las entrevistas verbales son un instrumento separado del protocolo de campo; de ese instrumento, hoy hay **un solo transcript con testimonio sustantivo** (plaza_botero). El resto de archivos audiovisuales son material C4 (visión por computadora) o material descartado por baja inteligibilidad. Confundir las dos pistas sería metodológicamente impropio: cada fuente tiene su instrumento, su umbral y su sesgo declarado. Por eso C3 sigue en 0 / 36: no porque falten videos, sino porque faltan transcripciones de entrevistas codificadas.

## 16. ¿Qué hallazgo material defendible hay hoy?

Exactamente uno, y se nombra en voz alta: `junin_paseo|peak_am` cumple **2/4 condiciones** (C1 + C4), con C4 sostenido por n=4 registros de video, saturación p75=0.465 y max=0.474 sobre un p75 global de 0.413, y C1 activo por el corte histórico precomputado `c1_high_by_window`. Es la única celda 2/4 de la matriz post-fix; el resto de las 4 celdas en `friccion_acumulada` quedan en 1/4 (solo C1). La narrativa correcta para el jurado: "Junín en la mañana muestra convergencia parcial sustantiva entre presión criminal histórica y densidad material observada; pendiente C2 (encuesta) y C3 (entrevistas) para hablar de colapso". Es modesto y trazable.

## 17. ¿Qué pasa con las 32 celdas "inconcluyente"? ¿Son zonas tranquilas?

No. "Inconcluyente" significa cobertura < 2 fuentes con dato; no es un veredicto sobre la celda, es un veredicto sobre la base de evidencia. Confundir "sin dato suficiente" con "sin colapso" o con "tranquilo" sería un error metodológico simétrico al de afirmar colapso sin evidencia. Tras el fix C1, ya no hay celdas en `flujo_ordinario` (la categoría desaparece): las celdas con C1 activo y video por debajo del umbral pasan a `friccion_acumulada` (1/4) y las celdas sin video procesado quedan en `inconcluyente`. Que una celda esté inconcluyente refleja límite de cobertura del campo, no ausencia de fenómeno.

---

**Nota (2026-05-07, post-fix C1):** la inconsistencia descrita en Q14 quedó resuelta el mismo día. `build_collapse_matrix.py` respeta ahora `c1_high_by_window` precomputado. Las preguntas 1, 12, 13, 16 y 17 reflejan los conteos post-fix (0/36 colapso, 4/36 fricción, 32/36 inconcluyente, 0/36 flujo ordinario). El hallazgo único defendible es `junin_paseo|peak_am` con 2/4 (C1+C4).
