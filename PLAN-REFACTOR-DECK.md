# Plan integral de refactor del Deck — Fenomenología Urbana

> Documento único, de extremo a extremo, que cruza **cada dataset generado** con **cada slide del deck**, **cada concepto de la tesis** y **cada animación** concreta. Sustituye cualquier plan anterior.
>
> Principio rector: **refactor quirúrgico**. Se respeta el 90% construido. Sólo se crean piezas cuando un dato empírico ya existe y no tiene dónde mostrarse.

---

## 0. Resumen ejecutivo

- **Diagnóstico**: existen 16 reportes JSON + 16 rásters `.npy` en [investigacion/outputs/](investigacion/outputs/). El payload frontend ya expone todos los JSON. **Los 16 rásters no llegan al navegador** (sólo hay 4 MP4s en [public/data/simulations/](public/data/simulations/)). Narrativamente, el deck está lejos del corpus de la tesis (no aparecen Sassen, $D_{KL}$, reacción-difusión, "Simulacro de Denuncia", "Fracaso como Verdad", etc.).
- **Objetivo**: convertir el deck en **presentación de lo múltiple** (Badiou) — que cada slide sea una prueba empírica anclada a un capítulo. Nada decorativo.
- **Cambios reales**:
  1. 1 script nuevo Python → exporta los 16 `.npy` como PNG coloreados + manifest.
  2. 2 componentes React nuevos (`FieldRaster`, `Heatline24h`) — justifican su existencia con datos que hoy están invisibles.
  3. 16 slides refactorizadas (reorden + poda + inyección de datos + animación concreta).
  4. 2 categorías nuevas en el `DataModal` existente.
- **Cero** reescritura de pipeline, payload, Leaflet, MP4s, paleta o tipografía.

---

## 1. Inventario exhaustivo de datos

### 1.1 JSON en [investigacion/outputs/](investigacion/outputs/) (16 archivos, todos ya en `frontend_payload.json`)

| Archivo | Estructura clave | Uso actual en deck | Dato de oro |
|---|---|---|---|
| [case_model.json](investigacion/outputs/case_model.json) | `meta`, `nodes`, `edges`, `scenarios`, `agents`, `trip_counts` | ✅ mapa, perfiles | 9 nodos con `heterotopia` tag, `phenomenology` en texto |
| [simulation_results.json](investigacion/outputs/simulation_results.json) | `baseline_metrics`, 4 `scenarios` con `top_bottlenecks`, `top_routes`, `node_loads`, `edge_loads`, `profile_stats` | parcial | 4 escenarios × 13 edges con flujos |
| [advanced_simulation_results.json](investigacion/outputs/advanced_simulation_results.json) | 4 `scenarios` con `m_mass_entropy`, `systemic_pressure`, `node_loads`, `edge_loads`, `profile_stats` | **no usado** | `systemic_pressure` peak_am=**7194.78** |
| [empirical_summary.json](investigacion/outputs/empirical_summary.json) | `center_perception`, `crime_comuna_10`, `barrio_la_candelaria`, `mobility_sitva`, `environmental_context`, `dane_cnpv_fallback` | ✅ evidence | DANE 403, percepción de seguridad |
| [source_status.json](investigacion/outputs/source_status.json) | lista de fuentes + `downloaded_count`/`failed_count` | ✅ evidence | contador de capturas fallidas |
| [field_calibration_delta.json](investigacion/outputs/field_calibration_delta.json) | `status`, `node_changes`, `edge_changes`, `scenario_changes` | ✅ mapa / evidence | `pending_no_capture` → miembro fantasma |
| [calibration_factors.json](investigacion/outputs/calibration_factors.json) | `densidad`, `comercio`, `espacio_publico` | parcial | factores normalizados |
| [hpc_calibration_report.json](investigacion/outputs/hpc_calibration_report.json) | `ground_truth_target`, `optimized_weights` | parcial | pesos time/risk/visibility |
| [hpc_multipoint_calibration.json](investigacion/outputs/hpc_multipoint_calibration.json) | `optimized_parameters`, `spatial_accuracy_score`, `residual_error`, `validation_nodes` | parcial | `spatial_accuracy_score` + 3 nodos validados |
| [hpc_uncertainty_quantification.json](investigacion/outputs/hpc_uncertainty_quantification.json) | `results.hour_{6,12,18}` con mean/std | parcial | **σ_rel = 0.00026** (asfixia) |
| [hpc_urban_stress_test.json](investigacion/outputs/hpc_urban_stress_test.json) | `tipping_point_detected`, `full_curve` (10 puntos) | ✅ stress | curva 100k→500k, **entropía 4.59→5.40** |
| [hpc_24h_simulation_report.json](investigacion/outputs/hpc_24h_simulation_report.json) | `hourly_metrics` (24 entradas) | ✅ multitudes | agentes/hora, max_load, mean_energy |
| [hpc_environmental_report.json](investigacion/outputs/hpc_environmental_report.json) | `pm25.peak/ambient_avg`, `noise.peak_db/spatial_variance` | ✅ ambiente | PM2.5 y ruido con estadísticas |
| [hpc_chaos_simulation_report.json](investigacion/outputs/hpc_chaos_simulation_report.json) | `informality_obstruction_ratio`, `flaneur_ratio`, `mean_turbulence_index` | parcial | ratios caos cotidiano |
| [hpc_micro_results.json](investigacion/outputs/hpc_micro_results.json) | `scenarios` con métricas SFM | parcial | Social Force Model micro |
| [micro_simulation_results.json](investigacion/outputs/micro_simulation_results.json) | `results` micro con `resolution` | parcial | micro-sim alternativa |
| [pde_environmental_results.json](investigacion/outputs/pde_environmental_results.json) | `fields.pm25`, `fields.noise` metadata | ✅ ambiente | encabezado del solver PDE |
| [perceptual_visibility_results.json](investigacion/outputs/perceptual_visibility_results.json) | `points_sampled`, `ray_count`, `max_panoptic_exposure`, `mean_openness` | ✅ visibilidad | rayos + apertura media |
| [urban_inequality_analysis.json](investigacion/outputs/urban_inequality_analysis.json) | 4 `scenarios` con `entropy_gini`, `most_restricted_profile`, `inequity_ratio` | ✅ desigualdad | **Gini entropía por escenario** |
| [economic_gravity_results.json](investigacion/outputs/economic_gravity_results.json) | `hubs_analyzed`, `total_commercial_pull`, `spatial_concentration_gini` | ✅ economía | Gini comercial |
| [historical_evolution_results.json](investigacion/outputs/historical_evolution_results.json) | `years_analyzed`, `evolution` (2012/2018/2024) | ✅ historia | mutación longitudinal |
| [temporal_24h_profile.json](investigacion/outputs/temporal_24h_profile.json) | `hours`, `demand_multiplier`, `environmental_intensity`, `peak_am_hour=6`, `peak_pm_hour=18` | **no usado** | curvas normalizadas 24h |

### 1.2 Rásters `.npy` (16 archivos, **ninguno exportado al frontend**)

Verificado con `numpy.load` real:

| Archivo | Shape | Rango (min→max) | Semántica (tesis) |
|---|---|---|---|
| [hpc_4k_pm25.npy](investigacion/outputs/hpc_4k_pm25.npy) | 4096² | 0 → 563.7 | M1 estigmérgico PM2.5 (§2.1) |
| [hpc_4k_noise.npy](investigacion/outputs/hpc_4k_noise.npy) | 4096² | 0 → 648.5 | M1 estigmérgico ruido (§2.1) |
| [hpc_isovist_exposure_real.npy](investigacion/outputs/hpc_isovist_exposure_real.npy) | 2048² | 6 → **198 506** | M3 Panóptico de Flujo (§2.3) |
| [hpc_24h_density_atlas.npy](investigacion/outputs/hpc_24h_density_atlas.npy) | 1024² | 0 → 1282 | densidad acumulada 24h (§3.1) |
| [hpc_density_peak_am.npy](investigacion/outputs/hpc_density_peak_am.npy) | 1024² | 0 → 252.8 | régimen horario (§3.1) |
| [hpc_density_peak_pm.npy](investigacion/outputs/hpc_density_peak_pm.npy) | 1024² | 0 → 260.7 | régimen horario |
| [hpc_density_valle.npy](investigacion/outputs/hpc_density_valle.npy) | 1024² | 0 → 252.5 | régimen horario |
| [hpc_density_night.npy](investigacion/outputs/hpc_density_night.npy) | 1024² | 0 → 259.8 | régimen horario |
| [hpc_everyday_chaos_map.npy](investigacion/outputs/hpc_everyday_chaos_map.npy) | 1024² | 0 → 6.75 | índice de turbulencia cotidiana (§3.3) |
| [historical_density_2012.npy](investigacion/outputs/historical_density_2012.npy) | 1024² | 0 → 122.7 | mutación longitudinal (§3.1) |
| [historical_density_2018.npy](investigacion/outputs/historical_density_2018.npy) | 1024² | 0 → 482.6 | — |
| [historical_density_2024.npy](investigacion/outputs/historical_density_2024.npy) | 1024² | 0 → 2.48 | — |
| [pde_field_pm25.npy](investigacion/outputs/pde_field_pm25.npy) | 512² | 0 → 419.1 | derivada rápida de M1 (thumbnail) |
| [pde_field_noise.npy](investigacion/outputs/pde_field_noise.npy) | 512² | 0 → 595.9 | — |
| [crowd_density_peak_pm.npy](investigacion/outputs/crowd_density_peak_pm.npy) | 256² | 0 → 3.6 | micro SFM |
| [crowd_density_valle.npy](investigacion/outputs/crowd_density_valle.npy) | 256² | 0 → 6.55 | micro SFM |

Rango del isovist [6, 198 506] obliga a **escala logarítmica** al colorear.

### 1.3 Assets multimedia ya publicados

[public/data/simulations/](public/data/simulations/): 4 MP4 + 4 posters PNG + `manifest.json` (conservar, usados por `RecordedSimulationClip`).

---

## 2. Matriz cruzada dato × slide × visualización × animación × tesis

Cada fila es una instrucción ejecutable. El "estado" indica si el dato ya está en pantalla (✅), no (❌) o parcialmente (◻︎).

| Slide | Dato(s) | Visualización | Animación | Cita tesis | Estado |
|---|---|---|---|---|---|
| `apertura` | — | `HeroConstellation` (existe) | órbita continua 40s + stagger del texto | Husserl §1.1 "amputación ontológica" | ❌→✅ |
| `symploke` (ex `metodo`) | fórmulas §2.1, §2.2, §2.3 | 3 `PanelFrame` + KaTeX | `pathLength` SVG que conecta M1→M2→M3 | Bueno §1.2 | ❌→✅ |
| `mapa` | `case_model.nodes`, `edges`, `heterotopia` tag | `CorridorMap` (existe) + `RouteMarquee` | nodos latiendo según `node_loads`, ruta dibujándose `pathLength` | Bueno symploké §1.2 | ◻︎→✅ |
| `heterotopias` **(nueva)** | `nodes[].heterotopia`, `phenomenology` | 3 `PanelFrame` agrupados por tipo (apertura_cierre / memoria_y_exposicion / ilusion_compensacion) | stagger + hover reveal `description` | Foucault §1.2 + Sassen §1.4 | ❌→✅ |
| `perfiles` | `agents[].weights` (5 perfiles × 7 dims) + `advanced_simulation_results[].profile_stats` | `ProfileRadar` (existe) + `RouteDuel` + nuevo subtítulo con `path_entropy` | radar animado, `MotionValue` interpolando weights al cambiar perfil | Deleuze dividuales §2.2 | ◻︎→✅ |
| `presion` | `scenarios[].mean_pressure`, `top_bottlenecks`, `advanced.systemic_pressure` | `pressure-card` (existe) + `BottleneckPodium` | `pressure-orb` latido con frecuencia ∝ presión | Foucault M3 §2.3 | ✅ |
| `simulacion` | MP4s + `hpc_24h.total_simulated_agents_day = 640 000` | `RecordedSimulationClip` (existe) + **nuevo** contador animado | contador 0→640 000 al aparecer (`useMotionValue`) | Badiou §1.3 | ◻︎→✅ |
| `multitudes` | `hpc_24h_simulation_report.hourly_metrics` + `temporal_24h_profile` + `hpc_24h_density_atlas.png` | **`Heatline24h` (nuevo)**: reloj + heatmap + linechart sincronizados | scrubber de 24h animado en loop 30s | Simmel §3.2 blasé computacional | ◻︎→✅ |
| `estres` | `hpc_urban_stress_test.full_curve` (10 pts) + `tipping_point` + `chaos.png` | `ComposedChart` simplificado + hero **500 000** + `chaos.png` overlay | progreso del chart sincronizado con entropy sonora (visual); overlay aparece al cruzar 500k | Badiou Acontecimiento §3.3 | ◻︎→✅ |
| `asfixia` **(fusión)** | `hpc_uncertainty.results` + `urban_inequality.scenarios` + fórmula $D_{KL}$ | hero **0.00026** + 4 mini-tiles Gini × escenario + `density_peak_pm.png` mask | velocímetro σ subiendo de 0 a 0.00026 con `spring`; Gini rotando entre 4 escenarios cada 3s | Foucault §2.3 + §3.1 asfixia emergencia | ◻︎→✅ |
| `ambiente` | `pm25_4k.png` + `noise_4k.png` + `hpc_environmental_report` + fórmula reacción-difusión | **`FieldRaster` (nuevo)** split + KaTeX | pulse suave (breathing 8s loop) sincronizado entre ambos | Johnson §2.1 estigmergia | ◻︎→✅ |
| `visibilidad` | `isovist.png` + `perceptual_visibility_results` | `FieldRaster` overlay `mix-blend-mode: screen` sobre `CorridorMap` + `visibility-meter` | "ver/ser visto" — raster oscila opacity 0.3↔0.8 | Foucault Panóptico §2.3 | ◻︎→✅ |
| `economia` | `economic_gravity_results` + `scenarios[].top_bottlenecks` | `BarChart` top comercio + `economy-gauge` Gini | aguja del gauge se desplaza con `spring` | Sassen estructura de expulsión §1.4 | ✅ |
| `historia` | `historical_{2012,2018,2024}.png` + `historical_evolution_results.evolution` | `FieldRaster` con `AnimatePresence` crossfade + línea temporal | morphing 2012→2018→2024 cada 2.5s, infinito | §3.1 mutación | ❌→✅ |
| `evidencia` | `empirical_summary`, `source_status`, `field_calibration_delta` | donut + word-cloud + barios (existe) + **nueva tarjeta "miembro fantasma"** | donut se dibuja `strokeDasharray`, tarjeta fantasma con pulso rojo | Merleau-Ponty §3.4 "Simulacro de Denuncia" | ◻︎→✅ |
| `cierre` | 3 postulados §4.3 | `ClosureGates` (existe) + 3 `PanelFrame` stagger | revelado secuencial, típewriter en la cita final | §4.3 Fracaso como Verdad | ◻︎→✅ |

---

## 3. Pipeline de datos — cambios Python mínimos

### 3.1 Nuevo script: [investigacion/scripts/visualization/export_raster_fields.py](investigacion/scripts/visualization/export_raster_fields.py)

Responsabilidad única: convertir los 16 `.npy` en PNG listos para web.

