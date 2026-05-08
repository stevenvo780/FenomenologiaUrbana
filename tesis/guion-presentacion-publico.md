# Guion de presentación para público general

Uso: apoyo oral para el deck React. Tono pedagógico y denso. Repetir siempre la distinción **evidencia pública / simulación / campo capturado e ingerido**.

## Tesis central

> La fenomenología sola no basta para abordar la ciudad. La atmósfera urbana es ineliminablemente subjetiva (kappa=0 entre dos observadores formados lo prueba), por eso la triangulación —M-MASS + HPC + matriz falsable 3-de-4— es la respuesta metodológica. La matriz hoy reporta 0 colapsos confirmados, 2 pilares defendibles, 4 celdas frágiles y 30 inconcluyentes. **Eso no es fracaso: es el método funcionando.**

---

## Slide 1 — Título y tesis

- Caminar el centro de Medellín como problema fenomenológico.
- Pregunta: ¿qué pasa con el cuerpo cuando recorre transporte, comercio, ruido, vigilancia, memoria y riesgo?
- Apuesta: la fenomenología necesita anclaje computacional y empírico para no colapsar en impresionismo.

## Slide 2 — Problema: la divergencia inter-observador

- Dos observadores formados, mismo corredor, mismo día: Cohen's kappa = 0.0 sobre 4 nodos coincidentes.
- Caso paradigmático: `parque_san_antonio` — Stev anota 4/5 ("tranquilidad contemplativa, no está rota la ventana") y Jacob 2/5 ("paso histórico del terror, vandalismo religioso").
- La divergencia no es ruido a corregir: es el dato fenomenológico.
- Si una sola mirada no estabiliza la atmósfera, ¿cómo se hace ciencia urbana?

## Slide 3 — Marco fenomenológico

- Husserl: la ciudad como mundo-de-vida, no como dato objetivo previo a la experiencia.
- Merleau-Ponty: el cuerpo es el primer instrumento; percepción y motricidad son inseparables.
- Lefebvre: producción social del espacio, ritmoanálisis, derecho a la ciudad.
- Haraway: conocimiento situado — no hay mirada desde ninguna parte; cada dato carga posición, hora, instrumento.
- Implicación: la subjetividad no es defecto a eliminar; exige triangulación con anclajes independientes.

## Slide 4 — Diseño M-MASS

- Tres capas: **M1** ambiente (aire, ruido, densidad), **M2** decisión (perfiles de caminante, costos), **M3** visibilidad (exposición, orientación).
- Pipeline HPC dual-GPU: visión por computadora sobre videos POV y fotos del corredor.
- Cinco perfiles comparativos (turista, comprador, trabajador, vendedor, movilidad reducida) como lentes, no sujetos reales.
- Salidas trazables en JSON; cada parámetro reproducible.

## Slide 5 — Operacionalización falsable: regla 3-de-4

- 9 nodos × 4 franjas (peak_am, midday, peak_pm, night) = **36 celdas**.
- Cuatro condiciones independientes:
  - **C1** criminalidad MEData > p75 horario.
  - **C2** seguridad percibida ≤ 2/5.
  - **C3** habitabilidad declarada negativa en entrevistas codificadas.
  - **C4** saturación material en video POV > p75.
- Colapso fenomenológico = al menos 3 de 4 en una misma celda. Deliberadamente exigente.

## Slide 6 — Datos integrados

- 14+1 entrevistas (Jacob como segundo observador independiente).
- 34 fotos asignadas a nodo×franja.
- 17 videos POV; 16 con saturación procesada por GPU.
- Serie histórica MEData de comuna 10 (mediana ~186 casos/mes).
- Cuatro fuentes nunca colapsan en una sola pista.

## Slide 7 — La matriz

- **0/36** celdas en colapso 3-de-4.
- **6/36** celdas en fricción acumulada (2/4).
- **30/36** inconcluyentes por cobertura insuficiente (< 2 fuentes con dato).
- "Inconcluyente" no es "tranquilo": es límite de evidencia, no veredicto sobre el fenómeno.

## Slide 8 — Pilares defendibles

- `junin_paseo | peak_am` — C1 + C4 (presión criminal histórica + densidad material observada). Pilar uno.
- `plaza_botero | midday` — C1 + C3 (presión criminal + testimonio in-situ negativo). Pilar dos, además respaldado por la métrica visual más alta del corpus (`human_density_max=30`, `saturation_max=71`).
- Ambos son **fricción acumulada documentada**, no colapso confirmado.

