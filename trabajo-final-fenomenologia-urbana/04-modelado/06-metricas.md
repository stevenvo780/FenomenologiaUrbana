# Métricas de Alta Complejidad

## Métricas de Información y Fenomenología

### Entropía de Shannon (H)
Mide la predictibilidad de las trayectorias de los agentes. Una entropía baja indica un espacio que impone un guion de movimiento (compulsión).

### Información Mutua (MI)
Calcula la dependencia entre la estructura espacial y las decisiones del agente.

### Entropía de Transferencia (TE)
Mide el flujo de información entre capas (ej. cómo el ruido ambiental modifica la intención de ruta en tiempo real).

## Métricas Sistémicas Calibradas

### Índice de Desigualdad Fenomenológica (Gini-E)
Mide la disparidad en la libertad de ruta (entropía) entre diferentes perfiles de agentes (ej. movilidad reducida vs. transbordo rápido).

### Presión de Nodo HPC
`P_v = load / (capacity * comfort_multiplier)`
Calculado sobre simulaciones de 100k agentes para detectar puntos de ruptura sistémica.

### Divergencia de Kullback-Leibler (D_KL)
Utilizada para medir la diferencia entre la distribución de flujos simulada y la observada empíricamente en los aforos del Metro.