```python
# pseudocódigo
NPY_TO_PNG = [
  ("hpc_4k_pm25.npy",        "fields/pm25.png",        "viridis", "linear",  1024),
  ("hpc_4k_noise.npy",       "fields/noise.png",       "magma",   "linear",  1024),
  ("hpc_isovist_exposure_real.npy", "fields/isovist.png", "plasma", "log",   1024),
  ("hpc_24h_density_atlas.npy",     "fields/density_24h.png", "inferno", "linear", 1024),
  ("hpc_density_peak_am.npy","fields/density_peak_am.png","inferno","linear",1024),
  ("hpc_density_peak_pm.npy","fields/density_peak_pm.png","inferno","linear",1024),
  ("hpc_density_valle.npy",  "fields/density_valle.png", "inferno","linear",1024),
  ("hpc_density_night.npy",  "fields/density_night.png", "inferno","linear",1024),
  ("hpc_everyday_chaos_map.npy","fields/chaos.png",    "turbo",   "linear", 1024),
  ("historical_density_2012.npy","fields/hist_2012.png","inferno","linear", 1024),
  ("historical_density_2018.npy","fields/hist_2018.png","inferno","linear", 1024),
  ("historical_density_2024.npy","fields/hist_2024.png","inferno","linear", 1024),
  ("pde_field_pm25.npy",     "fields/pm25_thumb.png",  "viridis","linear",  512),
  ("pde_field_noise.npy",    "fields/noise_thumb.png", "magma",  "linear",  512),
  ("crowd_density_peak_pm.npy","fields/micro_peak_pm.png","turbo","linear", 512),
  ("crowd_density_valle.npy","fields/micro_valle.png", "turbo",  "linear",  512),
]

for src, dst, cmap, scale, size in NPY_TO_PNG:
    arr = np.load(OUTPUTS_DIR / src).astype("float32")
    if scale == "log":
        arr = np.log1p(np.maximum(arr, 0))
    lo, hi = np.percentile(arr, [2, 98])
    arr = np.clip((arr - lo) / max(hi - lo, 1e-9), 0, 1)
    rgba = (matplotlib.cm.get_cmap(cmap)(arr) * 255).astype("uint8")
    img = Image.fromarray(rgba).resize((size, size), Image.LANCZOS)
    img.save(VISUAL_DATA_DIR / dst, optimize=True)

# manifest.json:
# { "pm25":    { "src":"fields/pm25.png", "cmap":"viridis", "min":0, "max":563.7, "units":"µg/m³", "scale":"linear" }, ... }
```

- Reutiliza `_shared.OUTPUTS_DIR` y `VISUAL_DATA_DIR`.
- Dependencias: `numpy`, `matplotlib`, `Pillow` (todas ya usadas por [render_simulation_clips.py](investigacion/scripts/visualization/render_simulation_clips.py)).
- Peso esperado: PNG 1024² optimizados ~120–300 KB c/u ⇒ total < 3 MB para los 16.

### 3.2 Integración en orquestador

En [investigacion/scripts/run_all.py](investigacion/scripts/run_all.py), añadir paso **después** de las simulaciones y **antes** de `publish_visual_payload.py` (que ya copia el manifest si está en `VISUAL_DATA_DIR`).

### 3.3 Enriquecimiento de [publish_visual_payload.py](investigacion/scripts/visualization/publish_visual_payload.py)

Añadir al payload final:

```json
{
  "fields_manifest": "/data/fields/manifest.json",
  "temporal_24h": <contenido de temporal_24h_profile.json>,
  "raw_reports": {
    "chaos": <hpc_chaos_simulation_report>,
    "multipoint_calibration": <hpc_multipoint_calibration>,
    "uncertainty": <hpc_uncertainty_quantification>,
    "micro": <hpc_micro_results>,
    "advanced_scenarios": <advanced_simulation_results.scenarios>
  }
}
```

Esto expone tres islas de datos hoy huérfanas: `temporal_24h`, `chaos`, `advanced_scenarios`.

---

## 4. Arquitectura visual final

### 4.1 Componentes existentes que se reutilizan tal cual (9)

[CorridorMap](src/presentation/components/visuals/CorridorMap.tsx) · [NetworkView](src/presentation/components/visuals/NetworkView.tsx) · [HeroConstellation](src/presentation/components/visuals/HeroConstellation.tsx) · [AnimatedSimulationStage](src/presentation/components/visuals/AnimatedSimulationStage.tsx) · [RecordedSimulationClip](src/presentation/components/visuals/RecordedSimulationClip.tsx) · [ProfileRadar](src/presentation/components/visuals/ProfileRadar.tsx) · [RouteVisuals (RouteDuel, RouteMarquee)](src/presentation/components/visuals/RouteVisuals.tsx) · [NodeSpotlight](src/presentation/components/visuals/NodeSpotlight.tsx) · [AmbientField](src/presentation/components/AmbientField.tsx) · [MeasuredChart](src/presentation/components/visuals/MeasuredChart.tsx) (es 10 contando `MeasuredChart`).

### 4.2 Componentes nuevos (2 — y sólo 2)

#### `FieldRaster.tsx` — [src/presentation/components/visuals/FieldRaster.tsx](src/presentation/components/visuals/FieldRaster.tsx)

```tsx
type FieldRasterProps = {
  src: string                               // /data/fields/pm25.png
  alt: string
  colormap: 'viridis' | 'magma' | 'plasma' | 'inferno' | 'turbo'
  legend?: { min: number; max: number; unit: string; scale?: 'linear' | 'log' }
  motion?: 'static' | 'breathing' | 'pulse' | 'reveal'
  overlaySrc?: string                       // raster 2 (ej. noise por encima de pm25)
  overlayBlendMode?: 'screen' | 'multiply' | 'overlay'
  overlayOpacity?: number
  className?: string
}
```

Internamente:
- `<motion.div>` con `animate` según `motion`:
  - `breathing`: `opacity: [0.65, 1, 0.65]`, duración 8s infinito.
  - `pulse`: `scale: [1, 1.02, 1]`, 4s infinito.
  - `reveal`: `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`, 1.2s.
- Leyenda: barra SVG con gradiente del colormap + min/max/unit.
- Overlay opcional con `mix-blend-mode` CSS.
- `prefers-reduced-motion` → `motion='static'`.

#### `Heatline24h.tsx` — [src/presentation/components/visuals/Heatline24h.tsx](src/presentation/components/visuals/Heatline24h.tsx)

Combina 3 piezas **sincronizadas** por un solo `hourIndex` (0..23) en loop:

1. **Reloj SVG** (anillo con marcas cada hora, aguja rotando).
2. **Heatmap 1×24** (franja horizontal, intensidad desde `hpc_24h_simulation_report.hourly_metrics[].agents`).
3. **Line chart** (`demand_multiplier` + `environmental_intensity` de `temporal_24h_profile.json`, con marker en `hourIndex`).

```tsx
type Heatline24hProps = {
  hourly: { hour: number; agents: number; maxLoad: number }[]   // 24 entradas
  temporal: { hours: number[]; demand: number[]; environmental: number[] }
  densityBackdrop?: string                 // /data/fields/density_24h.png
  loopMs?: number                          // default 30000
}
```

Loop: `useEffect` con `requestAnimationFrame` avanza `hourIndex` continuamente (interpolado). Render usa `motion.circle cx,cy` para la aguja y `motion.rect fill-opacity` para el marker del heatmap.

### 4.3 Inventario final visual

- 10 componentes existentes **intactos**.
- 2 componentes nuevos (`FieldRaster`, `Heatline24h`) — cada uno justifica su existencia por rescatar datos invisibles.
- Cero dependencias npm nuevas salvo `katex` + `react-katex` (§8).

---

## 5. Refactor slide por slide

Convención: ✂ podar · ✎ re-redactar · ➕ agregar · 🔁 reutilizar existente · 🆕 usar componente nuevo · 📊 dato inyectado. **Esfuerzo**: XS < 15 min · S < 45 min · M < 2 h · L > 2 h.

---

### Slide 01 · `apertura` — [OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx) (S)

**Narrativa (tesis §1.1)**: La matematización de Husserl opera una **amputación ontológica** del *Lebenswelt*. Este deck subvierte la técnica para hacer **Reducción Eidética Computacional**.

- ✎ Eyebrow: _"Apertura · Capítulo 1"_.
- ✎ H1: **"Volver a la calle misma"**.
- ✎ Subtítulo: _"Husserl, 1936: la matematización amputa el Lebenswelt. El HPC aquí invierte su signo: se vuelve Reducción Eidética Computacional."_
- ✂ Quitar los 4 `KpiPill` (Pipeline, Fuentes, Escenarios, Campo).
- ✂ Quitar `metrics-bar` inferior.
- ➕ 3 `motion.span` con stagger 0.18s: **phainómenon** · **lógos** · **Lebenswelt**.
- 🔁 Montar `HeroConstellation` a la derecha (ya existe, recibe `nodes` del payload).
- ✎ CTA: "INICIAR REDUCCIÓN" → `goToSlide('symploke')`.
- 📊 Footer: _"Corredor Junín–San Antonio · La Candelaria, Medellín · 9 nodos / 13 ejes"_ (desde `case_study` + `nodes.length`).
- 🎞 Animación: constelación orbita suave + stagger de términos.
- **Cita pie**: Husserl, 1936/1991.

