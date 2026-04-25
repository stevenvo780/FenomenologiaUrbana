# Aparato Investigativo: Fenomenología Urbana

Este documento describe la arquitectura técnica y epistemológica del componente de investigación del proyecto.

## 1. Arquitectura de Datos (`scripts/data/`)

El pipeline comienza con la captura y normalización de diversas fuentes:

- **Download Sources**: Recupera datasets de SIATA (aire, ruido), DANE (Censo, Microdatos) y portales de datos abiertos de Medellín.
- **Fieldwork Ingestion**: Procesa registros manuales de observación fenomenológica (conteos, flujos, impresiones sensoriales).
- **Empirical Derivation**: Cruza datos de criminalidad, movilidad y servicios para generar una capa de "fricción real" que valida o refuta el modelo teórico.

## 2. Modelado y Calibración (`scripts/models/`)

- **Case Graph**: Construcción de un grafo topológico del corredor (San Antonio - Plaza Botero). Cada nodo y arista contiene pesos de transitabilidad, visibilidad y carga fenomenológica.
- **Calibration**: Ajusta los parámetros del modelo basándose en la discrepancia (delta) entre los datos observados y las predicciones iniciales.

## 3. Motor de Simulación (`scripts/simulations/`)

Se utilizan múltiples paradigmas para capturar la complejidad urbana:

- **Crowd Dynamics (SFM)**: Simulación de fuerzas sociales en GPU para modelar micro-interacciones peatonales y cuellos de botella.
- **Deep Reinforcement Learning (DRL)**: Agentes entrenados con PyTorch que navegan el espacio buscando objetivos específicos (comercio, tránsito rápido, turismo) bajo condiciones de estrés.
- **Environmental PDE**: Resolución de ecuaciones en derivadas parciales para la dispersión de contaminantes y propagación de ruido en el cañón urbano.
- **Economic Gravity**: Modelado de la atracción comercial y flujos de capital simbólico/real en el eje Junín.
- **Historical Evolution**: Proyecciones longitudinales de densificación y cambio de uso de suelo.

## 4. Análisis y Salida (`scripts/analysis/` & `scripts/visualization/`)

- **Inequality Analysis**: Cálculo de métricas de accesibilidad y exclusión espacial.
- **Visual Payload**: Compilación de todos los resultados en un JSON optimizado (`frontend_payload.json`) y generación de clips de video de alta resolución para la interfaz interactiva.

## 5. Ciclo de Ejecución

El sistema se orquesta mediante `scripts/run_all.py`, que garantiza la precedencia de datos y la integridad referencial entre módulos.

```bash
# Ejecución completa
python3 scripts/run_all.py
```

## 6. Estado Epistémico

- **Baseline (Proxy)**: Modelos basados en promedios históricos y supuestos geométricos.
- **Field (Observado)**: Modelos validados y recalibrados con datos recolectados in-situ.
