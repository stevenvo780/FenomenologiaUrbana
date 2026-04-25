# Plan de refactor quirúrgico del Deck — Fenomenología Urbana

> Este plan **asume el deck actual al 90% hecho**. No se reescribe nada desde cero. Cada tarea declara: _archivo existente_ → _acción precisa_ → _qué queda, qué se poda, qué se agrega_.
>
> Inventario real verificado: 16 slides en [src/presentation/slides/](src/presentation/slides/), 9 componentes visuales en [src/presentation/components/visuals/](src/presentation/components/visuals/), primitivas UI en [src/presentation/components/ui.tsx](src/presentation/components/ui.tsx), modal con 5 categorías en [src/presentation/components/DataModal.tsx](src/presentation/components/DataModal.tsx), 3389 líneas de CSS en [src/presentation.css](src/presentation.css).

---

## 1. Diagnóstico — lo que **ya funciona** y no hay que tocar

| Asset | Archivo | Estado | Uso en refactor |
|---|---|---|---|
| Shell + transiciones | [ui.tsx](src/presentation/components/ui.tsx) | ✅ sólido | Reutilizar tal cual |
| Leaflet del corredor | [CorridorMap.tsx](src/presentation/components/visuals/CorridorMap.tsx) | ✅ | Reutilizar en slide 03 |
| Grafo SVG animado | [NetworkView.tsx](src/presentation/components/visuals/NetworkView.tsx) | ✅ pathLength + whileInView | Reutilizar para "symploké" |
| Constelación orbital | [HeroConstellation.tsx](src/presentation/components/visuals/HeroConstellation.tsx) | ✅ | Mover a slide 01 (apertura) |
| **Partículas sobre rutas** | [AnimatedSimulationStage.tsx](src/presentation/components/visuals/AnimatedSimulationStage.tsx) | ✅✅ `animateMotion` SVG | Pieza central para slide "Acontecimiento" |
| Clip MP4 del pipeline | [RecordedSimulationClip.tsx](src/presentation/components/visuals/RecordedSimulationClip.tsx) | ✅ autoplay/loop | Reutilizar en slide 06 |
| Radar perfiles | [ProfileRadar.tsx](src/presentation/components/visuals/ProfileRadar.tsx) | ✅ | Reutilizar en "Dividuales" |
| RouteDuel / RouteMarquee | [RouteVisuals.tsx](src/presentation/components/visuals/RouteVisuals.tsx) | ✅ | Reutilizar |
| Modal técnico (5 categorías) | [DataModal.tsx](src/presentation/components/DataModal.tsx) | ✅ | Sólo añadir 2 categorías |
| Navegación | [DeckNav.tsx](src/presentation/components/DeckNav.tsx) | ✅ | Sólo renombrar labels |
| Primitivas UI | [ui.tsx](src/presentation/components/ui.tsx) | ✅ `KpiPill`, `PanelFrame`, `StatTile`, `DeltaTile`, `MetricLine`, `EpistemicBadge` | Reutilizar en todo |
| Campo atmosférico animado | [AmbientField.tsx](src/presentation/components/AmbientField.tsx) | ✅ | Reutilizar |
| CSS (tokens, donut, gauge, word-cloud, constellation, flow-particle) | [presentation.css](src/presentation.css) | ✅ 3389 LOC | No tocar salvo añadir 1 utility |

**Conclusión**: el refactor es 80% **re-encuadre narrativo y poda de densidad** en las slides existentes, 15% **reubicación de KPIs a modales**, 5% **dos piezas nuevas muy pequeñas**.

---

## 2. Los 4 problemas reales (no "está mal todo")

1. **Slide 01 (`OpenSlide`)** abre con KPIs de pipeline/fuentes/escenarios y tesis genérica. Debería abrir con la **pregunta husserliana** + la constelación (que ya existe pero no se usa en apertura).
2. **Slide 02 (`MethodSlide`)** vende el _stack_ (Cpu, Bot, Waves, Zap, Eye, Orbit). La tesis no pide stack: pide **M1 / M2 / M3 de Gustavo Bueno**.
3. **Slide 08 (`CalibrationSlide`)** es la más densa (3 spotlights + BarChart de pesos + validation chips + uncertainty panel + KpiPills). Es la mejor candidata a **fusionarse con `InequalitySlide`** bajo una sola idea: **asfixia de la emergencia (σ=0.00026 + Gini)**.
4. **Heterotopías / laboratorio de campo** (Foucault, consigna del curso 24 abr → 8 may en [fenomenologia.md](fenomenologia.md)) **no aparecen** en el deck. Es un hueco evidente.

