---
fecha: 2026-05-05
tipo: inter_rater_reliability
raters: [stev, jacob]
schema: inter_rater_reliability_v1
---

# Inter-rater reliability — Stev vs Jacob (2026-05-05)

Mismo recorrido, mismo día, dos observadores independientes. Este documento cuantifica (Cohen's kappa) y cualifica (concordancia temática) la concordancia inter-observador, como soporte metodológico para la defensa.

## 1. Scoring por observador y por nodo

Variable principal: `perceived_safety_score_1_5` (escala 1–5 declarada en M2). Binarización para kappa: `>=3 → alto`, `<3 → bajo`.

| Nodo | Stev (1–5) | Stev (bin) | Jacob (1–5) | Jacob (bin) | Acuerdo |
|---|---:|:---:|---:|:---:|:---:|
| san_antonio_metro    | 2 | bajo | 3 | alto | NO |
| parque_san_antonio   | 4 | alto | 2 | bajo | NO |
| junin_paseo          | 4 | alto | 3 | alto | SI |
| parque_botero        | 2 | bajo | 2 | bajo | SI |

Acuerdo bruto: 2/4 = 0.50.

### Notas atmosféricas (resumen)

| Nodo | Stev — claves | Jacob — claves |
|---|---|---|
| san_antonio_metro | pobreza ortodoxa; vigilancia obligada; miedo vial | calma matutina; flujo trabajadores; prisa según perfil |
| parque_san_antonio | tranquilidad en medio del ruido; "no está rota la ventana"; arte | violencia; "paso histórico del terror"; subalternos; teatro de masas; vandalismo religioso |
| junin_paseo | muy habitable; extremadamente limpio; humildad; modernidad sobre antiguo | comercio informal heterotópico; reggaetón vs vallenato; clase media; vendedor seguro / transeúnte no; gradiente Coltejer-Ayacucho |
| parque_botero | sofocante; rezagos de violencia; presión social por exceso de seguridad | turística; sofisticación vs precariedad; Ejército reclutando; seguridad privada estatal; calle del consumo adyacente |

## 2. Cohen's kappa (cuantitativo)

- n = 4 ítems pareados (nodos compartidos).
- `Stev`:  [bajo, alto, alto, bajo]
- `Jacob`: [alto, bajo, alto, bajo]
- p_observed (acuerdo bruto) = 0.50
- p_expected (acuerdo por azar) = 0.50  (ambos raters: 50/50 alto/bajo)
- **kappa = (0.50 − 0.50) / (1 − 0.50) = 0.0**

Interpretación (Landis & Koch 1977): `kappa = 0.0` cae en *poor agreement* (<0.20). Está muy por debajo del umbral 0.4 habitualmente exigido.

### Lectura defensiva

Este resultado **no invalida** el estudio; al contrario, **confirma su tesis nuclear**: la atmósfera urbana es ineliminablemente subjetiva y depende de la sensibilidad cultivada del observador. Cuatro implicaciones metodológicas:

1. Justifica la **triangulación multi-observador** como necesaria, no opcional.
2. Justifica **C3 (testimonios in-situ)** como tercer eje independiente: cuando dos AF divergen, el testimonio de quien habita el nodo desempata.
3. Justifica **C1, C2, C4** como anclajes objetivables (oficiales, técnicos, físicos) que no dependen de la AF.
4. Convierte la divergencia en **dato fenomenológico positivo**: el caso `parque_san_antonio` (Stev=alto, Jacob=bajo) opera como evidencia empírica de que el "mismo lugar" no existe sin observador.

## 3. Concordancia cualitativa por temas

| Tema | Stev | Jacob | Concordancia |
|---|---|---|---|
| Heterotopía (categoría) | la_bastilla altamente heterotópico | junín apoderamiento heterotópico | **convergente conceptual** / divergente locacional |
| Presencia policial fuerte | botero (blase) | botero + seguridad privada estatal + Ejército | **convergente** (Jacob amplía) |
| Comercio informal en Junín | "casi nada" | "se apodera" | **divergente fuerte** |
| Atmósfera parque_san_antonio | tranquilidad contemplativa | violencia / paso del terror | **divergente radical** |
| Consumo / microtráfico Botero | no explícito | calle del consumo, prostitución | asimétrica (solo Jacob) |
| Ritmos temporales | no explícito | 6pm cierre informal | asimétrica (solo Jacob) |
| Marcadores sonoros | no explícito | reggaetón vs vallenato | asimétrica (solo Jacob) |

### Convergencias

- Heterotopía como categoría operativa.
- Presencia policial fuerte en parque_botero.
- Sensación de mejoramiento parcial en parque_botero.
- Calma matutina en san_antonio_metro (con matices de scoring).

### Divergencias

- **parque_san_antonio**: divergencia radical (Stev=4 alto / Jacob=2 bajo). Caso paradigmático.
- **junin_paseo / comercio informal**: divergencia fuerte (limpio vs heterotópicamente apoderado).
- **san_antonio_metro**: Stev percibe miedo vial; Jacob registra calma.

### Aportes únicos de Jacob

- Ejército reclutando (capa militar, no sólo policial).
- Seguridad privada contratada por el Estado (vigilancia heterogénea).
- "Calle del consumo" adyacente a Botero (circuito microtráfico).
- Ritmos temporales (6pm cierre).
- Marcadores culturales sonoros (reggaetón/vallenato).
- Gradiente intra-nodo: Coltejer-Ayacucho como sub-zona peligrosa dentro de Junín.
- Distinción **vendedor seguro / transeúnte no** (perfil-dependencia de la seguridad).

## 4. Decisión metodológica

- Reportar `kappa = 0.0` explícitamente en la tesis (sección de método y limitaciones).
- Mantener AF de Stev como observación de referencia, pero **incorporar Jacob como contraste sistemático**.
- En adelante, todo nodo con divergencia binaria entre observadores pasa a **bandera "fenomenológicamente disputado"** y exige al menos una entrevista C3 in-situ para resolución.

## 5. Integración con C3

La nueva entrevista de Jacob a *Andrés (vendedor, sub-zona Coltejer-Ayacucho)* se codifica `[HABITABLE, DIFICIL_DE_VIVIR]` y se inyecta vía `c3_field_interviews_jacob_2026-05-05.json` (mismo schema, recogida automática por `build_collapse_matrix.py`). Aporta el primer caso explícito de *gradiente intra-nodo* en el corpus C3.
