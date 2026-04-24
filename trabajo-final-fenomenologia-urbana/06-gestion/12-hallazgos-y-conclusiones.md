# Hallazgos y conclusiones base

**Fecha de corte:** 2026-04-24  
**Estado del proyecto:** `baseline_proxy_demostrable`

## 1. Tesis de trabajo

La experiencia urbana en el centro de Medellín no puede entenderse como una suma de percepciones aisladas ni como un mero tránsito sobre infraestructura neutra. El corredor `San Antonio - Junín - Parque Berrío - Plaza Botero` aparece al sujeto como una red de condiciones materiales —movilidad, control, ruido, comercio, vigilancia, memoria y permanencia— que condicionan lo que es posible percibir, decidir y habitar.

Este proyecto sostiene que esa aparición puede reconstruirse mediante una articulación entre fenomenología, teoría de redes, simulación de agentes y visualización trazable, sin perder espesor filosófico.

## 2. Qué demuestra ya el proyecto

### 2.1. La fenomenología urbana puede formalizarse

El proyecto ya cuenta con:

- caso de estudio definido y filosóficamente justificado;
- pipeline reproducible de datos y simulación;
- interfaz web conectada a outputs reales;
- distinción explícita entre capas `documented`, `proxy` y `pending`.

Esto prueba que la fenomenología urbana no tiene por qué quedarse en una descripción impresionista: puede traducirse en un dispositivo técnico sin renunciar a su pregunta central por la aparición del mundo vivido.

### 2.2. El centro funciona como red de restricciones diferenciales

La simulación y la lectura del grafo muestran que el corredor no distribuye homogéneamente la experiencia urbana. Algunos nodos concentran presión, centralidad y fricción, mientras otros funcionan como transiciones o alivios relativos.

En particular, `Junín` y `Parque Berrío` emergen como nodos donde se cruzan:

- intensidad de tránsito;
- valor comercial;
- memoria urbana;
- exposición a vigilancia y conflicto;
- mayor condicionamiento de trayectorias.

### 2.3. La libertad de trayecto existe, pero está condicionada

La comparación entre escenarios horarios y perfiles de agente sugiere que la ciudad no elimina por completo la agencia, pero sí reduce o ensancha el campo de posibilidades según:

- la hora del día;
- la presión del flujo;
- el tipo de cuerpo o de objetivo;
- la mezcla entre seguridad, comercio y accesibilidad.

Eso permite sostener una tesis fuerte: **la decisión cotidiana en el espacio urbano no es soberanía pura, sino elección situada dentro de una topología de restricciones materiales**.

### 2.4. La heterotopía puede convertirse en operador analítico

El proyecto ya usa la heterotopía no como adorno conceptual, sino como clave para leer nodos que articulan umbral, comercio, memoria, exposición y control. La interfaz permite mostrar esa lectura junto con centralidad, carga y atributos del nodo, haciendo visible la convergencia entre filosofía y modelación.

## 3. Qué todavía no demuestra del todo

La versión actual no debe presentarse como cierre empírico total. Sus límites principales siguen siendo:

- ausencia de trabajo de campo ya incorporado en `interim/` y `processed/`;
- dependencia parcial de pesos `proxy` en nodos y aristas;
- bloqueo de la ruta DANE por `403`;
- falta de recalibración con conteos, permanencia, ruido e iluminación observados;
- falta de comparación entre escenarios ya recalibrados con datos nuevos.

## 4. Valor filosófico de la versión actual

Aunque la calibración fina siga pendiente, la versión presente ya tiene valor filosófico y metodológico por tres razones:

1. muestra una forma rigurosa de vincular mundo de la vida y estructura material;
2. evita la falsa oposición entre experiencia y dato;
3. vuelve auditables los supuestos de una fenomenología urbana contemporánea.

En otras palabras, el proyecto no reemplaza la experiencia por números. Usa números, redes y simulaciones para mostrar con mayor precisión cómo la experiencia ya está mediada por regímenes espaciales y sociales.

## 5. Conclusión general

La principal conclusión de esta etapa es que el centro de Medellín puede pensarse como un sistema de aparición condicionada: un espacio donde la percepción, la circulación y la permanencia están moduladas por infraestructuras, densidades, riesgos, memorias y economías específicas. Ese sistema no anula al sujeto, pero sí organiza de manera desigual sus posibilidades.

Por eso, la fenomenología urbana que aquí se propone es contemporánea en un doble sentido:

- porque conserva la pregunta por la experiencia vivida;
- porque la sitúa dentro de redes técnicas, materiales y políticas formalizables.

## 6. Siguiente paso correcto

El cierre fuerte del proyecto exige ahora este orden:

1. capturar trabajo de campo mínimo con el protocolo ya preparado;
2. consolidar observaciones en `investigacion/data/interim/` y `processed/`;
3. recalibrar pesos y regenerar outputs;
4. cerrar una versión `field_calibrated` del payload y la demo;
5. reescribir la conclusión final incorporando resultados recalibrados.

## 7. Fórmula breve para cierre oral o escrito

> La ciudad aparece al sujeto como experiencia, pero esa experiencia ya está estructurada por redes de movilidad, comercio, vigilancia, ruido, memoria y poder. Este proyecto muestra que esa estructura puede modelarse y visualizarse sin vaciar la fenomenología, sino precisamente reforzándola.
