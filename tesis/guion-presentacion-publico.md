# Guion de presentación — 20 minutos · Stev + Jacob

**Contexto**: tarea de campo de la profesora ("vayan al centro y hagan fenomenología"). La salimos al centro de Medellín el 2026-05-05. Stev decidió escalarlo a un sistema computacional completo. Esta presentación cuenta lo hecho sin abrumar, con honestidad sobre el sobre-esfuerzo y rigor donde lo hubo.

**Formato**: dos presentadores alternando. ~10 min cada uno. ~9 momentos de ~2 min. Apoyo: deck web + caps de tesis como respaldo si hay preguntas.

**Tono**: directo, autocrítico con humor seco, provocador en la tesis. No leer.

---

## 1. Apertura — Stev (1 min)

- "Nos mandaron a la ciudad a hacer fenomenología. Yo me obsesioné un poco."
- Lo que se pidió: salir, observar, escribir.
- Lo que hicimos: salimos los dos, observamos, escribimos, **y además** corrimos un pipeline HPC con dos GPUs sobre fotos, videos, transcripciones y 14+1 entrevistas, construimos una matriz de colapso falsable, y montamos una web.
- Hoy contamos las dos cosas: la experiencia de campo y lo que el sistema dijo de ella.

## 2. Marco mínimo — Jacob (2 min)

- Fenomenología urbana: cómo se *vive* la ciudad antes de cómo se *mide*.
- Husserl: la ciudad es mundo-de-vida, no dato objetivo previo.
- Merleau-Ponty: el cuerpo es el primer instrumento.
- Lefebvre: el espacio se produce socialmente, ritmoanálisis.
- Haraway: conocimiento situado — no hay mirada neutra.
- La pregunta que cargamos: ¿alcanza con caminar y describir?

## 3. El recorrido — Stev (2 min)

- 5 nodos del centro: estación San Antonio, parque San Antonio, pasaje La Bastilla, pasaje Junín, parque Botero.
- Una jornada (8 a.m. a noche). Los dos llevamos cuaderno, cámara, audio.
- 34 fotos georreferenciadas, 17 videos, **14 entrevistas a transeúntes y vendedores**.
- Corredor coherente: por eso pudimos triangular nodo por nodo.

## 4. El choque inter-observador — Jacob (2 min)

- Misma plaza, mismo día, dos lecturas opuestas.
- Parque San Antonio: Stev escribe *"tranquilidad en medio del ruido, no está rota la ventana"*. Yo escribí *"paso histórico del terror, vandalismo apela a Dios"*.
- No es que uno se equivoque: cada uno percibe desde dónde es.
- Cuantificado con Cohen's kappa: **κ = 0.0** sobre los 4 nodos compartidos.
- **Esto no es ruido a corregir: es el dato fenomenológico que la tesis ataca.**

## 5. Lo que el pipeline midió — Stev (3 min)

- 4 criterios cuantitativos por nodo×franja (9 nodos × 4 franjas = 36 celdas):
  - C1 criminalidad histórica (MEData)
  - C2 seguridad percibida (encuesta — pendiente)
  - C3 habitabilidad declarada (entrevistas codificadas)
  - C4 saturación visual (YOLO sobre videos)
- Regla "3 de 4": una celda **colapsa** si 3 criterios fallan. Falsable.
- Audio: PANNs sobre 17 videos. Junín tiene música constante (1.0 ratio). Berrío registra el pico de ruido del corpus (-24.3 dB).
- Cross-validation: el dato visual confirma lo narrado. *"Sofocante en Botero"* → densidad humana máxima 30 personas/frame en parque Berrío. *"Miedo de cruzar San Antonio"* → vehicle_intensity 0.378 (tope del corpus).

## 6. La matriz — Jacob (2 min)

- Resultado: **0/36 colapsos · 6/36 fricción acumulada · 30/36 inconcluyente**.
- Cero colapsos confirmados. Y eso está bien — significa que la regla podía fallar y no la activamos sin evidencia.
- 2 celdas se sostienen como pilares bajo bootstrap (1000 iteraciones):
  - **Junín peak_am**: C1+C4 (criminalidad + saturación), 95.6% robusta.
  - **Botero midday**: C1+C3 (criminalidad + testimonios negativos), 97% robusta.
