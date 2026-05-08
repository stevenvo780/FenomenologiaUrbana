# Cross-validacion texto-imagen (campo vs YOLO) — 2026-05-07

Autor: Stev (analisis derivado). Insumo para defensa, capitulo 3.

## Resumen ejecutivo

Se trianguló cada reclamo cuantificable del trabajo de campo del 2026-05-05 (notas Stev + entrevistas Jacob) contra los agregados visuales YOLO (`m1_visual_aggregate.json`, `m3_visual_aggregate.json`). De 10 reclamos analizados, 2 muestran convergencia alta texto-imagen (riesgo vial en san_antonio_metro y la sensacion de "colapso" en plaza_botero/parque_berrio), 2 convergencia media (turistas en Botero, comercio informal en Junín), 0 bajas, y 6 no son evaluables hoy por limitaciones del pipeline (YOLO COCO no detecta uniformes, indigencia, consumo, ni grafiti; y `parque_san_antonio` no tiene bucket visual asignado). El resultado refuerza que la inter-method reliability donde el pipeline tiene capacidad es robusta, y delimita honestamente las zonas donde el reclamo del campo no puede ser falsado visualmente todavia.

## Tabla de reclamos

| ID | Nodo / Ventana | Reclamo (campo) | Métrica visual | Convergencia |
|---|---|---|---|---|
| san_antonio_metro_traffic_risk | san_antonio_metro / peak_am | "riesgo vial alto", safety=2/5 | vehicle_intensity=0.378 (max corpus) | **alta** |
| parque_san_antonio_obstaculos | parque_san_antonio / midday | 6 ambulantes/cuadra | obstacle_proxy_count (no hay bucket) | no evaluable |
| parque_san_antonio_vandalismo | parque_san_antonio / midday | vandalismo 1-3/10 | OCR/grafiti (no en pipeline) | no evaluable |
| junin_indigencia | junin_paseo / midday | indigencia 3/10 | sin clase YOLO COCO | no evaluable |
| junin_consumo_sustancias | junin_paseo / midday | consumo 4/10 | sin clase YOLO COCO | no evaluable |
| junin_comercio_informal | junin_paseo / peak_am+midday | Stev "casi nulo"; Jacob "heterotopico" | commerce_proxy=0.030/0.037; suitcases=240; sin food classes | **media** |
| botero_turistas | plaza_botero / midday | 5% turistas | tourist_proxy_ratio≈0.036 (proxy berrio) | **media** |
| botero_policia | plaza_botero / midday | "alta presencia policial" | police_proxy=null (TODO) | no evaluable |
| botero_sofocante | plaza_botero / midday | "sofocante / colapsa" | human_density_max=30, saturation_max=71 | **alta** |
| parque_san_antonio_tono | parque_san_antonio / midday | Stev tranquilidad vs Jacob tension | sin bucket visual | no evaluable |

## Resolución de divergencias inter-rater

### Junín — Stev ("casi nulo" comercio informal) vs Jacob ("heterotopico")
El visual da razon parcial a ambos:
- A favor de Stev: el `commerce_proxy` alimentario (apple, banana, donut, hot dog, pizza, sandwich, orange, cake) registra **0 hits** en Junín, lo cual confirma ausencia de venta callejera de comida — el indicador clasico de informalidad ambulante en Latinoamerica.
- A favor de Jacob: el corpus muestra **240 suitcases + 102 handbags en peak_am** y 9 clases distintas. Esto es un palimpsesto comercial-portatil sustancial que el M3 score 2/5 de Stev subestima si se lee Junín solo como "mono-uso formal".

Veredicto: Junín es **mono-uso comercial formal** (apoya a Stev) **con flujo portatil heterogeneo** (apoya a Jacob). El score M3 puede ajustarse a 3/5 sin contradecir a Stev.

### parque_san_antonio — Stev (tranquilidad) vs Jacob (tension)
Sin bucket visual asignado al nodo, la triangulacion no es posible directamente. El C3 inter-rater (3 entrevistas, HABITABLE consensual con disenso menor) y el M3 4/5 (heterotopia por arte + ambulantes + paso + reciclaje, social_pressure baja-media) **apoyan a Stev**: el nodo se lee como tranquilo-heterotopico, no violento. Jacob queda con apoyo cualitativo pero no cuantitativo.

## Implicaciones para defensa

**Reclamos del campo respaldados por visual (alta convergencia):**
1. Riesgo vial en san_antonio_metro — defendible directamente con `vehicle_intensity=0.378`.
2. "Colapsa" en Botero/Berrio — defendible con `human_density_max=30` y `saturation_max=71`, las metricas mas altas del corpus. Esta es la convergencia mas fuerte texto↔imagen del estudio.

**Reclamos parcialmente respaldados (media convergencia):**
3. ~5% turistas en Botero — el proxy adyacente da 3.6%, mismo orden de magnitud.
4. Comercio en Junín — la divergencia Stev↔Jacob se disuelve: ambos describen facetas reales del nodo.

**Reclamos NO falsables hoy (limitacion honesta):**
- Vandalismo/grafiti, indigencia, consumo de sustancias, presencia policial: requieren OCR, clasificador de uniformes o anotacion manual. Documentar como TODO de pipeline en la defensa, no como debilidad del reclamo de campo.
- `parque_san_antonio`: necesita reasignacion de fotos a bucket. Tarea HPC pendiente.

**Mensaje metodologico para defensa:** la convergencia donde el pipeline tiene capacidad (densidad humana, intensidad vehicular, saturacion visual, ratio turista-proxy) es alta. Donde no hay convergencia es por limitacion de YOLO COCO, no por contradiccion entre observador y datos.

## Datos crudos relevantes

- `san_antonio_metro|peak_am`: `vehicle_intensity=0.378`, vehicle_total=14, human_density_p75=3, max=5.
- `parque_berrio|midday` (proxy plaza_botero): human_density_max=30, p75=8, mean=3.79, saturation_max=71.2, obstacle_proxy=782, tourist_proxy_ratio=0.0365.
- `junin_paseo|peak_am`: commerce_proxy=0.0304 (102 handbags), 240 suitcases, 9 clases, heterogeneity_index_visual_norm=0.426.
- `junin_paseo|midday`: commerce_proxy=0.0365 (66 handbags), tourist_proxy_ratio=0.061, 7 clases.

JSON estructurado: `investigacion/data/interim/2026-05-05/cross_validation.json`.
