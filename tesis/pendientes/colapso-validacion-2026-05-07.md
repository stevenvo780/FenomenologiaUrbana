# Validación de la matriz de colapso fenomenológico

Fecha: 2026-05-07
Fuente: `investigacion/data/processed/collapse_matrix.json`
Generador: `investigacion/hpc/build_collapse_matrix.py`
Inspector: `investigacion/hpc/inspect_matrix.py`

## 1. Resumen ejecutivo

De las 36 celdas (9 nodos × 4 franjas), **0 celdas** alcanzan la regla
3-de-4 (colapso fenomenológico confirmado), **0 celdas** muestran 2/4
(zona gris), **1 celda** queda en `friccion_acumulada` con 1/4
(`junin_paseo|peak_am` por C4), **3 celdas** se reportan como
`flujo_ordinario` (cobertura ≥ 2 sin condiciones cumplidas) y **32
celdas** quedan `inconcluyente` por cobertura insuficiente (< 2 fuentes).
La matriz, en su estado actual, **falsa la afirmación sustantiva de
colapso** en cualquier celda y, simultáneamente, **fortalece la
falsabilidad** de la categoría: la definición se sostiene, pero el campo
todavía no produce instancias confirmadas. Esto es coherente con la
preg. 12 del listado de defensa.

## 2. Hallazgo crítico sobre C1 (criminalidad horaria)

El bloque `C1.c1_high_by_window` del JSON dice `{peak_am, midday,
peak_pm, night} = true`, pero **ninguna celda** termina con
`C1_crime_high: true`. La razón está en `build_collapse_matrix.py`
(líneas 252-268): la función reevalúa C1 por franja con
`recent_avg = c1.get("median_month")` (= 186 casos/mes), proyecta con
los pesos y horas/franja documentados, y compara contra los p75 por
franja en casos/hora:

| Franja  | peso | h | casos_w | tasa/h | p75/h    | C1_high |
|---------|------|---|---------|--------|----------|---------|
| peak_am | 0.20 | 3 | 37.2    | 12.4   | 46.27    | false   |
| midday  | 0.20 | 5 | 37.2    | 7.4    | 27.76    | false   |
| peak_pm | 0.45 | 5 | 83.7    | 16.7   | 62.46    | false   |
| night   | 0.15 | 3 | 27.9    | 9.3    | 34.70    | false   |

Con la mediana mensual como referente conservador, ningún mes
"promedio" cruza el p75 por hora. Si se usara `max_month` (1707) o el
promedio de los meses ya marcados en `months_above_p75` (62 meses),
las cuatro franjas saltarían a `true` y la matriz cambiaría
sustancialmente. **Decisión a tomar antes de defensa**: documentar
explícitamente en la tesis el supuesto "C1 evaluado sobre la mediana
mensual" o cambiar a un escenario etiquetado como "mes en pico".

## 3. Tabla de las 36 celdas

Notación: C1/C2/C3/C4 = booleanos cumplidos; cov = fuentes con dato;
dec = decisión.

