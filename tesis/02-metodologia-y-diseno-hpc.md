# Capítulo 2. Metodología y diseño computacional

## 2.1. Enfoque metodológico general

El diseño metodológico combina revisión filosófica, datos públicos, modelación computacional, visualización y una agenda explícita de validación de campo. La simulación no se presenta como reemplazo de la observación urbana ni como instrumento neutral de optimización. Su función es construir escenarios comparables para analizar cómo se articulan densidad peatonal, riesgo percibido, ruido, contaminación, iluminación, accesibilidad, atracción comercial y restricciones de trayectoria.

La investigación se encuentra en fase `baseline_proxy`. Esto significa que existe un pipeline funcional, datos públicos descargados, modelos derivados, simulaciones y salidas visuales; pero todavía no existe una jornada de campo suficiente para recalibrar el modelo. Esta distinción es metodológicamente central: todo resultado debe leerse como exploratorio hasta que `field_calibration_delta.json` deje de estar en `pending_no_capture`.

El método se organiza en cinco momentos:

1. **Construcción del caso:** delimitación del corredor y selección de nodos, aristas, perfiles y escenarios horarios.
2. **Ingesta y derivación de datos:** descarga de fuentes públicas, normalización y generación de indicadores urbanos.
3. **Modelación:** construcción del grafo, agentes, campos ambientales, escenarios y métricas de trayectoria.
4. **Análisis:** cálculo de incertidumbre, estrés, entropía, desigualdad relativa y patrones de concentración.
5. **Validación pendiente:** diseño de captura de campo para recalibrar conteos, permanencia, percepción y condiciones ambientales.

## 2.2. Delimitación espacial y unidades de análisis

El caso se concentra en el corredor San Antonio–Junín–Parque Berrío–Plaza Botero, entendido como un eje de centralidad peatonal y transporte. El modelo actual contiene nueve nodos operativos:

1. `san_antonio_metro`
2. `parque_san_antonio`
3. `palacio_nacional`
4. `junin_paseo`
5. `oriental_cruce`
6. `parque_berrio`
7. `carabobo_cultural`
8. `plaza_botero`
9. `museo_antioquia`

Estos nodos no agotan la complejidad del centro; son una discretización mínima para ensayar el modelo. Las aristas representan relaciones de desplazamiento y fricción entre nodos. Los perfiles simulados son: transeúnte rápido, comprador, turista cultural, vendedor ambulante y persona con movilidad reducida. Los escenarios horarios son: pico mañana, franja media, pico tarde y noche.

## 2.3. Fuentes de datos, trazabilidad y estado de captura

El pipeline integra fuentes públicas descargadas y transformadas: MEData, SIATA/AMVA, DANE, Medellín Cómo Vamos, Metro de Medellín y geometría base de OpenStreetMap/Overpass (Alcaldía de Medellín, s. f.; Área Metropolitana del Valle de Aburrá, s. f.; Departamento Administrativo Nacional de Estadística, 2018; Haklay & Weber, 2008; Medellín Cómo Vamos & Invamer, 2024; Metro de Medellín, s. f.; OpenStreetMap contributors, 2026).

El archivo `source_status.json` reporta 19 fuentes intentadas, 15 descargadas y 4 fallidas. Las fallas registradas incluyen páginas de MEData con tiempo de espera y acceso 403 al geovisor DANE. Esta información no debe ocultarse: forma parte de la trazabilidad de la investigación y permite diferenciar datos efectivamente incorporados de datos no disponibles.

La evidencia pública actualmente integrada incluye, entre otros elementos:

- percepción ciudadana del centro: imagen favorable de 53.3% e imagen desfavorable de 44.5% según Medellín Cómo Vamos;
- asociaciones dominantes: comercio, inseguridad, informalidad, congestión y habitantes de calle;
- criminalidad agregada de comuna 10 con última fecha disponible en 2023-11;
- indicadores barriales de La Candelaria: densidad empresarial alta, bajo espacio público efectivo por habitante y fuerte concentración de suelo múltiple;
- datos ambientales SIATA/AMVA para PM2.5, PM10 y ruido, con limitaciones de georreferenciación y actualidad;
- geometría urbana aproximada desde OpenStreetMap/Overpass.

