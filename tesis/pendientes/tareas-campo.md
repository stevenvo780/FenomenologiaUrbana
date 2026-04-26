# Guía de Campo: Tareas Pendientes para Validación Empírica

Este documento contiene las tareas críticas que el equipo de campo debe ejecutar para que la tesis pase de un **baseline proxy** a una investigación **calibrada empíricamente**.

## 1. Nodos de Observación (9 Puntos)

Se debe recolectar información en los 9 nodos definidos en el modelo. Cada nodo requiere registro de conteo, permanencia y ruido.

1.  `san_antonio_metro` (Umbral de transferencia)
2.  `parque_san_antonio` (Espacio de pausa/exposición)
3.  `palacio_nacional` (Punto comercial denso)
4.  `junin_paseo` (Corredor peatonal principal)
5.  `oriental_cruce` (Intersección de alta fricción)
6.  `parque_berrio` (Nodo central de flujo)
7.  `carabobo_cultural` (Eje patrimonial)
8.  `plaza_botero` (Saturación turística/local)
9.  `museo_antioquia` (Cierre del corredor)

## 2. Mediciones en Subtramos (Flujo Direccional)

Priorizar la medición de personas por sentido en las siguientes aristas críticas:

*   `san_antonio_metro <-> junin_paseo`
*   `junin_paseo <-> parque_berrio`
*   `parque_berrio <-> plaza_botero`
*   `parque_berrio <-> carabobo_cultural`
*   `plaza_botero <-> museo_antioquia`

## 3. Franjas Horarias Obligatorias

Para que los datos sean comparables con el modelo, las mediciones deben ocurrir en estas ventanas:

*   **Pico Mañana:** 07:00 – 09:00
*   **Valle/Mediodía:** 12:00 – 14:00
*   **Pico Tarde:** 17:00 – 19:00
*   **Nocturno:** 20:00 – 22:00 (Incluir medición de lux/iluminación)

## 4. Protocolo de Captura por Nodo/Franja

El equipo debe asegurar la siguiente muestra mínima para cada sesión:

| Tarea | Muestra Mínima | Herramienta | Propósito |
| :--- | :--- | :--- | :--- |
| **Conteo Peatonal** | 4 ventanas de 15 min | App de conteo / Manual | Recalibrar `crowding` |
| **Permanencia** | 15 a 20 casos | Cronómetro | Recalibrar `base_dwell` |
| **Ruido Puntual** | 1 medición (dB) | Sonómetro / App calibrada | Validar campo acústico |
| **Iluminación** | 1 medición (lux) | Luxómetro / App | Solo franja Nocturna |
| **Seguridad Percibida** | 20 a 30 encuestas | Formulario breve (1-5) | Contrastar proxy de riesgo |
| **Notas Fenomenológicas** | 1 registro escrito | Diario de campo | Capturar el "aparecer" del nodo |
| **Mapeo de Obstáculos** | Registro GeoJSON/Foto | Celular con GPS | Identificar fricciones reales |

## 5. Instrucciones de Entrega de Datos

Para que el sistema procese los datos automáticamente, el equipo debe:

1.  **Respetar IDs:** Usar exactamente los nombres de los nodos (ej. `parque_berrio`, no "P. Berrío").
2.  **Formato CSV:** Llenar la plantilla en `investigacion/data/interim/templates/field_counts_template.csv`.
3.  **Registro Geográfico:** Guardar puntos de obstáculos o desvíos en un GeoJSON siguiendo `field_points_template.geojson`.
4.  **Notas:** Guardar reflexiones en Markdown usando `field_notes_template.md`.
5.  **Ubicación:** Depositar todos los archivos finales en `investigacion/data/interim/` (crear una carpeta por fecha, ej. `jornada_2026_05_10/`).

## 6. Siguiente Paso Post-Campo

Una vez entregados los archivos, se debe correr el pipeline de recalibración:
`python investigacion/scripts/run_all.py`

---
*Nota: Mientras no se completen estas tareas, la tesis mantendrá el estado `baseline_proxy`.*
