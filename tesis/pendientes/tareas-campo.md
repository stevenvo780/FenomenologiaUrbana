# Tareas Pendientes de Investigación (Trabajo de Campo)

Este documento detalla las actividades de captura de datos necesarias para recalibrar el modelo fenomenológico y mover el proyecto de `baseline_proxy` a `field_observed`.

## 1. Tareas Críticas (Declaradas en el Sistema)

| Tarea | Variable | Método Sugerido |
| :--- | :--- | :--- |
| **Conteo peatonal fino por nodo** | Densidad peatonal | Conteo manual cada 15 minutos en nodos prioritarios. |
| **Registro de tiempos de permanencia** | Permanencia | Muestreo con cronómetro en zonas de estancia (Parque San Antonio, Plaza Botero). |
| **Encuesta de seguridad percibida** | Seguridad percibida | Breve escala 1-5 por subtramo (Junín, Carabobo). |
| **Medición de ruido e iluminación** | Presión ambiental | Sonómetro (o app calibrada) y luxómetro en franja nocturna. |

## 2. Nodos Prioritarios de Observación

Se deben recolectar datos en los siguientes 9 puntos clave del corredor:

1. `san_antonio_metro`
2. `parque_san_antonio`
3. `palacio_nacional`
4. `junin_paseo`
5. `oriental_cruce`
6. `parque_berrio`
7. `carabobo_cultural`
8. `plaza_botero`
9. `museo_antioquia`

## 3. Franjas Horarias de Captura

Para que los datos sean comparables con las simulaciones, la captura debe realizarse en:

*   **Pico Mañana:** 07:00 – 09:00
*   **Valle/Mediodía:** 12:00 – 14:00
*   **Pico Tarde:** 17:00 – 19:00
*   **Nocturno:** 20:00 – 22:00

## 4. Plantillas para el Equipo

Las plantillas para la recolección de datos se encuentran en el repositorio:
*   `investigacion/data/interim/templates/field_counts_template.csv`
*   `investigacion/data/interim/templates/field_notes_template.md`
*   `investigacion/data/interim/templates/field_points_template.geojson`

## 5. Nota sobre el "Miembro Fantasma"

El cierre empírico fuerte exige que no se fabriquen observaciones. Los datos capturados en campo deben guardarse en `investigacion/data/interim/` para ser procesados por el script `run_all.py`.
