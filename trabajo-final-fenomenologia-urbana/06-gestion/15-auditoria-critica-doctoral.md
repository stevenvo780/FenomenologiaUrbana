# Reporte de Auditoría Crítica Doctoral: Fenomenología Urbana Computacional
**Estado:** Crítico / Reprochable en puntos clave
**Auditor:** Gemini CLI (Simulación de Peritaje Académico)

## 1. El Problema de la "Caja de Cristal" (Geometría Abstracta)
**Crítica:** Aunque las simulaciones (SFM, Isovistas, PDE) corren en GPU con miles de agentes, se están ejecutando sobre una **cuadrícula abstracta (512x512 / 1024x1024)**. 
*   **Lo reprochable:** Las manzanas de Medellín no son cuadrados perfectos. Usar `obstacles[200:400, 100:300] = 1.0` en el script de isovistas es un procedimiento de "juguete".
*   **Exigencia Doctoral:** Se requiere la integración de la geometría real de OpenStreetMap (OSMnx) o capas Shapefile de la Alcaldía. Si la isovista no choca contra la fachada real del Palacio Nacional, el dato de "Exposición Fenomenológica" es ficticio.

## 2. Reduccionismo Positivista vs. Fenomenología
**Crítica:** Estamos reduciendo el "Cuerpo Vivido" (*Leib*) a un tensor de posición y velocidad.
*   **Lo reprochable:** Un tribunal de filosofía destrozará el argumento de que una red neuronal DQN "aprende fenomenología". La fenomenología trata sobre la *donación de sentido*, no sobre la optimización de una función de recompensa escalar.
*   **Exigencia Doctoral:** El documento `01-marco-filosofico.md` debe defender epistemológicamente cómo el "Costo Compuesto" (ruido + riesgo + prisa) constituye una estructura noemática válida. Falta un puente teórico entre la "fuerza social" de Helbing y el "ser-en-el-mundo" de Heidegger.

## 3. Calibración de "Punto Único" (Falacia de Validación)
**Crítica:** El script de calibración Bayesiana se dio por satisfecho al alcanzar el número mágico de 100,000 pasajeros en San Antonio.
*   **Lo reprochable:** Validar un sistema complejo contra un solo número escalar es amateur. La validación real debe ser **espacial**. ¿La densidad simulada en la esquina de Junín con Ayacucho coincide con los conteos del Observatorio? Si el total es 100k pero la distribución interna es errónea, el modelo es inválido.
*   **Exigencia Doctoral:** Generar un mapa de error residual (RMSE espacial) que compare los puntos de calor simulados contra los aforos específicos por intersección.

## 4. Ingesta Superficial de Big Data
**Crítica:** Tenemos archivos de 57MB (DANE/MEData) y 18MB (SIATA), pero los scripts actuales solo extraen promedios anuales o constantes.
*   **Lo reprochable:** Usar un promedio de PM2.5 para todo el corredor ignora el poder de tu hardware. Deberíamos estar mapeando la dispersión calle por calle, considerando la dirección del viento real y los "cañones urbanos".
*   **Exigencia Doctoral:** El PDE Solver debe usar como condiciones de contorno la morfología real del centro y no una máscara circular genérica.

## 5. Falta de "Peer-Review" y Benchmarking
**Crítica:** La tesis se alaba a sí misma por usar GPU, pero no se compara con modelos establecidos (como MATSim, SUMO o Anylogic).
*   **Lo reprochable:** ¿Por qué nuestro modelo MARL es mejor o más "fenomenológico" que una simulación de transporte estándar?
*   **Exigencia Doctoral:** Declarar formalmente las limitaciones del modelo y realizar un análisis de sensibilidad: ¿Qué pasa si el riesgo percibido aumenta un 10%? ¿Cómo colapsa la entropía del sistema?

## Conclusión de la Auditoría
El proyecto es **tecnológicamente impresionante pero metodológicamente frágil**. Estamos "haciendo gala de herramientas" sin la precisión quirúrgica que exige el objeto de estudio (Medellín). Si no integramos la **geometría real** y la **validación espacial granular**, la investigación corre el riesgo de ser vista como una "demo técnica" y no como una tesis doctoral.

### Próximos pasos correctivos sugeridos:
1.  Sustituir obstáculos manuales por geometrías GeoJSON reales del centro.
2.  Pasar de una validación de "flujo total" a una validación de "distribución espacial".
3.  Vincular las salidas del PDE Solver con las decisiones de los agentes (retroalimentación real aire-decisión).
