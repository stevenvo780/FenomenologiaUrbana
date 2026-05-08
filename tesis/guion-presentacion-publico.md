# Guion de presentación — Steven Vallejo + Jacob Agudelo

**Repositorio público:** <https://github.com/stevenvo780/FenomenologiaUrbana>

**Contexto**: tarea de la profesora ("vayan al centro y hagan fenomenología"). Salimos al centro de Medellín el 2026-05-05. Stev escaló el ejercicio a un sistema computacional. La presentación cuenta lo hecho con honestidad sobre el sobre-esfuerzo y rigor donde lo hubo.

**Formato**: 17 slides · alternamos · prosa hablada con conectores escritos · ~22 min + Q&A.

**Tono**: directo, autocrítico, provocador. Cursivas = énfasis. `(paréntesis)` = gestos sobre el slide.

---

## 1 — `apertura` · Stev (~45 s)

> *Slide:* **"La fenomenología sola no basta"** · κ=0.0 · `phainómenon · lógos · Lebenswelt` · Husserl/Merleau-Ponty/Kinkaid · botón Repositorio.

**Stev:** Buenos días. La tesis está en el título: *la fenomenología sola no basta para abordar la ciudad*. Voy a contar cómo llegamos ahí.

La profesora dijo: *vayan al centro y hagan fenomenología*. Yo me obsesioné un poco. Salimos los dos, observamos, escribimos — y además **consumimos toneladas de cómputo** sobre las fotos, videos, transcripciones y quince entrevistas, y montamos esta web. Hoy contamos las dos cosas: lo que vivimos en la calle y lo que el sistema dijo de eso.

---

## 2 — `symploke` · Jacob (~75 s)

> *Slide:* **"Triangulación M1 + M2 + M3 + matriz falsable"** · 3 cards.

**Jacob:** La ciudad no se deja agarrar con un solo tipo de mirada. Por eso el método son **tres capas y una matriz**.

(M1) **El aire que decide**: lo físico-ambiental — ruido, PM2.5, densidad, saturación visual.
(M2) **Cinco maneras de caminar**: el sujeto situado — quién carga miedo, quién vende, quién es turista.
(M3) **Opción vs restricción**: la capa social — heterotopía como geometría del poder.

Cada capa sola se queda corta. La **matriz tres-de-cuatro** declara colapso solo si tres condiciones convergen. Es falsable, y de hecho hoy no activa colapsos. A eso lo llamamos *symploké*: el entrelazamiento.

---

## 3 — `mapa` · Stev (~60 s)

> *Slide:* **"El campo donde aparece la ciudad"** · mapa interactivo · badge **"BASELINE PROXY · CORREDOR JUNÍN"**.

**Stev:** (señala el mapa) Cinco nodos: estación San Antonio, parque San Antonio, La Bastilla, Junín, parque Botero. Una jornada — ocho de la mañana a la tarde. Treinta y cuatro fotos georreferenciadas, diecisiete videos, quince entrevistas.

(badge) **Baseline proxy** importa: no estamos diciendo que esto explique toda la ciudad. Es el corredor donde fuimos. (clic en un nodo) Cada foto cae en su nodo por GPS — anclaje espacial sin ambigüedad.

---

## 4 — `heterotopias` · Jacob (~90 s)

> *Slide:* **"Cada nodo cuenta una tensión distinta"** · chips por nodo · Foucault/Sassen.

**Jacob:** Cada plaza tiene su tensión. Foucault los llamaría heterotopías: lugares con reglas distintas dentro de la misma ciudad.

(chips) **Junín**: comercio formal denso, vendedor seguro, transeúnte no. **La Bastilla**: máxima heterogeneidad. **Botero**: turismo, vigilancia, prostitución y consumo, todo conviviendo. **Parque San Antonio**: arte, vandalismo religioso, subalternos. **San Antonio metro**: contraste tercera edad / modernidad, riesgo vial.

Pero acá viene lo importante: **escribimos cosas opuestas del mismo nodo**. Stev anotó *"tranquilidad en medio del ruido"* en parque San Antonio. Yo escribí *"paso histórico del terror"*. Misma plaza, mismo día. Eso no es ruido a corregir — es el dato fenomenológico.

