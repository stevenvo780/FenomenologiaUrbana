# Preguntas previsibles de defensa y respuestas sobrias

Fecha: 25 de abril de 2026. Última actualización: 8 de mayo de 2026 (post-oleada 5: Jacob como segundo observador, bootstrap de sensibilidad y cross-validation texto-imagen).

## 1. ¿La tesis ya está validada en campo?

El campo se realizó antes del 6 de mayo de 2026 y cinco oleadas de ingesta ya corrieron. La tesis está en fase **`field_ingest_in_progress`** con números concretos sobre la mesa (post-oleada 5, 2026-05-08):

- **C1 (criminalidad)**: serie histórica MEData proyectada a franjas; `c1_high_by_window` precomputado con corte p75 por franja en `c1_hourly_projection.json`. `build_collapse_matrix.py` post-fix respeta ese bloque sin reevaluar contra la mediana mensual.
- **C2 (encuesta de seguridad percibida)**: 0 / 36 celdas con dato volcado; la captura existe en campo pero no está agregada a `field_observations_aggregate.csv`. Sigue siendo el cuello de botella número uno.
- **C3 (entrevistas codificadas)**: con la oleada 5 entran las primeras codificaciones del segundo observador (Jacob), incluida la entrevista de Andrés en sub-zona Coltejer-Ayacucho como primer caso explícito de gradiente intra-nodo en el corpus.
- **C4 (saturación de video)**: 16 `video_saturation` procesados en HPC; **pasaje_la_bastilla rescatado con 12 fotos reasignadas**. Sub-zonas Coltejer-Ayacucho y calle-del-consumo siguen vacías como limitación declarada.
- **Matriz `collapse_matrix.json` post-oleada 5**: **0/36 colapsos 3-de-4, 6/36 fricción acumulada y 30/36 inconcluyentes** por cobertura < 2.
- **Dos pilares defendibles** que sobreviven al bootstrap de sensibilidad (1000 iteraciones × 25 escenarios × LOO C3): `junin_paseo|peak_am` con C1+C4 (share **95.6% V1 / 88% V2**) y `plaza_botero|midday` con C1+C3 (share **97% V1 / 100% V2**).
- **Cuatro celdas frágiles** condicionales al p75 exacto: `parque_san_antonio|midday`, `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday` (V2 share = 0.40 al barrer p70..p90).

La validación empírica completa depende de cerrar C2 (volcado de encuesta) y completar la codificación C3 sobre el resto de transcripciones.

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
- que existe alguna franja-nodo en colapso fenomenológico confirmado a fecha de hoy (la matriz post-oleada 5 reporta **0/36 colapso, 6/36 fricción acumulada, 30/36 inconcluyente**).

## 11. ¿Qué es exactamente el colapso fenomenológico y cómo se mide?

Es una franja-evento (nodo × hora) donde convergen al menos tres de cuatro condiciones independientes: criminalidad MEData por encima del percentil 75 mensual de su serie, seguridad percibida ≤ 2/5 en encuesta breve situada, codificación dominante de habitabilidad declarada negativa en entrevistas (`EVITABLE` / `NO_DESEABLE` / `DIFICIL_DE_VIVIR`) y saturación material por encima del percentil 75 en videos POV procesados en GPU. La regla 3-de-4 es deliberadamente exigente; impide que un dato suelto se vuelva diagnóstico. La definición completa vive en `tesis/pendientes/colapso-fenomenologico.md`.

## 12. ¿Qué pasa si la matriz de colapso sale vacía?

Es exactamente lo que ocurre hoy (post-oleada 5): **0/36 celdas en 3-de-4, 6/36 en fricción acumulada, 30/36 inconcluyente**. La tesis lo reporta así. La categoría queda definida y operacionalizada pero sin instancias de colapso confirmadas; eso fortalece el rigor metodológico aunque debilite la afirmación sustantiva. El colapso fenomenológico es una hipótesis falsable y, en su primera evaluación empírica, no se confirmó. Esa es justamente la propiedad que distingue ciencia de retórica.

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

## 18. ¿Por qué el inter-rater Cohen's kappa = 0.0 entre Stev y Jacob? ¿No es eso un fracaso de fiabilidad?

No, y la pregunta es exactamente la que la tesis quiere responder. El 5 de mayo Jacob recorrió el mismo corredor el mismo día como segundo observador independiente. Sobre los **4 nodos coincidentes** la binarización de `perceived_safety_score_1_5` (>=3 alto, <3 bajo) da acuerdo bruto 2/4 = 0.50 y acuerdo esperado por azar 0.50, lo que produce **kappa = 0.0** — formalmente *poor agreement* en Landis-Koch. El caso paradigmático es `parque_san_antonio` (Stev = 4, "tranquilidad contemplativa, no está rota la ventana"; Jacob = 2, "paso histórico del terror, vandalismo religioso").

Tres razones por las que esto **confirma** y no invalida la tesis:

1. **Confirma la fenomenología subjetiva como tesis nuclear**: la atmósfera urbana no preexiste al observador. La divergencia *es* el dato fenomenológico, no ruido a eliminar. Una tesis fenomenológica que produjera kappa alto sería sospechosa de haber estandarizado la mirada.
2. **Justifica la triangulación multi-fuente**: precisamente porque la AF de un observador es subjetiva, la matriz no descansa sobre ella; descansa sobre la convergencia con C1 (criminalidad oficial), C3 (testimonio de quien habita) y C4 (saturación visual objetivable). El kappa bajo entre observadores refuerza la necesidad metodológica de la regla 3-de-4.
3. **Validación cruzada con C3 y visual**: la convergencia entre el campo y los agregados YOLO calculados independientemente (`vehicle_intensity=0.378` máximo en san_antonio_metro|peak_am, `human_density_max=30` máximo en Berrío) muestra que donde el pipeline puede ver, los dos canales coinciden. La subjetividad del observador no descalifica la convergencia inter-method.