Los **12 slides restantes son correctos de fondo**; sólo hay que re-titular, podar 1–3 KPIs por slide, y añadir algún micro-reveal con `motion.div` stagger (patrón que ya se usa en `MethodSlide`).

---

## 3. Re-secuenciación mínima (16 slides → 16 slides)

| Acción | Slides afectadas |
|---|---|
| Renombrar `metodo` → `symploke` y re-enfocar en M1/M2/M3 | [MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx) |
| **Fusionar** `calibracion` + `desigualdad` → una sola slide `asfixia` | [CalibrationSlide.tsx](src/presentation/slides/CalibrationSlide.tsx) + [InequalitySlide.tsx](src/presentation/slides/InequalitySlide.tsx) |
| **Añadir** slide `heterotopias` (Foucault) entre `mapa` y `perfiles` | nuevo `HeterotopiasSlide.tsx` |
| Renombrar labels de nav con vocabulario filosófico | [constants.ts](src/presentation/constants.ts) |

**Orden final propuesto** (16 slides, –2 renombradas, –1 eliminada por fusión, +1 nueva):

```
01 apertura     → "Volver a la calle misma"             (OpenSlide refactor)
02 symploke     → "Symploké: M1·M2·M3"                  (MethodSlide refactor)
03 mapa         → "El corredor como campo"              (MapSlide poda)
04 heterotopias → "Contra-sitios del centro"            (NUEVA)
05 perfiles     → "Dividuales, no individuos"           (ProfilesSlide re-titular)
06 presion      → "La hora modifica el régimen"         (PressureSlide intacta)
07 simulacion   → "Cien mil cuerpos"                    (SimulationSlide re-titular)
08 multitudes   → "La ciudad tiene pulso 24h"           (CrowdDynamicsSlide poda)
09 estres       → "El Acontecimiento · 500k"            (StressSlide re-enfoque)
10 asfixia      → "Asfixia de la emergencia"            (FUSIÓN calibracion+desigualdad)
11 ambiente     → "Campos estigmérgicos (M1)"           (EnvironmentSlide re-titular)
12 visibilidad  → "Panóptico de flujo (M3)"             (VisibilitySlide re-titular)
13 economia     → "El comercio curva el espacio"        (EconomySlide intacta)
14 historia     → "2012 → 2024: la mutación"            (HistorySlide intacta)
15 evidencia    → "Miembro fantasma"                    (EvidenceSlide re-enfoque)
16 cierre       → "Tres postulados doctorales"          (ClosingSlide re-texto)
```

---

## 4. Refactor slide por slide (acciones concretas)

> Convención: ✂ podar · ✎ re-redactar · ➕ agregar · 🔁 reusar componente existente.

### 01 `apertura` — [OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx)

- ✎ H1 → **"Volver a la calle misma"**.
- ✎ Subtítulo → "Husserl, 1936 · la ciudad matematizada olvida el *Lebenswelt*".
- ✎ Cuerpo (card "Tesis Central") → cita corta de Husserl + tres términos (_phainómenon_, _lógos_, _Lebenswelt_) con stagger `motion.span` (0.15s entre cada uno).
- ✂ Eliminar los 4 `KpiPill` (Pipeline / Fuentes / Escenarios / Campo).
- ✂ Eliminar `metrics-bar` inferior (Corte / Localización / Status).
- ➕ Montar `HeroConstellation` (ya existe) en la columna derecha. Props `data`, `scenario`, `selectedNode`, `onSelectNode` ya llegan al callsite.
- ✎ Botón primario "INICIAR AUDITORÍA" → "INICIAR REDUCCIÓN" (goToSlide `symploke`).

### 02 `symploke` (antes `metodo`) — [MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx)

