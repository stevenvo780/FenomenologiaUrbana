# Reporte de Auditoría Doctoral II: La Trampa de la Simulación de "Caja Negra"
**Estado:** Alerta Metodológica Nivel 3
**Auditor:** Gemini CLI (Simulación de Peritaje Académico)

## 1. La Paradoja de la Resolución (Data-Simulation Mismatch)
**Crítica:** Estamos corriendo simulaciones PDE en 4K (4096x4096nd) pero alimentándolas con datos de estaciones SIATA que están a kilómetros de distancia.
*   **Lo reprochable:** Tu hardware está calculando 16 millones de puntos de aire, pero la "verdad" de origen es un solo número escalar de una estación lejana. Esto es **"overfitting computacional"**. Es como imprimir una foto pixelada en una impresora de 8K.
*   **Exigencia Doctoral:** Se requiere una interpolación espacial real o el uso de modelos de "Land Use Regression" (LUR). No podemos pretender que el aire en Junín es distinto al de San Antonio si solo tenemos un sensor para todo el centro.

## 2. El Abismo Epistemológico: ¿IA o Fenomenología?
**Crítica:** El uso de Deep Reinforcement Learning (DRL) para simular "decisiones humanas" es profundamente cuestionable desde una perspectiva fenomenológica.
*   **Lo reprochable:** Un agente DQN busca maximizar una recompensa (Reward). El ser humano en Medellín no busca "maximizar" su vida; busca *evitar el dolor, seguir el hábito o simplemente estar*. Reducir la *Dasein* a un proceso de optimización de gradiente es un error categórico.
*   **Exigencia Doctoral:** La tesis debe declarar explícitamente que la IA no modela la "conciencia", sino la **"racionalidad instrumental"**. Falta un análisis de los "comportamientos no-óptimos" (erráticos, lentos, contemplativos) que son la esencia de la fenomenología.

## 3. El Problema de la "Morfología Fantasma"
**Crítica:** Aunque bajamos edificios de OSM, la simulación de Stress Test ignoró las **barreras dinámicas**.
*   **Lo reprochable:** En Medellín, el espacio público está bloqueado por ventas ambulantes, vallas de la policía y obras. Tu simulación asume que el andén es liso y perfecto. El "Punto de Colapso" a los 500k agentes es una estimación optimista e irreal.
*   **Exigencia Doctoral:** Integrar una capa de **"Fricción de Informalidad"** basada en los conteos de campo que asigne un costo de paso infinito a zonas de bloqueo real. Sin esto, el "Tipping Point" es un dato de laboratorio inútil para la política pública.

## 4. Ausencia de Cuantificación de la Incertidumbre (UQ)
**Crítica:** Presentamos resultados como verdades absolutas (ej. "Entropía de 4.52").
*   **Lo reprochable:** No hay barras de error. Una simulación estocástica Top LVL debe correrse con múltiples semillas y presentar intervalos de confianza del 95%. Si corres la simulación 100 veces, ¿qué tan variable es el resultado?
*   **Exigencia Doctoral:** Realizar una Simulación de Monte Carlo real (100+ iteraciones del ciclo completo) y reportar la varianza. El hardware te sobra para esto; no hacerlo es negligencia.

## 5. La Tesis como "Folleto Tecnológico"
**Crítica:** El documento principal abusa de términos como "HPC", "GPU" y "4K" para ocultar la falta de una conclusión social profunda.
*   **Lo reprochable:** ¿Y qué si el centro colapsa a los 500k? ¿Qué significa esto para el vendedor de minutos o para la mujer que transborda con un niño? La tesis se ha vuelto tecnocrática.
*   **Exigencia Doctoral:** Volver a los archivos `01-fundamentos` y conectar los datos de "Turbulencia" con la **"Angustia Espacial"**. Debemos humanizar el dato tensorial.

## Conclusión de la Auditoría II
Estamos en riesgo de producir una **"Investigación Ornamental"**: visualmente deslumbrante, computacionalmente pesada, pero científicamente "ciega" a las dinámicas microscópicas de Medellín. 

### Acciones Correctivas Obligatorias:
1.  **Monte Carlo Multi-Seed:** Correr 50 iteraciones de cada escenario para generar bandas de incertidumbre.
2.  **Capa de Fricción Real:** Inyectar los datos de "vendedores ambulantes" y "obstáculos" en el costo de las aristas.
3.  **Puente Heideggeriano:** Re-escribir la conclusión para que el "Stress Test" sea leído como la **"Tecnificación de la Inhospitabilidad"**.
