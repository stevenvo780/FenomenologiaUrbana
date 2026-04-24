# Fenomenología contemporánea del centro de Medellín
## Formalización fenomenológica, sistémica y computacional del corredor San Antonio - Junín - Parque Berrío - Plaza Botero

## Resumen

Este trabajo propone una fenomenología contemporánea del centro de Medellín capaz de articular descripción de la experiencia, análisis del poder, modelado formal y visualización computacional. El punto de partida es el documento [`fenomenologia.md`](../fenomenologia.md), en especial su cierre sobre heterotopías y reconstrucción fenomenológica. A partir de ese marco, se selecciona como caso de estudio la **comuna 10 de Medellín (La Candelaria)**, con foco en el corredor **San Antonio - Junín - Parque Berrío - Plaza Botero**, porque allí convergen centralidad peatonal, transporte masivo, comercio, informalidad, equipamientos culturales, control institucional, memoria urbana, conflicto y alta disponibilidad de datos públicos.

La tesis central es que el espacio urbano no aparece al sujeto como un simple escenario físico ni como una suma de impresiones individuales. Aparece como una **estructura relacional** donde trayectorias, obstáculos, ritmos, vigilancia, ruido, densidad, memoria, comercio, infraestructura y poder condicionan lo que el sujeto puede percibir, decidir y habitar. La fenomenología no se abandona; se formaliza. El mundo vivido se reconstruye conectando Husserl con teoría de grafos, hipergrafos, métricas urbanas, teoría de decisiones, simulación de agentes y una plataforma web interactiva en React.

## Introducción

Una parte importante de la fenomenología urbana latinoamericana queda atrapada entre dos extremos débiles: el impresionismo literario y la descripción arquitectónica sin formalización. En ambos casos, la experiencia urbana se enuncia, pero no se operacionaliza. El resultado es una filosofía incapaz de dialogar con sistemas complejos, datos urbanos, modelos espaciales o políticas concretas.

Este trabajo busca romper esa limitación. Su propósito es demostrar que puede construirse una fenomenología filosóficamente seria y técnicamente robusta. Eso implica conservar las categorías husserlianas de intencionalidad, cuerpo vivido, mundo de la vida y constitución de sentido, pero reinterpretarlas desde un enfoque sistémico, materialista, emergentista e irrealista: el sentido no es una esencia flotante ni una propiedad interna del sujeto, sino una estabilización relacional producida por cuerpos situados en un entorno materialmente estructurado.

## Problema

El problema general es el siguiente: la experiencia del espacio urbano suele presentarse como libre, espontánea e individual, cuando en realidad está fuertemente condicionada por una malla de restricciones y posibilidades materiales. Esa malla incluye rutas, topología urbana, transporte público, congestión, vigilancia, iluminación, ruido, inseguridad, comercio, memoria social, hábitos corporales, infraestructuras algorítmicas y distribución desigual del poder.

El problema filosófico específico es cómo pensar el **aparecer fenomenológico del espacio** sin reducirlo ni a interioridad subjetiva ni a determinismo físico bruto. El problema metodológico es cómo conectar descripción de experiencia con datos observables de altísima resolución. El problema técnico es cómo representar esas relaciones de modo trazable, medible y visualizable, aprovechando arquitecturas de cómputo de alto rendimiento (GPU/CPU-Parallel) para integrar modelos de fuerza social (micro-simulación), ecuaciones diferenciales parciales (PDEs) para la dispersión ambiental y Aprendizaje por Refuerzo Profundo (Deep Reinforcement Learning) para el comportamiento adaptativo de los agentes.

## Justificación

Este trabajo se justifica por cuatro razones.

