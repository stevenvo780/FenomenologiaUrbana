# Plan de refactor del Deck — Fenomenología Urbana

> Objetivo: realinear las 16 slides con la tesis actual (Husserl · Bueno · Foucault · Deleuze · Badiou · Merleau-Ponty · Simmel), **reducir la sobrecarga de datos numéricos** y sustituirlos por **animaciones conceptuales y experiencias visuales** que hagan palpable lo fenomenológico para un tribunal filosófico (no para un jurado técnico).

---

## 0. Diagnóstico general (qué está mal hoy)

### 0.1 Desalineación tesis ↔ deck

La tesis real (en [tesis/01-introduccion-y-marco-teorico.md](tesis/01-introduccion-y-marco-teorico.md), [tesis/02-metodologia-y-diseno-hpc.md](tesis/02-metodologia-y-diseno-hpc.md), [tesis/03-resultados-y-analisis-de-turbulencia.md](tesis/03-resultados-y-analisis-de-turbulencia.md), [tesis/04-conclusiones-y-referencias-bibliograficas.md](tesis/04-conclusiones-y-referencias-bibliograficas.md)) defiende cuatro tesis que **no aparecen explícitamente** en el deck:

1. **Reducción eidética computacional**: el HPC como método fenomenológico, no como ingeniería.
2. **Symploké materialista M1/M2/M3** (Bueno): campos físicos × intencionalidad sintética × panóptico de flujo.
3. **El fracaso del modelo como verdad ontológica**: el colapso a 500k agentes es el hallazgo, no un bug.
4. **Aporía del dato informal** (`pending_no_capture`) como "miembro fantasma" merleau-pontiano.

Además, el material de clase ([fenomenologia.md](fenomenologia.md)) añade el **Laboratorio de Campo sobre heterotopías (Foucault)** que el deck ignora por completo.

El deck actual, en cambio, comunica: pipeline → mapa → simulación → gráficos → calibración → cierre. Es un *dashboard de ingeniero urbano*, no una *defensa doctoral en filosofía*.

### 0.2 Sobrecarga de datos (inventario por slide)

Recorriendo [src/presentation/slides/](src/presentation/slides/):

| Slide | Archivo | Densidad de dato | Problema principal |
|---|---|---|---|
| 01 Apertura | [src/presentation/slides/OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx) | Alta (KPIs de pipeline/fuentes/escenarios) | Abre con métricas de ingeniería, no con la pregunta filosófica |
| 02 Stack/Método | [src/presentation/slides/MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx) | Media | Describe stack técnico en lugar de los tres estratos M1/M2/M3 |
| 03 Mapa | [src/presentation/slides/MapSlide.tsx](src/presentation/slides/MapSlide.tsx) | Muy alta (Leaflet + selectores) | Mapa "plano", sin capas heterotópicas ni atmósfera |
| 04 Perfiles | [src/presentation/slides/ProfilesSlide.tsx](src/presentation/slides/ProfilesSlide.tsx) | Muy alta | Compara DRL agents como si fueran personas reales; no se lee como "dividuales" |
| 05 Presión (Horas) | [src/presentation/slides/PressureSlide.tsx](src/presentation/slides/PressureSlide.tsx) | Alta | Barras horarias sin hacer visible el *ritmo vivido* |
| 06 Simulación (Clip) | [src/presentation/slides/SimulationSlide.tsx](src/presentation/slides/SimulationSlide.tsx) | Media | Clip estático, no transmite multitud |
| 07 Desigualdad | [src/presentation/slides/InequalitySlide.tsx](src/presentation/slides/InequalitySlide.tsx) | Alta | Gini numérico seco |
| 08 Calibración | [src/presentation/slides/CalibrationSlide.tsx](src/presentation/slides/CalibrationSlide.tsx) | **Altísima** | Tabla multipunto, jerga HPC, ilegible para un tribunal filosófico |
| 09 Multitudes 24h | [src/presentation/slides/CrowdDynamicsSlide.tsx](src/presentation/slides/CrowdDynamicsSlide.tsx) | Alta | 4 heatmaps iguales sin narración |
| 10 Estrés | [src/presentation/slides/StressSlide.tsx](src/presentation/slides/StressSlide.tsx) | Alta (ComposedChart + chaos) | El **Acontecimiento** queda escondido en una línea de gráfico |
| 11 Ambiente PDE | [src/presentation/slides/EnvironmentSlide.tsx](src/presentation/slides/EnvironmentSlide.tsx) | Alta | PDE como paper, no como atmósfera |
| 12 Visibilidad | [src/presentation/slides/VisibilitySlide.tsx](src/presentation/slides/VisibilitySlide.tsx) | Media | Isovistas sin cuerpo que las mire |
| 13 Gravedad económica | [src/presentation/slides/EconomySlide.tsx](src/presentation/slides/EconomySlide.tsx) | Alta | Bar chart estándar + Gini, muy de paper urbanista |
| 14 Historia | [src/presentation/slides/HistorySlide.tsx](src/presentation/slides/HistorySlide.tsx) | Media | Series 2012/2018/2024 sin sentido fenomenológico |
| 15 Empiria | [src/presentation/slides/EvidenceSlide.tsx](src/presentation/slides/EvidenceSlide.tsx) | Alta | Estado de fuentes como checklist devops |
| 16 Cierre | [src/presentation/slides/ClosingSlide.tsx](src/presentation/slides/ClosingSlide.tsx) | Baja | No remata con los tres postulados doctorales |