---

### Slide 02 · `symploke` (renombrar `metodo`) — [MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx) (M)

**Narrativa (tesis §1.2, §2.1–§2.3)**: Symploké materialista de Bueno — 3 estratos $M_1$, $M_2$, $M_3$ con sus ecuaciones.

- ✎ Renombrar `id` → `symploke`. Actualizar [constants.ts](src/presentation/constants.ts), [deckTypes.ts](src/presentation/deckTypes.ts), switch en [PresentationDeck.tsx](src/PresentationDeck.tsx).
- ✎ Eyebrow: _"Capítulo 2 · Symploké Urbana"_.
- ✎ H1: **"Tres materialidades, un solo entrelazamiento"**.
- ✂ Eliminar array `engines` (Cpu/Bot/Waves/Zap/Eye/Orbit).
- ➕ 3 tarjetas grandes (`PanelFrame` tones `teal | amber | danger`):
  - **$M_1$ · Materialidad física** — _"PDE de reacción-difusión, resolución 4096²"_ + KaTeX `∂u/∂t = D∇²u − κu + S(x,t)` + mini-thumb `fields/pm25_thumb.png`.
  - **$M_2$ · Intencionalidad sintética** — _"DRL, UrbanPhenomenologyDQN, capas LayerNorm y Dropout"_ + KaTeX `Q*(s,a) = E[R + γ maxₐ Q*(s',a')]`.
  - **$M_3$ · Panóptico de flujo** — _"Divergencia KL entre trayectoria libre y coaccionada"_ + KaTeX `D_{KL}(P‖Q) = Σ P(x) log(P(x)/Q(x))`.
- ➕ SVG que conecta las 3 tarjetas con `pathLength` animado (flechas M1→M2→M3 que se dibujan en 1.5s).
- ✂ Quitar stats Nodos/Agentes/Rayos/Version y `metrics-bar`.
- 📊 Cada tarjeta toma métricas ya disponibles: $M_1$ = `pde_environmental_results.resolution`; $M_2$ = `agents.length`; $M_3$ = `perceptual_visibility_results.ray_count`.
- 🎞 Entrada: `motion.div initial={{ y: 40, opacity: 0 }}` con delay escalonado (0.15/0.35/0.55s).
- **Cita pie**: Bueno, 1972 · Husserl, 1936/1991.

---

### Slide 03 · `mapa` — [MapSlide.tsx](src/presentation/slides/MapSlide.tsx) (S)

**Narrativa (tesis §1.2)**: El corredor no es grafo de transporte — es **campo de aparición**.

- ✎ Eyebrow: _"Capítulo 3 · El corredor como campo"_.
- ✎ H1: **"El campo donde aparece la ciudad"**.
- 🔁 `CorridorMap` + `NodeSpotlight` + `RouteMarquee` (`leadRoute` únicamente).
- ✂ `map-control-grid`: dejar sólo selector de `scenario`. Mover selectors `agent` y `compareAgent` a slide 05.
- ✂ `map-live-grid`: 4 tiles → 2 (nodos activos + presión media).
- ✂ HUD: conservar sólo "SISTEMA VIVO · JUNÍN CORRIDOR" y GPS.
- ➕ Pulso en cada marker de nodo proporcional a `scenarios[active].node_loads[nodeId]` con `motion.circle animate={{ r: [r0, r0*1.3, r0] }}`.
- 📊 `RouteMarquee` lee `top_routes` del escenario activo.
- 🎞 Al cambiar escenario, las rutas se redibujan con `pathLength` 0→1.

---

### Slide 04 · `heterotopias` (**nueva**) — [HeterotopiasSlide.tsx](src/presentation/slides/HeterotopiasSlide.tsx) (M)

**Narrativa (tesis §1.2 Foucault + §1.4 Sassen)**: Cada nodo ya lleva un tag `heterotopia`. Se agrupan.

- ➕ Crear archivo. Usar `SlideGrid` + 3 `PanelFrame`:
  - Tono `danger` — **Apertura/cierre**: `nodes.filter(n => n.heterotopia === 'apertura_cierre')`. Hoy: San Antonio Metro.
  - Tono `amber` — **Memoria y exposición**: `nodes.filter(n => n.heterotopia === 'memoria_y_exposicion')`. Hoy: Parque San Antonio.
  - Tono `teal` — **Ilusión/compensación**: `nodes.filter(n => n.heterotopia === 'ilusion_compensacion')`. Hoy: Palacio Nacional + otros comerciales.
- ➕ Cada panel muestra `label` + `phenomenology` del nodo (ya está en el payload).
- ➕ **Cuarto panel pequeño** abajo: _"Estructura de Expulsión"_ (Sassen 2014) — texto + chip `source_status.failed_count` como síntoma de expulsión documental.
- ➕ CTA: _"Abrir protocolo de campo"_ → `onOpenModal('fieldwork')` (ya existe la categoría).
- 🎞 Stagger 0.2s entre paneles. Cada tarjeta con `whileHover scale 1.03`. Nodos internos con mini-radar de `security/comfort/memory`.
- 📊 Datos enteramente en `case_model.nodes[].heterotopia` + `phenomenology`.
- Registrar `SlideId: 'heterotopias'` en [deckTypes.ts](src/presentation/deckTypes.ts), [constants.ts](src/presentation/constants.ts), [PresentationDeck.tsx](src/PresentationDeck.tsx).
- **Cita pie**: Foucault, 1975/2002 · Sassen, 2014.

---

### Slide 05 · `perfiles` — [ProfilesSlide.tsx](src/presentation/slides/ProfilesSlide.tsx) (S)

**Narrativa (tesis §2.2 y §3.2)**: No hay individuos, hay **dividuales** (Deleuze). La red DRL filtra percepción.

- ✎ Eyebrow: _"Capítulo 5 · dividuales"_.
- ✎ H1: **"Dividuales, no individuos"**.
- ✎ Nota: _"Deleuze, 1990: el sujeto se fragmenta en modulaciones estadísticas. LayerNorm y Dropout formalizan la actitud blasé de Simmel."_
- 🔁 `ProfileRadar` (5 perfiles × 7 dims de `agents[].weights`).
- 🔁 `RouteDuel` recibido del mapa.
- ➕ Absorber los `<select agent>` / `<select compareAgent>` movidos desde slide 03.
- ➕ Nueva sub-barra con **path_entropy** y **diversity_index** de `advanced_simulation_results.scenarios[active].profile_stats[selected]` (dato **hoy no usado**).
- 🎞 Al cambiar de perfil, el radar interpola con `spring` (ya hace esto parcialmente; asegurar con `MotionValue` explícito).
- **Cita pie**: Deleuze, 1990 · Simmel, 1903/1986.

---

### Slide 06 · `presion` — [PressureSlide.tsx](src/presentation/slides/PressureSlide.tsx) (XS)

**Narrativa (tesis §2.3)**: El régimen horario es una configuración distinta de posibilidades.

- ✎ Eyebrow: _"Capítulo 6 · régimen horario"_.
- 🔁 `pressure-card` + `pressure-orb` + `BottleneckPodium`.
- ✂ Cada card pasa de 3 `MetricLine` a 2 (quitar "Carga").
- ➕ Chip con `advanced_simulation_results.scenarios[].systemic_pressure` (peak_am 7194.78 — dato **hoy no usado**).
- 🎞 Duración del `pulse` del orb proporcional a presión: `animate={{ scale: [1, 1.2, 1] }}` con `duration = 2 / pressureNormalized`.

---

### Slide 07 · `simulacion` — [SimulationSlide.tsx](src/presentation/slides/SimulationSlide.tsx) (S)

**Narrativa (tesis §1.3)**: La simulación no representa: **presenta lo múltiple**.