1. Filosófica. Permite defender una fenomenología no ornamental, capaz de formalizar sus intuiciones sin renunciar a la experiencia, llevándola al estado del arte computacional.
2. Urbana. El centro de Medellín es un condensador de flujos, conflictos, memorias y asimetrías; por eso es un lugar privilegiado para estudiar la experiencia situada a nivel micro y macro.
3. Metodológica. El caso permite combinar teoría, Big Data, telemetría satelital, LiDAR, modelos de fluidos peatonales (Social Force Model) y visualización en tiempo real.
4. Pedagógica. Sirve para mostrar a un grupo de filosofía que hoy la fenomenología puede trabajar con la ciencia de datos más avanzada (IA, Supercómputo) sin degradarse a tecnicismo positivista.

## Pregunta de investigación

¿Cómo aparece fenomenológicamente el corredor urbano San Antonio - Junín - Parque Berrío - Plaza Botero al sujeto urbano contemporáneo, y en qué medida esa aparición está producida y restringida por la estructura material de movilidad, seguridad, comercio, densidad, vigilancia, atmósfera y poder que puede modelarse formalmente mediante redes, métricas y simulaciones?

## Hipótesis

La experiencia del corredor estudiado no es la de un espacio libremente recorrido, sino la de una **red de decisiones condicionadas**. Lo que el sujeto interpreta como elección cotidiana está fuertemente acotado por centralidades de red, cuellos de botella, nodos de atracción, zonas de evitación, gradientes de seguridad, intensidad comercial, exposición sensorial y reglas explícitas o implícitas de circulación. La fenomenología del lugar puede formalizarse si se reconstruye la correlación entre:

- estructura material del espacio;
- organización de flujos y restricciones;
- tipos de cuerpo y capacidad de movimiento;
- percepción situada del riesgo, la orientación, el confort y la exposición;
- producción de sentido en prácticas concretas.

## Objetivo general

Construir un modelo filosófico, metodológico y computacional de la experiencia urbana del corredor San Antonio - Junín - Parque Berrío - Plaza Botero que articule fenomenología husserliana, análisis sistémico, datos públicos, trabajo de campo, simulación de agentes y visualización web en React.

## Objetivos específicos

1. Reinterpretar los conceptos husserlianos de intencionalidad, mundo de la vida, cuerpo y constitución de sentido desde una perspectiva materialista y sistémica.
2. Delimitar un espacio real del centro de Medellín con alta disponibilidad de datos y alta potencia filosófica.
3. Integrar fuentes públicas sobre movilidad, criminalidad, ruido, calidad del aire, uso del suelo, equipamientos, centralidad y percepción ciudadana.
4. Diseñar un grafo multicapa y un hipergrafo del espacio estudiado.
5. Definir métricas que conecten restricciones objetivas con experiencia situada.
6. Diseñar simulaciones de agentes y escenarios urbanos comparables.
7. Especificar una web interactiva en React que comunique el caso con calidad profesional.

## Marco teórico

### 1. Husserl y el mundo vivido

La fenomenología husserliana parte de la tesis de que toda conciencia es conciencia de algo. Esa intencionalidad no debe entenderse como una operación mental privada, sino como una estructura de apertura al mundo. Para filosofía de la ciudad, esto significa que una plaza, un corredor peatonal o una estación no aparecen como objetos neutros, sino como lugares temidos, deseados, usados, evitados, recordados o atravesados desde situaciones concretas.

El **mundo de la vida** no es un resto precientífico irrelevante. Es la base preteórica desde la cual el espacio adquiere sentido. Caminar, esperar, desviarse, dudar, detenerse, apurarse, exponerse o buscar refugio son operaciones corporales previas a su formalización técnica. La fenomenología obliga a reconstruir ese nivel en vez de saltar directamente a categorías administrativas.

### 2. Cuerpo vivido y espacialidad

La distinción entre *Körper* y *Leib* es decisiva. El cuerpo no es solo objeto físico medible; es el punto cero desde el cual el espacio se orienta como cerca, lejos, seguro, ruidoso, opresivo, fluido o confuso. Por eso el análisis de ciudad no puede quedarse en geometría o infraestructura. Debe preguntarse por la experiencia encarnada de la orientación, del cansancio, del riesgo, de la saturación sensorial y de la exposición pública.

