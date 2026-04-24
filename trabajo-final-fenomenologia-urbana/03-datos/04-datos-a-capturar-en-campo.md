# Datos a capturar en campo

## Principio

La capa de campo no es decorativa. Sirve para bajar el análisis al nivel donde el espacio efectivamente aparece al cuerpo. Debe recogerse con formatos homogéneos y franjas comparables.

## Matriz de captura

| Variable | Cómo se mide | Instrumento | Frecuencia sugerida | Formato |
| --- | --- | --- | --- | --- |
| Densidad peatonal | conteo por punto y ventana temporal | contador manual o app de tally | cada 15 min | CSV |
| Flujo direccional | conteo por sentido de desplazamiento | tally + croquis | cada 15 min | CSV |
| Tiempo de permanencia | observación de muestra por zona | cronómetro | cada 30 min | CSV |
| Rutas más usadas | trazado manual y validación en mapa | base impresa o app móvil | por sesión | GeoJSON / notas |
| Zonas de pausa | observación de detenciones > 30 s | mapa de calor manual | por sesión | GeoJSON |
| Zonas de tránsito rápido | velocidad aparente y no permanencia | observación + video corto | por sesión | notas / CSV |
| Obstáculos físicos | registro de bolardos, ventas, motos, baches, cierres | foto + georreferencia | por sesión | GeoJSON + foto |
| Percepción de seguridad | encuesta corta de 1 a 5 | formulario móvil | al menos 30 casos por franja | CSV |
| Ruido aproximado | medición puntual dB | sonómetro o app calibrada | cada 15 min | CSV |
| Iluminación | observación nocturna y medición lux si es posible | luxómetro o app | noche | CSV |
| Vendedores ambulantes | conteo y tipología | observación | cada 30 min | CSV |
| Interacción social | baja, media, alta y tipo dominante | ficha cualitativa | por sesión | notas |
| Transporte visible | buses, taxis, Metro, bici, microparadas | observación estructurada | cada 15 min | CSV |
| Emociones percibidas | tensión, calma, prisa, espera, extravío | ficha fenomenológica | por sesión | notas |
| Puntos de congestión | registro espacial de acumulación | croquis + foto | por sesión | GeoJSON |
| Accesibilidad | continuidad de andén, rampas, textura | checklist | por subtramo | CSV |
| Señales y orientación | claridad de señalización y legibilidad | checklist | por subtramo | CSV |
| Vigilancia | policía, cámaras, seguridad privada | observación | por sesión | CSV |
| Puntos de decisión | cruces donde el sujeto debe elegir o dudar | observación + mapa | por sesión | GeoJSON |
| Patrones de comportamiento | atravesar, permanecer, vender, observar, esquivar | observación categorial | por sesión | CSV |

## Franjas horarias mínimas

- 07:00 a 09:00
- 12:00 a 14:00
- 17:00 a 19:00
- 20:00 a 22:00
- sábado en franja media

## Unidades espaciales sugeridas

- nodo;
- subtramo;
- borde;
- zona de permanencia;
- acceso;
- umbral.

## Reglas de captura

- usar siempre el mismo polígono base;
- registrar clima y condiciones excepcionales;
- documentar fecha exacta, hora, observador y duración;
- no mezclar observación libre con dato estructurado;
- anonimizar cualquier dato sensible.

## Resultado esperado

Al final del campo debe existir una base mínima con:

- conteos comparables;
- notas fenomenológicas sincronizadas con espacio y hora;
- mapa de nodos de decisión;
- zonas de atracción y evitación;
- registro de obstáculos y fricciones;
- evidencia suficiente para calibrar el modelo de agentes.
