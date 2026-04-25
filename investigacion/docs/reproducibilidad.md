# Anexo de reproducibilidad computacional

Fecha de consolidación: 25 de abril de 2026.  
Estado empírico: `baseline_proxy` con `pending_no_capture` para campo.

## 1. Propósito

Este anexo permite que otra persona revise cómo se generan las salidas principales del proyecto sin depender de una explicación oral. No convierte los resultados en validación empírica: solo documenta ambiente, comandos, entradas, salidas y límites de ejecución.

## 2. Entorno observado en esta máquina

Captura local realizada el 25 de abril de 2026:

| Componente | Versión observada |
| --- | --- |
| Sistema | Linux 6.17.0-22-generic x86_64, glibc 2.42 |
| Python | 3.13.7 |
| Node.js | v22.21.1 |
| npm | 10.9.4 |
| NumPy | 2.4.3 |
| PyTorch | 2.10.0+cu128 |
| NetworkX | 3.6.1 |
| Requests | 2.32.3 |
| Pandas | no disponible en el Python global observado |
| GeoPandas/Shapely | no disponibles en el Python global observado |

Nota: el repositorio contiene `venv_hpc/`, pero esta captura se hizo con el `python3` disponible en la terminal activa. Para una entrega formal, fijar un `requirements.txt` o `pyproject.toml` con versiones exactas.

## 3. Entradas principales

| Entrada | Ruta | Estado |
| --- | --- | --- |
| Fuentes públicas descargadas | `investigacion/data/raw/` | parcial, con fallas documentadas |
| Plantillas de campo | `investigacion/data/interim/templates/` | disponibles |
| Ejemplos sintéticos | `investigacion/data/interim/examples/` | solo prueba técnica; no evidencia |
| Modelo de caso | `investigacion/outputs/case_model.json` | baseline proxy |
| Reporte de campo | `investigacion/outputs/field_calibration_delta.json` | debe seguir `pending_no_capture` hasta tener campo real |

## 4. Pipeline completo

Ejecutar desde `investigacion/`:

```bash
python3 scripts/run_all.py
```

El orquestador ejecuta 15 pasos:

1. descarga de fuentes públicas;
2. construcción del caso base;
3. derivación empírica;
4. ingesta de trabajo de campo;
5. agregación de observaciones;
6. recalibración si hay datos observados;
7. simulaciones base;
8. simulaciones avanzadas M-MASS;
9. entrenamiento DRL;
10. microsimulación Social Force Model;
11. PDE ambiental;
12. desigualdad fenomenológica;
13. evolución histórica;
14. exportación raster;
15. publicación de payload visual.

## 5. Modo reducido recomendado para revisión en CPU

Para un jurado o revisor que no quiera ejecutar todo el pipeline pesado, usar estos pasos:

```bash
cd investigacion
PYTHONPATH=scripts python3 -m data.ingest_fieldwork
PYTHONPATH=scripts python3 -m data.aggregate_fieldwork
PYTHONPATH=scripts python3 -m models.build_case_graph
PYTHONPATH=scripts python3 -m data.derive_empirical_data
PYTHONPATH=scripts python3 -m models.calibrate_case_model
PYTHONPATH=scripts python3 -m analysis.analyze_urban_inequality
PYTHONPATH=scripts python3 -m visualization.publish_visual_payload
```

Si no hay datos reales de campo, este modo debe conservar `pending_no_capture`.

## 6. Validación visual/frontend

Desde la raíz del repositorio:

```bash
npm run build
npm run lint
```

Estos comandos verifican TypeScript/Vite y reglas de lint del frontend.

## 7. Salidas auditables

| Salida | Uso en tesis |
| --- | --- |
| `outputs/source_status.json` | fuentes descargadas/fallidas |
| `outputs/empirical_summary.json` | evidencia pública secundaria |
| `outputs/case_model.json` | nodos, aristas, agentes, escenarios |
| `outputs/hpc_uncertainty_quantification.json` | estabilidad numérica bajo supuestos |
| `outputs/hpc_urban_stress_test.json` | escenario límite, no capacidad real |
| `outputs/urban_inequality_analysis.json` | desigualdad relativa de rutas |
| `outputs/field_calibration_delta.json` | estado real de calibración de campo |
| `outputs/frontend_payload.json` | visualización y deck |

## 8. Semillas y determinismo

El proyecto produce resultados reproducibles en estructura, pero no debe prometer bit-identical reproducibility sin fijar:

- semillas aleatorias de NumPy/PyTorch;
- versión exacta de CUDA/cuDNN;
- hardware GPU/CPU;
- orden de operaciones paralelas;
- número de agentes y pasos por experimento.

Para cierre formal, cada script pesado debe registrar en su JSON de salida: `seed`, `device`, `python_version`, `torch_version`, `numpy_version`, `started_at`, `finished_at` y `parameters`.

## 9. Límites de reproducibilidad

- No hay validación empírica completa mientras `field_calibration_delta.json` siga en `pending_no_capture`.
- Los ejemplos sintéticos no deben mover el estado del caso ni citarse como observación real.
- Si un revisor no tiene GPU, puede validar estructura y salidas ligeras, pero no tiempos ni rendimiento HPC.
- Las fuentes externas pueden fallar por 403, timeout o cambios de portal; esas fallas deben conservarse en `source_status.json`.

## 10. Criterio de aprobación

La reproducibilidad se considera documentada si un tercero puede:

1. identificar entradas;
2. ejecutar modo reducido;
3. localizar salidas;
4. distinguir datos reales de ejemplos sintéticos;
5. verificar que el estado de campo no fue falsificado.
