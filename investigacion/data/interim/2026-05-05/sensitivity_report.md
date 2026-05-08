# Análisis de sensibilidad - matriz de colapso

Generado: 1000 iteraciones bootstrap, 25 escenarios de umbrales (C1 x C4), 15 entrevistas leave-one-out.

## Definiciones
- **Celda robusta**: mantiene la decisión baseline en >=80% del bootstrap V1 y >=80% de las 25 combinaciones de umbrales V2.
- **Celda frágil**: la decisión baseline aparece en <80% en al menos una variante.

## Top-5 celdas más robustas

| celda | decisión baseline | V1 share | V2 share |
|---|---|---|---|
| `san_antonio_metro|midday` | inconcluyente | 1.000 | 1.000 |
| `san_antonio_metro|peak_pm` | inconcluyente | 1.000 | 1.000 |
| `san_antonio_metro|night` | inconcluyente | 1.000 | 1.000 |
| `parque_san_antonio|peak_am` | inconcluyente | 1.000 | 1.000 |
| `parque_san_antonio|peak_pm` | inconcluyente | 1.000 | 1.000 |

## Top-5 celdas más frágiles

| celda | decisión baseline | V1 share | V2 share | min |
|---|---|---|---|---|
| `san_antonio_metro|peak_am` | friccion_acumulada | 0.477 | 0.400 | 0.400 |
| `parque_san_antonio|midday` | friccion_acumulada | 0.668 | 0.400 | 0.400 |
| `junin_paseo|midday` | friccion_acumulada | 0.499 | 0.400 | 0.400 |
| `parque_berrio|midday` | friccion_acumulada | 0.497 | 0.400 | 0.400 |
| `junin_paseo|peak_am` | friccion_acumulada | 0.956 | 0.880 | 0.880 |

## Veredicto sobre las 6 celdas en fricción acumulada baseline

| celda | V1 fricción | V2 fricción | LOO C3 fricción | clasificación |
|---|---|---|---|---|
| `san_antonio_metro|peak_am` | 0.477 | 0.400 | 1.000 | frágil |
| `parque_san_antonio|midday` | 0.668 | 0.400 | 1.000 | frágil |
| `junin_paseo|peak_am` | 0.956 | 0.880 | 1.000 | robusta |
| `junin_paseo|midday` | 0.499 | 0.400 | 1.000 | frágil |
| `parque_berrio|midday` | 0.497 | 0.400 | 1.000 | frágil |
| `plaza_botero|midday` | 0.970 | 1.000 | 1.000 | robusta |

## Celdas inconcluyentes con riesgo de colapso (>30% en V2)

Ninguna celda inconcluyente cruza el umbral del 30% de colapso bajo V2.

## Discusión metodológica

- **V1 (bootstrap clásico)** captura la incertidumbre de muestreo dentro de cada serie (C1 horario por franja, C4 saturación por celda y C3 entrevistas). Las celdas con n bajo (especialmente C4 con n<=2 o C3 con <=3 entrevistas) muestran shares menos estables, lo que es esperable y debe declararse en defensa.
- **V2 (sensibilidad de umbrales)** evalúa si la decisión depende del corte p75 elegido; barrer p70..p90 muestra qué celdas son artefactos del umbral y cuáles sobreviven a deformaciones moderadas del criterio.
- **V3 (leave-one-out C3)** mide si una sola entrevista determina el carácter negativo dominante de un nodo. Si quitar una entrevista mueve la decisión, esa celda se reporta como dependiente de testigo único.
- **Limitación**: C2 (security_score de campo) no está disponible en el baseline (cells_with_data=0), por lo que la regla 3-de-4 opera de facto como 3-de-3 con C2=False. Esto sesga decisiones hacia 'fricción' antes que 'colapso' — declarar explícitamente.