---

## 5 — `perfiles` · Stev (~50 s)

> *Slide:* **"No son personas: son lentes de comparación"** · radar 5 perfiles + Shannon.

**Stev:** Cinco perfiles: trabajador rápido, comprador, turista, vendedor ambulante, persona con movilidad reducida. **No son personas reales** — son lentes para comparar.

(entropía) El índice de Shannon mide diversidad de rutas por perfil. Más alto, más libertad de movimiento. La pregunta política: *¿quién paga el costo de qué franja?*

---

## 6 — `presion` · Jacob (~50 s)

> *Slide:* **"La hora modifica el campo de posibilidades"** · escenario activo.

**Jacob:** La ciudad no es la misma a las siete de la mañana que a las seis de la tarde. Por eso cuatro franjas: peak_am, midday, peak_pm, night.

(cambia escenarios) Junín peak_am: ordenado, comercio abriendo. Botero midday: turistas, sofocante. Night: casi todo cierra, lo que queda cambia de dueño.

Por eso la matriz es **nueve nodos por cuatro franjas — treinta y seis celdas**. La hora es eje, no detalle.

---

## 7 — `simulacion` · Stev (~75 s)

> *Slide:* **"Muchos recorridos posibles, un corredor concreto"** · parámetros, métricas.

**Stev:** Capa M-MASS: simulación multi-agente sobre el corredor real. Cada agente tiene perfil, posición, decisión. Caminan por la red real.

**No es realismo, es exploración**. La pregunta no es *¿qué pasa?* sino *¿qué pasaría si esto se aprieta así?* Si meto cien mil agentes en peak_pm, ¿dónde se traba?

(parámetros) Tasa de inyección, sensibilidad al ruido, propensión a desviarse — todos justificados en cap 2. La simulación no es la verdad de la calle: **es lo que el modelo deja hacer cuando el cuerpo ya no está en el campo.**

---

## 8 — `multitudes` · Jacob (~50 s)

> *Slide:* **"24 horas son un latido"** · reloj sincronizado · 640k agentes.

**Jacob:** Cuando se agregan veinticuatro horas de recorridos, emerge **un latido**, no un gráfico de barras. Seiscientos cuarenta mil agentes/día simulados — no es la población real, es el cuenta-rutas.

(reloj+heatmap) Hay franjas que respiran y otras que se ahogan. Eso es lo que la fenomenología sola no puede contar — necesita el agregado.

---

## 9 — `estres` · Stev (~50 s)

> *Slide:* **"500.000 como escenario límite"** · curva presión vs entropía.

**Stev:** Pregunta de estrés: ¿qué pasa con medio millón de agentes? (curva) Hay un *tipping point*: hasta cierto punto presión y entropía suben juntas; después la entropía colapsa y la presión sigue. Todos terminan por las mismas calles.

Esto es exploración computacional, no predicción. Pregunta *cuánto aguanta* — no *qué va a pasar*.

---

## 10 — `asfixia` · Jacob (~50 s)

> *Slide:* **"Precisión interna no es validación de campo"** · σ Monte Carlo · Gini.

**Jacob:** Autocrítica del modelo. (σ) La incertidumbre Monte Carlo es baja — coherente consigo mismo. (Gini) Pero el Gini muestra **desigualdad fenomenológica**: la habitabilidad media oculta que un perfil — la persona con movilidad reducida — absorbe casi todo el costo.

Esto **no** es validación con datos reales. Es coherencia interna. La validación viene en el slide dieciséis.

---

## 11 — `ambiente` · Stev (~45 s)

> *Slide:* **"El ambiente también pesa al caminar"** · PM2.5 + ruido SIATA.

**Stev:** Capa M1 con datos del SIATA — la red oficial. (PM2.5) Estación más cercana al corredor, cada lectura validada. (ruido) Decibelios con muestras válidas declaradas.

Esto entra al modelo como **campo estigmérgico**: el aire deja huella en el cuerpo. No es metáfora — mueve a los agentes.

---