| # | Nodo | Franja | C1 | C2 | C3 | C4 | cov | Decisión |
|---|------|--------|----|----|----|----|-----|----------|
| 1 | san_antonio_metro | peak_am | 0 | – | – | 0 | 2 | flujo_ordinario |
| 2 | san_antonio_metro | midday | 0 | – | – | – | 1 | inconcluyente |
| 3 | san_antonio_metro | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 4 | san_antonio_metro | night | 0 | – | – | – | 1 | inconcluyente |
| 5 | parque_san_antonio | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 6 | parque_san_antonio | midday | 0 | – | – | – | 1 | inconcluyente |
| 7 | parque_san_antonio | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 8 | parque_san_antonio | night | 0 | – | – | – | 1 | inconcluyente |
| 9 | palacio_nacional | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 10 | palacio_nacional | midday | 0 | – | – | – | 1 | inconcluyente |
| 11 | palacio_nacional | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 12 | palacio_nacional | night | 0 | – | – | – | 1 | inconcluyente |
| 13 | junin_paseo | peak_am | 0 | – | – | **1** | 2 | **friccion_acumulada** |
| 14 | junin_paseo | midday | 0 | – | – | 0 | 2 | flujo_ordinario |
| 15 | junin_paseo | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 16 | junin_paseo | night | 0 | – | – | – | 1 | inconcluyente |
| 17 | oriental_cruce | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 18 | oriental_cruce | midday | 0 | – | – | – | 1 | inconcluyente |
| 19 | oriental_cruce | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 20 | oriental_cruce | night | 0 | – | – | – | 1 | inconcluyente |
| 21 | parque_berrio | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 22 | parque_berrio | midday | 0 | – | – | 0 | 2 | flujo_ordinario |
| 23 | parque_berrio | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 24 | parque_berrio | night | 0 | – | – | – | 1 | inconcluyente |
| 25 | carabobo_cultural | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 26 | carabobo_cultural | midday | 0 | – | – | – | 1 | inconcluyente |
| 27 | carabobo_cultural | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 28 | carabobo_cultural | night | 0 | – | – | – | 1 | inconcluyente |
| 29 | plaza_botero | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 30 | plaza_botero | midday | 0 | – | – | – | 1 | inconcluyente |
| 31 | plaza_botero | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 32 | plaza_botero | night | 0 | – | – | – | 1 | inconcluyente |
| 33 | museo_antioquia | peak_am | 0 | – | – | – | 1 | inconcluyente |
| 34 | museo_antioquia | midday | 0 | – | – | – | 1 | inconcluyente |
| 35 | museo_antioquia | peak_pm | 0 | – | – | – | 1 | inconcluyente |
| 36 | museo_antioquia | night | 0 | – | – | – | 1 | inconcluyente |

«–» indica ausencia de dato para esa fuente en esa celda.

## 4. Conteos

- Colapso confirmado (≥ 3/4): **0 / 36**
- Zona gris (2/4): **0 / 36**
- Fricción acumulada (1/4 con cov ≥ 2): **1 / 36** (`junin_paseo|peak_am`)
- Flujo ordinario (0/4 con cov ≥ 2): **3 / 36** (`san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday`)
- Inconcluyente (cov < 2): **32 / 36**

## 5. Celdas defendibles vs preliminares ante jurado

**Defendibles ante jurado (con redacción cuidadosa)**

- **`junin_paseo|peak_am` — fricción acumulada por C4.** Cuatro
  registros de video (n=4), saturación p75 = 0.465, max = 0.474, sobre
  un p75 global de 0.413. Es el único nodo×franja donde C4 cruza el
  umbral. La narrativa correcta para defensa: "fricción material
  matinal documentada en video; pendiente convergencia con C2/C3 para
  hablar de colapso".
- **Saturación de fondo en `parque_berrio|midday` (n=3, max 0.399) y
  `san_antonio_metro|peak_am` (n=3, max 0.365)**: defendibles como
  evidencia C4 *no saturada*, útiles como contraste empírico (no son
  zonas de colapso).
- **El hecho de que la matriz salga sin colapso** es defendible y
  consistente con el documento `colapso-fenomenologico.md` §7
  (falsabilidad) y la pregunta 12 del cuestionario de defensa.

**Preliminares / no afirmar como resultado**

- Cualquier afirmación sobre C1 por franja: el motor recalcula sobre
  la mediana mensual y todas dan `false`, mientras el bloque C1 dice
  `c1_high_by_window: all true`. Este desfase debe explicarse antes de
  presentar la matriz a un jurado.
- Las 32 celdas `inconcluyente` no pueden leerse como "sin colapso";
  solo significan cobertura < 2.
- Las 3 celdas `flujo_ordinario` no son "zonas tranquilas": solo
  significan que las únicas dos fuentes con dato (C1 vía proyección y
  C4 vía video) no marcan condición.

## 6. Huecos de datos identificados

- **C2 (encuesta de seguridad percibida)**: 0 / 36 celdas con dato.
  Falta `field_observations_aggregate.csv` poblado con `security_score`.
  Bloquea por sí solo el alcance de la regla 3-de-4 en cualquier celda.