## Slide 9 — Robustez y fragilidad

- Bootstrap de sensibilidad: 1000 iteraciones × 25 escenarios de umbrales (p70..p90 en C1 × C4) × leave-one-out C3.
- Pilares robustos: Junín peak_am (share V1=95.6%, V2=88%) y Botero midday (V1=97%, V2=100%).
- **Cuatro celdas frágiles** condicionales al p75 exacto (V2≈40%): `parque_san_antonio|midday`, `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday`.
- Se nombran como hipótesis abiertas, no hallazgos.

## Slide 10 — Inter-rater como fortaleza metodológica

- kappa = 0.0 confirma que la atmósfera urbana no preexiste al observador.
- Una tesis fenomenológica con kappa alto sería sospechosa de haber estandarizado la mirada.
- La regla 3-de-4 está diseñada exactamente para esto: no eliminar la subjetividad, obligarla a coincidir con anclajes independientes (criminalidad oficial, testimonio in-situ, saturación visual).
- Decisión: nodos con divergencia binaria pasan a bandera "fenomenológicamente disputado" y exigen entrevista C3 in-situ.

## Slide 11 — Validación cruzada texto↔imagen

- Métricas YOLO calculadas **antes** de leer las narrativas del campo.
- "Riesgo vial alto en `san_antonio_metro|peak_am`" ↔ `vehicle_intensity = 0.378` (máximo del corpus).
- "Plaza Botero / Berrío sofocante" ↔ `human_density_max = 30`, `saturation_max = 71` (máximos del corpus).
- Junín — divergencia Stev/Jacob se disuelve: 0 hits de comida callejera (apoya a Stev) + 240 maletas, 102 bolsos en peak_am (apoya a Jacob). Ambos describen facetas reales.
- Convergencia ≠ causalidad; descarta azar.

## Slide 12 — Limitaciones honestas

- **C2** (encuesta de seguridad percibida): 0/36 celdas con dato volcado al CSV agregado. Cuello de botella número uno.
- **Sub-zonas vacías**: Coltejer-Ayacucho y "calle del consumo" surgen del campo, no del modelo; su vacío es sesgo de muestreo declarado, no inexistencia del fenómeno.
- **OCR / pipeline visual**: YOLO COCO no detecta uniformes, indigencia, consumo ni grafiti.
- **Audio**: pista de los videos POV es ruido ambiental, no entrevistas; el corpus verbal codificado es parcial.

## Slide 13 — La fenomenología sola no basta

- Una sola mirada produce kappa=0 con otra mirada igual de formada.
- La triangulación 3-de-4 discrimina lo defendible (2 pilares) de lo frágil (4 condicionales) de lo inconcluyente (30).
- La categoría "colapso fenomenológico" se sostiene como definición operacional precisamente porque podía fallar y no falló trivialmente.
- Contribución: marco teórico denso + pipeline HPC reproducible + campo multimodal + categoría falsable. Las cuatro se sostienen con o sin instancias de colapso confirmadas.

## Slide 14 — Agenda y cierre

- Cerrar C2 (volcado de encuesta) y completar C3 (codificación de transcripciones) son los pasos bloqueantes para mover celdas de 2/4 a 3/4.
- Muestreo dirigido a Coltejer-Ayacucho y "calle del consumo".
- Cierre oral: la presentación no resuelve el centro; lo deja abierto de forma más rigurosa, con hipótesis visibles y una matriz que dice celda por celda lo que la evidencia alcanza a sostener.

---

## Preguntas difíciles — respuesta corta

- **kappa = 0, ¿no descalifica todo?** No: confirma que la atmósfera es subjetiva y justifica la triangulación.
- **¿0/36 colapsos no es fracaso?** No: es la regla de falsabilidad funcionando. Falla la afirmación fuerte, no la tesis.
- **¿Las 4 celdas frágiles son hallazgos?** No: son hipótesis abiertas condicionales al p75 exacto; el bootstrap las identifica como fragilidad, no las salva.
- **Sub-zonas vacías:** surgen del campo, no del modelo; su ausencia visual es sesgo de muestreo declarado.
- **Cross-validation texto↔imagen, ¿es post-hoc?** No: las métricas YOLO se calcularon antes de leer narrativas. Convergencia ≠ causalidad, pero descarta azar.
- **¿Qué no afirmar?** Que el corredor está calibrado, que los agentes son personas, que el stress test es capacidad real, que existe alguna celda en colapso confirmado.