- ✎ Eyebrow: _"Capítulo 7 · Presentación de lo múltiple"_.
- ✎ H1: **"Cien mil cuerpos, seis horas, un corredor"**.
- 🔁 `RecordedSimulationClip` (MP4 real).
- ➕ Antes del clip, **contador animado** que corre 0 → **640 000** (`hpc_24h.total_simulated_agents_day`) en 2s con `animate(count, 640000, { duration: 2 })` de framer-motion. Al llegar, desbloquea el clip.
- ✂ Reducir `simulation-meta-grid` a 2 `MetricLine` por sección.
- ✂ Quitar `metrics-bar` final.
- 📊 Subtítulo: _"Actitud blasé computacional: LayerNorm + Dropout"_ preparando slide 08 narrativamente.
- **Cita pie**: Badiou, 1988/1999.

---

### Slide 08 · `multitudes` — [CrowdDynamicsSlide.tsx](src/presentation/slides/CrowdDynamicsSlide.tsx) (M)

**Narrativa (tesis §3.1, §3.2)**: El pulso diario evidencia la modulación biopolítica.

- ✎ Eyebrow: _"Capítulo 8 · el pulso de la ciudad"_.
- ✎ H1: **"24 horas son un latido, no una serie de barras"**.
- 🆕 Reemplazar `AreaChart` + grid de `StatTile` por **`Heatline24h`** (reloj + heatmap + linechart sincronizados).
- 📊 Input: `hpc_24h.hourly_metrics` (24 entradas) + `temporal_24h_profile` (demand + environmental) + backdrop `fields/density_24h.png`.
- ✂ `crowd-side-grid` reduce a 2 `StatTile` (valle + peak_pm).
- 🎞 Loop de 30s: aguja del reloj rota, marker del heatmap avanza, línea chart resalta hora activa. Al pulsar `barra espaciadora`, se pausa/reanuda.
- **Cita pie**: Simmel, 1903/1986.

---

### Slide 09 · `estres` — [StressSlide.tsx](src/presentation/slides/StressSlide.tsx) (M)

**Narrativa (tesis §3.3)**: El tipping point es un **Acontecimiento** — Badiou.

- ✎ Eyebrow: _"Capítulo 9 · El Acontecimiento"_.
- ✎ Hero central: **`500.000`** en `.hero-number` (font 6rem). Subtítulo: _"En este umbral la cuenta-por-uno fracasa. La ciudad revela su vacío del ser."_
- ➕ Badge: **H: 4.59 → 5.40** (`full_curve[0].system_entropy` → `tipping_point.system_entropy`).
- 🔁 `ComposedChart` simplificado: sólo `Line entropy` + `ReferenceLine x=500000` con label "COLAPSO".
- ✂ `stress-chaos-grid` → mover a `DataModal` categoría `stress-detail` (nueva).
- 🔁 `stress-alert-panel` con `panel-alert-pulse`.
- 🆕 **`FieldRaster` con `fields/chaos.png`** como overlay condicional: `opacity: tipping ? 0.7 : 0`, `transition: 0.6s`.
- 🔁 Reutilizar `AnimatedSimulationStage` debajo del chart (ya existe) con `opacity: 0.25` constante como fondo.
- 🎞 El chart se dibuja con `pathLength` 0→1 en 2.5s al entrar a la slide.
- **Cita pie**: Badiou, 1988/1999.

---

### Slide 10 · `asfixia` (**fusión `calibracion` + `desigualdad`**) — [AsphyxiaSlide.tsx](src/presentation/slides/AsphyxiaSlide.tsx) (M)

**Narrativa (tesis §3.1, §2.3)**: La precisión del modelo **es** la asfixia de la libertad. $\sigma_{rel}$ + $D_{KL}$ + Gini.

- ➕ Crear archivo nuevo consolidando Calibración + Desigualdad.
- Layout 2 columnas:
  - **Izquierda**: hero **`0.00026`** (`.hero-number`) + subtítulo _"incertidumbre relativa — asfixia de la emergencia"_ + KaTeX `D_{KL}(P‖Q)` + mini-stat `spatial_accuracy_score` de `hpc_multipoint_calibration`.
  - **Derecha**: 4 mini-tiles (uno por escenario) con `entropy_gini` de `urban_inequality.scenarios`. Perfil más restringido destacado: _"Turista cultural"_.
- 🆕 Fondo: `FieldRaster` con `fields/density_peak_pm.png`, `motion='breathing'`, `opacity: 0.35`.
- 🎞 **Velocímetro σ**: `animate(count, 0.00026, { duration: 2.5, ease: [0.16, 1, 0.3, 1] })`. Al terminar, chip "asfixia" aparece.
- 🎞 Los 4 tiles Gini rotan con `AnimatePresence mode="wait"` cada 3s mostrando escenario activo, con nombre del perfil restringido.
- ✂ Todo lo podado (`spotlight-grid` de 3, `BarChart` de pesos, `validation-node-grid` completa, `confidence-card`, `BarChart` de entropía por perfil) se migra a `DataModal` categoría **`calibration-detail`** (nueva).
- Eliminar `CalibrationSlide.tsx` e `InequalitySlide.tsx` del switch en [PresentationDeck.tsx](src/PresentationDeck.tsx).
- **Cita pie**: Foucault, 1975/2002.

---

### Slide 11 · `ambiente` — [EnvironmentSlide.tsx](src/presentation/slides/EnvironmentSlide.tsx) (M)

**Narrativa (tesis §2.1)**: Señales estigmérgicas negativas (Johnson) — el aire decide la ruta.

- ✎ Eyebrow: _"Capítulo 11 · M₁ · campos estigmérgicos"_.
- ✎ H1: **"El aire también decide la ruta"**.
- ➕ KaTeX encabezado: `∂u/∂t = D∇²u − κu + S(x,t)`.
- 🆕 Layout split: arriba **`FieldRaster src=pm25.png cmap=viridis motion=breathing`** (leyenda 0–563.7 µg/m³), abajo **`FieldRaster src=noise.png cmap=magma motion=breathing`** (leyenda 0–648.5 dB·unit). Breathing sincronizado (mismo `duration: 8s`).
- ✂ `status-strip`: 3 `KpiPill` → 2 (Malla 4096², Estación PM2.5 peak).
- ✂ `field-grid` reducido a 2 `field-card` (PM2.5 peak, noise peak_db) — el resto de la data está ahora visualmente en los rásters.
- 📊 Lectura derecha (3 líneas) desde `hpc_environmental_report`.
- **Cita pie**: Johnson, 2001 · Aguilar, 2014.

---

### Slide 12 · `visibilidad` — [VisibilitySlide.tsx](src/presentation/slides/VisibilitySlide.tsx) (M)

**Narrativa (tesis §2.3)**: Panóptico de flujo — ver, ser visto, no poder no ser visto.

- ✎ Eyebrow: _"Capítulo 12 · M₃ · Panóptico de flujo"_.
- ✎ H1: **"Ver, ser visto, no poder no ser visto"**.
- 🆕 **`FieldRaster src=isovist.png cmap=plasma scale=log motion=breathing`** superpuesto a `CorridorMap` con `overlayBlendMode: screen, overlayOpacity: 0.55`.
- 🔁 `visibility-meter` (openness %).
- ✂ `surface-pill-grid` de 3 → 2 (puntos muestreados, resolución).
- 📊 `perceptual_visibility_results.max_panoptic_exposure` y `ray_count` en leyenda del isovist.
- 🎞 Opacity del isovist oscila 0.3 ↔ 0.8 en 6s (breathing) — evoca "ver/ser visto".
- **Cita pie**: Foucault, 1975/2002.

---

### Slide 13 · `economia` — [EconomySlide.tsx](src/presentation/slides/EconomySlide.tsx) (XS)

**Narrativa (tesis §1.4)**: El comercio curva el espacio peatonal — gravitación de Sassen.

