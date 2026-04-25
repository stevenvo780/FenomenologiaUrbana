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

## Salidas clave

- `outputs/source_status.json`
- `outputs/case_model.json`
- `outputs/frontend_payload.json`
- `outputs/simulation_results.json`