### 3. Heterotopía, poder y ciudad

El cierre de [`fenomenologia.md`](../fenomenologia.md) introduce correctamente el concepto de heterotopía en sentido foucaultiano. El centro de Medellín es especialmente apto para esta lectura porque reúne espacios de apertura y cierre, circulación masiva, control, consumo, diferencia social, memorialización, institucionalidad y economías callejeras. No es solo un espacio de tránsito; es un campo donde la ciudad organiza inclusión y exclusión.

### 4. Relectura sistémica y materialista

Aquí se introduce el giro decisivo del proyecto. La constitución de sentido no se entiende como producción de una subjetividad desligada de la materialidad, sino como correlación entre:

- topología del entorno;
- distribución de fricciones;
- densidad de cuerpos;
- infraestructuras de movilidad;
- asimetrías de poder;
- hábitos y expectativas;
- memoria social;
- condiciones sensoriales.

El enfoque es **emergentista** porque la experiencia resulta de interacciones entre capas, no de una sola causa. Es **materialista** porque esas capas tienen soporte físico, institucional y económico. Es **irrealista** porque el sentido del lugar no se trata como esencia metafísica autónoma, sino como efecto estabilizado de relaciones.

## Marco metodológico

### Fase 1. Delimitación y ensamblaje de fuentes

Se define un polígono base dentro de La Candelaria, centrado en San Antonio, Junín, Parque Berrío y Plaza Botero. Sobre ese polígono se ensamblan fuentes públicas georreferenciadas o georreferenciables.

### Fase 2. Trabajo de campo fenomenológico

Se realiza observación situada, conteo de flujos, identificación de nodos de decisión, permanencia, obstáculos, gradientes de vigilancia, señales, densidad de vendedores, iluminación y percepción de seguridad en varias franjas horarias.

### Fase 3. Modelado espacial

Se construye un grafo multicapa del corredor y un hipergrafo de co-ocurrencias entre cuerpos, prácticas, restricciones y atmósferas.

### Fase 4. Métricas y simulación

Se calculan centralidades, accesibilidad, fricción, entropía de trayectorias, presión ambiental, restricción decisional e intensidad fenomenológica. Luego se ejecutan escenarios con agentes.

### Fase 5. Interpretación filosófica y comunicación web

Los resultados no se presentan como verdad objetiva pura, sino como reconstrucción trazable de cómo el espacio aparece bajo condiciones materiales determinadas. La web en React sirve como interfaz de exploración, no como ornamento.

## Selección y justificación del espacio urbano

### Espacio seleccionado

**Comuna 10 de Medellín (La Candelaria), con foco en el corredor San Antonio - Parque San Antonio - Junín - Parque Berrío - Plaza Botero.**

### Justificación empírica

La elección se sostiene en evidencia pública disponible:

- El Metro de Medellín identifica **San Antonio B** como un nodo con alto flujo de usuarios durante todo el día y mayor presión en hora pico de la tarde.
- El Observatorio de Movilidad de Medellín publica capas sobre pasajeros movilizados, velocidad e intensidad vial, aforos y eventos de tránsito.
- MEData publica criminalidad por comuna y mes, batería de indicadores barriales, uso general del suelo y equipamientos colectivos.
- El Área Metropolitana y SIATA publican datos abiertos de calidad del aire y ruido ambiental.
- Medellín Cómo Vamos reporta que la imagen del centro mezcla comercio, inseguridad, congestión, informalidad y presencia de habitantes de calle, lo que confirma su espesor fenomenológico y político.
- DANE permite bajar el análisis a escala de manzana para población, hogares y estructura urbana.

### Justificación filosófica

Este corredor no es solo central. Es un **condensador fenomenológico**. Allí convergen:

- tránsito obligado y desvío;
- promesa de accesibilidad y saturación real;
- consumo, vigilancia y visualidad;
- cultura y precariedad;
- memoria urbana y gestión policial;
- cuerpos que circulan, esperan, venden, vigilan, descansan, mendigan, compran y evitan.

