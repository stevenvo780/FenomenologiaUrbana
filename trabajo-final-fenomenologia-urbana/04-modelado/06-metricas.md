# Métricas

## Principio

Las métricas no sustituyen la fenomenología. Funcionan como instrumentos de contraste entre experiencia, estructura y simulación.

## Métricas de red

### Centralidad de intermediación

Mide qué nodos concentran el paso de trayectorias y, por tanto, capacidad de condicionar decisiones.

### Centralidad de cercanía

Mide qué nodos reducen distancia media hacia otros nodos del sistema.

### Conectividad efectiva

No basta con contar aristas. Debe descontarse la fricción. Un nodo muy conectado geométricamente puede ser pobremente conectado fenomenológicamente.

## Métricas espaciales y fenomenológicas

### Fricción espacial

`FS_e(t) = a*travel_time + b*crowding + c*risk + d*noise + e*obstacles + f*poor_lighting - g*orientation_support`

Sirve para mostrar que la dificultad de atravesar el espacio no es solo distancia.

### Entropía de trayectorias

`H = -sum(p_r * log(p_r))`

Mide diversidad real de rutas. Entropía baja implica trayectoria muy guiada o restringida.

### Concentración de flujos

Puede medirse con Gini, HHI o simple distribución acumulada sobre nodos y aristas.

### Accesibilidad situada

Tiempo o costo necesario para alcanzar nodos relevantes desde distintos puntos y perfiles de agente.

### Restricción decisional

`RD_i(v,t) = 1 - |A_i^eps(v,t)| / |A_i^0(v,t)|`

Donde `A_i^0` es el conjunto ideal de opciones y `A_i^eps` el conjunto realmente disponible bajo restricciones.

### Intensidad fenomenológica

Índice compuesto, no esencialista:

`IF = z(dwell_time) + z(stimulus_density) + z(conflict_of_flows) + z(affective_marking) + z(sensorial_exposure) - z(route_redundancy)`

Debe usarse como proxy analítico y siempre acompañado de notas de campo.

### Presión ambiental

`PA = z(pm25) + z(noise) + z(heat) - z(shade) - z(ventilation)`

### Percepción de seguridad

Índice mixto que combine:

- encuesta breve;
- observación de vigilancia;
- eventos delictivos agregados;
- iluminación;
- permanencia diferencial por tipo de cuerpo.

### Permanencia

Tiempo medio de estancia por nodo o zona.

### Velocidad de tránsito

Distancia recorrida sobre tiempo real observado. Útil para detectar espacios de flujo impuesto.

## Métricas de validación

- correlación entre flujo simulado y flujo observado;
- diferencia entre ruta mínima por tiempo y ruta realmente usada;
- error entre permanencia observada y permanencia modelada;
- contraste entre percepción declarada y capa de riesgo objetivo.

## Métricas que requieren cautela

- intensidad fenomenológica;
- seguridad percibida;
- confort;
- sensación de orientación.

Estas no deben presentarse como hechos duros aislados, sino como resultados triangulados.