Decisión metodológica: todo nodo con divergencia binaria entre observadores pasa a bandera "fenomenológicamente disputado" y exige al menos una entrevista C3 in-situ para resolución.

## 19. ¿Qué pasa si cambian el umbral p75 de C1 o C4? ¿La matriz no es entonces un artefacto del corte elegido?

El bootstrap de sensibilidad responde celda a celda. V2 barre 25 combinaciones de umbrales (p70..p90 para C1 × p70..p90 para C4) y mide qué fracción de escenarios mantiene la decisión baseline. El resultado clasifica las 6 celdas en fricción acumulada en dos grupos:

- **Robustas al umbral (2 celdas)**: `junin_paseo|peak_am` (V1=0.956, V2=0.880) y `plaza_botero|midday` (V1=0.970, V2=1.000). Sobreviven al barrido completo. Son los dos pilares defendibles.
- **Frágiles condicionales al p75 exacto (4 celdas)**: `parque_san_antonio|midday`, `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday` (V2 share ≈ 0.40). Cambiar el umbral las saca de fricción. Se reportan como hipótesis abiertas, no como hallazgos.

La distinción se nombra explícitamente en la defensa. El bootstrap no salva los pilares de la fragilidad; los **identifica** como fragilidad, y eso es la sensibilidad funcionando.

## 20. ¿Por qué definieron sub-zonas (Coltejer-Ayacucho, "calle del consumo") que después no muestrearon visualmente?

Porque las sub-zonas no surgen del modelo: surgen del campo. Coltejer-Ayacucho aparece en la entrevista de Andrés (vendedor) que Jacob recogió como gradiente intra-Junín; "calle del consumo" aparece en la observación de Stev sobre el circuito microtráfico adyacente a Botero. El protocolo de campo respeta lo que el corpus narra, no lo que el corpus puede confirmar.

Que ambas sub-zonas queden vacías de datos visuales C4 es **evidencia de sesgo de muestreo declarado**, no evidencia de inexistencia del fenómeno. La diferencia importa: una tesis que silenciara las sub-zonas para evitar el vacío sería metodológicamente peor que una que las nombra como límite. El plan de cierre real (sección "agenda" del guion) incluye muestreo dirigido a estas sub-zonas como tarea futura.

## 21. La cross-validation texto-imagen, ¿no es post-hoc? ¿No están confirmando con imágenes lo que ya leyeron en notas de campo?

No en el sentido peyorativo. Las métricas YOLO de `m1_visual_aggregate.json` y `m3_visual_aggregate.json` se calcularon en HPC **antes de leer las narrativas** del campo del 2026-05-05. La triangulación texto↔imagen del 2026-05-07 toma esos agregados ya cerrados y los confronta con cada reclamo cuantificable del campo.

Resultados: de 10 reclamos analizados, 2 muestran convergencia alta (`san_antonio_metro|peak_am` riesgo vial ↔ `vehicle_intensity=0.378` máximo del corpus; "Botero sofocante" ↔ `human_density_max=30` y `saturation_max=71`, las métricas más altas del corpus), 2 convergencia media (turistas en Botero, comercio en Junín), 0 bajas, y 6 no evaluables por límite del pipeline (YOLO COCO no detecta uniformes, indigencia, consumo, grafiti).

Aclaración importante sobre el alcance epistémico: convergencia ≠ confirmación causal. Que el campo y la imagen coincidan en `vehicle_intensity` máximo no prueba que el riesgo vial **causa** la baja seguridad percibida; descarta el azar. El reclamo de la tesis es exactamente ese: convergencia inter-method donde el pipeline tiene capacidad, y delimitación honesta donde no la tiene.

---

**Nota (2026-05-07, post-fix C1):** la inconsistencia descrita en Q14 quedó resuelta el mismo día. `build_collapse_matrix.py` respeta ahora `c1_high_by_window` precomputado.

**Nota (2026-05-08, post-oleada 5):** se incorpora a Jacob como segundo observador (kappa=0.0 sobre 4 nodos coincidentes; ver Q18), bootstrap de sensibilidad (1000 iteraciones × 25 escenarios × LOO C3; ver Q19) y cross-validation texto-imagen (ver Q21). Las preguntas 1, 10, 12, 13, 16 y 17 reflejan los conteos post-oleada 5 (**0/36 colapso, 6/36 fricción, 30/36 inconcluyente**). Hay **dos pilares defendibles**: `junin_paseo|peak_am` con 2/4 (C1+C4, bootstrap 95.6% V1 / 88% V2) y `plaza_botero|midday` con 2/4 (C1+C3, bootstrap 97% V1 / 100% V2). Cuatro celdas frágiles condicionales al p75 exacto (parque_san_antonio|midday, san_antonio_metro|peak_am, junin_paseo|midday, parque_berrio|midday). Pasaje_la_bastilla rescatado con 12 fotos; sub-zonas Coltejer-Ayacucho y calle-del-consumo siguen vacías y se reportan como límite de muestreo (ver Q20).
