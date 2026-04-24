# Modelo computacional

## Objetivo

Representar el corredor estudiado como un sistema relacional donde el sujeto se mueve, percibe, decide y es condicionado por el entorno. El modelo no busca reemplazar la experiencia; busca formalizar las condiciones de su producción.

## Nivel 1: grafo multicapa

Definir:

- `V`: nodos espaciales relevantes.
- `E`: aristas de conexión.
- `L`: capas temáticas.
- `W_t`: pesos dependientes del tiempo.

## Tipología de nodos

- acceso Metro;
- cruce peatonal;
- tramo comercial;
- plaza o vacío de permanencia;
- equipamiento;
- borde de vigilancia;
- umbral de cambio atmosférico;
- punto de decisión;
- refugio;
- obstáculo.

## Tipología de aristas

- peatonal directa;
- peatonal con fricción;
- multimodal;
- borde de alta exposición;
- conexión condicionada por semáforo o cruce;
- transición de alta a baja densidad.

## Capas mínimas

- movilidad;
- seguridad;
- ambiente;
- morfología;
- comercio;
- poder y control;
- percepción;
- memoria y simbolización.

## Estructura de datos sugerida

### Node

```json
{
  "id": "san_antonio_a_01",
  "type": "metro_access",
  "name": "Acceso Estación San Antonio",
  "lon": -75.568,
  "lat": 6.247,
  "layers": {
    "security": 0.42,
    "commerce": 0.71,
    "orientation": 0.63
  }
}
```

### Edge

```json
{
  "id": "edge_101",
  "source": "san_antonio_a_01",
  "target": "junin_03",
  "mode": "walk",
  "length_m": 180,
  "travel_time_s": 150,
  "crowding": 0.77,
  "noise": 0.68,
  "risk": 0.54,
  "lighting": 0.82
}
```

### Hyperedge

```json
{
  "id": "hyper_018",
  "members": ["san_antonio_a_01", "peak_pm", "commuter", "high_surveillance", "high_noise"],
  "relation": "transfer_stress"
}
```

## Nivel 2: hipergrafo

El hipergrafo es necesario porque muchas situaciones urbanas no son binarias. Una situación fenomenológica completa puede incluir:

- lugar;
- hora;
- cuerpo;
- objetivo;
- densidad;
- atmósfera;
- dispositivo de poder.

Ejemplo de hiper-arista:

`{Parque Berrío, 12:30, comprador, alta densidad, predicación pública, oferta callejera, vigilancia, pausa breve}`

## Nivel 3: agentes

Perfiles mínimos:

- `commuter_fast`
- `buyer`
- `tourist`
- `street_vendor`
- `shelter_seeker`
- `reduced_mobility`

## Estado interno del agente

- objetivo principal;
- tolerancia al riesgo;
- tolerancia al ruido;
- sensibilidad a congestión;
- presupuesto temporal;
- hábito de ruta;
- necesidad de refugio;
- capacidad de permanencia;
- velocidad base.

## Función de utilidad

`U_i(r,t) = a*access - b*risk - c*crowding - d*noise - e*fatigue + f*attraction + g*habit + h*refuge`

Cada parámetro debe calibrarse por perfil de agente.

## Restricción material

El agente no elige sobre el conjunto total de trayectorias imaginables, sino sobre un conjunto factible:

`A_i(t) = {rutas viables dada accesibilidad fisica, tiempo disponible, costo perceptivo y barreras reales}`

## Dinámica de simulación

1. Inicializar nodos, aristas y capas por franja horaria.
2. Inicializar distribución de agentes.
3. Calcular costos dinámicos.
4. Resolver ruta y permanencia.
5. Actualizar congestión y retroalimentación.
6. Registrar trayectorias, cuellos de botella y zonas de evitación.

## Stack sugerido

- `Python + GeoPandas + OSMnx + NetworkX` para grafo base;
- `Mesa` para simulación;
- exportación a `Parquet`, `GeoJSON`, `JSON`;
- consumo en web con React y Web Workers.

## Regla metodológica

El modelo debe declarar siempre:

- qué variable es observada;
- qué variable es proxy;
- qué variable es inferida;
- qué variable es calibrada manualmente.
