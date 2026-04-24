# Simulaciones

## Objetivo

Explorar cómo cambia la experiencia y la estructura de decisiones del corredor cuando varían hora, densidad, vigilancia, iluminación, ruido, accesibilidad o saturación de nodos.

## Simulaciones mínimas

| Escenario | Qué cambia | Qué se observa |
| --- | --- | --- |
| Hora pico AM | alta densidad y prisa | centralidad, congestión, pérdida de alternativas |
| Hora valle | baja densidad relativa | recuperación de rutas y permanencia |
| Hora pico PM | retorno y saturación San Antonio | cuellos de botella y estrés de transferencia |
| Noche | menos flujo, más peso de iluminación y seguridad | cambios de evitación y permanencia |
| Evento o cierre parcial | bloqueo de nodo o arista | redistribución de trayectorias |
| Refuerzo de iluminación | mejora de visibilidad nocturna | aumento de accesibilidad percibida |
| Mayor presencia policial | cambio del control visible | modificación de permanencia y uso diferencial |
| Intensificación del comercio callejero | mayor atracción y obstáculo simultáneo | fricción y nuevas zonas de pausa |

## Escenarios comparativos por tipo de agente

- trabajador con alta urgencia temporal;
- turista con alta tolerancia a permanencia;
- persona con movilidad reducida;
- persona que prioriza seguridad sobre velocidad;
- vendedor ambulante que busca nodos de visibilidad y flujo.

## Variables de salida

- rutas elegidas;
- tiempos promedio;
- distribución de congestión;
- nodos más presionados;
- zonas de evitación;
- zonas de permanencia;
- restricción decisional media por perfil.

## Simulaciones avanzadas

### 1. Cambio en el nodo San Antonio

Simular cierre parcial, operación degradada o saturación del intercambio modal.

### 2. Intervención urbana

Comparar antes y después de:

- aumento de iluminación;
- despeje de obstáculos;
- ampliación de andén útil;
- redistribución de cruce peatonal;
- aumento de vegetación o sombra.

### 3. Escenario heterotópico

Modelar cómo cambia la mezcla de cuerpos, permanencias y trayectorias cuando aumenta:

- vigilancia;
- turistificación;
- control del comercio informal;
- actividad cultural.

## Herramienta sugerida

- simulación principal offline con `Mesa`;
- exportación de escenarios a archivos JSON;
- reproducción interactiva en la web mediante `Web Workers`.

## Criterio de éxito

La simulación es útil si permite mostrar:

1. dónde la estructura restringe más que el discurso de libertad cotidiana;
2. cómo cambian las trayectorias al variar una sola capa;
3. qué diferencia hay entre accesibilidad geométrica y accesibilidad vivida.