- ✎ `id` del SlideShell: `metodo` → `symploke`. Actualizar [constants.ts](src/presentation/constants.ts), [deckTypes.ts](src/presentation/deckTypes.ts), el `switch` en [PresentationDeck.tsx](src/PresentationDeck.tsx).
- ✎ Eyebrow: "Stack Doctoral 02 · Metodología" → "Capítulo 02 · Symploké Urbana".
- ✎ H1: "Laboratorio de Fenomenología Operacional" → **"Tres materialidades, un solo entrelazamiento"**.
- ✎ Subtítulo: _"Siguiendo a Bueno, el corredor Junín–San Antonio no es una unidad: es un entrelazamiento de M1 físico, M2 intencional y M3 normativo."_
- ✂ Eliminar el array `engines` con iconos Cpu/Bot/Waves/Zap/Eye/Orbit (jerga técnica).
- ➕ Sustituir con **3 tarjetas grandes** con `PanelFrame` (`tone="teal" | "amber" | "danger"`):
  - **M1 · Materialidad física**: PDE 4K, PM2.5, ruido.
  - **M2 · Intencionalidad sintética**: DRL / `UrbanPhenomenologyDQN`.
  - **M3 · Panóptico de flujo**: red de normas y visibilidad.
- ➕ Cada tarjeta entra con `motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}` (mismo patrón que ya hay en el archivo actual).
- ✂ Eliminar la barra de stats (Nodos / Agentes / Rayos GPU / Version) y `metrics-bar` final.
- ➕ Flecha CSS que conecta M1 → M2 → M3 visualmente (no requiere componente nuevo).

### 03 `mapa` — [MapSlide.tsx](src/presentation/slides/MapSlide.tsx)

- ✎ Eyebrow: "Auditoría 03 · Topología" → "Capítulo 03 · El corredor como campo".
- ✎ H1: "Grafo Operativo" → **"El campo donde aparece la ciudad"**.
- ✂ Podar `map-control-grid`: dejar **sólo** el selector de `scenario`. Los selects de `agent` y `compareAgent` se mueven a slide 05 (perfiles).
- ✂ Podar `map-live-grid` de 4 tiles → 2 (Nodos, Presión media).
- 🔁 `CorridorMap`, `NodeSpotlight`, `RouteMarquee` se quedan (con `leadRoute` únicamente, sin compareRoute).
- ✂ HUD overlays: dejar sólo "SISTEMA VIVO · JUNÍN CORRIDOR" y GPS.

### 04 `heterotopias` — [HeterotopiasSlide.tsx](src/presentation/slides/) _(nueva, única realmente nueva)_

- ➕ Crear archivo clonando la estructura de `EnvironmentSlide` (`SlideGrid` + `PanelFrame` + `StatTile`).
- Contenido: 3 `PanelFrame` con tone `danger` / `amber` / `teal`:
  1. **Crisis / desviación** — cementerio San Pedro, antigua cárcel, hospital.
  2. **Ilusión / compensación** — centros comerciales del corredor, atrios "limpios".
  3. **Apertura / cierre** — templos, zonas de tolerancia, fronteras invisibles.
- Cada `PanelFrame` expone `StatTile` con nombre del lugar + 2 preguntas guía de [fenomenologia.md](fenomenologia.md) ("¿qué cuerpos organiza?", "¿qué atmósfera produce?").
- ➕ Stagger al entrar (`delay: index * 0.2`). Sin SVG, se apoya en `panel-tone-*` que ya existe.
- ➕ Action button "Abrir protocolo" → `onOpenModal('fieldwork')`.
- ➕ Registrar en [deckTypes.ts](src/presentation/deckTypes.ts) `SlideId`, [constants.ts](src/presentation/constants.ts) y `switch` en [PresentationDeck.tsx](src/PresentationDeck.tsx).

### 05 `perfiles` — [ProfilesSlide.tsx](src/presentation/slides/ProfilesSlide.tsx)

- ✎ Eyebrow: "Slide 04 · cuerpos situados" → "Capítulo 05 · dividuales (Deleuze)".
- ✎ H1: "El mismo centro no aparece igual para todos" → **"Dividuales, no individuos"**.
- ✎ Añadir nota sobre Deleuze 1990, "el sujeto queda fragmentado en modulaciones estadísticas".
- 🔁 `ProfileRadar` y `RouteDuel` intactos.
- ➕ Montar aquí los selects `agent` / `compareAgent` removidos de slide 03.

### 06 `presion` — [PressureSlide.tsx](src/presentation/slides/PressureSlide.tsx)

- ✎ Eyebrow: "Slide 05 · presión temporal" → "Capítulo 06 · régimen horario".
- La slide **está bien**: `pressure-card` con `pressure-orb` + `BottleneckPodium` son un buen visual.
- ✂ Poda menor: en cada `pressure-card`, reducir `MetricLine` de 3 → 2 (quitar "Carga").

