# Trazabilidad y pendientes

## Matriz operativa

| Ítem | Estado | Responsable sugerido | Cómo se captura o consigue | Formato | Variable o salida que alimenta |
| --- | --- | --- | --- | --- | --- |
| Observatorio de Movilidad | disponible | equipo datos | descarga web oficial | CSV / XLSX | flujos, congestión |
| Datos Metro San Antonio | parcial | equipo datos | revisión web e informes | PDF / notas / CSV si aparece | centralidad de transporte |
| Criminalidad por comuna | disponible | equipo datos | descarga MEData | CSV | riesgo objetivo |
| Capacidad de soporte barrial | disponible | equipo datos | descarga MEData | CSV | contexto estructural |
| Uso del suelo | disponible | equipo datos | descarga MEData | CSV / GIS | atracción funcional |
| Equipamientos colectivos | disponible | equipo datos | descarga MEData | CSV / GIS | densidad institucional |
| Aire y ruido | disponible pero revisar cobertura | equipo datos | portal AMVA | JSON / CSV | presión ambiental |
| Población y hogares | disponible | equipo datos | DANE Geoportal | GIS / tablas | densidad demográfica |
| Percepción ciudadana del centro | disponible | equipo filosofía-datos | informe Medellín Cómo Vamos | PDF / tabla manual | percepción macro |
| Red peatonal y POI | disponible | equipo geodatos | OSM / Overpass | GeoJSON | grafo base |
| Conteo peatonal fino | pendiente | equipo campo | observación estructurada | CSV | calibración de flujo |
| Tiempos de permanencia | pendiente | equipo campo | cronometraje por nodo | CSV | permanencia |
| Puntos de decisión | pendiente | equipo campo | cartografía y observación | GeoJSON | restricción decisional |
| Obstáculos temporales | pendiente | equipo campo | observación y foto | GeoJSON | fricción espacial |
| Seguridad percibida por subtramo | pendiente | equipo campo | encuesta breve | CSV | seguridad percibida |
| Ruido puntual de campo | pendiente | equipo campo | sonómetro o app calibrada | CSV | validación ambiental |
| Iluminación nocturna | pendiente | equipo campo | checklist y luxómetro | CSV | accesibilidad nocturna |
| Notas fenomenológicas | pendiente | equipo filosofía-campo | ficha estructurada | Markdown / CSV | panel interpretativo |
| Modelo de agentes | pendiente | equipo modelado | calibración con datos y supuestos | JSON / Python | simulación |
| Web React | pendiente | equipo web | implementación | código | visualización final |

## Prioridad de ejecución

### Prioridad alta

- descargar todas las fuentes públicas;
- fijar el polígono exacto;
- hacer primera jornada de campo;
- construir grafo base;
- cerrar esquema de datos.

### Prioridad media

- calibrar agentes;
- producir métricas iniciales;
- montar prototipo React con mapa y filtros.

### Prioridad baja

- visualizaciones avanzadas;
- simulaciones comparativas complejas;
- refinamiento estético final.

## Riesgos abiertos

- escalas espaciales incompatibles;
- variables oficiales demasiado agregadas para el subtramo;
- ausencia de conteos peatonales oficiales finos;
- sobreinterpretación de proxies;
- subestimación del trabajo de limpieza geoespacial.

## Criterio de cierre real

El proyecto solo debe considerarse completo cuando existan:

- datos públicos descargados y versionados;
- base de campo consistente;
- grafo e hipergrafo ejecutables;
- métricas calculadas;
- una simulación validada al menos de forma básica;
- una web navegable con trazabilidad de fuentes.
