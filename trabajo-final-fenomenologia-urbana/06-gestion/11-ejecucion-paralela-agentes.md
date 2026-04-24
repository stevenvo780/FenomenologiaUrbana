# Ejecución paralela con agentes — consolidado operativo

**Fecha de corte:** 2026-04-24

Este documento consolida los hallazgos de cuatro frentes de exploración ejecutados en paralelo para acelerar el cierre del proyecto:

1. fuentes y geodatos;
2. protocolo mínimo de campo;
3. backlog visual final;
4. cierre académico y demo.

La intención no es abrir más planeación infinita, sino convertir esa exploración en una secuencia de trabajo utilizable para llevar el proyecto a versión final defendible.

---

## 1. Resultado global del trabajo paralelo

El proyecto ya tiene una base **ejecutable y demostrable**:

- pipeline Python validado de punta a punta;
- outputs sincronizados hacia la app visual;
- frontend compilando y pasando lint;
- integración filosófica y metodológica ya resuelta.

Lo que falta no es “inventar el proyecto”, sino **cerrar cuatro brechas específicas**:

- integrar mejores fuentes geoespaciales y ambientales;
- capturar trabajo de campo mínimo para recalibrar;
- subir la web desde baseline a demo final fuerte;
- escribir y presentar el cierre analítico con tesis clara.

---

## 2. Frente A — fuentes y geodatos

### Estado detectado

Las fuentes públicas están bastante avanzadas, pero el modelo sigue siendo fuerte en trazabilidad y todavía débil en calibración espacial fina.

### Ya integrado

- Observatorio de Movilidad;
- Metro San Antonio B;
- MEData criminalidad;
- MEData indicadores barriales;
- Medellín Cómo Vamos;
- páginas de SIATA / AMVA para aire y ruido.

### Bloqueos o ausencias

- DANE CNPV con `403`;
- SIATA/AMVA descargado como HTML, no todavía como capa estructurada lista para el grafo;
- uso del suelo y equipamientos todavía no integrados realmente al pipeline;
- OSM / Overpass todavía no participa de la topología base ejecutada.

### Alternativas concretas priorizadas

#### Prioridad inmediata

- usar una ruta alternativa municipal o estadística local para reemplazar la dependencia directa de DANE;
- consultar SIATA / AMVA por API CKAN o ruta de recurso estructurado, no solo página HTML;
- sumar al pipeline fuentes de suelo y equipamientos desde MEData con el mismo patrón ya usado en criminalidad e indicadores barriales.

#### Prioridad siguiente

- incorporar red peatonal real o semirreal desde OSM / Overpass;
- derivar capas ambientales y funcionales listas para lookup por nodo/arista;
- documentar cobertura y fecha de cada capa para no mezclar datos como si fueran simultáneos.

### Decisión operativa

Antes de tocar campo, conviene ejecutar un **Sprint 0 de datos**:

1. resolver reemplazo/fallback de DANE;
2. bajar aire/ruido como dataset explotable;
3. meter suelo + equipamientos;
4. definir si OSM entra ya o entra después del primer cierre visual.

---

## 3. Frente B — protocolo mínimo de campo

### Cobertura propuesta

Se propone observar los 9 nodos ya presentes en el `case_model.json`:

- San Antonio Metro;
- Parque San Antonio;
- Palacio Nacional;
- Junín Peatonal;
- Cruce Oriental;
- Parque Berrío;
- Carabobo Cultural;
- Plaza Botero;
- Museo de Antioquia.

Además, priorizar tres subtramos críticos:

- San Antonio → Junín;
- Junín → Parque Berrío;
- Parque Berrío → Plaza Botero.

### Franjas mínimas

- 07:00–09:00
- 12:00–14:00
- 17:00–19:00
- 20:00–22:00

### Variables indispensables

#### Tier 1 — sí o sí

- conteo peatonal por nodo;
- flujo direccional por arista crítica;
- tiempo de permanencia;
- ruido puntual;
- iluminación nocturna.