### 07 `simulacion` — [SimulationSlide.tsx](src/presentation/slides/SimulationSlide.tsx)

- ✎ Eyebrow → "Capítulo 07 · cien mil cuerpos".
- ✎ H1 → **"Cien mil cuerpos en el corredor"**.
- 🔁 `RecordedSimulationClip` intacto (uno de los mejores assets del deck).
- ✂ `simulation-meta-grid`: reducir a 2 `MetricLine` por sección (eliminar "Motor/Física/Sampling").
- ✂ Eliminar `metrics-bar` final.
- ➕ Sobre la nota situada, eyebrow "Lectura blasé" que prepara narrativamente slide 09.

### 08 `multitudes` — [CrowdDynamicsSlide.tsx](src/presentation/slides/CrowdDynamicsSlide.tsx)

- ✎ Eyebrow → "Capítulo 08 · el pulso de la ciudad".
- La slide ya usa `ChartPanel` + `PanelFrame` + `StatTile` (migración reciente ya registrada en memory). Queda bien.
- ✂ `crowd-side-grid` con `StatTile.map(micro)`: limitar a **2 escenarios** (valle + peak_pm).

### 09 `estres` — [StressSlide.tsx](src/presentation/slides/StressSlide.tsx) ⭐

- ✎ Eyebrow → **"Capítulo 09 · El Acontecimiento (Badiou)"**.
- ✎ H1 → **"500.000"** (número gigante, 6rem). Subtítulo: "En este umbral la cuenta-por-uno fracasa. La ciudad revela su vacío."
- 🔁 `ComposedChart` queda pero simplificado: **sólo 1 `Line` (entropy)** + la `ReferenceLine` de COLLAPSE. Quitar el `Bar pressure_index`.
- ✂ `stress-chaos-grid` (obstrucción / flâneur / turbulencia) → modal nuevo `stress-detail`.
- 🔁 `stress-alert-panel` queda, con `alert-number` escalado y halo rojo (ya existe `panel-alert-pulse`).
- ➕ **Reusar `AnimatedSimulationStage`** como overlay al alcanzar el tipping point: `{tipping && <AnimatedSimulationStage ... opacity={0.3} />}`. Es el "estallido" visual sin añadir código nuevo.
- ✂ `metrics-bar` final fuera.

### 10 `asfixia` — [AsphyxiaSlide.tsx](src/presentation/slides/) _(fusión calibracion + desigualdad)_

- ➕ Crear archivo consolidando datos de ambas slides actuales.
- **Idea única**: "La precisión del modelo es la asfixia de la libertad. σ=0.00026 + Gini de entropía."
- Layout (SlideGrid, 2 columnas):
  - **Izquierda**: número enorme `0.00026` (misma utility `.hero-number` que slide 09), subtítulo "incertidumbre relativa". Mini-narrativa 2 líneas.
  - **Derecha**: 2 `PanelFrame`:
    - "Gini de entropía" + `most_restricted_profile`.
    - "Perfil crítico" con nombre del perfil más restringido.
- ✂ Podar (todo va al modal nuevo `calibration-detail`):
  - `spotlight-grid` de 3 spotlights → queda sólo 1 (accuracy espacial).
  - `BarChart` de pesos (tiempo/riesgo/visibilidad).
  - `validation-node-grid` completa.
  - `confidence-card` de Monte Carlo.
  - `BarChart` de entropía por perfil de Inequality.
- ➕ Añadir categoría `calibration-detail` a `ModalKind` y `DataModal` con todo lo podado.
- Eliminar `CalibrationSlide.tsx` e `InequalitySlide.tsx` del `switch` en [PresentationDeck.tsx](src/PresentationDeck.tsx).
- Actualizar [constants.ts](src/presentation/constants.ts) y [deckTypes.ts](src/presentation/deckTypes.ts).

### 11 `ambiente` — [EnvironmentSlide.tsx](src/presentation/slides/EnvironmentSlide.tsx)

- ✎ Eyebrow → "Capítulo 11 · M1 · campos estigmérgicos".
- ✎ H1 → **"El aire también decide la ruta"**.
- ✎ Añadir "PDE de reacción-difusión · señales estigmérgicas negativas (Johnson, 2001)".
- ✂ `status-strip` de 3 `KpiPill` → 2 (Malla, Estación PM2.5).
- 🔁 `field-grid` con 4 `field-card` se queda.
- ➕ Reemplazar prosa del `spotlight-card` derecho con 3 líneas sobre cómo los gradientes condicionan la navegación DRL.