- **C3 (transcripciones codificadas)**: 0 / 36 celdas con dato. No hay
  archivos `*.coded.json` en `investigacion/data/interim/`. Depende del
  colega externo que transcribe.
- **C4 (saturación de video)**: solo 4 celdas con dato (`junin_paseo|peak_am`
  con n=4, `parque_berrio|midday` n=3, `san_antonio_metro|peak_am` n=3,
  `junin_paseo|midday` n=2). 32 celdas sin video procesado en HPC.
- **C1 (criminalidad horaria)**: disponible globalmente, pero
  parametrizado sobre la mediana mensual; revisar política antes de
  defensa.
- **Critical path para alcanzar al menos una celda en colapso**: poblar
  C2 y C3 en `junin_paseo|peak_am`, donde C4 ya está marcado y C1
  podría reactivarse con un supuesto distinto.

## 7. Conclusión para la defensa

La matriz, hoy, es honesta y vacía: cumple su función falsacionista.
Nada que se haya escrito en el guion público o en los capítulos 3-4
sobre "colapso confirmado" puede sostenerse con esta versión del JSON.
El plan defendible es: (a) presentar la matriz como evidencia del rigor
de la regla 3-de-4, (b) reportar `junin_paseo|peak_am` como única
fricción material confirmada, (c) declarar explícitamente los huecos
C2/C3 y el supuesto de C1, y (d) condicionar cualquier afirmación
sustantiva al cierre del pipeline.

## Anexo: regeneración 2026-05-07 (post-fix C1)

**Fix aplicado.** En `investigacion/hpc/build_collapse_matrix.py` se
eliminó la reevaluación interna de C1 sobre `median_month` (líneas
252-268 originales) que producía la inconsistencia descrita en §2: el
bloque `c1_high_by_window` precomputado en `load_c1_crime` marcaba las
cuatro franjas como `true`, pero `build_matrix` las recalculaba contra
la mediana mensual y todas terminaban en `false`. Ahora `build_matrix`
lee directamente `c1.get("c1_high_by_window")` y respeta el corte p75
por franja sobre la serie histórica MEData, que es la operacionalización
formal de C1 en `colapso-fenomenologico.md` §1.

**Nuevo conteo de decisiones (36 celdas):**

- Colapso confirmado (≥ 3/4): **0 / 36** (sin cambio).
- Zona gris (2/4): **0 / 36** (sin cambio en categoría, pero
  `junin_paseo|peak_am` ahora cumple 2/4 con C1+C4).
- Fricción acumulada (≥ 1/4 con cov ≥ 2): **4 / 36** (antes 1).
- Flujo ordinario (0/4 con cov ≥ 2): **0 / 36** (antes 3).
- Inconcluyente (cov < 2): **32 / 36** (sin cambio).

**Celdas que cambiaron de decisión:**

| Celda | Antes | Ahora | Condiciones |
|-------|-------|-------|-------------|
| `san_antonio_metro|peak_am` | flujo_ordinario | friccion_acumulada | C1=1, C4=0 |
| `junin_paseo|midday` | flujo_ordinario | friccion_acumulada | C1=1, C4=0 |
| `parque_berrio|midday` | flujo_ordinario | friccion_acumulada | C1=1, C4=0 |
| `junin_paseo|peak_am` | friccion_acumulada (1/4) | friccion_acumulada (2/4) | C1=1, C4=1 |

**Nota metodológica.** El cambio refuerza la lectura honesta de la
matriz: ya no hay celdas declaradas como `flujo_ordinario` cuando la
única fuente disponible además de C1 es C4 — eso era un artefacto del
desfase. Ninguna celda alcanza el umbral 3-de-4 (la regla sustantiva
sigue sin instanciarse), pero `junin_paseo|peak_am` se consolida como
la celda más cargada del corredor (2/4, C1+C4), candidata natural para
el cierre del pipeline una vez se pueblen C2 y C3. La matriz sigue
siendo falsable y honesta: documenta convergencia parcial sin
sobreafirmar colapso.