La captura que todavía falta es de otro tipo: conteo peatonal fino, permanencia, flujo direccional, ruido puntual, iluminación, obstáculos temporales y percepción de seguridad por subtramo. Esos datos no pueden inventarse desde el computador.

## 2.4. Operacionalización de variables

La traducción entre teoría y modelo requiere declarar variables, unidades y límites. La tabla siguiente resume la operacionalización actual:

| Dimensión | Variable operativa | Fuente actual | Estado | Límite principal |
| --- | --- | --- | --- | --- |
| Flujo peatonal | densidad/crowding | simulación + proxies | `baseline_proxy` | falta conteo por nodo y franja |
| Permanencia | `base_dwell` | supuestos del modelo | `pending_field` | falta muestreo con cronómetro |
| Riesgo/percepción | seguridad percibida | proxies + EPC agregada | `baseline_proxy` | falta encuesta situada |
| Ambiente | PM2.5/PM10 | SIATA/AMVA | parcial | desfase temporal y escala estación-corredor |
| Ruido | campo acústico | SIATA + PDE | parcial | falta medición puntual georreferenciada |
| Iluminación | lux nocturno | no capturado | `pending_field` | falta medición por nodo |
| Accesibilidad | nodos/aristas | grafo del caso | funcional | requiere validación de obstáculos reales |
| Libertad de ruta | entropía/divergencia | simulación | exploratorio | depende de supuestos de agentes |

Esta tabla cumple una función de control: impide presentar todas las variables con el mismo grado de evidencia.

## 2.5. Modelo M-MASS y arquitectura de capas

La combinación de agentes, dinámica peatonal, redes y ciudad computacional se apoya en literatura de modelos basados en agentes, ciencia urbana y dinámica social de peatones (Batty, 2013; Bonabeau, 2002; Epstein, 2006; Helbing & Molnár, 1995). Estas referencias orientan la arquitectura del prototipo, pero no eliminan la necesidad de validación situada.

El modelo se organiza según tres planos de la *symploké*:

- **$M_1$ material:** campos ambientales, densidad, ruido, PM2.5, visibilidad, geometría y obstáculos.
- **$M_2$ decisional/fenomenológico:** perfiles de agentes, preferencias, costos, recompensa, riesgo, tiempo y exposición.
- **$M_3$ normativo/socioespacial:** reglas implícitas, vigilancia, infraestructura, comercio, centralidad, informalidad y diseño urbano.

La integración de estas capas no busca afirmar que la ciudad sea un sistema cerrado. Al contrario, permite mostrar qué variables fueron incluidas, cuáles quedaron por fuera y qué supuestos gobiernan cada resultado.

## 2.6. Campos ambientales y PDE ($M_1$)

Para representar la materialidad ambiental se implementó un solucionador vectorizado de ecuaciones diferenciales parciales sobre mallas de alta resolución. En los experimentos ambientales se usó una cuadrícula 4K (4096x4096), equivalente a 16.7 millones de celdas. Esta escala computacional debe leerse como capacidad analítica del prototipo, no como garantía de exactitud empírica.

La distribución espacio-temporal del material particulado y de la presión acústica se aproxima mediante una ecuación de reacción-difusión:

$$ \frac{\partial u(x,t)}{\partial t} = D \nabla^2 u(x,t) - \kappa u(x,t) + S(x,t) $$

Donde $u(x,t)$ representa la concentración aproximada del estresor, $D$ el parámetro de difusión, $\kappa$ la tasa de decaimiento y $S(x,t)$ la distribución de fuentes emisoras. En el marco de los sistemas emergentes (Johnson, 2001), estos campos se interpretan como señales estigmérgicas negativas: condiciones ambientales que modifican la probabilidad de elegir una ruta sin necesidad de imponer una orden centralizada.