- ✎ Eyebrow: _"Capítulo 13 · gravitación comercial"_.
- ✎ H1: **"El comercio curva el espacio"**.
- 🔁 `BarChart` top comercio + `economy-gauge` Gini.
- ✂ `status-strip` → 1 solo `KpiPill` (Gini = `spatial_concentration_gini`).
- 🎞 Aguja del gauge: `spring stiffness: 60`.
- **Cita pie**: Sassen, 2014.

---

### Slide 14 · `historia` — [HistorySlide.tsx](src/presentation/slides/HistorySlide.tsx) (M)

**Narrativa (tesis §3.1)**: 2012 → 2024, la mutación es computable.

- ✎ Eyebrow: _"Capítulo 14 · mutación longitudinal"_.
- 🆕 Reemplazar `ComposedChart` por **`FieldRaster` en modo carrusel**: `AnimatePresence mode="wait"` crossfade entre `hist_2012.png` → `hist_2018.png` → `hist_2024.png` cada 2.5s en loop.
- 🔁 Year cards abajo con sincronización: la card del año activo escala `1.05` y brilla.
- 📊 Stats de `historical_evolution_results.evolution` en la card activa.
- 🎞 Scrubber manual con flechas ←/→ que pausan el loop y permiten comparar (accesible).

---

### Slide 15 · `evidencia` — [EvidenceSlide.tsx](src/presentation/slides/EvidenceSlide.tsx) (S)

**Narrativa (tesis §3.4)**: El dato que falta es el **miembro fantasma** de Merleau-Ponty — **Simulacro de Denuncia**.

- ✎ Eyebrow: _"Capítulo 15 · el miembro fantasma"_.
- ✎ H1: **"El dato que la ciudad no se deja capturar"**.
- ✎ Subtítulo: _"La simulación es Simulacro de Denuncia."_
- 🔁 Donut (cobertura empírica), word-cloud, crime-card, barrio-card, source-card.
- ➕ **Nueva tarjeta `panel-tone-danger`** _"Miembro fantasma"_: muestra `field_calibration_delta.status = 'pending_no_capture'` + `dane_cnpv_fallback.code = 403` + `source_status.failed_count`.
- 🎞 Donut se dibuja con `strokeDasharray` animado. La tarjeta "fantasma" pulsa `panel-alert-pulse` (ya existe).
- **Cita pie**: Merleau-Ponty, 1945/1993.

---

### Slide 16 · `cierre` — [ClosingSlide.tsx](src/presentation/slides/ClosingSlide.tsx) (S)

**Narrativa (tesis §4.1, §4.3)**: El fracaso como verdad — 3 postulados doctorales.

- ✎ Eyebrow: _"Capítulo 16 · Fracaso como Verdad"_.
- ✎ H1: **"El fracaso del modelo es la verdad del lugar"**.
- ➕ 3 `PanelFrame` con stagger (delay 0.2/0.5/0.8s), tones `danger | amber | teal`:
  1. _Contra el instrumentalismo_ — texto §4.3 literal.
  2. _Soberanía fenomenológica_ — texto §4.3 literal.
  3. _El colapso como denuncia_ — texto §4.3 literal.
- 🔁 `ClosureGates` con `EpistemicBadge`.
- 🎞 Cita final con efecto _typewriter_ (`motion.span` carácter por carácter, 35ms/car).
- **Cita pie**: todos los autores (Husserl · Bueno · Badiou · Foucault · Deleuze · Merleau-Ponty · Simmel · Johnson · Sassen · Aguilar).

---

## 6. Infraestructura TypeScript

### 6.1 [deckTypes.ts](src/presentation/deckTypes.ts)

```ts
export type SlideId =
  | 'apertura' | 'symploke' | 'mapa' | 'heterotopias'
  | 'perfiles' | 'presion'  | 'simulacion' | 'multitudes'
  | 'estres'   | 'asfixia'  | 'ambiente' | 'visibilidad'
  | 'economia' | 'historia' | 'evidencia' | 'cierre'

export type ModalKind =
  | 'status' | 'evidence' | 'sources' | 'fieldwork' | 'model'
  | 'calibration-detail'    // nuevo
  | 'stress-detail'         // nuevo
```

### 6.2 [constants.ts](src/presentation/constants.ts)

Reordenar array `SLIDES` (16 entradas) con `shortLabel`: `Calle · M1/M2/M3 · Campo · Hetero · Divid · Horas · 100k · Pulso · Evento · Asfixia · M1 · M3 · Gravedad · Hist · Fantasma · Tesis`.

Añadir `MODAL_TITLES['calibration-detail']` y `MODAL_TITLES['stress-detail']`.

### 6.3 [PresentationDeck.tsx](src/PresentationDeck.tsx)

Switch con los 16 nuevos IDs. Quitar `metodo`, `calibracion`, `desigualdad`. Importar `SymplokeSlide`, `HeterotopiasSlide`, `AsphyxiaSlide`.

### 6.4 [DataModal.tsx](src/presentation/components/DataModal.tsx)

Añadir 2 categorías:

- **`calibration-detail`**: 3 spotlights calibración + `BarChart` pesos + `validation_nodes` chips + `uncertainty.results` por hora + tabla de `urban_inequality.scenarios`.
- **`stress-detail`**: `chaos` (informality/flaneur/turbulence) + `full_curve` completa + `advanced_simulation_results.scenarios[].systemic_pressure`.

### 6.5 Hook `useDeckController` — [src/presentation/hooks/](src/presentation/hooks/)

Añadir listener `keydown`:

- `D` → abre modal técnico de la slide activa (mapping: `asfixia→calibration-detail`, `estres→stress-detail`, `evidencia→evidence`, `mapa→model`, `heterotopias→fieldwork`, resto→`status`).
- `Espacio` en `multitudes` → pausa/reanuda `Heatline24h`.
- `←/→` en `historia` → scrubber manual que pausa el crossfade.

### 6.6 Tipos del payload — [src/types.ts](src/types.ts)

Añadir:

```ts
type FieldsManifest = {
  [slug: string]: {
    src: string
    cmap: 'viridis' | 'magma' | 'plasma' | 'inferno' | 'turbo'
    min: number
    max: number
    units: string
    scale: 'linear' | 'log'
  }
}

type Temporal24h = {
  hours: number[]
  demand_multiplier: number[]
  environmental_intensity: number[]
  peak_am_hour: number
  peak_pm_hour: number
}

type RawReports = {
  chaos: ChaosReport
  multipoint_calibration: MultipointCalibration
  uncertainty: UncertaintyReport
  micro: MicroResults
  advanced_scenarios: AdvancedScenario[]
}
```

Extender `FrontendPayload` con `fields_manifest`, `temporal_24h`, `raw_reports`.

---

## 7. Catálogo de animaciones avanzadas (biblioteca reusable)

Patrones concretos de framer-motion que se usan en todo el deck. No inventar nuevos.

| Patrón | Implementación | Slides donde aparece |
|---|---|---|
| **Stagger reveal** | `transition={{ staggerChildren: 0.18 }}` en contenedor + `initial={{ y: 30, opacity: 0 }}` en hijos | apertura, symploke, heterotopias, cierre |
| **pathLength SVG** | `<motion.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}/>` | symploke (flechas M1→M2→M3), mapa (rutas), estres (chart) |
| **Contador animado** | `const c = useMotionValue(0); animate(c, target, { duration: 2 }); useTransform(c, v => v.toLocaleString('es'))` | simulacion (640k), asfixia (σ=0.00026), estres (500k) |
| **Breathing raster** | `animate={{ opacity: [0.65, 1, 0.65] }} transition={{ duration: 8, repeat: Infinity }}` | ambiente, visibilidad, asfixia |
| **Pulse orb** | `animate={{ scale: [1, 1 + 0.2*f, 1] }}` con `duration` ∝ 1/carga | presion, mapa (marcadores) |
| **Crossfade AnimatePresence** | `<AnimatePresence mode="wait">` cambiando `key={index}` cada `setInterval` | historia (2012/2018/2024), asfixia (escenarios Gini) |
| **Loop 24h sincronizado** | `useAnimationFrame` avanzando `hourIndex` 0→23 en N segundos, todos los subcomponentes leen `hourIndex` | multitudes |
| **Reveal tipográfico clipPath** | `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)` con `duration: 1.2` | cierre (cita final) |
| **Typewriter** | `motion.span` char-by-char con `transition delay: i * 0.035` | cierre |
| **Overlay condicional tipping** | `animate={{ opacity: tipping ? 0.7 : 0 }}` | estres (chaos.png) |
| **Blend mode screen** | CSS `mix-blend-mode: screen` + framer opacity oscillation | visibilidad (isovist sobre mapa) |
| **Spring interpolado** | `useSpring(value, { stiffness: 60, damping: 14 })` | perfiles (radar), economia (gauge) |