#### Tier 2 — muy recomendadas

- seguridad percibida;
- obstáculos temporales;
- presencia de vendedores;
- vigilancia visible;
- puntos de decisión o desvío.

### Formato mínimo de captura

#### CSV de campo

Campos mínimos sugeridos:

- `fecha`
- `franja`
- `node_id` o `edge_id`
- `timestamp`
- `variable`
- `valor`
- `observador`
- `notas`

#### Markdown fenomenológico

Una ficha por jornada y por franja con:

- densidad percibida;
- aparición fenomenológica;
- heterotopía dominante;
- obstáculos;
- lectura de restricción decisional.

#### GeoJSON mínimo

- nodos observados;
- puntos de decisión;
- obstáculos;
- subtramos críticos con observación asociada.

### Mapeo al modelo actual

Los agentes identificaron una traducción muy útil entre campo y modelo:

- densidad peatonal → `crowding`;
- flujo direccional → distribución real de trayectorias;
- permanencia → `base_dwell`;
- ruido → `noise`;
- iluminación → `lighting`;
- seguridad percibida → validación de `security`;
- obstáculos → `obstacle`.

### Decisión operativa

El campo mínimo defendible es una **jornada completa con 2 observadores**, seguida de una fase corta de consolidación de CSV + notas + georreferenciación.

---

## 4. Frente C — backlog visual final

### Gap principal detectado

La visión documental de la web describe un laboratorio visual completo, mientras que la implementación actual es un dashboard sólido pero todavía intermedio.

### Qué ya existe

- hero con estado del proyecto;
- escenarios horarios;
- perfiles de agente;
- inspector por nodo;
- comparativa básica de escenarios;
- trazabilidad de fuentes;
- evidencia empírica ya integrada.

### Qué falta para demo final defendible

#### Prioridad P0

1. **Mapa geográfico real del corredor**
   - nodos ubicados en mapa;
   - aristas visibles;
   - color por métrica;
   - clic en nodo conectado al inspector.

2. **Comparación de rutas**
   - rutas lado a lado o sobre el mismo mapa;
   - diferencias de tiempo, costo, riesgo y carga;
   - comparación entre perfiles o entre escenarios.

3. **Badges epistemológicos**
   - `documented`;
   - `proxy`;
   - `pending field`.

4. **Inspector hipergrafo simple**
   - situación compuesta por lugar + hora + perfil + control + carga + atmósfera.

5. **Mejor legibilidad fenomenológica**
   - separar con claridad fenomenología, heterotopía y lectura sistémica.

#### Prioridad P1

- slider o timeline temporal más explícito;
- matriz visual de estado de campo;
- comparación entre dos escenarios;
- leyendas y jerarquía visual más fuertes.

#### Prioridad P2

- fotos de campo;
- simulación interactiva más viva;
- responsive fino;
- modo oscuro o polish estético adicional.

### Decisión operativa

La web no necesitaba rehacerse. La estrategia correcta era **sumar piezas sobre el payload actual** y ese tramo ya quedó ejecutado:

1. mapa;
2. comparación de rutas;
3. badges epistemológicos;
4. matriz visual de trabajo de campo.

Eso ya movió la app desde “dashboard académico” hacia “laboratorio defendible”. El siguiente salto es incorporar datos de campo reales y comparación entre escenarios recalibrados.

---

## 5. Frente D — cierre académico y demo

### Tesis defendible propuesta

> La fenomenología urbana contemporánea puede operacionalizarse sin perder rigor filosófico. El espacio urbano aparece al sujeto no como escenario neutro, sino como red de condiciones materiales —topología, flujo, vigilancia, atmósfera, comercio y memoria— que estructuran lo que es posible percibir, decidir y habitar. Esa aparición es reconstruible mediante grafo multicapa, simulación y visualización, sin reducir la experiencia a puro determinismo.

### Hallazgos fuertes ya sostenibles