## 12 — `visibilidad` · Jacob (~50 s)

> *Slide:* **"Ver, orientarse y sentirse expuesto"** · isovistas.

**Jacob:** Capa M3 con datos: **isovistas**. ¿Cuánto se ve desde un punto? ¿Cuánto lo ven a uno?

Botero: alta exposición — el cuerpo se siente mirado. Junín: cobertura visual, hay dónde meterse sin ser visto. **La vigilancia no es solo cámaras: es geometría**. Foucault con números.

---

## 13 — `economia` · Stev (~30 s)

> *Slide:* **"El comercio curva el espacio"**.

**Stev:** El comercio funciona como gravedad: atrae trayectorias, deforma el campo. Junín gravita por mono-uso comercial. Botero por turismo más microtráfico vecino. El espacio no es neutro — lo curva la economía que lo ocupa.

---

## 14 — `historia` · Jacob (~40 s)

> *Slide:* **"2012 → 2024: el corredor no permanece igual"**.

**Jacob:** Doce años. (capas) Densidad 2012, 2018, 2024 superpuestas. Donde estaba el Bronx, hoy hay turismo y hoteles.

Un entrevistado lo dijo con más precisión que cualquier informe oficial: *"movieron el Bronx una calle"*. La intervención desplaza, no elimina.

---

## 15 — `evidencia` · Stev (~90 s)

> *Slide:* **"Qué tenemos del centro · evidencia pública"** · 6 paneles.

**Stev:** Datos públicos que alimentan los criterios cuantitativos.

(donut) **Medellín Cómo Vamos 2024**: el centro es ambivalente — más del 50% de favorabilidad pero conviven aprecio y rechazo. (nube) Las palabras: comercio, congestión, inseguridad, informalidad, todo a la vez.

(crimen) Criminalidad oficial comuna 10 desde **MEData** — alimenta C1. (La Candelaria) Alta densidad, comercio denso, espacio público escaso por habitante. (trazabilidad) Cada fuente con URL y estado: descargada, fallida, parseada — no pegamos nada que no podamos enseñar.

Sobre eso montamos los **cuatro criterios**: criminalidad histórica (C1), seguridad percibida (C2 · pendiente), habitabilidad declarada (C3 · 15 entrevistas), saturación visual (C4 · YOLO sobre videos).

---

## 16 — `triangulacion` · Jacob (~2 min · 3 tabs)

> *Slide:* **"Lo que sobrevive a la triangulación"** · 3 tabs · Husserl/Haraway.

**Jacob:** El corazón empírico de todo. Tres tabs.

(tab 1 — Matriz) Treinta y seis celdas. **Cero colapsos confirmados, seis fricciones, treinta inconcluyentes.** Cero colapsos no es fracaso — la regla podía fallar y decidimos no activar sin evidencia. (celdas doradas) Dos pilares se sostienen bajo bootstrap: **Junín peak_am** (95.6%) y **Botero midday** (97%). (sensibilidad) Si movemos el umbral ±5 puntos, los dos aguantan; las otras cuatro fricciones caen — son frágiles, lo declaramos.

(tab 2 — Validación) **Cohen's kappa = 0.0** entre Stev y yo. Cuatro nodos compartidos, lecturas opuestas, acuerdo formal cero. Eso *es* la fenomenología fallando como validación intersubjetiva. (cross-val) Pero el dato visual confirma lo narrado: *"sofocante en Botero"* → densidad 30 personas/frame; *"miedo de cruzar San Antonio"* → vehicle_intensity 0.378 (tope del corpus). (audio) Junín: música constante (ratio 1.0). Berrío: pico de ruido del corpus (-24.3 dB). El POV se confirma con espectrograma.

(tab 3 — Sub-zonas) Lo que **no** se debe fingir: definimos Coltejer-Ayacucho y "calle del consumo" porque salieron en entrevistas, pero no las muestreamos. **Sesgo de itinerario, declarado.** Bastilla sí lo rescatamos (12 fotos al refinar geocoding). (agregados) YOLO cuantifica densidad y heterogeneidad de Shannon: número a la sensación.

---

## 17 — `cierre` · Stev (~60 s)

