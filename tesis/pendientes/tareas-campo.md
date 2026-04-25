# Pendientes críticos de investigación: PC, campo y fuentes externas

Este documento deja explícito qué falta para que la tesis pase de un **baseline proxy** a una investigación empíricamente calibrada. Su función es evitar dos errores: inventar datos de campo o cerrar la tesis con indulgencia metodológica.

## 0. Estado actual que debe mantenerse

- Estado empírico actual: `pending_no_capture`.
- Archivo que lo confirma: `investigacion/outputs/field_calibration_delta.json`.
- Significado: el pipeline está preparado para recibir datos de campo, pero todavía no hay observaciones situadas suficientes para recalibrar nodos, aristas o escenarios.
- Regla: no cambiar este estado ni redactar como si hubiese trabajo de campo hasta que existan archivos reales en `investigacion/data/interim/`.

## 1. Pendientes que sí se pueden hacer en PC

Estas tareas pueden hacerse entre usuario y asistente en el computador, sin salir a campo. No sustituyen la captura empírica, pero fortalecen la tesis ante una evaluación exigente.

| Prioridad | Tarea | Entregable | Archivo sugerido |
| --- | --- | --- | --- |
| Alta | Documentar reproducibilidad | versiones, dependencias, comandos, GPU/CPU, semillas, parámetros | `investigacion/docs/reproducibilidad.md` |
| Alta | Crear modo de ejecución reducido | instrucciones para correr un mini-pipeline en CPU | `investigacion/README.md` |
| Alta | Auditoría de sensibilidad | matriz de variación ±10%, ±20%, ±30% para pesos de tiempo/riesgo/ruido/densidad | `investigacion/docs/sensibilidad.md` |
| Alta | Pruebas de ablación | escenarios sin ruido, sin riesgo, sin congestión, sin atracción comercial | `investigacion/outputs/` + capítulo 3 |
| Alta | Probar pipeline con datos sintéticos | CSV/MD/GeoJSON de ejemplo claramente marcados como sintéticos | `investigacion/data/interim/examples/` |
| Media | Crear anexo ético | consentimiento, anonimización, fotografía, datos sensibles | `investigacion/docs/etica-campo.md` |
| Media | Tabla de trazabilidad | afirmación → fuente/script/output/pendiente | `investigacion/docs/trazabilidad-tesis.md` |
| Media | Ampliar bibliografía empírica reciente | literatura 2020–2025 sobre Medellín, movilidad peatonal, seguridad, ruido y espacio público | `bibliografia/referencias-academicas.md` |
| Media | Revisar consistencia APA | DOI, URLs, fechas de consulta, edición y traducción | capítulo 4 + bibliografía |
| Media | Generar tablas listas para tesis | fuentes, variables, límites, resultados defendibles/no defendibles | capítulos 2 y 3 |
| Baja | Preparar preguntas de defensa | respuestas a objeciones previsibles del jurado | `tesis/pendientes/preguntas-defensa.md` |

### 1.1. Criterio para no confundir datos sintéticos con campo

Si se crean datos de ejemplo para probar el pipeline, deben cumplir estas reglas:

- ubicarse en una carpeta `examples/` o incluir `synthetic` en el nombre;
- llevar una nota visible: “datos sintéticos para prueba técnica; no usar como evidencia empírica”;
- no modificar la conclusión `pending_no_capture`;
- no citarse en la tesis como observación real.

## 2. Pendientes de campo indispensables

Estas tareas no pueden resolverse desde el computador. Requieren presencia situada en el corredor o equipo humano de observación.

### 2.1. Nodos prioritarios

Se deben recolectar datos en los 9 nodos del modelo:

1. `san_antonio_metro`
2. `parque_san_antonio`
3. `palacio_nacional`
4. `junin_paseo`
5. `oriental_cruce`
6. `parque_berrio`
7. `carabobo_cultural`
8. `plaza_botero`
9. `museo_antioquia`

### 2.2. Subtramos críticos

Priorizar estas aristas:

- `san_antonio_metro -> junin_paseo`
- `junin_paseo -> parque_berrio`
- `parque_berrio -> plaza_botero`
- `parque_berrio -> carabobo_cultural`
- `plaza_botero -> museo_antioquia`

### 2.3. Franjas horarias mínimas

- **Pico mañana:** 07:00–09:00
- **Mediodía/valle:** 12:00–14:00
- **Pico tarde:** 17:00–19:00
- **Nocturno:** 20:00–22:00

### 2.4. Variables obligatorias