1. **Parque Berrío y Junín** funcionan como concentradores estructurales del sistema.
2. **La libertad de trayectoria baja en horas pico**, aunque no desaparece.
3. **La percepción ciudadana del centro** correlaciona razonablemente con la estructura modelada.
4. **La heterotopía** ya puede mostrarse como operación espacial, no solo como concepto decorativo.

### Qué todavía debe declararse como límite

- conteo peatonal fino no capturado;
- permanencia real no calibrada;
- seguridad percibida por subtramo pendiente;
- ruido e iluminación de campo pendientes;
- obstáculos temporales no sistematizados.

### Estructura sugerida para exposición oral

#### Apertura

- pregunta problema;
- por qué la fenomenología suele quedarse sin formalización;
- qué intenta resolver este proyecto.

#### Marco

- Husserl: intencionalidad, mundo vivido, cuerpo;
- Foucault: heterotopías, umbrales, contra-sitios;
- giro materialista/sistémico del proyecto.

#### Método

- datos públicos;
- grafo multicapa;
- simulación de agentes;
- trazabilidad epistemológica.

#### Demo

- abrir la app;
- mostrar nodo crítico;
- cambiar escenario;
- comparar rutas;
- mostrar una métrica de restricción.

#### Cierre

- qué ya demuestra el proyecto;
- qué falta para calibración empírica fuerte;
- por qué el modelo sigue siendo filosóficamente valioso incluso antes del cierre de campo.

---

## 6. Secuencia de ejecución recomendada

## Semana 1 — desbloqueo y preparación

### Carril datos

- reemplazo o fallback de DANE;
- SIATA / AMVA explotable por dataset;
- agregar suelo y equipamientos.

### Carril campo

- convertir protocolo en formato reutilizable;
- dejar lista la plantilla CSV + Markdown + GeoJSON;
- asignar jornada y observadores.

### Carril visual

- arrancar mapa del corredor;
- crear badges epistemológicos;
- diseñar tarjeta de comparación de rutas.

### Carril académico

- bosquejo de conclusiones;
- lista de evidencias duras vs. límites;
- primer guion de demo.

## Semana 2 — integración fuerte

### Carril datos/modelado

- recalibración con primeras observaciones o con mejores capas descargadas;
- regeneración de `frontend_payload.json`.

### Carril visual

- conectar mapa;
- mostrar rutas;
- mostrar situación compuesta por nodo.

### Carril académico

- redactar hallazgos;
- producir narrativa de defensa;
- capturas de pantalla o demo grabable.

## Semana 3 — cierre

- estabilización del frontend;
- cierre de conclusiones;
- ensayo de exposición;
- revisión de trazabilidad final.

---

## 7. Siguiente ejecución recomendada del agente principal

Con base en los resultados de los agentes paralelos, el siguiente movimiento más rentable no es abrir más exploración, sino ejecutar en este orden:

1. **capturar trabajo de campo usando el protocolo y las plantillas ya creadas**;
2. **integrar nuevas fuentes geoespaciales y ambientales al pipeline**;
3. **recalibrar pesos y regenerar outputs**;
4. **cerrar comparación entre escenarios y narrativa final de demo**.

El motivo es simple:

- las piezas visuales críticas ya están resueltas y verificadas;
- el protocolo de campo ya habilita calibración real y además tiene plantillas listas;
- el cierre académico puede apoyarse ahora en una demo más fuerte;
- la mejora de fuentes sigue siendo paralelizable sin bloquear la evolución visual.

---

## 8. Resumen ejecutivo de decisión

El trabajo de los agentes confirma esto:

- **el proyecto ya funciona**;
- **el cierre depende de cuatro frentes muy concretos**;
- **no hace falta reinventar la arquitectura**;
- **sí hace falta convertir el baseline en una versión explícitamente defendible**.

La estrategia correcta es trabajar por carriles coordinados, no por backlog caótico:

- datos/geodatos;
- campo;
- visual;
- cierre académico.

Ese es el camino más corto entre el estado actual y una presentación final fuerte.
