# Guion de presentación — Steven Vallejo + Jacob Agudelo

**Repositorio público:** <https://github.com/stevenvo780/FenomenologiaUrbana>

**Contexto**: tarea de campo de la profesora ("vayan al centro y hagan fenomenología"). Salimos los dos al centro de Medellín el 2026-05-05. Stev decidió escalarlo a un sistema computacional. Esta presentación cuenta lo hecho con honestidad sobre el sobre-esfuerzo y rigor donde lo hubo.

**Formato**: 17 slides · alternamos Stev y Jacob · 1 a 3 min por slide · ~26-28 min + Q&A → **~30 min total**.

**Tono**: directo, autocrítico con humor seco. Leemos ágiles. Cada bloque "El slide muestra:" es lo que hay en pantalla — los bullets son lo que decimos.

---

## 1 — `apertura` · Stev (1 min)

> *Slide:* título grande **"La fenomenología sola no basta"**, subtítulo κ=0.0, términos `phainómenon · lógos · Lebenswelt`, autores, citas Husserl/Merleau-Ponty/Kinkaid, botón Repositorio.

- Leer la tesis del título. **"La fenomenología sola no basta para abordar la ciudad."**
- "Nos mandaron a la ciudad a hacer fenomenología. Yo me obsesioné un poco."
- Lo que se pidió: salir, observar, escribir. Lo que hicimos: salimos los dos, observamos, **y además** corrimos un pipeline HPC, construimos una matriz falsable, y montamos esta web.

## 2 — `symploke` · Jacob (2 min)

> *Slide:* título **"Triangulación M1 + M2 + M3 + matriz falsable"**. 3 cards: **M1 "El aire que decide"**, **M2 "Cinco maneras de caminar"**, **M3 "La distancia entre opción y restricción"**.

- "El método tiene **3 capas + matriz**. Cada capa sola se queda corta."
- **M1 — el aire que decide**: lo físico-ambiental. Ruido, PM2.5, densidad, saturación visual.
- **M2 — cinco maneras de caminar**: el sujeto situado. Quién carga miedo, quién vende, quién es turista.
- **M3 — opción vs restricción**: capa social. Quién mira, quién es mirado, quién decide quedarse.
- "La **matriz 3-de-4** declara colapso solo si tres condiciones convergen. Falsable."

## 3 — `mapa` · Stev (1.5 min)

> *Slide:* título **"El campo donde aparece la ciudad"**, mapa interactivo del corredor, badge **"BASELINE PROXY · CORREDOR JUNÍN"**, GPS del nodo seleccionado.

- "Esta es la geografía: estación San Antonio → parque San Antonio → Bastilla → Junín → parque Botero. **Cinco nodos**."
- 8 a.m. a noche. Cada uno con cuaderno, cámara, audio.
- 34 fotos georreferenciadas, 17 videos, 15 entrevistas.
- "El badge dice **baseline_proxy**: no decimos que esto explique toda la ciudad."

## 4 — `heterotopias` · Jacob (2 min)

> *Slide:* título **"Cada nodo cuenta una tensión distinta"**, chips por nodo con su fenomenología. Cita Foucault/Sassen.

- "**Foucault** lo llamaría heterotopía: lugares con reglas distintas dentro de la misma ciudad."
- Junín: comercio formal denso, modernidad sobre lo antiguo.
- Bastilla: comercio diverso, máxima heterogeneidad.
- Botero: turismo, vigilancia, prostitución y consumo conviven.
- Parque San Antonio: arte, vandalismo, congregación de subalternos.
- "**En parque San Antonio Stev anotó *'tranquilidad en medio del ruido'*; yo escribí *'paso histórico del terror, vandalismo apela a Dios'*.** Misma plaza, mismo día."

## 5 — `perfiles` · Stev (1.5 min)

> *Slide:* título **"No son personas: son lentes de comparación"**. Radar de 5 perfiles + entropía de Shannon por perfil.

- "Cinco perfiles de caminante. **No son personas reales**: son lentes para comparar."
- Trabajador rápido, comprador, turista, vendedor ambulante, persona con movilidad reducida.
- "El radar muestra cómo cada perfil distribuye sus rutas. Más entropía = más diversidad de caminos."
- "Esto sirve para preguntar *¿quién paga el costo de qué franja?*"

## 6 — `presion` · Jacob (1.5 min)

> *Slide:* título **"La hora modifica el campo de posibilidades"**. Etiqueta del escenario activo (ej. peak_pm), métricas por franja.

- "La ciudad **no es la misma a las 7 a.m. que a las 6 p.m.** Eso suena obvio, pero el modelo lo separa."
- 4 franjas: peak_am, midday, peak_pm, night. Cada una con su régimen.
- "Junín a peak_am tiene mucha gente pero ordenada. Botero a midday se siente sofocante. La hora cambia el campo."

## 7 — `simulacion` · Stev (2 min)

> *Slide:* título **"Muchos recorridos posibles, un corredor concreto"**. Parámetros de renderizado, métricas del escenario, panel "Qué permite ver la simulación".