Todos los patrones respetan `prefers-reduced-motion` (utilidad `useReducedMotion()` de framer).

---

## 8. CSS y fórmulas

### 8.1 CSS — [src/presentation.css](src/presentation.css)

Adiciones mínimas al archivo existente (3389 LOC):

```css
/* hero-number — para 500.000, 0.00026, 640.000 */
.hero-number {
  font-size: clamp(4rem, 8vw, 6.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* field-raster — wrapper para FieldRaster */
.field-raster { position: relative; border-radius: 18px; overflow: hidden; }
.field-raster img { width: 100%; height: 100%; object-fit: cover; display: block; }
.field-raster .legend {
  position: absolute; bottom: 12px; left: 12px;
  background: rgba(12,14,20,.72); backdrop-filter: blur(8px);
  padding: 6px 10px; border-radius: 10px; font-size: 0.75rem;
}

/* heatline-24h */
.heatline-24h { display: grid; grid-template-columns: 180px 1fr; gap: 16px; }
.heatline-24h .clock { aspect-ratio: 1; }
.heatline-24h .strip { height: 64px; }
```

**Nada más**. Los tokens, `panel-tone-*`, `donut`, `word-cloud`, `economy-gauge`, `visibility-meter`, `pressure-orb`, `constellation-node`, `alert-number`, `panel-alert-pulse` ya existen.

### 8.2 KaTeX

Instalar:

```bash
npm i katex react-katex
```

Importar CSS una sola vez en [src/main.tsx](src/main.tsx):

```ts
import 'katex/dist/katex.min.css'
```

Helper utilitario en un único sitio — [src/presentation/components/ui.tsx](src/presentation/components/ui.tsx):

```tsx
import { InlineMath, BlockMath } from 'react-katex'
export const TexInline = ({ tex }: { tex: string }) => <InlineMath math={tex} />
export const TexBlock  = ({ tex }: { tex: string }) => <BlockMath math={tex} />
```

Usos concretos: ver §5 slides `symploke`, `ambiente`, `asfixia`, `estres`.

---

## 9. Orden de implementación (fases ejecutables)

Cada fase deja el deck compilando. Si una fase rompe, se revierte sin afectar las anteriores.

### Fase 1 · Infraestructura silenciosa (no cambia UX visible)

- [deckTypes.ts](src/presentation/deckTypes.ts): actualizar `SlideId` y `ModalKind`.
- [constants.ts](src/presentation/constants.ts): reordenar, renombrar labels, `MODAL_TITLES` x2.
- [types.ts](src/types.ts): añadir `FieldsManifest`, `Temporal24h`, `RawReports`.
- [PresentationDeck.tsx](src/PresentationDeck.tsx): stub de casos `symploke/heterotopias/asfixia` (lanzan copia de slides anteriores temporalmente).
- Atajo `D` en `useDeckController`.

### Fase 2 · Pipeline de datos

- Crear [investigacion/scripts/visualization/export_raster_fields.py](investigacion/scripts/visualization/export_raster_fields.py).
- Ejecutar una vez; verificar `public/data/fields/*.png` + `manifest.json`.
- Extender [publish_visual_payload.py](investigacion/scripts/visualization/publish_visual_payload.py) con `fields_manifest`, `temporal_24h`, `raw_reports`.
- Integrar ambos en [run_all.py](investigacion/scripts/run_all.py).
- Re-ejecutar pipeline; validar `frontend_payload.json` tiene las 3 nuevas claves.

### Fase 3 · Instalación KaTeX + primitivas

- `npm i katex react-katex`.
- Añadir import global + `TexInline`/`TexBlock` en `ui.tsx`.
- Crear `.hero-number`, `.field-raster`, `.heatline-24h` en CSS.

### Fase 4 · Componentes nuevos

- Crear [FieldRaster.tsx](src/presentation/components/visuals/FieldRaster.tsx).
- Crear [Heatline24h.tsx](src/presentation/components/visuals/Heatline24h.tsx).
- Ambos exportados desde un barrel si ya existe.

### Fase 5 · Podas XS/S de slides sin cambio estructural

10 slides con cambios menores: `mapa`, `perfiles`, `presion`, `simulacion`, `ambiente`, `visibilidad`, `economia`, `historia`, `evidencia` + eliminar `CalibrationSlide.tsx`/`InequalitySlide.tsx` del switch.

### Fase 6 · Refactor mayor: apertura + symploke + cierre

Tesis-anchor slides. Aquí entra KaTeX, `HeroConstellation` en `apertura`, 3 tarjetas M1/M2/M3 en `symploke`, 3 postulados en `cierre`.

### Fase 7 · Slides fusionadas/nuevas

- Crear [HeterotopiasSlide.tsx](src/presentation/slides/HeterotopiasSlide.tsx) (nueva).
- Crear [AsphyxiaSlide.tsx](src/presentation/slides/AsphyxiaSlide.tsx) (fusión).
- Crear [SymplokeSlide.tsx](src/presentation/slides/SymplokeSlide.tsx) (si el rename implica cambio de filename; alternativa: dejar `MethodSlide.tsx` y cambiar contenido).

### Fase 8 · Animaciones avanzadas por slide

- `multitudes` con `Heatline24h`.
- `estres` con hero 500k + chaos overlay condicional + chart `pathLength`.
- `asfixia` con velocímetro σ + crossfade Gini.
- `ambiente`, `visibilidad` con `FieldRaster` breathing.
- `historia` con crossfade 2012→2018→2024.
- `simulacion` con contador 640k.

### Fase 9 · DataModal ampliado

- Implementar `calibration-detail` y `stress-detail` con todo el material migrado.

### Fase 10 · QA

- `npm run lint && npm run build`.
- Recorrido completo con flechas.
- Validar que los PNG pesan < 400 KB c/u.
- Validar `visibleBottom` real en navegador (nota de memory sobre `scrollHeight` engañoso).
- Test con `prefers-reduced-motion`.

---

## 10. Anti-plan (lo que **no** se hace)

- **No** reemplazar Leaflet por SVG estilizado.
- **No** crear componentes que dupliquen `HeroConstellation`, `NetworkView`, `AnimatedSimulationStage`, `RecordedSimulationClip`.
- **No** inventar más de los **2** componentes visuales nuevos (`FieldRaster`, `Heatline24h`).
- **No** cambiar paleta, tokens, tipografía.
- **No** reescribir la capa de payload ni los scripts de simulación.
- **No** borrar los 4 MP4 ni los posters — son assets reales.
- **No** añadir dependencias npm salvo `katex` + `react-katex`.
- **No** introducir scroll interno dentro de una slide.
- **No** "suavizar" los datos duros: 500 000, 0.00026, 4.59→5.40, 640 000 deben aparecer literales.

---

## 11. Apéndices

### A. Checklist por archivo

