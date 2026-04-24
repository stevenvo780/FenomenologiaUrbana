# Modelo computacional HPC (High Performance Computing)

## Objetivo

Modelar el corredor como un sistema dinámico no lineal de alta fidelidad, donde la experiencia emerge de la interacción entre agentes inteligentes (MARL) y campos ambientales continuos (PDE).

## Nivel 1: Grafo Multicapa de Alta Resolución

Definición extendida: `G = (V, E, L, W, F)`
- `F`: Campos de flujo continuos integrados (PM2.5, Ruido, Densidad).

## Nivel 2: Motor de Agentes (DRL y SFM)

Ya no usamos heurísticas simples. El modelo emplea:
- **Deep Reinforcement Learning (DQN):** Agentes con redes neuronales que optimizan su trayectoria basándose en una recompensa fenomenológica compleja.
- **Social Force Model (SFM):** Dinámica de fluidos peatonales para modelar colisiones físicas y turbulencias en nodos de alta densidad (San Antonio).

## Nivel 3: Calibración Empírica Bayesiana

El modelo se calibra contra:
- **Microdatos DANE:** Población por manzana para la generación de agentes (Origins).
- **Aforos Metro:** Validación de flujos en nodos de transferencia.
- **Telemetría SIATA:** Integración de campos de dispersión 4K.

## Regla Metodológica: Validación de Grado Científico

Todo resultado debe incluir su intervalo de confianza y el error residual respecto a los datos observados del Observatorio de Movilidad.
