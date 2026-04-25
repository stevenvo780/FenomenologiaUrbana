# Desarrollo investigativo

Esta carpeta ejecuta el plan analítico del proyecto y publica artefactos consumibles por la app React en `../visual`.

## Estructura Organizada

```text
investigacion/
├── data/           # Datos raw, interim y processed
├── docs/           # Protocolos y documentación analítica
├── outputs/        # Resultados de simulaciones y reportes
├── scripts/
│   ├── _shared.py  # Utilidades comunes y rutas
│   ├── run_all.py  # Orquestador principal
│   ├── data/       # Ingesta y descarga de fuentes
│   ├── models/     # Construcción de grafos y calibración
│   ├── simulations/# Motores DRL, SFM, PDE y Gravedad
│   ├── analysis/   # Post-procesamiento y métricas
│   └── visualization/ # Renderizado y publicación
└── README.md
```

## Aparato Investigativo

Para una descripción detallada de los métodos y el pipeline, consulte [docs/aparato-investigativo.md](docs/aparato-investigativo.md).

## Ejecución

El pipeline completo se ejecuta desde la raíz de `investigacion/`:

```bash
python3 scripts/run_all.py
```

Este modo puede tardar porque incluye descarga de fuentes, ingesta de campo, calibración, simulaciones HPC/DRL/SFM/PDE, análisis de desigualdad, publicación de payload y renderizado visual.

## Modo reducido CPU

Para revisión rápida sin entrenamientos largos ni estrés computacional, ejecutar solo los módulos de preparación y publicación:

```bash
python3 -m data.ingest_fieldwork
python3 -m data.aggregate_fieldwork
python3 -m models.calibrate_case_model
python3 -m models.build_case_graph
python3 -m data.derive_empirical_data
python3 -m analysis.analyze_urban_inequality
python3 -m visualization.publish_visual_payload
```

Si no hay datos reales de campo, el estado correcto debe seguir siendo `pending_no_capture`.

## Ejemplos sintéticos

Los archivos en `data/interim/examples/` son ejemplos técnicos. No son observaciones reales, no calibran el modelo y el script de ingesta los excluye automáticamente. Para una prueba manual, copiar temporalmente el ejemplo fuera de `examples/`, ejecutar la ingesta y borrar la copia al terminar.

## Documentación de control

- `docs/reproducibilidad.md`: entorno, comandos, límites de determinismo y salidas auditables.
- `docs/sensibilidad.md`: matriz de sensibilidad y ablaciones.
- `docs/etica-campo.md`: consentimiento, anonimización y cuidado visual.
- `docs/instrumentos-campo.md`: encuesta, manual de observación y codificación fenomenológica.
- `docs/trazabilidad-tesis.md`: afirmación → fuente/script/output/pendiente.

## Salidas clave

- `outputs/source_status.json`
- `outputs/case_model.json`
- `outputs/frontend_payload.json`
- `outputs/simulation_results.json`