### 12 `visibilidad` — [VisibilitySlide.tsx](src/presentation/slides/VisibilitySlide.tsx)

- ✎ Eyebrow → "Capítulo 12 · M3 · Panóptico de Flujo".
- ✎ H1 → **"Ver, ser visto, no poder no ser visto"**.
- 🔁 `visibility-meter` y `PanelFrame`s se quedan.
- ✂ `surface-pill-grid` de 3 `KpiPill` → 2 (puntos, resolución). Rayos → modal.
- ➕ Citar Foucault 1975/2002 explícitamente en la nota final.

### 13 `economia` — [EconomySlide.tsx](src/presentation/slides/EconomySlide.tsx)

- ✎ Eyebrow → "Capítulo 13 · gravitación comercial".
- La slide funciona: `BarChart` + `economy-gauge`. Cambio mínimo.
- ✂ `status-strip` → 1 solo `KpiPill` (Gini).

### 14 `historia` — [HistorySlide.tsx](src/presentation/slides/HistorySlide.tsx)

- ✎ Eyebrow → "Capítulo 14 · mutación longitudinal".
- Queda tal cual. **Opcional**: hacerla condicional con tecla `H` si falta tiempo en defensa.

### 15 `evidencia` — [EvidenceSlide.tsx](src/presentation/slides/EvidenceSlide.tsx)

- ✎ Eyebrow → "Capítulo 15 · el miembro fantasma (Merleau-Ponty)".
- ✎ H1 → **"El dato que la ciudad no se deja capturar"**.
- ✎ En `evidence-hero-card` (donut): re-redactar como _aporía_, no como evidencia técnica.
- 🔁 `word-cloud`, `crime-card`, `barrio-card`, `source-card` se quedan.
- ➕ Añadir micro-tarjeta nueva sobre `pending_no_capture` + DANE CNPV 403 (dato ya registrado en [memories/repo/fenomenologia-urbana.md](memories/repo/fenomenologia-urbana.md)).

### 16 `cierre` — [ClosingSlide.tsx](src/presentation/slides/ClosingSlide.tsx)

- ✎ Eyebrow → "Capítulo 16 · tres postulados doctorales".
- ✎ H2 actual queda como **cita de remate**. Antes, los 3 postulados explícitos de [tesis/04-conclusiones-y-referencias-bibliograficas.md](tesis/04-conclusiones-y-referencias-bibliograficas.md) §4.3:
  1. Contra el instrumentalismo.
  2. Soberanía fenomenológica.
  3. El colapso como denuncia.
- ➕ Renderizar como 3 `PanelFrame` con stagger (mismo patrón que array `engines` actual de `MethodSlide`).
- 🔁 `ClosureGates` se queda.

---

## 5. Cambios de infraestructura (pequeños pero obligatorios)

### 5.1 [constants.ts](src/presentation/constants.ts)

Reordenar array `SLIDES` y actualizar `shortLabel`:
```
apertura     → 'Calle'
symploke     → 'M1/M2/M3'
mapa         → 'Campo'
heterotopias → 'Hetero'
perfiles     → 'Divid'
presion      → 'Horas'
simulacion   → '100k'
multitudes   → 'Pulso'
estres       → 'Evento'
asfixia      → 'Asfixia'
ambiente     → 'M1'
visibilidad  → 'M3'
economia     → 'Gravedad'
historia     → 'Hist'
evidencia    → 'Fantasma'
cierre       → 'Tesis'
```

### 5.2 [deckTypes.ts](src/presentation/deckTypes.ts)

- `SlideId`: reemplazar `metodo | calibracion | desigualdad` por `symploke | asfixia | heterotopias`.
- `ModalKind`: añadir `calibration-detail` y `stress-detail`.

### 5.3 [PresentationDeck.tsx](src/PresentationDeck.tsx)

- Actualizar `switch (deck.activeSlide)`: quitar `metodo`, `calibracion`, `desigualdad`; añadir `symploke`, `asfixia`, `heterotopias`.
- Ajustar imports.

### 5.4 [DataModal.tsx](src/presentation/components/DataModal.tsx)

