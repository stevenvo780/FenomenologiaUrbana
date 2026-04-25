# Instrumentos finales de campo

Fecha de consolidación: 25 de abril de 2026.

## 1. Manual breve para observadores

### Antes de salir

1. Revisar nodos y subtramos del modelo.
2. Cargar plantillas CSV, Markdown y GeoJSON.
3. Definir observadores con IDs anónimos: `obs_01`, `obs_02`, etc.
4. Sincronizar hora del celular/reloj.
5. Preparar libreta, contador manual, cronómetro, sonómetro/app, luxómetro/app y batería.
6. Leer el anexo ético antes de cualquier encuesta o fotografía.

### Durante la observación

1. Permanecer en punto visible y seguro.
2. No intervenir en conflictos.
3. Contar personas por ventanas de 5 minutos y consolidar por franja.
4. Registrar dirección de flujo cuando aplique.
5. Medir ruido/lux en el mismo punto del conteo.
6. Separar observación de interpretación: primero dato, luego nota.
7. No registrar nombres ni rostros.

### Después de la jornada

1. Guardar archivos en `investigacion/data/interim/YYYY_MM_DD/`.
2. Revisar columnas obligatorias.
3. Verificar que `node_id` y `edge_id` existan en `case_model.json`.
4. Ejecutar ingesta y agregación.
5. Revisar errores antes de usar cualquier resultado.

## 2. Encuesta de seguridad percibida

Consentimiento breve:

> Estamos realizando una investigación académica sobre experiencia peatonal y condiciones urbanas en el centro de Medellín. La encuesta dura menos de dos minutos, es anónima y no recoge nombres, teléfonos ni imágenes. Puede no responder cualquier pregunta o retirarse cuando quiera. Sus respuestas se usarán solo de forma agregada para fines académicos. ¿Acepta participar?

Preguntas:

| Código | Pregunta | Escala |
| --- | --- | --- |
| q1_seguridad | ¿Qué tan seguro/a se siente caminando por este tramo ahora? | 1 muy inseguro – 5 muy seguro |
| q2_orientacion | ¿Qué tan fácil es orientarse en este punto? | 1 muy difícil – 5 muy fácil |
| q3_ruido | ¿Qué tan molesto percibe el ruido en este punto? | 1 nada – 5 mucho |
| q4_pausa | ¿Este lugar invita a detenerse o solo a pasar rápido? | 1 pasar rápido – 5 detenerse |
| q5_obstaculos | ¿Encuentra obstáculos o conflictos para caminar? | 1 ninguno – 5 muchos |

Campos de registro agregados:

| Campo | Ejemplo |
| --- | --- |
| `timestamp` | `2026-04-25T17:15:00-05:00` |
| `node_id` | `parque_berrio` |
| `time_window` | `17:00-18:00` |
| `observer_id` | `obs_01` |
| `security_score` | promedio de q1 o escala general 1–5 |
| `notes` | sin datos personales |

## 3. Codificación fenomenológica de notas

Usar códigos cortos para que las notas sean comparables:

| Código | Significado | Ejemplo de nota válida |
| --- | --- | --- |
| `PASO_RAPIDO` | el lugar induce acelerar | “grupo cruza sin detenerse por congestión sonora” |
| `PAUSA` | el lugar permite o invita permanencia | “personas esperan bajo sombra cerca del borde” |
| `DESVIO` | cambio de trayectoria por obstáculo | “vendedor móvil estrecha paso; flujo bordea” |
| `RUIDO_ALTO` | ruido domina percepción | “buses y motocicletas elevan presión sonora” |
| `LUZ_BAJA` | baja iluminación percibida/medida | “tramo con sombra nocturna, lux bajo” |
| `RIESGO_PERCIBIDO` | señal de cautela o evitación | “personas agrupan pertenencias y aceleran” |
| `ORIENTACION` | claridad o confusión espacial | “turistas se detienen a ubicar salida” |
| `ACCESIBILIDAD` | barrera para movilidad reducida | “desnivel obliga rodeo de silla/coche” |

No escribir: nombres, rasgos identificables, juicios morales o frases que culpen a grupos.

## 4. Categorías para GeoJSON

`feature_type` permitido:

- `obstacle`
- `decision_point`
- `pause_area`
- `noise_hotspot`
- `low_light`
- `accessibility_barrier`
- `informal_crossing`

Campos mínimos por punto:

```json
{
  "timestamp": "2026-04-25T17:15:00-05:00",
  "node_id": "parque_berrio",
  "feature_type": "decision_point",
  "time_window": "17:00-18:00",
  "observer_id": "obs_01",
  "notes": "sin datos personales"
}
```

## 5. Control de calidad

Una sesión se considera lista para ingesta si:

- existe `metadata.json`;
- existe `field_counts_*.csv`;
- los `timestamp` son ISO válidos;
- `time_window` pertenece a 07–10, 12–15, 17–20 o 20–23;
- `node_id` existe en el caso;
- `pedestrians_5min` es numérico;
- no hay nombres ni rostros descritos en notas.

## 6. Cierre

Estos instrumentos completan la fase preparatoria. No cambian el estado del proyecto. El cambio de `pending_no_capture` solo puede ocurrir con datos reales, no con plantillas ni ejemplos sintéticos.
