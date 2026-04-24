# Simulaciones HPC de Alta Fidelidad

## Metodología M-MASS (Massive Multi-Agent Stochastic Simulation)

Las simulaciones se ejecutan a una escala de **100,000 agentes simultáneos** para capturar fenómenos emergentes (atascos fantasma, turbulencia fenomenológica).

## Escenarios de Estrés Calibrados

| Escenario | Población Real Sim. | Objetivo de Calibración |
| --- | --- | --- |
| Pico PM San Antonio | 120,000 agentes | Flujo observado ~100k pax/día |
| Saturación Junín | 80,000 agentes | Velocidad de flujo < 0.5 m/s |
| Noche (Baja Densidad) | 15,000 agentes | Aumento de rutas de evitación |

## Calibración Dinámica de Parámetros

Se utiliza un algoritmo de optimización para ajustar los pesos de la función de utilidad de los agentes, buscando que la distribución de rutas simuladas coincida con los datos del Observatorio de Movilidad y el ArcGIS Hub del Metro.