- +2 categorías: `calibration-detail` (BarChart pesos + validation chips + confidence cards + entropía inequality), `stress-detail` (chaos stats).
- Entradas correspondientes en `MODAL_TITLES`.

### 5.5 Atajo `D` para modal técnico de la slide actual

En `useDeckController` (hook en [src/presentation/hooks/](src/presentation/hooks/)), `useEffect` que escuche `keydown: "d"` y abra la categoría de modal asociada:
```
asfixia      → calibration-detail
estres       → stress-detail
evidencia    → evidence
mapa         → model
heterotopias → fieldwork
(resto)      → status
```

### 5.6 CSS — [presentation.css](src/presentation.css)

- **Casi nada que añadir.** Tokens (`--accent`, `--danger`), clases `donut`, `word-cloud`, `economy-gauge`, `visibility-meter`, `pressure-orb`, `constellation-node`, `panel-tone-*`, `alert-number` ya existen.
- Única adición: utility `.hero-number` (font-size 6rem, tracking tight) para los dos números-protagonista (`500.000`, `0.00026`).

---

## 6. Checklist por archivo (ejecutable)

| Archivo | Acción | Esfuerzo |
|---|---|---|
| [OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx) | Re-redactar, quitar KPIs, montar `HeroConstellation` | S |
| [MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx) | Renombrar `SymplokeSlide`, 3 tarjetas M1/M2/M3 | M |
| [MapSlide.tsx](src/presentation/slides/MapSlide.tsx) | Quitar selects agent, podar HUD | S |
| **nuevo** `HeterotopiasSlide.tsx` | Crear (≈80 LOC) | M |
| [ProfilesSlide.tsx](src/presentation/slides/ProfilesSlide.tsx) | Re-titular, absorber selects | S |
| [PressureSlide.tsx](src/presentation/slides/PressureSlide.tsx) | Poda 1 `MetricLine` | XS |
| [SimulationSlide.tsx](src/presentation/slides/SimulationSlide.tsx) | Re-titular, podar metadata | XS |
| [CrowdDynamicsSlide.tsx](src/presentation/slides/CrowdDynamicsSlide.tsx) | Limitar `micro.map` a 2 | XS |
| [StressSlide.tsx](src/presentation/slides/StressSlide.tsx) | Número hero, simplificar Composed, overlay stage | M |
| **nuevo** `AsphyxiaSlide.tsx` | Fusionar Calib+Inequality | M |
| `CalibrationSlide.tsx` | Eliminar del switch | XS |
| `InequalitySlide.tsx` | Eliminar del switch | XS |
| [EnvironmentSlide.tsx](src/presentation/slides/EnvironmentSlide.tsx) | Re-titular M1, poda pill | XS |
| [VisibilitySlide.tsx](src/presentation/slides/VisibilitySlide.tsx) | Re-titular M3, cita Foucault, poda pill | XS |
| [EconomySlide.tsx](src/presentation/slides/EconomySlide.tsx) | Poda `status-strip` | XS |
| [HistorySlide.tsx](src/presentation/slides/HistorySlide.tsx) | Re-titular (o tecla `H`) | XS |
| [EvidenceSlide.tsx](src/presentation/slides/EvidenceSlide.tsx) | Miembro fantasma + tarjeta `pending_no_capture` | S |
| [ClosingSlide.tsx](src/presentation/slides/ClosingSlide.tsx) | 3 postulados con stagger | S |
| [constants.ts](src/presentation/constants.ts) | Reorden + `MODAL_TITLES` | XS |
| [deckTypes.ts](src/presentation/deckTypes.ts) | `SlideId` + `ModalKind` | XS |
| [PresentationDeck.tsx](src/PresentationDeck.tsx) | Switch + imports | S |
| [DataModal.tsx](src/presentation/components/DataModal.tsx) | +2 categorías | S |
| `useDeckController` | Atajo `D` | XS |
| [presentation.css](src/presentation.css) | `.hero-number` utility | XS |

Tamaños: XS < 15 min · S < 45 min · M < 2 h.

- **Piezas realmente nuevas a crear**: 1 slide (`HeterotopiasSlide`) + 1 slide fusión (`AsphyxiaSlide`).
- **Componentes visuales a crear**: **cero**. Los 9 existentes cubren todos los casos.

---

## 7. Guion verbal mínimo (2 frases por slide)

