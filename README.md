# Fenomenología contemporánea del centro de Medellín

Este proyecto organiza un trabajo final académico-investigativo para filosofía de la ciudad a partir del documento base [`fenomenologia.md`](../fenomenologia.md), especialmente de su tramo final sobre heterotopías, reconstrucción fenomenológica y trabajo de campo.

La apuesta central no es literaria ni decorativa. El objetivo es mostrar que hoy se puede hacer fenomenología urbana con rigor filosófico y, al mismo tiempo, con formalización computacional, análisis de datos, teoría de redes, teoría de decisiones, simulación de agentes, métricas espaciales y una web interactiva en React.

## Caso elegido

Se selecciona la **comuna 10 de Medellín (La Candelaria)**, con foco operativo en el corredor:

- Estación San Antonio
- Parque San Antonio
- Pasaje Junín
- Parque Berrío
- Plaza Botero
- bordes inmediatos de Carabobo, Oriental y entorno Metro

Este polígono fue elegido por dos razones:

1. Tiene la mayor densidad de capas urbanas útiles para el proyecto: transporte masivo, centralidad peatonal, comercio formal e informal, equipamientos culturales, vigilancia, conflictividad, memoria urbana y percepción ciudadana.
2. Tiene buena disponibilidad de datos públicos y de capas derivables desde fuentes abiertas: movilidad, criminalidad, uso del suelo, equipamientos, indicadores barriales, cartografía base, aire, ruido, percepción ciudadana y red vial/peatonal.

## Estructura de carpetas

```text
trabajo-final-fenomenologia-urbana/
├── README.md
├── 00-documento-principal.md
├── 01-fundamentos/
│   └── 01-marco-filosofico.md
├── 02-caso-estudio/
│   └── 02-espacio-urbano.md
├── 03-datos/
│   ├── 03-fuentes-de-datos.md
│   └── 04-datos-a-capturar-en-campo.md
├── 04-modelado/
│   ├── 05-modelo-computacional.md
│   ├── 06-metricas.md
│   └── 07-simulaciones.md
├── 05-web/
│   └── 08-web-react.md
├── 06-gestion/
│   ├── 09-trazabilidad-y-pendientes.md
│   ├── 10-guion-exposicion.md
│   ├── 12-hallazgos-y-conclusiones.md
│   ├── 13-plan-operativo-cierre-empirico.md
│   └── 14-cierre-final-repo.md
├── investigacion/
│   ├── README.md
│   ├── data/
│   ├── docs/
│   ├── outputs/
│   └── scripts/
└── visual/
    ├── README.md
    ├── public/data/
    └── src/
```

## Cómo leer y presentar el proyecto

1. Lee la tesis en orden: [`tesis/01-introduccion-y-marco-teorico.md`](./tesis/01-introduccion-y-marco-teorico.md), [`tesis/02-metodologia-y-diseno-hpc.md`](./tesis/02-metodologia-y-diseno-hpc.md), [`tesis/03-resultados-y-analisis-de-turbulencia.md`](./tesis/03-resultados-y-analisis-de-turbulencia.md) y [`tesis/04-conclusiones-y-referencias-bibliograficas.md`](./tesis/04-conclusiones-y-referencias-bibliograficas.md).
2. Para exponer a público general, usa [`tesis/guion-presentacion-publico.md`](./tesis/guion-presentacion-publico.md) junto con el deck React.
3. Para saber qué está validado y qué sigue pendiente, revisa [`tesis/pendientes/tareas-campo.md`](./tesis/pendientes/tareas-campo.md) y [`investigacion/docs/trazabilidad-tesis.md`](./investigacion/docs/trazabilidad-tesis.md).
4. Para reproducir o revisar el pipeline, usa [`investigacion/README.md`](./investigacion/README.md) y [`investigacion/docs/reproducibilidad.md`](./investigacion/docs/reproducibilidad.md).
5. Para revisar la evolución crítica de la escritura, consulta [`tesis/historico/`](./tesis/historico/).

## Enfoque filosófico

- Husserl: intencionalidad, mundo de la vida, cuerpo vivido, constitución de sentido, aparecer del espacio.
- Foucault: heterotopías, poder, umbrales, contra-sitios, visibilidad e invisibilidad.
- Relectura materialista y sistémica: el sujeto no decide desde un vacío trascendental, sino desde una trama de condiciones materiales y restricciones situadas.
- Enfoque emergentista: la experiencia urbana es un efecto relacional de cuerpos, infraestructuras, ritmos, densidades, memorias, incentivos y fricciones.

## Enfoque computacional

- Grafo multicapa del espacio urbano.
- Hipergrafo para relaciones no binarias entre cuerpos, prácticas, tiempos, poderes y atmósferas.
- Modelo de decisión con agentes acotados por accesibilidad, riesgo, congestión, iluminación, ruido, vigilancia, hábito y atracción comercial.
- Métricas de centralidad, fricción, restricción decisional, entropía de trayectorias e intensidad fenomenológica.
- Simulaciones comparativas por franjas horarias y escenarios de intervención.
- Web en React para visualización, exploración y comunicación pública del argumento.

## Estado del proyecto

Lo que ya queda resuelto en estos archivos:

- formulación filosófica y metodológica del trabajo;
- justificación del espacio urbano elegido;
- inventario inicial de datos públicos disponibles;
- modelo computacional y métricas;
- pipeline investigativo ejecutable;
- simulación inicial ya corrida y publicada;
- dashboard React ya conectado a outputs reales;
- fuentes públicas ampliadas a SIATA/AMVA JSON, pasajeros SITVA y fallback DANE municipal/microdatos;
- payload visual `0.2.0-baseline` con cierre operativo y límites explícitos;
- matriz de trazabilidad para trabajo real.

Lo que todavía queda fuera del repo y no debe inventarse:

- captura física de campo en varias franjas horarias;
- validación de proxies para seguridad percibida y densidad peatonal;
- sustitución progresiva de pesos proxy por observación fina;
- cierre de acceso automatizado a fuentes que hoy bloquean `403`: DANE geovisor fino, MEData uso del suelo y MEData equipamientos.