En términos foucaultianos, no es un espacio uniforme, sino una sucesión de umbrales heterotópicos. En términos husserlianos, es un laboratorio privilegiado para analizar cómo el mundo urbano aparece diferencialmente según cuerpo, trayecto y situación.

## Fuentes de datos

| Fuente | Qué aporta | Resolución | Uso en el proyecto |
| --- | --- | --- | --- |
| Observatorio de Movilidad de Medellín | pasajeros movilizados, velocidad e intensidad, aforos, eventos | temporal y espacial variable | flujos, congestión, jerarquía de movilidad |
| Metro de Medellín | información operacional del sistema y nodo San Antonio | sistema y estación | presión de intercambio modal y centralidad de red |
| MEData criminalidad | casos por comuna, año y mes | comuna/mes | capa de riesgo y percepción de seguridad |
| MEData capacidad de soporte barrio | 100+ indicadores urbanos | barrio | contexto estructural del entorno |
| MEData uso del suelo | mezcla de usos | capa urbana | atracción funcional y zonificación |
| MEData equipamientos colectivos | cultura, salud, educación, etc. | punto/polígono | atracción y densidad institucional |
| SIATA / AMVA aire | PM2.5, PM10, gases, variables atmosféricas | estación/serie temporal | presión ambiental |
| SIATA / AMVA ruido | ruido ambiental | estación/serie temporal | fatiga sensorial y fricción |
| DANE CNPV | población y hogares por manzana | manzana | densidad y vulnerabilidad contextual |
| Medellín Cómo Vamos | percepción ciudadana sobre el centro | encuesta/ciudad | contraste entre estructura y experiencia declarada |
| OpenStreetMap / Overpass | red peatonal, POI, cruces, escaleras, accesos | calle y nodo | base topológica del grafo |

## Variables

| Dimensión | Variables principales |
| --- | --- |
| Movilidad | tiempo de recorrido, flujo peatonal, flujo vehicular, frecuencia de transporte, densidad por franja, velocidad de tránsito |
| Seguridad | hurtos, homicidios, presencia policial, vigilancia privada, percepción de riesgo, zonas de evitación |
| Ambiente | ruido, PM2.5, temperatura, sombra, iluminación, exposición solar |
| Morfología | ancho útil, continuidad de andén, obstáculos, cruces, pendientes, visibilidad |
| Economía urbana | densidad comercial, vendedores ambulantes, permanencia por consumo, mezcla de usos |
| Experiencia | pausa, estrés, desorientación, refugio, exposición, comodidad, sobrecarga sensorial |
| Poder y control | cámaras, celaduría, filtros de acceso, códigos de permanencia, expulsión simbólica |
| Temporalidad | hora pico, mediodía, noche, fin de semana, cambios por evento |

## Modelo de análisis

### 1. Grafo multicapa

Se modela el corredor como un grafo G = (V, E, L, W).

- V: nodos relevantes, por ejemplo accesos Metro, cruces, plazas, pasajes, bordes, equipamientos, umbrales y zonas de pausa.
- E: aristas peatonales, viales o multimodales.
- L: capas, por ejemplo movilidad, seguridad, ambiente, comercio, poder, percepción.
- W: pesos dinámicos dependientes del tiempo.

Cada arista tiene un costo compuesto:

`C_e(t) = a*tiempo + b*congestion + c*riesgo + d*ruido + e*obstaculos + f*desorientacion - g*atraccion`

### 2. Hipergrafo de co-ocurrencias

El grafo binario no basta. Muchas relaciones urbanas son n-arias. Por eso se define un hipergrafo H donde cada hiper-arista vincula simultáneamente:

- lugar;
- franja horaria;
- tipo de cuerpo o agente;
- condición ambiental;
- práctica dominante;
- dispositivo de poder.

Ejemplo:

`{San Antonio, 18:00, transbordo, flujo denso, vigilancia, prisa, sobrecarga sensorial}`

Ese formato permite modelar situaciones completas de aparición, no solo conectividad.

### 3. Agentes y teoría de decisiones

Se definen perfiles de agente con racionalidad acotada:

- trabajador en tránsito;
- comprador;
- turista cultural;
- vendedor ambulante;
- persona en búsqueda de refugio;
- persona con movilidad reducida.

Cada agente decide rutas y permanencias maximizando una utilidad acotada:

`U_i(r,t) = alpha*accesibilidad + beta*atraccion + gamma*habito + delta*refugio - eta*riesgo - theta*congestion - kappa*fatiga`

La elección no es libre en sentido fuerte. Está recortada por el conjunto factible de opciones:

`A_i(t) = {rutas posibles dadas las restricciones fisicas, economicas, temporales y perceptivas}`

## Interpretación fenomenológica

La fenomenología del corredor no consiste en enumerar sensaciones. Consiste en reconstruir la manera en que el espacio se da como:

- orientación o desorientación;
- fluidez o atasco;
- refugio o exposición;
- acceso o filtro;
- promesa de libertad o guion de circulación;
- convivencia o conflicto de trayectorias.

El mismo lugar noemáticamente cambia según noesis, cuerpo y situación. San Antonio puede aparecer como nodo eficiente para quien transborda, como saturación para quien huye del ruido, como umbral de vigilancia para quien vende en el espacio público o como simple enlace para quien no se detiene.

## Interpretación sistémica

Desde una lectura sistémica, el corredor opera como ensamblaje de capas:

- red de transporte;
- economía de calle;
- institucionalidad;
- control espacial;
- flujos cotidianos;
- memoria y simbolización cultural.

La experiencia no se explica por una sola variable, sino por la interacción entre esas capas. La centralidad no es solo geométrica; es también política y afectiva.

## Interpretación computacional

El modelo computacional no pretende reemplazar la fenomenología. Pretende darle soporte analítico y trazabilidad. Su función es:

- identificar restricciones invisibles a simple vista;
- comparar escenarios;
- medir concentración de flujos;
- detectar cuellos de botella;
- estimar cambios de ruta por variación de seguridad, ruido o iluminación;
- cruzar experiencia declarada con estructura material.

## Resultados esperados

### Hallazgos preliminares plausibles

Sin inventar resultados finales, la evidencia pública ya sugiere:

- alta centralidad funcional de San Antonio como nodo de intercambio y redistribución;
- coexistencia de fuerte atracción comercial con percepción ambivalente o negativa del centro;
- desajuste entre accesibilidad geométrica y habitabilidad percibida;
- coexistencia de circulación rápida con permanencias forzadas o tácticas.

### Resultados esperados tras ejecución completa

1. Un mapa de centralidades que muestre concentración de decisiones en pocos nodos.
2. Un gradiente de fricción donde el costo de atravesar el espacio cambie fuerte por hora y perfil de agente.
3. Una prueba de que la libertad de elección disminuye cuando crecen congestión, inseguridad y saturación sensorial.
4. Una tipología heterotópica del corredor: umbral, intercambio, consumo, refugio, vitrina, control.
5. Una visualización clara de la brecha entre estructura objetiva y experiencia percibida.

## Visualizaciones previstas

1. Mapa base del polígono con capas conmutables.
2. Heatmap de densidad peatonal por franja horaria.
3. Flow map de trayectorias principales y desvíos.
4. Grafo de centralidad con nodos dimensionados por intermediación y flujo.
5. Hipergrafo de co-ocurrencias entre lugar, práctica, cuerpo y poder.
6. Línea temporal con cambios de presión ambiental, seguridad y movilidad.
7. Matriz de restricción decisional por tipo de agente.
8. Panel fenomenológico con notas de campo sincronizadas con nodos y mapas.

## Simulaciones previstas