Extraído de [tesis/01-introduccion-y-marco-teorico.md](tesis/01-introduccion-y-marco-teorico.md), [tesis/02-metodologia-y-diseno-hpc.md](tesis/02-metodologia-y-diseno-hpc.md), [tesis/03-resultados-y-analisis-de-turbulencia.md](tesis/03-resultados-y-analisis-de-turbulencia.md), [tesis/04-conclusiones-y-referencias-bibliograficas.md](tesis/04-conclusiones-y-referencias-bibliograficas.md):

1. _Apertura_ — "Husserl denuncia la matematización. Volvemos a la calle misma."
2. _Symploké_ — "Bueno: M1 físico, M2 intencional, M3 normativo. La atmósfera es el residuo."
3. _Campo_ — "Este corredor no es un grafo: es un campo de aparición."
4. _Heterotopías_ — "Foucault: la ciudad tiene contra-sitios que revelan su orden."
5. _Dividuales_ — "Deleuze: no hay individuos, hay modulaciones estadísticas."
6. _Horas_ — "El régimen horario es una configuración distinta de posibilidades."
7. _Cien mil cuerpos_ — "La simulación no representa: presenta lo múltiple."
8. _Pulso_ — "24 horas son un latido, no una serie de barras."
9. _Acontecimiento_ — "500.000. Aquí la cuenta-por-uno fracasa."
10. _Asfixia_ — "σ=0.00026. Esta precisión es asfixia."
11. _M1_ — "PDE de reacción-difusión: el aire decide la ruta."
12. _M3_ — "Panóptico de flujo: ver, ser visto, no poder no ser visto."
13. _Gravedad_ — "El comercio curva el espacio del peatón."
14. _Historia_ — "2012 → 2024: la mutación es computable."
15. _Miembro fantasma_ — "Lo que el modelo no captura es la tesis."
16. _Tesis_ — "No optimizar: auditar. Tres postulados doctorales."

---

## 8. Orden de implementación recomendado

Para no romper la deck en ningún punto:

1. **Fase 1 · Infraestructura silenciosa** (no cambia UX): `SlideId`, `ModalKind`, `constants.ts` reordenado, atajo `D`. _~30 min._
2. **Fase 2 · Podas XS/S** (KPIs, metrics-bars, re-titulares): 10 slides marcadas XS/S. _~2 h._
3. **Fase 3 · Fusión `asfixia`**: crear AsphyxiaSlide, deprecate Calibration+Inequality. _~1 h._
4. **Fase 4 · Nueva `heterotopias`**: crear slide. _~1 h._
5. **Fase 5 · Refactor narrativo** `apertura` + `symploke` + `estres` + `cierre` (mayor impacto). _~2 h._
6. **Fase 6 · DataModal +2 categorías**. _~45 min._
7. **Fase 7 · Validación**: `npm run lint && npm run build`, recorrer deck con flechas, validar `visibleBottom` en navegador (nota de memory sobre `scrollHeight` engañoso).

---

## 9. Qué **NO** hacer (anti-plan)

- **No** reemplazar `CorridorMap` por un SVG estilizado. Leaflet funciona y aporta valor empírico.
- **No** crear `EventBurst`, `GravityField`, `PhantomLimb`, `DividualSilhouette`, `PulsingClock`, `FlipCard`, etc. `AnimatedSimulationStage` + `NetworkView` + CSS existente (donut, gauge, orb, meter, constellation) cubren las metáforas.
- **No** cambiar la paleta (calibrada en 3389 líneas de CSS).
- **No** cambiar la fuente.
- **No** reescribir pipeline ni payload. El dato llega bien desde [frontend_payload.json](investigacion/outputs/frontend_payload.json).
- **No** eliminar `RecordedSimulationClip`. Es el único asset MP4 real del pipeline.
- **No** introducir carrusel / scroll / overflow dentro de una slide — rompe el principio "sin scroll" del deck.

---

## 10. TL;DR

- **9/9 componentes visuales existentes se reutilizan tal cual.** Cero piezas visuales nuevas.
- **13/16 slides se refactorizan in situ** (podas + retitulación + stagger). Son cambios XS/S.
- **Cambios estructurales reales**: 1 slide nueva (heterotopías), 1 slide fusionada (asfixia = calibración + desigualdad).
- **Objetivo narrativo**: pasar de "dashboard HPC" a "defensa doctoral fenomenológica" sin reescribir nada que ya funciona.