> *Slide:* **"Dos pilares · κ=0 fortaleza · agenda"** · 3 postulados · botón Repositorio.

**Stev:** Tres postulados.

(1) **Dos celdas sobreviven** a bootstrap, sensibilidad y leave-one-out — Junín peak_am y Botero midday. Hallazgo, no anuncio.
(2) **Kappa cero es la prueba**: la fenomenología pura describe, no falsea. Necesita la matriz como condición de posibilidad para discriminar.
(3) **Treinta inconcluyentes no es vacío**: la regla diciendo *aquí no tengo evidencia*. Una regla que nunca falsea no es regla.

**La fenomenología no se rinde ante los datos — pide más que ella misma.**

¿Qué falta? Encuesta C2, sub-zonas, más observadores. Pero **ninguno bloquea el entregable**: lo que pidió la profesora está hecho. (botón Repositorio) Todo público — scripts, decisiones, bitácora, los cuatro capítulos.

> *Caminar la ciudad sigue siendo el primer dato. No es el único.*

Gracias.

---

## Reparto

| # | Min | Quien | Slide | Tema |
|---|---|---|---|---|
| 1 | 0:00–0:45 | Stev | `apertura` | Tesis + over-engineering |
| 2 | 0:45–2:00 | Jacob | `symploke` | 3 capas + matriz |
| 3 | 2:00–3:00 | Stev | `mapa` | 5 nodos + baseline |
| 4 | 3:00–4:30 | Jacob | `heterotopias` | Caso parque San Antonio |
| 5 | 4:30–5:20 | Stev | `perfiles` | 5 lentes + Shannon |
| 6 | 5:20–6:10 | Jacob | `presion` | 4 franjas |
| 7 | 6:10–7:25 | Stev | `simulacion` | M-MASS exploración |
| 8 | 7:25–8:15 | Jacob | `multitudes` | 24h latido + 640k |
| 9 | 8:15–9:05 | Stev | `estres` | 500k tipping point |
| 10 | 9:05–9:55 | Jacob | `asfixia` | Precisión ≠ validación |
| 11 | 9:55–10:40 | Stev | `ambiente` | PM2.5 + SIATA |
| 12 | 10:40–11:30 | Jacob | `visibilidad` | Isovistas |
| 13 | 11:30–12:00 | Stev | `economia` | Gravedad comercial |
| 14 | 12:00–12:40 | Jacob | `historia` | "Movieron el Bronx" |
| 15 | 12:40–14:10 | Stev | `evidencia` | C1-C4 |
| 16 | 14:10–16:10 | Jacob | `triangulacion` | Matriz + κ=0 + cross-val |
| 17 | 16:10–17:10 | Stev | `cierre` | 3 postulados + repo |
| Q&A | 17:10–22:00 | ambos | libre | Preguntas |

**Total estimado**: ~17 min + ~5 min Q&A → 22 min.

---

## Preguntas anticipables

- **"¿Por qué tanto cómputo para una salida de campo?"** → No nos lo pidieron; sobre-elaboramos. El ejercicio mostró el límite del método clásico: si dos observadores no concuerdan, ¿qué se reporta?
- **"¿0/36 colapsos no es fracaso?"** → No: la regla 3-de-4 funcionando. Una regla que nunca falsea no es regla.
- **"¿κ=0 con n=2 no es estadísticamente débil?"** → Sí. Lo enmarcamos como piloto y evidencia cualitativa de divergencia.
- **"¿No están sobre-interpretando con YOLO?"** → YOLO detecta lo entrenado. 6 reclamos los declaramos *no evaluables*.
- **"¿Por qué la fenomenología no basta?"** → Porque vivimos la divergencia. La triangulación no la *resuelve*, la *opera*.
- **"¿La simulación de 640k refleja la realidad?"** → No es predicción, es exploración. *¿Qué pasaría si...?*
- **"¿Política pública?"** → Las 6 fricciones señalan dónde mirar primero. La tesis recomienda método, no intervenciones.
- **"¿Cross-validation post-hoc?"** → No: las métricas YOLO se calcularon antes de leer las narrativas.
