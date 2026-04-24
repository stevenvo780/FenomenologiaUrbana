# Fuentes de datos

## Fuentes públicas prioritarias

| Fuente | URL | Tipo de dato | Para qué sirve |
| --- | --- | --- | --- |
| Observatorio de Movilidad de Medellín | https://www.medellin.gov.co/es/secretaria-de-movilidad/observatorio-de-movilidad/ | aforos, eventos, pasajeros, velocidad e intensidad | construir capa de movilidad y congestión |
| Componente transporte del Observatorio | https://www.medellin.gov.co/es/secretaria-de-movilidad/observatorio-de-movilidad/componente-transporte/ | pasajeros movilizados y dinámica del sistema | aproximar presión de transporte y demanda |
| Componente tránsito del Observatorio | https://www.medellin.gov.co/es/secretaria-de-movilidad/observatorio-de-movilidad/componente-transito/ | eventos, velocidad, intensidad, siniestros | fricción vial y presión circulatoria |
| Metro de Medellín, reto San Antonio B | https://www.metrodemedellin.gov.co/en/challenge-mobility-in-san-antonio-b | descripción operacional del nodo | justificar la centralidad y saturación del nodo |
| MEData criminalidad | https://medata.gov.co/node/16667 | criminalidad por comuna, año y mes | capa de riesgo objetivo |
| MEData batería de indicadores barriales | https://medata.gov.co/node/16899 | 100+ indicadores por barrio | contexto estructural del área |
| MEData uso general del suelo urbano | https://www.medata.gov.co/node/16360 | usos del suelo | atracción funcional y mezcla urbana |
| MEData equipamientos colectivos | https://www.medata.gov.co/node/41592 | equipamientos georreferenciados | densidad institucional y cultural |
| SIATA / AMVA calidad del aire | https://datosabiertos.metropol.gov.co/dataset/mediciones-estaciones-calidad-del-aire | series ambientales | presión ambiental |
| SIATA / AMVA ruido ambiental | https://datosabiertos.metropol.gov.co/dataset/mediciones-de-ruido-ambiental | series de ruido | fricción sensorial |
| DANE Geoportal / CNPV | https://geoportal.dane.gov.co/geovisores/sociedad/cnpv-2018/ | población, hogares, escala de manzana | densidad y contexto demográfico |
| Medellín Cómo Vamos, EPC 2024 | https://www.medellincomovamos.org/download/informe-metodologico-centro-epc-medellin-como-vamos-2024/ | percepción ciudadana del centro | percepción, imagen urbana, contraste con datos |
| OpenStreetMap / Overpass | https://www.openstreetmap.org/ | red peatonal, cruces, POI, accesos | base topológica y capa comercial derivada |

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
