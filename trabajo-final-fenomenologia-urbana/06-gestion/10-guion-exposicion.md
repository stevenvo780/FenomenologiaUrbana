# Guion de exposición

## Duración sugerida

12 a 15 minutos.

## Tesis en una frase

La ciudad no se vive como un fondo neutro sino como una red material de restricciones, atracciones, umbrales y memorias; este proyecto muestra que esa aparición fenomenológica puede modelarse, simularse y visualizarse sin vaciarla filosóficamente.

## Estructura sugerida por minutos

- 0:00–1:30 · apertura y problema;
- 1:30–3:30 · base filosófica y giro crítico;
- 3:30–5:30 · caso de estudio y método;
- 5:30–10:30 · demo guiada de la app;
- 10:30–12:30 · hallazgos, límites y trabajo pendiente;
- 12:30–15:00 · cierre y preguntas.

## 1. Apertura

La pregunta no es solo qué es la ciudad como objeto físico, sino cómo aparece al sujeto y qué estructuras materiales producen esa aparición. Nuestro punto es que la fenomenología urbana puede hacerse hoy con rigor formal, datos y simulaciones, sin perder su núcleo filosófico.

### Frase de arranque sugerida

"La pregunta central de este trabajo no es simplemente cómo está hecha la ciudad, sino cómo se le aparece al sujeto y qué condiciones materiales hacen posible esa aparición."

## 2. Problema

Gran parte de la fenomenología urbana termina en descripción estética o literaria. Nosotros queremos mostrar otra cosa: que el espacio vivido puede reconstruirse como sistema de restricciones, flujos, cuerpos y decisiones.

### Giro del problema

- no reducir experiencia a subjetividad pura;
- no reducir ciudad a infraestructura muda;
- articular experiencia, datos, red urbana y decisión situada.

## 3. Base filosófica

Desde Husserl tomamos:

- intencionalidad;
- mundo de la vida;
- cuerpo vivido;
- constitución de sentido.

Pero los reinterpretamos materialmente: el sujeto no decide desde la nada, sino desde infraestructuras, riesgos, hábitos y topologías concretas.

### Frase-puente sugerida

"Aquí la fenomenología no desaparece dentro del dato; más bien el dato ayuda a explicitar aquello que condiciona la experiencia antes incluso de que el sujeto lo tematice."

## 4. Giro crítico

Con Foucault añadimos heterotopía y poder. La ciudad no es homogénea. Tiene umbrales, contra-sitios, zonas de apertura y cierre, espacios de control y espacios de exposición.

### Punto clave para decir en voz alta

Los nodos del caso no son solo puntos geométricos: son espacios donde cambia el régimen de visibilidad, seguridad, comercio, permanencia y circulación.

## 5. Caso elegido

Tomamos La Candelaria, con foco en San Antonio, Junín, Parque Berrío y Plaza Botero, porque allí se concentran transporte, comercio, vigilancia, cultura, conflicto y centralidad.

## 6. Por qué ese lugar

- alta disponibilidad de datos públicos;
- nodo de movilidad crucial;
- fuerte espesor fenomenológico;
- posibilidad de trabajo de campo accesible y denso.

## 7. Método

Combinamos cuatro planos:

1. fenomenología del espacio vivido;
2. fuentes públicas de ciudad;
3. grafo, hipergrafo y teoría de decisiones;
4. simulación y visualización web.

### Explicación corta del pipeline

1. se descargan y trazan fuentes públicas;
2. se construye el caso como red de nodos y aristas;
3. se corren escenarios horarios y perfiles de agente;
4. se publica un payload que la app convierte en laboratorio visual.

## 8. Qué modelamos

No modelamos solo calles. Modelamos:

- nodos;
- trayectorias;
- cuellos de botella;
- zonas de permanencia;
- ruido;
- iluminación;
- riesgo;
- atracción comercial;
- vigilancia;
- tipos de cuerpo y de objetivo.

### Aclaración útil

Eso significa que el modelo no pregunta solamente "por dónde se puede pasar", sino también "cómo cambia la decisión cuando cambian presión, ruido, seguridad y objetivo del trayecto".

## 9. Hallazgo conceptual clave

Lo que parece libre elección cotidiana suele ser un conjunto muy reducido de posibilidades. La ciudad orienta, recorta, acelera, expulsa, atrae y filtra.

## 10. Visualizaciones

### Secuencia real de demo

#### Paso 1 — abrir el escenario pico PM

- mostrar el hero con estado del proyecto;
- señalar que el proyecto está en `baseline proxy demostrable` con trazabilidad explícita;
- enfatizar que la UI ya distingue entre `documented`, `proxy` y `pending`.

#### Paso 2 — entrar al mapa del corredor

- mostrar mapa geográfico y grafo operativo en paralelo;
- señalar la ruta dominante del perfil principal y la del perfil comparado;
- explicar que la comparación no es abstracta: queda dibujada sobre el corredor real.