### 0.3 Faltan animaciones creativas

El deck usa `framer-motion` solo para transiciones entre slides. No hay:

- secuencias animadas dentro de cada slide,
- revelado progresivo del argumento (step-by-step),
- *ghost trajectories* de agentes,
- transiciones entre los tres estratos M1 → M2 → M3,
- metáforas visuales del colapso, la actitud blasé o el miembro fantasma.

### 0.4 Falta la heterotopía foucaultiana

El Laboratorio de Campo (ver selección en [fenomenologia.md](fenomenologia.md#L3430-L3506)) introduce **heterotopías** (crisis/desviación, ilusión/compensación, apertura/cierre) como eje del trabajo empírico. El deck debe tener al menos **una slide dedicada** y referencias cruzadas en mapa, campo y cierre.

---

## 1. Principios de diseño para el refactor

1. **Una idea por slide**. Si el tribunal no puede resumirla en una frase, hay que podar.
2. **Dato solo como evidencia de un concepto filosófico**. Nunca dato por sí mismo. Todo número debe ir precedido de una pregunta fenomenológica.
3. **Animación > Gráfico** cuando el objetivo es comunicar experiencia (ritmo, atmósfera, colapso, filtrado). Gráfico solo cuando el objetivo es probar.
4. **Revelado progresivo** (`stagger`) dentro de cada slide: el argumento se construye, no se vuelca.
5. **Vocabulario fenomenológico consistente**: *Lebenswelt*, symploké, dividual, blasé, acontecimiento, heterotopía, miembro fantasma. Los términos técnicos (DRL, PDE, KL) aparecen **subtitulados** por su equivalente filosófico.
6. **Paleta atmosférica**, no paleta dashboard. Usar velos, blur, grano, latido; reservar el rojo/acento para el Acontecimiento (slide 10).
7. **Densidad máxima por slide**: 1 titular + 1 visual protagonista + 2–3 KPIs opcionales. Eliminar todo lo demás.

---

## 2. Nueva estructura narrativa (16 slides → 15 slides re-secuenciadas)

El orden propuesto sigue la arquitectura de la tesis: **pregunta → método → evidencia → acontecimiento → denuncia**.

```
Acto I — La pregunta fenomenológica (01–03)
Acto II — El aparato (symploké M1/M2/M3) (04–07)
Acto III — La evidencia de la asfixia (08–11)
Acto IV — El Acontecimiento y su residuo (12–13)
Acto V — La denuncia doctoral (14–15)
```

### Mapa completo

| # | Nuevo título | Idea única | Sustituye a | Reemplazo principal |
|---|---|---|---|---|
| 01 | Volver a la calle misma | Pregunta husserliana sobre Junín | OpenSlide | Quote animada + silueta del corredor |
| 02 | La crisis de la ciudad matematizada | Husserl 1936 → urbanismo funcional | (nueva) | Diagrama animado de "amputación ontológica" |
| 03 | Symploké: tres materialidades | M1/M2/M3 (Bueno) como eje del deck | MethodSlide | Diagrama animado en 3 capas |
| 04 | Heterotopías del centro | Foucault: contra-sitios en Junín-San Antonio | (nueva, reemplaza parte de MapSlide) | Mapa con 3 capas de heterotopías |
| 05 | El corredor como campo | Mapa Leaflet sobrio, sin dashboards | MapSlide (simplificado) | Leaflet + overlay de atmósfera |
| 06 | Campos estigmérgicos (M1) | PDE como "atmósfera objetiva" | EnvironmentSlide | Heatmap con grano respirando |
| 07 | Dividuales (M2) | Agentes DRL como dividuales deleuzianos | ProfilesSlide | 5 siluetas con trayectoria fantasma |
| 08 | El ritmo vivido | Presión 24h como pulso, no como barras | PressureSlide + HistorySlide fusión parcial | Reloj circular latiente |
| 09 | Actitud blasé computacional | Filtrado perceptual (LayerNorm/Dropout) | (nueva, usa material de SimulationSlide) | Animación de filtrado progresivo |
| 10 | **El Acontecimiento** (500k) | Tipping point badiouano | StressSlide | Colapso animado, curva como evento |
| 11 | Asfixia de la emergencia | σ_rel ≈ 0.00026 → superdeterminación | CalibrationSlide + InequalitySlide | Un solo número grande + explicación |
| 12 | Gravedad del comercio | Economía como curvatura del espacio | EconomySlide | Nodos con campo gravitatorio animado |
| 13 | El miembro fantasma | `pending_no_capture` como residuo incomputable | EvidenceSlide | Silueta del campo faltante |
| 14 | Tres postulados doctorales | Cierre argumentativo | ClosingSlide | 3 cartas animadas |
| 15 | Protocolo de campo y agenda | 24 abril → 8 mayo, heterotopías pendientes | (nueva, reemplaza VisibilitySlide) | Timeline + QR a protocolo |

**Slides absorbidas/eliminadas**: `SimulationSlide` (se integra a 07 y 09), `VisibilitySlide` (se reabsorbe en 04 como capa), `CrowdDynamicsSlide` (se integra a 08 como ritmo).

---

## 3. Refactor detallado por slide

> Convención: **Titular** / **Subtítulo** / **Visual protagonista** / **Animación** / **KPIs permitidos** / **Texto eliminado**.

### Slide 01 — Volver a la calle misma

- **Titular**: "Volver a la calle misma"
- **Subtítulo**: "Una fenomenología del corredor Junín–San Antonio"
- **Visual protagonista**: silueta vectorial animada de la calle (línea que se traza sola de sur a norte en ~4s) sobre fondo gris neblina.
- **Animación**:
  - cita de Husserl aparece letra por letra (typewriter lento, sin cursor parpadeante, ver nota de memoria debugging).
  - tres palabras clave emergen debajo con stagger 200ms: `fenómeno` · `lógos` · *Lebenswelt*.
- **KPIs permitidos**: ninguno. Fuera del tribunal no necesitamos pipeline_version al abrir.
- **Eliminar**: grid de `KpiPill` con Pipeline/Fuentes/Escenarios (mover a slide 15).
- **Refactor**: [src/presentation/slides/OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx) — reducir a ~80 líneas, un solo `motion.div` con la línea SVG.

### Slide 02 — La crisis de la ciudad matematizada (nueva)

- **Titular**: "Crisis, 1936"
- **Subtítulo**: "Husserl diagnostica la amputación del *Lebenswelt*"
- **Visual protagonista**: diagrama de dos paneles que se dividen:
  - izquierda "Ciudad como grafo" (red geométrica fría),
  - derecha "Ciudad como mundo vivido" (neblina, siluetas, sonido implícito),
  - un tajo vertical anima la amputación.
- **Animación**: el grafo de la izquierda se expande y "corta" el lado derecho, dejando un residuo que titila.
- **Crear**: `src/presentation/slides/CrisisSlide.tsx`.
- **Apoyo textual** (1 línea): "Cuando la ciudad se vuelve cálculo, el mundo de la vida queda como residuo."

### Slide 03 — Symploké: tres materialidades

- **Titular**: "Symploké Urbana"
- **Subtítulo**: "M1 físico · M2 intencional · M3 normativo (Bueno)"
- **Visual protagonista**: tres capas horizontales apiladas que se iluminan en secuencia:
  - M1: campo continuo de ondas (PDE) en azul frío,
  - M2: constelación de puntos luminosos (agentes DRL) en ámbar,
  - M3: retícula panóptica tenue en gris.
- **Animación**:
  - cada capa aparece con fade + ligero skew 3D (framer-motion `rotateX`),
  - flechas de acoplamiento M1↔M2↔M3 se dibujan al final.
- **Sustituye**: [src/presentation/slides/MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx) — el stack técnico (Vite/Leaflet/Python) se saca del deck y se deja en el README.
- **KPIs permitidos**: 0.

### Slide 04 — Heterotopías del centro (nueva) ⭐

- **Titular**: "Heterotopías del centro"
- **Subtítulo**: "Foucault en Junín–San Antonio: contra-sitios del orden"
- **Visual protagonista**: mapa esquemático (no Leaflet; SVG estilizado) con 3 capas conmutables:
  1. **Crisis / desviación**: cementerio de San Pedro, antigua cárcel, zonas de exclusión sanitaria.
  2. **Ilusión / compensación**: centros comerciales del corredor (Villanueva, etc.), atrios "limpios".
  3. **Apertura / cierre**: templos, zonas de tolerancia, fronteras invisibles entre tramos.
- **Animación**: cada capa entra y sale con desplazamiento vertical y opacidad; tarjetas laterales explican las 3 categorías cuando se activa cada capa.
- **Crear**: `src/presentation/slides/HeterotopiasSlide.tsx`.
- **Fuente narrativa**: [fenomenologia.md](fenomenologia.md#L3430-L3506) (Laboratorio de Campo).
- **Importancia**: es la slide que conecta el deck con la consigna del curso y con el Laboratorio de Campo del 24 abril → 8 mayo.

### Slide 05 — El corredor como campo

- **Titular**: "El corredor como campo"
- **Subtítulo**: "De la traza administrativa al espacio vivido"
- **Visual protagonista**: Leaflet con **un solo overlay** (densidad peak_pm en gradiente suave), sin selectores, sin perfiles, sin rutas comparadas.
- **Animación**: overlay respira (opacidad 0.25 ↔ 0.45 a 4s loop).
- **Sustituye**: [src/presentation/slides/MapSlide.tsx](src/presentation/slides/MapSlide.tsx) — quitar selectores de agent/compareAgent/scenario; esos controles se mueven a un panel "modo exploración" oculto por defecto.
- **KPIs permitidos**: ninguno en pantalla principal; sólo un hint "pulsa E para modo exploración".

### Slide 06 — Campos estigmérgicos (M1)

- **Titular**: "El aire también decide la ruta"
- **Subtítulo**: "PM2.5 y ruido como señales estigmérgicas negativas"
- **Visual protagonista**: dos heatmaps lado a lado (PM2.5 / Ruido) con grano dinámico (canvas noise) superpuesto.
- **Animación**:
  - partículas punteadas flotan siguiendo el gradiente,
  - un cuerpo silueta entra por la parte baja y su contorno se satura cuando atraviesa zonas rojas (alusión al filtrado blasé).
- **Sustituye**: [src/presentation/slides/EnvironmentSlide.tsx](src/presentation/slides/EnvironmentSlide.tsx). Eliminar ecuación PDE del panel principal; dejarla como *tooltip* opcional.
- **KPIs permitidos**: 2 (ΔPM2.5 pico, ΔdB pico).

### Slide 07 — Dividuales (M2)

- **Titular**: "Dividuales, no individuos"
- **Subtítulo**: "Deleuze en la red neuronal"
- **Visual protagonista**: 5 siluetas humanas (turista, vendedor, comprador, commuter, movilidad reducida) caminando en loop, cada una deja una **trayectoria fantasma** que se desvanece. Sobre cada silueta, un *halo* que representa la red neuronal.
- **Animación**:
  - cada silueta se fragmenta en ~20 puntos estadísticos al final del loop (momento "dividual"),
  - los halos parpadean cuando se filtra estímulo (blasé).
- **Sustituye**: [src/presentation/slides/ProfilesSlide.tsx](src/presentation/slides/ProfilesSlide.tsx) — eliminar tabla comparativa de rutas, mover a modal.
- **KPIs permitidos**: 1 por silueta (tiempo medio, no más).

### Slide 08 — El ritmo vivido

- **Titular**: "La ciudad tiene pulso"
- **Subtítulo**: "Densidad 24h como latido, no como barras"
- **Visual protagonista**: **reloj circular de 24 posiciones** que pulsa en función de la densidad; el color oscila de calma (azul) a saturación (rojo).
- **Animación**:
  - un cursor barre las 24 horas en ~12s,
  - al cruzar el pico PM aparece un flash breve con el número grande "18:00 · 847 p/min",
  - abajo, un sparkline histórico 2012/2018/2024 minimalista (absorbe HistorySlide parcialmente).
- **Sustituye**: [src/presentation/slides/PressureSlide.tsx](src/presentation/slides/PressureSlide.tsx) + parte de [src/presentation/slides/HistorySlide.tsx](src/presentation/slides/HistorySlide.tsx) y [src/presentation/slides/CrowdDynamicsSlide.tsx](src/presentation/slides/CrowdDynamicsSlide.tsx).
- **Eliminar**: 4 heatmaps apilados de CrowdDynamics, ComposedChart de horas.
- **KPIs permitidos**: 2 (pico AM, pico PM).

### Slide 09 — Actitud blasé computacional (nueva)

- **Titular**: "Filtrar para sobrevivir"
- **Subtítulo**: "LayerNorm/Dropout como actitud blasé (Simmel)"
- **Visual protagonista**: una calle con ~30 estímulos discretos (afiches, bocinas, vendedores, sirenas); al activarse el filtro, el ~90% se desaturan hasta quedar en gris neblina, sólo permanece nítido el destino.
- **Animación**: stagger de desaturación estímulo por estímulo, acompañado de texto que aparece: "La red aprende a no ver".
- **Crear**: `src/presentation/slides/BlaseSlide.tsx`. Puede reutilizar assets de [src/presentation/slides/SimulationSlide.tsx](src/presentation/slides/SimulationSlide.tsx).

### Slide 10 — El Acontecimiento (500k) ⭐

- **Titular**: "500.000"
- **Subtítulo**: "El punto de quiebre fenomenológico (Badiou)"
- **Visual protagonista**: curva única, enorme, de entropía vs agentes; al alcanzar 500k, la curva **estalla** (partículas que se dispersan) y el fondo vira a rojo.
- **Animación**:
  - la curva se dibuja en 3s,
  - al tocar el tipping point, freeze de 300ms + pulso de pantalla,
  - aparece la palabra "ACONTECIMIENTO" en 4rem.
- **Sustituye**: [src/presentation/slides/StressSlide.tsx](src/presentation/slides/StressSlide.tsx) — quitar segundo panel de chaos; queda en modal.
- **KPIs permitidos**: 1 (ΔH: 4.59 → 5.40).

### Slide 11 — Asfixia de la emergencia

- **Titular**: "σ = 0.00026"
- **Subtítulo**: "La libertad de ruta ha colapsado"
- **Visual protagonista**: gran número central; debajo, dos nubes de trayectorias ("ideal sin fricción" vs "efectiva") que convergen casi a una sola línea.
- **Animación**: las trayectorias ideales (dispersas, azules) se "succionan" hacia la trayectoria única (roja) en ~4s. Texto aparece "lo que parece precisión es asfixia".
- **Sustituye**: [src/presentation/slides/CalibrationSlide.tsx](src/presentation/slides/CalibrationSlide.tsx) + [src/presentation/slides/InequalitySlide.tsx](src/presentation/slides/InequalitySlide.tsx) fusionadas.
- **KPIs permitidos**: σ_rel, Gini, KL. Máximo 3.
- **Eliminar**: tabla multipunto de calibración, dejar en modal.

### Slide 12 — Gravedad del comercio

- **Titular**: "El comercio curva el espacio"
- **Subtítulo**: "Gravedad económica y asimetría del centro"
- **Visual protagonista**: nodos comerciales como masas con su **campo gravitatorio** visible (líneas equipotenciales); peatones-partículas caen hacia los 3 nodos dominantes.
- **Animación**: peatones se aceleran al acercarse a hubs; al final, un Gini aparece como *distortion index*.
- **Sustituye**: [src/presentation/slides/EconomySlide.tsx](src/presentation/slides/EconomySlide.tsx) — quitar BarChart, dejarlo en modal.
- **KPIs permitidos**: Gini espacial, 3 hubs dominantes.

### Slide 13 — El miembro fantasma

- **Titular**: "El dato que falta"
- **Subtítulo**: "`pending_no_capture` como miembro fantasma (Merleau-Ponty)"
- **Visual protagonista**: contorno de un cuerpo/mano dibujado con línea discontinua, relleno translúcido que pulsa; alrededor, los datasets "capturados" (puntos llenos) rodean pero no tocan el residuo.
- **Animación**: los puntos capturados orbitan lentamente; el contorno del miembro fantasma late a 0.6s.
- **Sustituye**: [src/presentation/slides/EvidenceSlide.tsx](src/presentation/slides/EvidenceSlide.tsx) — el checklist de fuentes va a modal; la slide principal comunica la aporía, no el estado.
- **KPIs permitidos**: 1 (ratio fuentes documentadas / totales).

### Slide 14 — Tres postulados doctorales

- **Titular**: "Tres postulados"
- **Subtítulo**: "El fracaso del modelo como verdad ontológica"
- **Visual protagonista**: tres tarjetas verticales que se giran (flip 3D) en secuencia:
  1. *Contra el instrumentalismo*.
  2. *Soberanía fenomenológica*.
  3. *El colapso como denuncia*.
- **Animación**: cada tarjeta se ilumina al leerse; al final, las tres se funden en una línea final: "No optimizar: auditar".
- **Sustituye**: [src/presentation/slides/ClosingSlide.tsx](src/presentation/slides/ClosingSlide.tsx).

### Slide 15 — Protocolo de campo y agenda

- **Titular**: "Abrir la caja negra"
- **Subtítulo**: "Laboratorio de campo 24 abr → 8 may"
- **Visual protagonista**: timeline horizontal con 3 hitos (asignación 24/04, captura heterotópica, presentación 08/05); debajo, mini-mapa con los 6 nodos heterotópicos a visitar.
- **Animación**: el timeline se rellena progresivamente; cada hito despliega una tarjeta con pregunta guía ("¿qué cuerpos organiza?", "¿qué atmósfera produce?").
- **Crear**: `src/presentation/slides/FieldProtocolSlide.tsx`. Absorbe el contenido útil de [src/presentation/slides/VisibilitySlide.tsx](src/presentation/slides/VisibilitySlide.tsx) como modal (isovistas = herramienta para medir "qué se ve" en heterotopías).
- **KPIs permitidos**: días restantes, nodos pendientes, plantilla de captura (ver [investigacion/docs/protocolo-campo-minimo.md](investigacion/docs/protocolo-campo-minimo.md)).

---

## 4. Animaciones reutilizables a construir

Crear en `src/presentation/components/visuals/`:

1. `TraceLine.tsx` — línea SVG que se dibuja sola (usado en 01, 05).
2. `BreathingField.tsx` — heatmap con opacidad respirante y grano (6, 8).
3. `GhostTrajectories.tsx` — trayectorias fantasma que se desvanecen (07, 11).
4. `DividualSilhouette.tsx` — silueta que se fragmenta en puntos (07).
5. `BlaseFilter.tsx` — estímulos desaturándose en stagger (09).
6. `EventBurst.tsx` — explosión de partículas al tipping point (10).
7. `GravityField.tsx` — equipotenciales + partículas cayendo (12).
8. `PhantomLimb.tsx` — contorno discontinuo pulsante (13).
9. `FlipCard.tsx` — tarjeta 3D flip (14).
10. `PulsingClock.tsx` — reloj 24h con pulso (08).

Principios comunes:

- Todos aceptan `prefersReducedMotion` y degradan a estática.
- Todos miden contenedor con `MeasuredChart` / `ResizeObserver` (no usar `ResponsiveContainer` offscreen, ver nota de memoria).
- Loops lentos (4–8s) para no distraer del discurso oral.

---

## 5. Paleta y tipografía

- **Fondo**: `#0b0b0d` (casi negro) con gradiente radial suave.
- **Texto primario**: `#eae6dc` (cálido, no blanco puro).
- **Atenuado**: `#8a867c`.
- **Acento frío (M1)**: `#6fb3d2`.
- **Acento cálido (M2)**: `#d9a559`.
- **Retícula (M3)**: `#3a3a40`.
- **Acontecimiento**: `#ff2d55` (reservado para slide 10 y flashes críticos).
- **Tipografía títulos**: serif con carácter (e.g., *Fraunces* o *Playfair*), 4–6rem.
- **Tipografía cuerpo**: sans humanista (e.g., *Inter* o *IBM Plex Sans*), 1.05rem máximo.
- **Nunca** usar emojis en slides.

---

## 6. Modales (donde se esconde el dato técnico)

Todo lo que hoy está en el deck y es "dato para paper" se mueve a [src/presentation/components/DataModal.tsx](src/presentation/components/DataModal.tsx) con estas categorías:

- `modal/method` — stack técnico, versiones, pipeline_version.
- `modal/calibration` — tabla multipunto, deltas, KL.
- `modal/sources` — checklist completo de datasets.
- `modal/economy-table` — top nodos por commerce.
- `modal/chaos` — curvas secundarias del stress.
- `modal/visibility` — isovistas detalladas.
- `modal/history` — series 2012/2018/2024 completas.

Los modales se abren con tecla `D` (data) o click en botones discretos "ver evidencia completa" en cada slide. Así el tribunal técnico tiene acceso al dato, pero el argumento no se ahoga en él.

---

## 7. Navegación y cronometraje

- **Atajo `R`**: modo reducido de movimiento (para captura).
- **Atajo `E`**: modo exploración (revela selectores en 05).
- **Atajo `D`**: abre modal de dato técnico de la slide activa.
- **Duración objetivo por slide**: 60–75s; deck total ~18–20 min + 10 min preguntas.
- **Progreso visual**: barra inferior segmentada en 5 actos (I–V), no en 15 pasos.

---

## 8. Checklist de implementación (ordenado por impacto)

### Fase A — Reestructura narrativa (alto impacto, ~bajo esfuerzo)

- [ ] Reescribir [src/presentation/constants.ts](src/presentation/constants.ts) con los 15 ids nuevos y los 5 actos.
- [ ] Purgar KPIs del slide 01 en [src/presentation/slides/OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx).
- [ ] Crear `CrisisSlide.tsx` (02) y `HeterotopiasSlide.tsx` (04).
- [ ] Fusionar InequalitySlide + CalibrationSlide → `AsphyxiaSlide.tsx` (11).
- [ ] Crear `BlaseSlide.tsx` (09) y `FieldProtocolSlide.tsx` (15).
- [ ] Eliminar de la barra de slides: `SimulationSlide`, `VisibilitySlide`, `CrowdDynamicsSlide` (o reciclarlos como componentes internos).

### Fase B — Componentes visuales reutilizables

- [ ] Crear los 10 componentes de `visuals/` listados en §4.
- [ ] Cubrir `prefersReducedMotion` en todos.
- [ ] Sustituir `Bar/ComposedChart` en StressSlide por `EventBurst`.
- [ ] Sustituir `BarChart` en EconomySlide por `GravityField`.

### Fase C — Contenido filosófico

- [ ] Redactar los textos de titular/subtítulo con vocabulario Husserl/Bueno/Foucault/Deleuze/Badiou/Merleau-Ponty/Simmel.
- [ ] Añadir citas cortas (1 por acto) con atribución en pie de slide.
- [ ] Verificar que cada slide tenga **una** idea identificable en 1 frase.

### Fase D — Modales y dato técnico

- [ ] Ampliar [src/presentation/components/DataModal.tsx](src/presentation/components/DataModal.tsx) con las 7 categorías de §6.
- [ ] Mover BarChart de comercio, tabla de calibración, checklist de fuentes e isovistas a modales.
- [ ] Añadir atajo global `D` en [src/presentation/hooks/useDeckController.ts](src/presentation/hooks/useDeckController.ts) (si existe) o crearlo.

### Fase E — Estética

- [ ] Actualizar paleta en [src/presentation.css](src/presentation.css).
- [ ] Instalar fuentes serif + sans (self-hosted).
- [ ] Añadir gradiente radial de fondo + grano sutil global.
- [ ] Reservar color `--event-red` solo para slide 10.

### Fase F — Validación

- [ ] `npm run lint` y `npm run build` limpios.
- [ ] Validar overflow con medición real en navegador (ver nota en [memories/repo](memories/repo/fenomenologia-urbana.md) sobre `visibleBottom`).
- [ ] Cronometrar cada slide con un compañero (objetivo 60–75s).
- [ ] Ensayo con `R` activado para verificar que el deck también funciona sin animaciones.

---

## 9. Riesgos y decisiones abiertas

1. **Riesgo de tecnicismo residual**: aunque movamos el dato a modales, el jurado puede pedir explicaciones de PDE/DRL. Mantener en modales, preparar 3 frases de respuesta oral.
2. **Riesgo estético**: `EventBurst` y `GravityField` con partículas pueden resultar *videoclip*. Tope: 30 partículas, movimiento suave, sin brillos.
3. **Decisión pendiente**: ¿eliminar definitivamente `VisibilitySlide` o integrarla como modal foucaultiano ("dispositivo panóptico")? Propuesta: **modal** accesible desde slide 04 (heterotopías) y 10 (acontecimiento).
4. **Decisión pendiente**: ¿el material HPC histórico 2012/2018/2024 merece slide propia? Propuesta: **no**; ir como sparkline en slide 08.
5. **Bloqueo conocido** (ver memory): DANE CNPV 403 → declarar explícitamente en slide 13 ("miembro fantasma") en vez de esconderlo.

---

## 10. Resumen ejecutivo

- De 16 a 15 slides, reorganizadas en 5 actos filosóficos.
- Se eliminan 3 slides tipo-dashboard (Simulation, Visibility, CrowdDynamics) y se crean 4 slides conceptuales nuevas (Crisis, Heterotopías, Blasé, Protocolo).
- Cada slide tiene **una** idea y **una** animación protagonista.
- Todo dato técnico migra a 7 modales accesibles bajo demanda.
- Se añaden 10 componentes visuales reutilizables (`TraceLine`, `BreathingField`, `GhostTrajectories`, `DividualSilhouette`, `BlaseFilter`, `EventBurst`, `GravityField`, `PhantomLimb`, `FlipCard`, `PulsingClock`).
- La Heterotopía foucaultiana del Laboratorio de Campo por fin entra al deck (slide 04 + slide 15).
- La paleta pasa de dashboard a atmosférica; el rojo se reserva para el Acontecimiento.
- El deck deja de parecer un reporte de ingeniería urbana y vuelve a ser una **defensa fenomenológica doctoral**.