1. Hora pico laboral versus hora valle.
2. Cierre parcial o saturación del nodo San Antonio.
3. Aumento o disminución de iluminación nocturna.
4. Cambio de presencia policial o vigilancia privada.
5. Escenario con incremento de vendedores ambulantes.
6. Agente con movilidad reducida versus agente de tránsito rápido.
7. Ruta minimizando tiempo versus ruta minimizando riesgo percibido.

## Arquitectura de la web

La web se piensa como una aplicación React profesional, no como una presentación lineal.

- Frontend: React 19, TypeScript, Vite.
- Estado: Zustand para filtros y modo de exploración; TanStack Query para carga y cacheo.
- Mapas: MapLibre GL JS + deck.gl.
- Grafos: graphology + sigma.js, o Cytoscape si se privilegia edición y eventos.
- Análisis en cliente: DuckDB-WASM para consultas locales sobre Parquet; d3 para escalas y agregaciones.
- Simulación ligera en navegador: Web Workers + Comlink.
- Pipeline offline: Python con Pandas, GeoPandas, OSMnx, NetworkX, Mesa y exportación a GeoJSON, TopoJSON, Parquet y JSON.

## Límites, pendientes y riesgos

### Pendientes reales

- descargar y limpiar datasets;
- confirmar cobertura espacial exacta de ruido y aire en el polígono;
- conseguir o estimar mejor flujo peatonal fino;
- capturar trabajo de campo multihorario;
- validar proxies de inseguridad y permanencia;
- elegir la librería final para el hipergrafo.

### Riesgos metodológicos

- confundir percepción con dato objetivo;
- sobreindexar criminalidad oficial sin captar micro-atmósferas;
- usar un índice fenomenológico como si fuera esencia y no proxy analítico;
- trabajar con escalas espaciales incompatibles entre datasets.

### Supuestos fuertes

- que la centralidad de red influye en el aparecer del espacio;
- que la restricción material modifica el conjunto real de decisiones;
- que la experiencia situada puede modelarse parcialmente sin agotarse en el modelo.

## Conclusiones

La contribución principal del proyecto es metodológica y filosófica a la vez. Muestra que la fenomenología de la ciudad no tiene por qué quedarse en una poética del paseo ni en una descripción arquitectónica vaga. Puede convertirse en una investigación formal sobre cómo un espacio aparece a cuerpos situados bajo condiciones materiales específicas.

El centro de Medellín, especialmente el corredor San Antonio - Junín - Parque Berrío - Plaza Botero, permite demostrarlo con fuerza. Allí la ciudad aparece como red de trayectorias, conflictos, filtros, memorias, comercio, vigilancia, exposición y posibilidades desiguales. El sujeto no desaparece, pero deja de ser fundamento soberano. Se vuelve un cuerpo situado que percibe, decide y habita dentro de una arquitectura de restricciones.

La fenomenología no pierde su núcleo al entrar en contacto con datos, redes y simulaciones. Gana capacidad de explicitación, contraste, trazabilidad y potencia pública.

## Bibliografía sugerida

- Husserl, Edmund. *Ideas relativas a una fenomenología pura y una filosofía fenomenológica*.
- Husserl, Edmund. *La crisis de las ciencias europeas y la fenomenología trascendental*.
- Husserl, Edmund. *Meditaciones cartesianas*.
- Merleau-Ponty, Maurice. *Fenomenología de la percepción*.
- Foucault, Michel. *Of Other Spaces / Des espaces autres*.
- Lefebvre, Henri. *La producción del espacio*.
- de Certeau, Michel. *La invención de lo cotidiano*.
- Hillier, Bill; Hanson, Julienne. *The Social Logic of Space*.
- Batty, Michael. *The New Science of Cities*.
- Barabási, Albert-László. *Network Science*.
- Helbing, Dirk. *Social Self-Organization*.
- Schelling, Thomas. *Micromotives and Macrobehavior*.
- Simon, Herbert. *Models of Bounded Rationality*.