#### Paso 3 — activar el inspector de nodo

- hacer clic en `Parque Berrío` o `Junín`;
- leer rápidamente carga, centralidad y seguridad estructural;
- mostrar cómo el nodo aparece a la vez como punto físico, heterotopía y restricción sistémica.

#### Paso 4 — cambiar el perfil de agente

- pasar de `commuter_fast` a un perfil más vulnerable o lento;
- usar el comparador lateral para mostrar diferencias de costo, tiempo y entropía de rutas;
- decir explícitamente que no todos los cuerpos habitan igual el mismo espacio.

#### Paso 5 — cambiar de escenario horario

- comparar mediodía vs. pico PM;
- mostrar cómo sube la restricción decisional o la presión media;
- remarcar que la hora modifica el campo de posibilidades sin que el sujeto deje de actuar.

#### Paso 6 — abrir la matriz de campo

- mostrar la tarjeta de trabajo de campo;
- explicar que el modelo ya es demostrable, pero declara de forma visible qué sigue pendiente para calibración fuerte;
- mencionar protocolo y plantillas de captura.

#### Paso 7 — cerrar con evidencia integrada

- entrar a las tarjetas de percepción del centro, criminalidad y estructura barrial;
- mostrar que la app no es una ilustración vacía, sino una interfaz sobre datos reales ya integrados.

### Qué mostrar sí o sí

- mapa del corredor con rutas superpuestas;
- inspector de nodo con lectura fenomenológica, heterotópica y sistémica;
- comparación de perfiles en un mismo escenario;
- matriz de presión por franja horaria;
- matriz de campo y evidencia integrada.

### Frase de apoyo para la demo

"Aquí no estamos viendo un mapa bonito: estamos viendo cómo cambia el espacio de decisión cuando cambiamos perfil corporal, franja horaria y régimen de presión urbana."

## 11. Hallazgos defendibles hoy

### Hallazgo 1 — centralidad diferencial

Parque Berrío y Junín funcionan como concentradores estructurales del corredor; no son puntos equivalentes, sino nodos que condensan memoria, comercio, control y presión.

### Hallazgo 2 — libertad condicionada

La libertad de trayecto disminuye en horas pico: el sistema reduce alternativas efectivas sin anular por completo la agencia del sujeto.

### Hallazgo 3 — los perfiles no habitan igual

Cuando cambiamos el tipo de agente cambian costo, tiempo y diversidad de rutas; por tanto, el mismo espacio urbano no aparece igual para todos los cuerpos y objetivos.

### Hallazgo 4 — la heterotopía puede operacionalizarse

La heterotopía deja de ser un adorno teórico cuando se relaciona con nodos críticos, umbrales, comercio, vigilancia y permanencia.

## 12. Límites declarados con honestidad

- DANE sigue bloqueado por `403` y necesita sustitución o explicitación metodológica;
- la calibración fina de campo sigue pendiente;
- todavía no hay ingestión de observaciones reales en `processed/`;
- la siguiente versión debe comparar escenarios ya recalibrados, no solo escenarios base.

### Frase útil para blindar preguntas

"La fortaleza de esta versión no es fingir completitud, sino hacer visible qué parte está documentada, qué parte sigue siendo proxy y cuál es exactamente el siguiente paso empírico."

## 13. Tesis final

La fenomenología no se opone al dato. Se vuelve más fuerte cuando puede explicitar las condiciones materiales de la experiencia. El espacio urbano aparece al sujeto, pero aparece ya estructurado por transporte, densidad, ruido, vigilancia, economía y poder.

## 14. Cierre

Nuestro trabajo propone una fenomenología contemporánea de la ciudad: filosóficamente rigurosa, formalizable, trazable y técnicamente construible. No reemplazamos la experiencia por números; usamos números, redes y simulaciones para mostrar con más precisión cómo la experiencia es producida.

### Última frase sugerida

"No se trata de sustituir la ciudad vivida por una simulación, sino de construir una herramienta capaz de mostrar con más claridad cómo esa ciudad vivida ya está organizada por flujos, poderes, umbrales y decisiones materialmente condicionadas."

## 15. Preguntas probables y respuesta breve

### ¿Entonces esto es fenomenología o ciencia de datos urbana?

Es ambas cosas: la fenomenología aporta la pregunta por la aparición y el habitar; la modelación y la visualización permiten explicitar condiciones materiales de esa aparición.

### ¿Qué falta para decir que el modelo está cerrado?

Trabajo de campo mínimo, sustitución o cierre metodológico del hueco DANE y una recalibración de pesos con nuevos datos.

### ¿Qué demuestra ya esta versión?

Que es posible traducir una pregunta fenomenológica en un dispositivo técnico trazable, defendible y visualizable sin perder espesor conceptual.