- "Aquí está la capa M-MASS. **Simulación multi-agente sobre el corredor real.**"
- Cada agente tiene perfil, posición, decisión. Caminan por la red de nodos y ejes.
- "No es realismo: es exploración. Pregunta *¿qué pasa si esto se aprieta así?*"
- "Lo que ves en pantalla son trayectorias agregadas, densidades, conflictos."

## 8 — `multitudes` · Jacob (1.5 min)

> *Slide:* título **"24 horas son un latido, no una serie de barras"**. Reloj sincronizado · heatmap · curva. Lectura "X agentes / día".

- "Cuando agregás todos los recorridos en 24 horas, **emerge un latido**."
- 640.000 agentes / día simulados. No es la población real, es el cuenta-rutas.
- "El reloj y el heatmap están sincronizados. Veé el pulso del corredor."

## 9 — `estres` · Stev (1.5 min)

> *Slide:* título **"500.000 como escenario límite"**. Curva de presión vs entropía, tipping point, panel presión sistémica.

- "Pregunta de estrés: **¿qué pasa si metemos 500 mil al corredor?**"
- La curva muestra cómo presión y entropía se desacoplan al límite.
- "Hay un *tipping point*: hasta cierto punto el sistema absorbe; después, colapsa estructuralmente."
- "Esto es exploración computacional, no predicción."

## 10 — `asfixia` · Jacob (1.5 min)

> *Slide:* título **"Precisión interna no es validación de campo"**. σ relativa Monte Carlo, Gini de desigualdad, "Horas medidas".

- "Acá la autocrítica del modelo: **el modelo es preciso consigo mismo, no con la calle**."
- Incertidumbre Monte Carlo: σ relativa por escenario.
- Gini de desigualdad fenomenológica: no todos los perfiles cargan el mismo peso.
- "Esto NO es validación con datos reales. Es coherencia interna. La triangulación es lo que sigue."

## 11 — `ambiente` · Stev (1.5 min)

> *Slide:* título **"El ambiente también pesa al caminar"**. PM2.5 con estación cercana, ruido con muestras válidas.

- "Capa M1 con datos reales del SIATA: **PM2.5 y ruido**."
- Estación más cercana al corredor + número de muestras válidas.
- "Esto entra al modelo como campo estigmérgico — el aire deja huella en el cuerpo."

## 12 — `visibilidad` · Jacob (1.5 min)

> *Slide:* título **"Ver, orientarse y sentirse expuesto"**. Campo perceptual, exposición máxima, legibilidad.

- "Capa M3: **isovistas**. ¿Cuánto se puede ver desde donde uno está?"
- Apertura, exposición y legibilidad por nodo.
- "Botero tiene alta exposición — uno se siente mirado. Junín tiene cobertura visual de árboles. La vigilancia es geometría."

## 13 — `economia` · Stev (1 min)

> *Slide:* título **"El comercio curva el espacio"**.

- "El comercio funciona como **gravedad**: atrae trayectorias."
- Junín: gravitación intensa, mono-uso comercial.
- Botero: gravitación con turismo + microtráfico vecino.
- "El espacio no es neutro: lo curva la economía que lo ocupa."

## 14 — `historia` · Jacob (1 min)

> *Slide:* título **"2012 → 2024: el corredor no permanece igual"**.

- "Doce años. **El corredor no es estable.**"
- Densidad histórica 2012, 2018, 2024 superpuestas.
- "Donde estaba el Bronx, ahora hay turismo. *'Movieron el Bronx una calle'* — eso lo dijo un entrevistado."

## 15 — `evidencia` · Stev (2.5 min)

> *Slide:* título **"Qué tenemos del centro · evidencia pública"**. Donut **50%+ imagen favorable**, nube semántica, gráfico crimen 2023, KPI La Candelaria, trazabilidad de fuentes, card campo pendiente.

- (donut) "**Medellín Cómo Vamos 2024**: el centro es **ambivalente**. Lo quieren y le tienen miedo a la vez."
- (nube) "Las palabras asociadas: comercio, congestión, inseguridad, informalidad — todo a la vez."
- (gráfico crimen) "Criminalidad oficial comuna 10 desde MEData. Esto alimenta el criterio C1 de la matriz."
- (KPI La Candelaria) "Alta densidad poblacional, espacio público escaso por habitante."
- (trazabilidad) "Cada fuente con URL y estado. No pegamos nada sin enseñar."
- "Sobre esto montamos los **4 criterios**: criminalidad histórica (C1), seguridad percibida (C2 · pendiente), habitabilidad declarada (C3), saturación visual (C4)."

## 16 — `triangulacion` · Jacob (3 min)

> *Slide:* título **"Lo que sobrevive a la triangulación · qué falta · qué no se debe fingir"**. 7 paneles: matriz, kappa, sensibilidad, cross-validation, sub-zonas, audio, agregados visuales. Cita Husserl/Haraway.

