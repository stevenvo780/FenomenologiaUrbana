# Análisis de Modelos de Simulación: Fenomenología Urbana HPC

Este documento presenta una auditoría técnica de los modelos computacionales desarrollados para el estudio del corredor Junín - San Antonio. Los modelos están organizados desde la mayor fidelidad y relevancia fenomenológica hasta las implementaciones base.

## Tabla Comparativa de Modelos

| Rango | Modelo / Simulación | Estado | Metodología | Infraestructura | Descripción |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **M-MASS (Advanced)** | **En Uso** | Agentes + Campos | HPC / Multi-GPU | Simulación masiva (100k+ agentes). Captura la "Estructura de Expulsión". |
| **2** | **MARL (Deep RL)** | **En Uso** | Reinforcement Learning | PyTorch / CUDA | Modela la "racionalidad de supervivencia" y toma de decisiones bajo presión. |
| **3** | **Social Force Model (SFM)** | **En Uso** | Dinámica de Fluidos | GPU / Micro-sim | Captura turbulencia física y colisiones a nivel de cuerpo individual. |
| **4** | **Urban Isovists (2K)** | Experimental | Ray-Tracing Masivo | GPU / 720 Rays | Mapea la visibilidad perceptual y la exposición visual en tiempo real. |
| **5** | **Environmental PDE** | **En Uso** | Ecuaciones Diferenciales | Solver Numérico | Dispersión de contaminantes (PM2.5) y propagación acústica (Ruido). |
| **6** | **Everyday Chaos** | Experimental | Teoría del Caos / Entropía | HPC Analysis | Mide la predictibilidad del flujo y los puntos de ruptura sistémica. |
| **7** | **Stress Test / MC** | Experimental | Monte Carlo / UQ | HPC Cluster | Cuantifica la incertidumbre y la resiliencia ante picos de demanda. |
| **8** | **Historical Evolution** | **En Uso** | Longitudinal (2012-24) | CPU / Batch | Analiza la transformación del espacio y la entropía en la última década. |
| **9** | **Economic Gravity** | Experimental | Campos de Potencial | PyTorch Field | Modela la atracción comercial y los flujos de consumo hacia nodos. |
| **10** | **Baseline Simulation** | **En Uso** | Grafos / Dijkstra | CPU / Single-thread | Modelo de enrutamiento básico para comparación y calibración inicial. |

## Análisis de Integración

### Modelos en el Flujo Principal (`run_all.py`)
Los modelos marcados como **"En Uso"** constituyen la columna vertebral de la tesis. Se ejecutan de forma secuencial y sus resultados se consolidan en el `frontend_payload.json` para la visualización interactiva. La transición de modelos de grafos simples (Baseline) a modelos de agentes inteligentes (MARL) permite observar cómo el espacio deja de ser una red de transporte para convertirse en un territorio de conflicto y habitabilidad.

### Modelos Experimentales / Específicos
Los modelos marcados como **"Experimental"** (como *Economic Gravity* o *Urban Isovists*) son componentes de alta fidelidad que se han utilizado para validaciones específicas o capítulos teóricos. Aunque no se ejecutan en cada iteración del pipeline principal para optimizar recursos, sus datos pre-calculados informan los hallazgos del documento final.

### Criterio de Calificación (Ranking)
1. **Fidelidad Fenomenológica:** Capacidad de representar la experiencia del cuerpo en el espacio.
2. **Complejidad Computacional:** Uso eficiente de recursos HPC y GPU.
3. **Poder Predictivo:** Capacidad de detectar colapsos sistémicos antes de que ocurran en el modelo base.