| Variable | Unidad | Método | Uso en modelo |
| --- | --- | --- | --- |
| Conteo peatonal | personas/15 min | conteo manual por nodo | recalibrar `crowding` |
| Flujo direccional | personas/sentido | conteo por subtramo | validar cargas de arista |
| Permanencia | segundos/caso | cronómetro | recalibrar `base_dwell` |
| Ruido puntual | dB | sonómetro/app calibrada | validar campo acústico |
| Iluminación | lux | luxómetro/app | validar escenario nocturno |
| Seguridad percibida | escala 1–5 | encuesta breve | contrastar proxy de riesgo |
| Obstáculos temporales | nota + punto | registro visual/GeoJSON | recalibrar fricción |
| Puntos de decisión | nota + punto | observación situada | validar rutas alternativas |

### 2.5. Muestra mínima razonable

Para una jornada piloto defendible:

- 4 ventanas de conteo de 15 minutos por franja en nodos principales;
- al menos 15 observaciones de permanencia por franja;
- mínimo 1 medición de ruido por nodo observado y franja;
- medición de iluminación en nodos críticos durante la franja nocturna;
- 20 a 30 respuestas breves de seguridad percibida por franja, distribuidas en subtramos;
- notas fenomenológicas en mínimo 2 nodos por franja;
- registro GeoJSON de obstáculos y puntos de decisión.

## 3. Instrumentos de campo que faltan preparar

Existen plantillas base, pero aún faltan instrumentos más completos:

| Instrumento | Estado | Pendiente |
| --- | --- | --- |
| `field_counts_template.csv` | existe | probar con datos sintéticos y ajustar columnas |
| `field_notes_template.md` | existe | añadir guía de codificación fenomenológica |
| `field_points_template.geojson` | existe | definir categorías cerradas de obstáculos/puntos |
| Encuesta seguridad percibida | falta | crear 5 preguntas máximo + consentimiento |
| Formato de consentimiento | falta | redactar versión breve y comprensible |
| Guía de fotografía ética | falta | evitar rostros, menores, habitantes de calle identificables |
| Manual de observadores | falta | instrucciones paso a paso y control de calidad |

## 4. Pendientes por fuentes externas

Estas tareas dependen de acceso web, instituciones, bases académicas o gestión externa.

| Fuente/gestión | Estado actual | Pendiente |
| --- | --- | --- |
| DANE geovisor CNPV | 403 documentado | buscar ruta alternativa o citar fallback municipal |
| MEData uso del suelo | timeout documentado | reintentar descarga o conseguir CSV alternativo |
| MEData equipamientos | timeout documentado | reintentar o documentar ausencia |
| Literatura empírica 2020–2025 | incompleta | buscar estudios sobre Medellín centro, movilidad peatonal, ruido, seguridad |
| Aval ético institucional | no gestionado | verificar si UdeA exige aval para encuestas/observación |
| Mediciones ambientales oficiales recientes | parcial | buscar actualización SIATA/AMVA o fuentes municipales |

## 5. Criterios para cambiar el estado del proyecto

### De `pending_no_capture` a `field_partial`

Puede cambiarse solo si existe al menos:

- un CSV real de conteos;
- notas fenomenológicas reales;
- GeoJSON real de puntos observados;
- consistencia de IDs con `case_model.json`;
- ejecución exitosa de ingesta y agregación.

### De `field_partial` a `field_calibrated`

Puede cambiarse solo si existe:

- cobertura de al menos 75% de nodos/franjas previstas;
- recalibración efectiva de nodos o aristas;
- reporte de calidad de datos;
- comparación antes/después del modelo;
- discusión de sesgos de la jornada.

## 6. Riesgos si no se completan los pendientes

| Riesgo | Consecuencia en evaluación |
| --- | --- |
| No hacer campo | tesis queda como diseño/prototipo, no validación empírica |
| No documentar reproducibilidad | jurado puede considerar el modelo una caja negra |
| No hacer sensibilidad | resultados pueden parecer dependientes de parámetros arbitrarios |
| No incluir ética | captura de percepción puede ser cuestionada |
| No ampliar literatura reciente | marco puede verse canónico pero desactualizado |
| No separar sintético/real | riesgo grave de credibilidad |

## 7. Orden recomendado de trabajo

### Fase PC inmediata

1. Documentar reproducibilidad.
2. Crear anexo ético.
3. Probar pipeline con datos sintéticos claramente marcados.
4. Diseñar sensibilidad y ablación.
5. Ampliar bibliografía empírica reciente.

### Fase pre-campo

1. Cerrar instrumentos.
2. Definir observadores.
3. Imprimir/compartir plantillas.
4. Sincronizar horarios y nodos.
5. Preparar respaldo de datos.

### Fase campo

1. Capturar conteos, permanencia, ruido, lux, percepción y obstáculos.
2. Consolidar archivos en `investigacion/data/interim/`.
3. Ejecutar ingesta/agregación/calibración.
4. Revisar `field_calibration_delta.json`.
5. Actualizar capítulos 2, 3 y 4 con resultados reales.

## 8. Regla final

Mientras no haya campo real, la tesis debe decir: **modelo exploratorio, baseline proxy, validación pendiente**. Eso no es una debilidad si se declara bien; sería una debilidad fingir lo contrario.