- (matriz 9×4) "**Resultado**: 0 colapsos confirmados, 6 fricciones, 30 inconcluyentes. **Cero colapsos no es fracaso** — la regla 3-de-4 podía fallar."
- (celdas con borde dorado) "Dos pilares se sostienen bajo bootstrap de 1000 iteraciones: **Junín peak_am** (C1+C4, 95.6%) y **Botero midday** (C1+C3, 97%)."
- (panel inter-rater) "**Cohen's kappa = 0.0** entre Stev y yo. Lecturas opuestas. Eso es la fenomenología sola fallando."
- (panel cross-validation) "El dato visual confirma lo narrado: *'sofocante en Botero'* → densidad humana max 30 personas/frame. *'Miedo de cruzar San Antonio'* → vehicle_intensity 0.378."
- (panel audio) "Junín tiene música constante (ratio 1.0). Berrío registra el pico de ruido del corpus (-24.3 dB). El POV se confirma."
- (sub-zonas) "**Lo honesto**: definimos Coltejer-Ayacucho y 'calle del consumo' porque salieron en el campo, pero no las muestreamos. **Sesgo de itinerario, no se finge.**"

## 17 — `cierre` · Stev (2 min)

> *Slide:* título **"Dos pilares defendibles, κ = 0 como fortaleza, agenda explícita"**. 3 postulados, gates de cierre, autores, botones "Pendientes de campo", "Estatus completo", **"Repositorio ↗"**.

- (postulado 1) "**Dos pilares se sostienen** bajo bootstrap, sensibilidad y leave-one-out."
- (postulado 2) "**Kappa = 0 es la prueba**: dos miradas formadas no concuerdan. La fenomenología pura no falsea, solo describe."
- (postulado 3) "**Matriz 3-de-4 falla limpia**: 30 inconcluyentes no es vacío, es la regla diciendo *'aquí no tengo evidencia'*."
- "**La fenomenología no se rinde ante los datos: pide más que ella misma.**"
- "Lo que falta: encuesta C2, sub-zonas, más observadores. **Ninguno bloquea el entregable.**"
- (señala botón Repositorio) "Todo está aquí. Cada script, cada decisión, la bitácora completa."
- *"Caminar la ciudad sigue siendo el primer dato. No es el único."*

---

## Reparto

| # | Min | Quien | Slide | Lo que se dice |
|---|---|---|---|---|
| 1 | 0–1 | Stev | `apertura` | Tesis + over-engineering |
| 2 | 1–3 | Jacob | `symploke` | 3 capas M1/M2/M3 + matriz |
| 3 | 3–4.5 | Stev | `mapa` | Corredor y 5 nodos |
| 4 | 4.5–6.5 | Jacob | `heterotopias` | Heterotopías + caso parque San Antonio |
| 5 | 6.5–8 | Stev | `perfiles` | 5 lentes de comparación |
| 6 | 8–9.5 | Jacob | `presion` | La hora cambia el campo |
| 7 | 9.5–11.5 | Stev | `simulacion` | M-MASS multi-agente |
| 8 | 11.5–13 | Jacob | `multitudes` | 24h como latido + 640k agentes |
| 9 | 13–14.5 | Stev | `estres` | 500k tipping point |
| 10 | 14.5–16 | Jacob | `asfixia` | Precisión ≠ validación |
| 11 | 16–17.5 | Stev | `ambiente` | PM2.5 + ruido SIATA |
| 12 | 17.5–19 | Jacob | `visibilidad` | Isovistas, exposición |
| 13 | 19–20 | Stev | `economia` | Comercio curva el espacio |
| 14 | 20–21 | Jacob | `historia` | 2012→2024, "movieron el Bronx" |
| 15 | 21–23.5 | Stev | `evidencia` | Datos públicos para C1-C4 |
| 16 | 23.5–26.5 | Jacob | `triangulacion` | Matriz + 2 pilares + kappa + cross-val |
| 17 | 26.5–28.5 | Stev | `cierre` | 3 postulados + repo |
| Q&A | 28.5–32 | ambos | libre | Preguntas |

**Total estimado**: ~28 min + Q&A → ~30 min en total.

---

## Preguntas anticipables

- **"¿Por qué tanto cómputo para una salida de campo?"** → No nos lo pidieron; sobre-elaboramos. Pero el ejercicio mostró el límite del método clásico: si dos observadores no concuerdan, ¿qué se reporta?
- **"¿0/36 colapsos no es fracaso?"** → No: es la regla 3-de-4 funcionando. Una regla que nunca falsea no es regla.
- **"¿κ=0 con n=2 no es estadísticamente débil?"** → Sí. Por eso lo enmarcamos como piloto y como evidencia cualitativa de divergencia.
- **"¿No están sobre-interpretando los videos con YOLO?"** → YOLO detecta lo que está entrenado a detectar. Por eso declaramos 6 reclamos *no evaluables*.
- **"¿Por qué creen que la fenomenología no basta?"** → Porque vivimos la divergencia. La triangulación no la resuelve, la opera: distingue lo que se sostiene de lo que no.
- **"¿La simulación de 640k agentes refleja la realidad?"** → No es predicción, es exploración. Pregunta *¿qué pasaría si...?*. Validación pendiente con campo.
- **"¿Qué proponen para política pública?"** → Las 6 fricciones señalan dónde mirar primero. Pero la tesis no recomienda intervenciones — recomienda método.
