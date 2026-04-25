# Anexo ético para trabajo de campo

Fecha de consolidación: 25 de abril de 2026.  
Estado: protocolo operativo mínimo; verificar si UdeA exige aval formal antes de encuestas.

## 1. Principios

1. **No daño:** no exponer, estigmatizar ni identificar personas en situación vulnerable.
2. **Mínima recolección:** tomar solo datos necesarios para conteos, percepción agregada y condiciones espaciales.
3. **Anonimato:** no registrar nombres, cédulas, rostros ni datos de contacto.
4. **Consentimiento:** toda encuesta debe iniciar con explicación breve y opción de no responder.
5. **Separación sintético/real:** datos de prueba nunca se presentan como campo.
6. **Cuidado conceptual:** categorías como inseguridad, informalidad o habitantes de calle se tratan como condiciones urbanas agregadas, no como atributos morales de individuos.

## 2. Consentimiento breve sugerido

Texto para encuesta de seguridad percibida:

> Estamos realizando una investigación académica sobre experiencia peatonal y condiciones urbanas en el centro de Medellín. La encuesta dura menos de dos minutos, es anónima y no recoge nombres, teléfonos ni imágenes. Puede no responder cualquier pregunta o retirarse cuando quiera. Sus respuestas se usarán solo de forma agregada para fines académicos. ¿Acepta participar?

Registrar solo: `acepta_si/no`. Si la respuesta es “no”, no insistir.

## 3. Encuesta breve de seguridad percibida

No más de cinco preguntas:

| Código | Pregunta | Escala |
| --- | --- | --- |
| q1_seguridad | ¿Qué tan seguro/a se siente caminando por este tramo ahora? | 1 muy inseguro – 5 muy seguro |
| q2_orientacion | ¿Qué tan fácil es orientarse en este punto? | 1 muy difícil – 5 muy fácil |
| q3_ruido | ¿Qué tan molesto percibe el ruido en este punto? | 1 nada – 5 mucho |
| q4_pausa | ¿Este lugar invita a detenerse o solo a pasar rápido? | 1 pasar rápido – 5 detenerse |
| q5_obstaculos | ¿Encuentra obstáculos o conflictos para caminar? | 1 ninguno – 5 muchos |

No preguntar: nombre, edad exacta, documento, dirección, condición migratoria, ingresos, afiliación política, salud o relato de victimización.

## 4. Fotografía y registro visual

Permitido:

- obstáculos físicos;
- cruces, andenes, señalización, iluminación;
- flujos agregados desde ángulos amplios;
- puntos de decisión sin rostros identificables.

No permitido sin autorización explícita:

- primeros planos de rostros;
- menores de edad identificables;
- habitantes de calle identificables;
- situaciones de conflicto, consumo, persecución o vulnerabilidad;
- placas o datos personales visibles.

## 5. Manejo de datos

- Guardar archivos reales en `investigacion/data/interim/YYYY_MM_DD/`.
- Usar IDs de observador (`obs_01`, `obs_02`) y no nombres.
- Separar ejemplos sintéticos en `investigacion/data/interim/examples/`.
- Revisar que CSV/GeoJSON no contengan nombres o notas estigmatizantes.
- Conservar solo datos necesarios para la tesis.

## 6. Riesgos y mitigación

| Riesgo | Mitigación |
| --- | --- |
| Identificación accidental | no fotografiar rostros; revisar archivos antes de publicar |
| Estigmatización del centro | redactar en términos de condiciones urbanas, no de culpables |
| Sesgo del observador | usar manual común, franjas repetidas y notas de contexto |
| Encuesta invasiva | máximo cinco preguntas, consentimiento breve, anonimato |
| Seguridad del equipo | observar en parejas o puntos visibles; no intervenir en conflictos |

## 7. Criterio de publicación

Una tabla o figura de campo se puede publicar si:

- no identifica personas;
- agrega datos por nodo/franja;
- declara fecha, hora y método;
- reconoce sesgos de muestra;
- no cambia `pending_no_capture` sin cobertura suficiente.

## 8. Frase ética para la tesis

> El trabajo de campo se diseñó bajo criterios de mínima recolección, anonimización y no estigmatización. Las mediciones se orientan a condiciones espaciales y percepciones agregadas, no a identificar ni clasificar individuos.