La salida `hpc_environmental_report.json` muestra valores pico muy altos para ruido y PM2.5. Esos valores deben tratarse como unidades internas del modelo o indicadores relativos de intensidad, no como mediciones ambientales listas para comparación normativa. Antes de cualquier afirmación sanitaria o regulatoria se requiere calibración con mediciones reales.

## 2.7. Agentes, perfiles y aprendizaje por refuerzo ($M_2$)

El transeúnte urbano se formaliza como un agente con información limitada, preferencias ponderadas y costos de desplazamiento. Para estimar políticas de navegación se entrenaron agentes mediante aprendizaje por refuerzo profundo (DRL), apoyado en la ecuación de Bellman (Bellman, 1957; Sutton & Barto, 2018):

$$ Q^*(s, a) = \mathbb{E} \left[ R(s, a) + \gamma \max_{a'} Q^*(s', a') \right] $$

La función de recompensa $R(s,a)$ codifica costos de tiempo, riesgo y exposición ambiental. La arquitectura `UrbanPhenomenologyDQN` incorpora capas densas, normalización y regularización (*LayerNorm* y *Dropout*) siguiendo prácticas comunes en redes profundas (Mnih et al., 2015). Técnicamente, estas capas estabilizan el entrenamiento y reducen sobreajuste; interpretativamente, permiten discutir la noción de filtrado perceptivo sin afirmar que reproduzcan la conciencia ni los *qualia* de los transeúntes.

Los perfiles no representan identidades completas. Son tipos analíticos para comparar sensibilidad a costos. Esta precaución es importante: una persona con movilidad reducida, un vendedor o un turista no se reducen a pesos en una función de recompensa. El modelo solo evalúa cómo ciertos supuestos modifican trayectorias.

## 2.8. Condiciones normativas y lectura crítica ($M_3$)

La integración de $M_1$ y $M_2$ se interpreta en el plano $M_3$: reglas, vigilancia, infraestructura, comercio, informalidad y hábitos de tránsito. La expresión “Panóptico de Flujo” se usa con cautela: no designa una entidad empírica cerrada, sino una lente inspirada en Foucault para describir cómo ciertas condiciones orientan el movimiento sin prohibirlo de forma explícita.

Esta capa es la más difícil de formalizar porque incluye poder, expectativa, vigilancia, costumbre y desigualdad. Por eso el modelo actual solo la aproxima mediante variables de control, riesgo, atracción y conectividad. La observación cualitativa de campo deberá corregir esa simplificación.

## 2.9. Métricas de análisis

Las métricas principales son:

- **Velocidad media:** indicador de fluidez simulada, no equivalente directo a comodidad.
- **Entropía de trayectorias:** medida de dispersión del repertorio de rutas; valores mayores sugieren mayor diversidad o desorden según contexto.
- **Divergencia de Kullback-Leibler:** diferencia entre una distribución de referencia y una distribución bajo fricción (Kullback & Leibler, 1951).
- **Gini de entropía:** desigualdad relativa entre perfiles respecto a diversidad de ruta.
- **Índice de presión:** relación entre cantidad de agentes y superficie de simulación.
- **Intervalos de confianza Monte Carlo:** estabilidad de resultados bajo repeticiones con variación aleatoria.

La divergencia KL se define como:

$$ D_{KL}(P \parallel Q) = \sum_{x \in \mathcal{X}} P(x) \log \left( \frac{P(x)}{Q(x)} \right) $$

Estas métricas no deben confundirse con juicios normativos automáticos. Un valor alto puede indicar restricción, diversidad, ruido o mala especificación, según el diseño del experimento. La interpretación exige contraste con observación y teoría.

## 2.10. Reproducibilidad computacional

La reproducibilidad se apoya en tres elementos ya presentes en el repositorio:

- scripts de ingesta, derivación, modelado, simulación, análisis y publicación visual;
- archivos JSON de salida en `investigacion/outputs/`;
- documentación metodológica en `investigacion/docs/` y plantillas de campo.

Sin embargo, una tesis evaluable debe documentar todavía con más precisión:

- versiones de Python, PyTorch, NumPy y dependencias geoespaciales;
- disponibilidad o no de GPU/CUDA;
- semillas aleatorias usadas en simulaciones;
- tiempos aproximados de ejecución;
- parámetros sensibles: número de agentes, pasos, tamaño de malla, tasas de difusión, recompensas, pesos de riesgo y ruido;
- modo reducido para reproducir resultados en CPU.

Estos elementos pueden resolverse en el computador antes del trabajo de campo y deberían quedar como anexo técnico. Sin esa documentación, el pipeline puede funcionar, pero no ser suficientemente auditable por terceros.

## 2.11. Validación, sensibilidad y falsabilidad

El modelo debe someterse a tres tipos de prueba:

1. **Validación interna:** comprobar que los scripts producen salidas consistentes, que las métricas se calculan correctamente y que no hay errores de pipeline.
2. **Sensibilidad:** variar parámetros clave para observar cuánto cambian velocidad, entropía, concentración de rutas y desigualdad entre perfiles.
3. **Validación empírica:** comparar salidas con conteos, permanencias, mediciones y encuestas de campo.

La validación interna y parte de la sensibilidad pueden hacerse ya en PC. La validación empírica no. Por tanto, el modelo debe ser falsable: si los conteos reales muestran flujos distintos, si la percepción de seguridad contradice los proxies o si el ruido puntual no corresponde a los campos simulados, el modelo debe recalibrarse.

Esta validación no debe entenderse como simple confirmación numérica. En términos epistemológicos, la fase de campo debe producir conocimiento situado: cada conteo, medición o encuesta depende de hora, posición, instrumento, observador y protocolo. Esta cautela sigue la advertencia de Haraway (1995): no existe una mirada neutral “desde ninguna parte”; hay perspectivas parciales que deben declararse para ser discutibles.

## 2.12. Consideraciones éticas

Aunque la fase actual usa datos públicos y simulación, la agenda de campo introduce obligaciones éticas. Las encuestas de seguridad percibida y observaciones de permanencia deben evitar recoger datos personales identificables. Las fotografías, si se usan, deben centrarse en obstáculos, condiciones espaciales o flujos agregados, no en exposición de individuos vulnerables. Cualquier mención a habitantes de calle, informalidad o inseguridad debe tratarse como categoría urbana agregada, no como estigma de grupos.

El protocolo de campo debe incluir:

- consentimiento verbal o escrito para encuestas breves;
- anonimización de observadores y participantes;
- no registro de rostros identificables sin autorización;
- almacenamiento seguro de archivos;
- uso académico limitado de los datos;
- posibilidad de no responder sin consecuencia alguna.

## 2.13. Diagrama del método

```mermaid
graph TD
    A[Fuentes públicas] --> B[Ingesta y normalización]
    B --> C[Modelo de caso: nodos, aristas, perfiles]
    C --> D[M1 Campos ambientales]
    C --> E[M2 Agentes y DRL]
    C --> F[M3 Condiciones normativas]
    D --> G[Simulación y métricas]
    E --> G
    F --> G
    G --> H[Resultados baseline_proxy]
    H --> I{Validación de campo}
    I -->|pendiente| J[pending_no_capture]
    I -->|futuro| K[Modelo recalibrado]
```

## 2.14. Balance metodológico

El método es suficientemente robusto para una fase exploratoria: integra fuentes públicas, variables urbanas, simulación y lectura filosófica. Pero todavía no es suficiente para una afirmación empírica fuerte sobre el corredor. La fortaleza del trabajo está en declarar esta diferencia y convertirla en plan: primero baseline trazable, luego campo, después recalibración y discusión final.