| # | Archivo | Acción | Esfuerzo |
|---|---|---|---|
| 1 | [investigacion/scripts/visualization/export_raster_fields.py](investigacion/scripts/visualization/export_raster_fields.py) | **Crear** | M |
| 2 | [investigacion/scripts/visualization/publish_visual_payload.py](investigacion/scripts/visualization/publish_visual_payload.py) | Añadir `fields_manifest` + `temporal_24h` + `raw_reports` | S |
| 3 | [investigacion/scripts/run_all.py](investigacion/scripts/run_all.py) | Registrar nuevo paso | XS |
| 4 | [src/types.ts](src/types.ts) | Extender `FrontendPayload` | XS |
| 5 | [src/presentation/deckTypes.ts](src/presentation/deckTypes.ts) | `SlideId`, `ModalKind` | XS |
| 6 | [src/presentation/constants.ts](src/presentation/constants.ts) | Reordenar `SLIDES`, `MODAL_TITLES` | XS |
| 7 | [src/PresentationDeck.tsx](src/PresentationDeck.tsx) | Switch + imports | S |
| 8 | [src/presentation/hooks/useDeckController.ts](src/presentation/hooks/) | Atajo `D`, `Espacio`, `←/→` | S |
| 9 | [src/presentation/components/ui.tsx](src/presentation/components/ui.tsx) | `TexInline`/`TexBlock` | XS |
| 10 | [src/presentation.css](src/presentation.css) | `.hero-number`, `.field-raster`, `.heatline-24h` | XS |
| 11 | [src/main.tsx](src/main.tsx) | Import `katex/dist/katex.min.css` | XS |
| 12 | [package.json](package.json) | `katex` + `react-katex` | XS |
| 13 | [src/presentation/components/visuals/FieldRaster.tsx](src/presentation/components/visuals/FieldRaster.tsx) | **Crear** | M |
| 14 | [src/presentation/components/visuals/Heatline24h.tsx](src/presentation/components/visuals/Heatline24h.tsx) | **Crear** | M |
| 15 | [src/presentation/components/DataModal.tsx](src/presentation/components/DataModal.tsx) | +2 categorías | M |
| 16 | [src/presentation/slides/OpenSlide.tsx](src/presentation/slides/OpenSlide.tsx) | Refactor narrativo + `HeroConstellation` | S |
| 17 | [src/presentation/slides/MethodSlide.tsx](src/presentation/slides/MethodSlide.tsx) → `SymplokeSlide` | 3 tarjetas M1/M2/M3 + KaTeX | M |
| 18 | [src/presentation/slides/MapSlide.tsx](src/presentation/slides/MapSlide.tsx) | Poda + pulse en nodos | S |
| 19 | [src/presentation/slides/HeterotopiasSlide.tsx](src/presentation/slides/HeterotopiasSlide.tsx) | **Crear** | M |
| 20 | [src/presentation/slides/ProfilesSlide.tsx](src/presentation/slides/ProfilesSlide.tsx) | Absorber selects + `path_entropy` | S |
| 21 | [src/presentation/slides/PressureSlide.tsx](src/presentation/slides/PressureSlide.tsx) | Poda + chip `systemic_pressure` | XS |
| 22 | [src/presentation/slides/SimulationSlide.tsx](src/presentation/slides/SimulationSlide.tsx) | Contador 640k + poda | S |
| 23 | [src/presentation/slides/CrowdDynamicsSlide.tsx](src/presentation/slides/CrowdDynamicsSlide.tsx) | Sustituir por `Heatline24h` | M |
| 24 | [src/presentation/slides/StressSlide.tsx](src/presentation/slides/StressSlide.tsx) | Hero 500k + chaos overlay + entropy chip | M |
| 25 | [src/presentation/slides/AsphyxiaSlide.tsx](src/presentation/slides/AsphyxiaSlide.tsx) | **Crear** (fusión) | M |
| 26 | [src/presentation/slides/CalibrationSlide.tsx](src/presentation/slides/CalibrationSlide.tsx) | Eliminar referencia en switch | XS |
| 27 | [src/presentation/slides/InequalitySlide.tsx](src/presentation/slides/InequalitySlide.tsx) | Eliminar referencia en switch | XS |
| 28 | [src/presentation/slides/EnvironmentSlide.tsx](src/presentation/slides/EnvironmentSlide.tsx) | `FieldRaster` split pm25/noise + KaTeX | M |
| 29 | [src/presentation/slides/VisibilitySlide.tsx](src/presentation/slides/VisibilitySlide.tsx) | `FieldRaster` isovist sobre mapa | M |
| 30 | [src/presentation/slides/EconomySlide.tsx](src/presentation/slides/EconomySlide.tsx) | Poda `status-strip` | XS |
| 31 | [src/presentation/slides/HistorySlide.tsx](src/presentation/slides/HistorySlide.tsx) | Crossfade `FieldRaster` 2012/2018/2024 | M |
| 32 | [src/presentation/slides/EvidenceSlide.tsx](src/presentation/slides/EvidenceSlide.tsx) | Tarjeta "miembro fantasma" + `Simulacro de Denuncia` | S |
| 33 | [src/presentation/slides/ClosingSlide.tsx](src/presentation/slides/ClosingSlide.tsx) | 3 postulados §4.3 + typewriter | S |

**Totales**: 3 archivos Python (1 nuevo), 5 archivos TS de infraestructura, 2 componentes visuales nuevos, 16 slides tocadas (2 nuevas, 1 fusión, 1 rename, 12 refactor in-situ). Esfuerzo agregado: **~14–16 h**.

### B. Guion verbal mínimo (2 frases / slide)

1. **Apertura** — "Husserl denuncia la matematización. Este deck vuelve a la calle misma."
2. **Symploké** — "Bueno: tres materialidades entrelazadas. PDE, Bellman, KL."
3. **Mapa** — "No es un grafo de transporte: es un campo de aparición."
4. **Heterotopías** — "Foucault: la ciudad tiene contra-sitios. Sassen: producen expulsión."
5. **Dividuales** — "Deleuze: no hay individuos. Simmel: la indiferencia es defensa."
6. **Presión** — "La hora cambia el régimen de posibilidades."
7. **Simulación** — "640 mil cuerpos. No se representa: se presenta."
8. **Multitudes** — "24 horas son un latido."
9. **Acontecimiento** — "500 000. La entropía salta de 4.59 a 5.40. La cuenta-por-uno fracasa."
10. **Asfixia** — "σ = 0.00026. La precisión es asfixia."
11. **Ambiente** — "El aire también decide la ruta. Reacción-difusión."
12. **Visibilidad** — "Ver, ser visto, no poder no ser visto."
13. **Economía** — "El comercio curva el espacio. Gini: Sassen."
14. **Historia** — "2012 → 2024: la mutación es computable."
15. **Miembro fantasma** — "Lo incapturable es la tesis. Simulacro de Denuncia."
16. **Cierre** — "El fracaso del modelo es la verdad del lugar. Tres postulados."

### C. Citas en pie de slide (mapeo final)

| Slide | Autor(es) citado(s) en footer |
|---|---|
| apertura | Husserl 1936/1991 |
| symploke | Bueno 1972 · Husserl 1936/1991 |
| mapa | Bueno 1972 |
| heterotopias | Foucault 1975/2002 · Sassen 2014 |
| perfiles | Deleuze 1990 · Simmel 1903/1986 |
| presion | Foucault 1975/2002 |
| simulacion | Badiou 1988/1999 |
| multitudes | Simmel 1903/1986 |
| estres | Badiou 1988/1999 |
| asfixia | Foucault 1975/2002 |
| ambiente | Johnson 2001 · Aguilar 2014 |
| visibilidad | Foucault 1975/2002 |
| economia | Sassen 2014 |
| historia | — |
| evidencia | Merleau-Ponty 1945/1993 |
| cierre | _todos_ |

Así los 10 autores centrales de la tesis aparecen **visibles** al menos una vez.

---

## 12. TL;DR

- **16 rásters `.npy`** hoy invisibles → exportados como PNG 1024² con 1 script Python.
- **2 componentes React nuevos** (`FieldRaster`, `Heatline24h`) justificados por datos huérfanos.
- **10 componentes existentes** reusados tal cual.
- **16 slides** re-secuenciadas: 2 nuevas (heterotopías, asfixia), 1 rename (metodo→symploke), 12 refactor in situ, 1 eliminada estructuralmente (calibracion+desigualdad fusionadas).
- **10 autores** de la tesis citados literalmente en footer; 3 fórmulas (KL, Bellman, reacción-difusión) renderizadas en KaTeX; 4 números-protagonista (500k, 0.00026, 640k, 4.59→5.40) con formato hero.
- **3 JSON hoy huérfanos** (`temporal_24h`, `advanced_simulation_results`, `hpc_chaos`) entran al payload y al deck.
- **12 animaciones** catalogadas, todas con `prefers-reduced-motion` honrado.
- Cero riesgo de regresión sobre lo que ya funciona.