- 4 celdas frágiles: dependen del umbral exacto. Lo declaramos.

## 7. Limitaciones honestas — Stev (2 min)

- C2 ausente entera (no alcanzamos a hacer encuesta cuantitativa). Sesga el sistema hacia "fricción" antes que "colapso".
- Sub-zonas Coltejer-Ayacucho y "calle del consumo" definidas porque salieron en entrevistas — pero no las muestreamos. El campo nos pidió ir, no fuimos.
- 15 entrevistas es muestra pequeña. 1 sola entrevista con testimonio sustantivo grabado.
- Audio celular satura la firma armónica → no podemos confirmar reggaetón vs vallenato por modelo, solo por ratio de actividad musical.
- 2 observadores es estadísticamente débil para κ. Lo enmarcamos como **piloto**, no medición definitiva.

## 8. Tesis — Jacob (2 min)

- **La fenomenología sola no basta para abordar la ciudad.**
- κ=0 lo prueba: dos miradas formadas producen lecturas opuestas sin instrumento que arbitre.
- Pero al triangular fenomenología (lo que vivimos) + simulación M-MASS + HPC + matriz falsable, la metodología sí discrimina:
  - Lo que se sostiene cuantitativamente (Junín peak_am, Botero midday).
  - Lo que es frágil (4 celdas).
  - Lo que no podemos afirmar (30 inconcluyentes).
- Eso no es fracaso fenomenológico: es la fenomenología **operada** con anclaje empírico.

## 9. Cierre — Stev (2 min)

- Lo que nos llevamos:
  - La fenomenología no se rinde ante los datos: pide más que ella misma.
  - "Sobre-elaborar" la tarea sirvió para descubrir el límite del método clásico.
  - Hay 2 hallazgos que nos atrevemos a sostener; el resto queda inconcluyente y eso es honesto.
- Lo que falta:
  - Encuesta de seguridad (C2).
  - Volver a muestrear Coltejer-Ayacucho y la calle del consumo.
  - Triangular con más observadores.
- Una frase para cerrar: *Caminar la ciudad sigue siendo el primer dato. No es el único.*

---

## Reparto rápido (referencia)

| # | Min | Quien | Tema |
|---|---|---|---|
| 1 | 0–1 | Stev | Apertura + reconocimiento del over-engineering |
| 2 | 1–3 | Jacob | Marco fenomenológico mínimo |
| 3 | 3–5 | Stev | El recorrido, qué hicimos en campo |
| 4 | 5–7 | Jacob | Choque inter-observador (κ=0) |
| 5 | 7–10 | Stev | Pipeline cuantitativo + cross-val |
| 6 | 10–12 | Jacob | Matriz: 0/6/30 + 2 pilares |
| 7 | 12–14 | Stev | Limitaciones (sin sobre-disculparse) |
| 8 | 14–16 | Jacob | Tesis: fenomenología no basta |
| 9 | 16–18 | Stev | Cierre + agenda |
| Q&A | 18–20 | ambos | Preguntas |

---

## Preguntas anticipables (apuntes mentales)

- **"¿Por qué tanto cómputo para una salida de campo?"** → No nos pidieron esto; es honesto que sobre-elaboramos. Pero el ejercicio mostró el límite del método clásico: si dos observadores no concuerdan, ¿qué se reporta?
- **"¿0/36 colapsos no es fracaso?"** → No: es la regla 3-de-4 funcionando. Una regla que nunca falsea no es regla.
- **"¿κ=0 con n=2 no es estadísticamente débil?"** → Sí. Por eso lo enmarcamos como piloto y como evidencia cualitativa de divergencia, no como medición poblacional.
- **"¿No están sobre-interpretando los videos con YOLO?"** → YOLO detecta lo que está entrenado a detectar. Por eso declaramos 6 reclamos *no evaluables* (vandalismo, indigencia, consumo, policía, etc.).
- **"¿Por qué creen que la fenomenología no basta?"** → Porque vivimos la divergencia. La triangulación no la *resuelve*, la *opera* — distingue lo que se sostiene de lo que no.
