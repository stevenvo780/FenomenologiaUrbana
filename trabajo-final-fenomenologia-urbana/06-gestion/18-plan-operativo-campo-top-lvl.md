# Protocolo de Captura de Datos de Campo: Operación "Junín Real-Time"
**Objetivo:** Validar y recalibrar el motor HPC (SFM, PDE e Isovistas) mediante datos primarios de alta resolución.
**Equipo:** 2 Personas (P1: Sensor de Flujo / P2: Sensor Atmosférico y Social).
**Equipo Técnico:** 2 Smartphones (4K/60fps), 2 Trípodes, Micrófonos direccionales (opcional), Apps de sensado ambiental.

## 1. Misión P1: El Observador Técnico (Validación de Flujos y Morfología)
Su tarea es capturar la "verdad de red" para alimentar los algoritmos de YOLO (detección de objetos) y SFM.

### A. Estaciones de Conteo (Detección de Tipping Points)
*   **Ubicación:** 3 puntos clave (San Antonio, Junín con Colombia, Parque Berrío).
*   **Acción:** Montar trípode en un punto elevado (si es posible) o en un borde de andén.
*   **Captura:** Video 4K de 10 minutos por punto en Hora Pico (5 PM) y Hora Valle (10 AM).
*   **Dato buscado:** Densidad real de cuerpos/m² y velocidad media de flujo. Estos videos se procesarán en tu PC para extraer trayectorias reales y compararlas con la simulación de 100k agentes.

### B. Escaneo de Obstáculos (Morfología del Caos)
*   **Acción:** Recorrido caminando a ritmo constante por todo el corredor (San Antonio -> Plaza Botero).
*   **Captura:** Video estabilizado o fotos 360°.
*   **Dato buscado:** Identificar y marcar la ubicación exacta de ventas ambulantes, vallas y obras. Esto reemplazará el "ruido aleatorio" del script de Caos por **obstáculos reales**.

## 2. Misión P2: El Analista Atmosférico (Validación de PDE y Fenomenología)
Su tarea es capturar la "tonalidad afectiva" y los campos ambientales.

### A. Perfilado de Ruido (Validación de PDE Acústica)
*   **Acción:** Grabación de audio ambiente de alta fidelidad (1 minuto) en 5 nodos.
*   **Dato buscado:** Usaremos tu hardware para generar **Espectrogramas de Frecuencia**. Queremos ver si los picos de decibelios reales coinciden con el modelo de dispersión PDE.

### B. Entrevistas Fenomenológicas "Flash"
No buscaremos encuestas estadísticas largas, sino **"Captura de Noemas"**.
*   **Muestra:** 5 personas por nodo (total 25).
*   **Preguntas Clave (Blindaje Doctoral):**
    1.  *¿Siente que este espacio lo obliga a caminar rápido o le permite quedarse?* (Valida la "Compulsión de Red").
    2.  *¿Qué es lo más ruidoso que escucha ahora mismo?* (Valida la PDE).
    3.  *¿Se siente observado o protegido en este punto?* (Valida las Isovistas/Panóptico).
    4.  *¿Cuál es el obstáculo más molesto que ha encontrado hoy?* (Valida la Fricción de Informalidad).

## 3. Matriz de Validación de Hipótesis (Hardware vs Realidad)

| Hipótesis Computacional | Método de Validación en Campo | Instrumento |
| --- | --- | --- |
| **Colapso a los 500k** | Medición de velocidad vs densidad en nudos críticos. | Video 4K + CV |
| **Isovistas / Panóptico** | Pregunta sobre "sentirse observado" en puntos de alta exposición. | Entrevista Flash |
| **Dispersión de Ruido** | Comparación de espectrogramas reales vs mapa de calor PDE. | Audio HQ + FFT |
| **Fricción de Informalidad** | Mapeo de densidad de puestos de venta por metro lineal. | Fotogrametría |

## 4. Pipeline Post-Campo (Uso de Supercómputo)
Al regresar a la PC, ejecutaremos:
1.  **Object Detection (YOLOv8):** Para contar personas automáticamente en los videos 4K.
2.  **Sentiment Analysis (NLP):** Procesar las entrevistas para inyectar "tonalidad afectiva" en el documento principal.
3.  **Bayesian Re-Calibration:** Ajustar los pesos de la simulación con los errores encontrados (RMSE).

---
**Nota de Seguridad:** Operar en el centro de Medellín requiere discreción con los equipos. Se recomienda usar smartphones con correas de seguridad y trípodes ligeros.
