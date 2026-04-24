## Datos de Validación Empírica (Grounding)

Para evitar que la simulación sea puramente teórica, se calibran los resultados contra:

- **Afluencia Estación San Antonio (2023-2024):** ~100,000 pasajeros diarios (Día laboral). Datos extraídos de reportes de sostenibilidad del Metro de Medellín y el ArcGIS Hub de Datos Abiertos.
- **Volumen Total del Sistema:** 312.5 millones de viajes (2023).
- **Tendencia 2024:** Contracción del 1.9% por migración a otros modos (motocicleta), lo cual informa el perfil de agente `commuter_fast`.

## Calibración del Modelo

El modelo utiliza un enfoque de **Validación Cruzada**, comparando el flujo simulado en nodos críticos contra los aforos reales. El objetivo es minimizar la divergencia de Kullback-Leibler entre la realidad observada y la simulación HPC.

## Fuentes complementarias

| Fuente | URL | Tipo de dato | Estado |
| --- | --- | --- | --- |
| Metro de Medellín, mapa del sistema | https://www.metrodemedellin.gov.co/viaja-con-nosotros/mapa-del-sistema-metro | estructura de red | útil para topología multimodal |
| Informe para inversionistas Metro | https://www.metrodemedellin.gov.co/Portals/0/Documentos/metroinvestmentreport2023.pdf | capacidad de líneas y cobertura | útil para justificar capacidad de red |
| DANE Censo Económico Nacional Urbano | https://www.dane.gov.co/index.php/estadisticas-por-tema/comercio-interno/censo-economico-nacional-urbano | actividad económica | usar cuando exista salida espacial fina utilizable |

## Qué datos ya existen en la red

- movilidad urbana agregada;
- estructura del sistema Metro;
- criminalidad por comuna;
- indicadores barriales;
- usos del suelo y equipamientos;
- ruido y calidad del aire;
- cartografía base;
- percepción ciudadana del centro;
- demografía de contexto.

## Qué datos no están suficientemente resueltos solo con web

- conteo peatonal fino por nodo y por quince minutos;
- tiempos de permanencia;
- microzonas de pausa, evitación y refugio;
- obstáculos temporales sobre andén;
- intensidad real de vendedores ambulantes;
- percepción situada de seguridad por subtramo;
- experiencia corporal comparada entre perfiles de usuario.

## Criterio de calidad de fuente

Se priorizan:

1. fuentes oficiales del municipio, AMVA, Metro y DANE;
2. cartografía abierta trazable;
3. percepción ciudadana institucionalizada;
4. datos capturados en campo por el equipo.

No se deben mezclar sin control escalas incompatibles ni proxies sin declarar.
