# Capítulo 4. Conclusiones, limitaciones y referencias

**Autores:** Steven Vallejo · Jacob Agudelo
**Repositorio público:** <https://github.com/stevenvo780/FenomenologiaUrbana>

## 4.1. Tesis y alcance

La fenomenología urbana, entendida como descripción cultivada de la experiencia situada, **no es suficiente para abordar la ciudad**. Esta tesis lo demuestra empíricamente: dos observadores entrenados (Stev y Jacob) recorriendo los mismos cuatro nodos del corredor Junín–San Antonio producen lecturas divergentes con kappa inter-rater = 0.0 (n=4 nodos compartidos). El caso paradigmático `parque_san_antonio` (Stev = 4 alto / Jacob = 2 bajo) no es ruido de medición: es el límite intrínseco de la primera persona como instancia única de validación. La fenomenología pura, por sí sola, **no falsa nada**.

La tesis sostenida aquí es que la fenomenología urbana se vuelve **operativa** únicamente al triangularse con instrumentos heterogéneos: criminalidad horaria (C1, MEData), seguridad percibida agregada (C2, encuesta), habitabilidad declarada en entrevistas codificadas (C3) y saturación material en video POV procesado por HPC dual-GPU con M-MASS multicapa (C4), bajo una regla falsable 3-de-4 sobre 36 celdas (9 nodos × 4 franjas). El resultado del baseline auditado al 2026-05-08 lo confirma: **2 pilares se sostienen** bajo bootstrap, barrido de umbrales y leave-one-out (`junin_paseo|peak_am`, `plaza_botero|midday`); **4 celdas en fricción son frágiles** y dependen del corte p75; **30 quedan inconcluyentes** por cobertura insuficiente; **0/36 alcanzan colapso confirmado** porque C2 sigue vacío. Eso no es fracaso: es ciencia urbana operando, una regla que no se autoconfirma y discrimina lo defendible de lo frágil.

## 4.2. Respuestas a las preguntas de investigación

**P1 — Articulación teórica.** La fenomenología (Husserl, 1936/1991; Merleau-Ponty, 1945/1993) sostiene la primacía del cuerpo y del *Lebenswelt*, pero la ciudad excede a un sujeto. La tradición crítica (Lefebvre, 1968/2017; Harvey, 2008; Sassen, 2014) sitúa esa experiencia en condiciones materiales y políticas. La actualización contemporánea (Kinkaid, 2020) re-encuentra a Lefebvre como fenomenología crítica del espacio social; los estudios sobre regulación de las geografías de la memoria en Medellín (Velásquez Ocampo & Tamayo Arboleda, 2025) muestran que esa articulación es viable hoy. El kappa = 0.0 entre Stev y Jacob confirma que ningún observador agota la atmósfera: la triangulación no es ornamento, es necesidad metodológica.

**P2 — Operacionalización.** Las cuatro condiciones C1–C4 son suficientes para un baseline falsable y trazable, no para una validación cerrada. C1 cubre 36/36 celdas (proyección horaria con `c1_high_by_window` precomputado, p75 por franja sobre serie histórica MEData); C4 cubre 4/36 con saturación derivada de pipeline dual-GPU (YOLOv8 + DeepSort + segmentación) y métricas POV (`vehicle_intensity`, `human_density`, `saturation_max`); C3 cubre 15 entrevistas codificadas Stev+Jacob; **C2 cubre 0/36**. Mientras C2 = ∅, la regla 3-de-4 opera de facto como 3-de-3 con C2 = False, y todo "no colapso" es condicional. El reporte lo declara explícitamente; no se oculta tras prosa.

**P3 — Análisis empírico.** Las simulaciones M-MASS multicapa muestran estabilidad numérica, aumento monótono de entropía bajo presión y diferenciación entre perfiles. Cruzadas con la matriz auditada, sostienen una lectura nítida: el corredor concentra fricción material matinal en `junin_paseo|peak_am` (C4 p75 = 0.465, max = 0.474, n = 4; p75 global = 0.413; bootstrap V1 share = 0.956, barrido V2 share = 0.880, leave-one-out = 1.000) y fricción meridiana robusta en `plaza_botero|midday` (V1 = 0.970, V2 = 1.000, LOO = 1.000). Las otras cuatro celdas en fricción presentan V2 share ≤ 0.40 y son artefactos del corte p75: se reportan como frágiles, no como hallazgo.

**P4 — Validación cruzada.** La cross-validación texto↔imagen converge cuantitativamente con la narración POV en dos reclamos: riesgo vial en `san_antonio_metro|peak_am` (`vehicle_intensity = 0.378`, máximo del corpus) y "sofocación" en Botero/Berrio meridiano (`human_density_max = 30`, `saturation_max = 71`, máximos del corpus). La triangulación discrimina; la subjetividad queda anclada en agregados independientes. Estudios recientes sobre estrés peatonal (Rodriguez-Valencia et al., 2022), accesibilidad de aceras en plazas latinoamericanas (Garcia et al., 2024) y mortalidad vial SALURBAL (Quistberg et al., 2022) son consistentes con esta lectura.

**P5 — Definición de colapso.** El colapso fenomenológico se opera como convergencia de ≥3 de 4 condiciones (C1 > p75 por franja; C2 ≤ 2/5; C3 negativa; C4 > p75 global) en una misma celda. La matriz al 2026-05-08 reporta **0/36 colapsos confirmados**, **6/36 en `friccion_acumulada`** (2 robustas + 4 frágiles) y **30/36 inconcluyentes**. Que la matriz hoy no produzca colapsos es la prueba de que la categoría es **falsable**: si tras cerrar C2 sobre `junin_paseo|peak_am` y `plaza_botero|midday` la regla siguiera dando 0/36, sería evidencia sustantiva contra la hipótesis de colapso; si diera ≥3/4, sería evidencia a favor. La regla no se autoconfirma.

## 4.3. Aportes defendibles

1. **Marco teórico** que articula fenomenología clásica (Husserl, Merleau-Ponty), crítica urbana (Lefebvre, Harvey, Sassen, Foucault, Deleuze, Simmel) y triangulación contemporánea (Kinkaid, 2020; Velásquez Ocampo & Tamayo Arboleda, 2025), con la subjetividad fenomenológica reconocida como dato positivo, no como ruido.
2. **Pipeline HPC reproducible**: arquitectura M-MASS multicapa, ejecución dual-GPU sobre video POV, 9 scripts versionados (`build_collapse_matrix.py`, `inspect_matrix.py`, `bootstrap_v1.py`, `threshold_sweep_v2.py`, `loo_v3.py`, ingesta C1/C3/C4 y cross-validation texto-imagen), JSON auditables y trazabilidad celda por celda.
3. **Regla 3-de-4 falsable**, validada por bootstrap (1000 iteraciones V1), barrido de umbrales p70–p90 (25 escenarios V2) y leave-one-out sobre las 15 entrevistas C3 (V3). La regla discrimina robustez de fragilidad y no se autoconfirma.
4. **Dos pilares empíricamente defendibles**: `junin_paseo|peak_am` (V1 = 0.956, V2 = 0.880, LOO = 1.000) y `plaza_botero|midday` (V1 = 0.970, V2 = 1.000, LOO = 1.000) como franjas-nodo de fricción acumulada robusta bajo deformaciones de la operacionalización.
5. **Metodología inter-rater explícita** con kappa = 0.0 publicado (Stev vs Jacob, n = 4, dos observadores entrenados sobre nodos compartidos). La divergencia se reporta como evidencia de subjetividad ineliminable que justifica la triangulación, no como debilidad oculta.
6. **Validación cruzada texto↔imagen**: convergencia cuantitativa entre narrativa POV y agregados YOLO/segmentación en `vehicle_intensity` y `human_density` para los dos pilares y para `san_antonio_metro|peak_am`.
7. **Refinamiento geométrico y declaración explícita de limitaciones de muestreo**: malla ambiental tratada como campo relativo, sub-zonas declaradas, cobertura por celda reportada, y `inconcluyente` distinguido de "ausencia de fenómeno".

## 4.4. Limitaciones honestas

| Limitación | Implicación |
| --- | --- |
| **C2 ausente (0/36 celdas)** | la regla 3-de-4 opera como 3-de-3; el resultado "0/36 colapsos" es condicional y sesga decisiones hacia fricción antes que hacia colapso confirmado |
| **Sub-zonas Coltejer-Ayacucho y "calle del consumo" no muestreadas sistemáticamente** | gradiente intra-nodo invisible al baseline; el caso Andrés (2026-05-05) opera como signo aislado, no como cobertura |
| **OCR sesgado a signage comercial diurno** | sub-representación de grafiti, marcas nocturnas, micro-territorios, vandalismo, indigencia, consumo y presencia policial; dominios no falsables por imagen al estado actual |
| **Audio de celular saturado por firma reggaetón en Junín** | clasificador acústico no aplicado; ritmos temporales (cierre informal 6 pm) registrados solo como notas atmosféricas, no como quinta dimensión cuantitativa |
| **Kappa = 0.0 entre observadores entrenados** | evidencia de subjetividad fenomenológica ineliminable; obliga al desempate por C1+C4 y limita C3 como fuente de validación cerrada |
| **Baseline_proxy en simulación M-MASS** | parámetros no calibrados con mediciones absolutas; los resultados se leen como campo relativo entre escenarios, no como magnitudes empíricas del corredor |

## 4.5. Implicaciones filosóficas

La fenomenología clásica acertó sobre la primacía de la experiencia: el espacio se comprende desde el cuerpo, los hábitos, las pausas, las orientaciones (Merleau-Ponty, 1945/1993; Husserl, 1936/1991). Pero el corredor Junín–San Antonio excede a cualquier sujeto único, como el kappa = 0.0 entre Stev y Jacob lo testimonia con crudeza: dos descripciones cultivadas de los mismos nodos divergen sin posibilidad de jerarquización interna a la primera persona. La actualización metodológicamente honesta no es abandonar la fenomenología, sino **triangularla** con criminalidad, encuesta, codificación inter-rater y video procesado por HPC. Kinkaid (2020) lo formula como fenomenología crítica del espacio social: el *Lebenswelt* sigue siendo punto de partida, pero la validación migra al cruce de instrumentos. Esta tesis defiende esa actualización: la fenomenología es necesaria y no suficiente; la regla 3-de-4 es la forma operativa de esa insuficiencia.

## 4.6. Implicaciones políticas

Las seis celdas en `friccion_acumulada` —especialmente los dos pilares robustos `junin_paseo|peak_am` y `plaza_botero|midday`— sugieren, sin sobreafirmar, que la política pública del centro de Medellín debería distinguir **eficiencia funcional** (flujo, conectividad metro) de **costo fenomenológico** (saturación material, presión vial, restricción de pausa). Que `san_antonio_metro|peak_am` concentre el máximo de `vehicle_intensity` (0.378) coincide con la literatura SALURBAL sobre mortalidad vial latinoamericana (Quistberg et al., 2022) y con estudios de estrés peatonal (Rodriguez-Valencia et al., 2022) y caminabilidad (Arellana et al., 2020). Que `plaza_botero|midday` y `parque_berrio|midday` saturen `human_density` y `saturation_max` indica que la productividad simbólica del centro convive con costos sensoriales documentables. Cualquier intervención normativa debe pasar por el cierre de C2; mientras tanto, la lectura es: **fricción material localizada, no colapso confirmado**.

## 4.7. Agenda real

1. **Cerrar C2** mediante encuesta de seguridad percibida tabulada en `field_observations_aggregate.csv`, prioridad sobre los dos pilares (`junin_paseo|peak_am`, `plaza_botero|midday`); es el único bloqueo estructural restante de la regla 3-de-4.
2. **Ampliar muestreo** a sub-zonas Coltejer-Ayacucho y "calle del consumo" con conteos, fotos y entrevistas sistemáticas, para que el gradiente intra-nodo deje de operar como signo aislado.
3. **Consolidar C4** en franjas `peak_pm` y `night` con material POV adicional, y reasignar `parque_san_antonio` a un bucket visual para habilitar su cross-validación texto-imagen.
4. **Clasificación acústica** sobre el audio POV ya grabado para abrir una quinta dimensión sonora complementaria a C4.
5. **Doble codificación externa** de C3 para acotar el kappa inter-rater en una segunda iteración.

## 4.8. Cierre

Esta tesis no afirma que el corredor Junín–San Antonio colapse fenomenológicamente. Afirma algo más exigente y más útil: que la categoría de colapso fenomenológico es **operativamente falsable**, que dos pilares (`junin_paseo|peak_am`, `plaza_botero|midday`) sobreviven al bootstrap, al barrido de umbrales y al leave-one-out, que cuatro celdas adicionales son frágiles y se reportan como tales, y que treinta quedan inconcluyentes por cobertura insuficiente. La matriz, no la prosa, decide.

La fenomenología sola no basta —el kappa = 0.0 entre dos observadores cultivados lo demuestra sin apelación. La triangulación con HPC, simulación M-MASS multicapa, criminalidad horaria, codificación de entrevistas y saturación visual procesada por dual-GPU sí discrimina: separa robustez de fragilidad, defendible de inconcluyente, ciencia urbana de comentario. Que el aparato hoy reporte 0/36 colapsos confirmados no es debilidad: es la prueba más fuerte de que la regla no se autoconfirma. Cerrar C2 sobre los dos pilares —tarea delimitada y tractable— decidirá si la categoría se confirma, se refuta o se refina. Cualquiera de los tres resultados será resultado.

El procedimiento académicamente correcto es declarar lo que se sabe, lo que no se sabe y por qué. Esta tesis lo hace.

## 4.9. Referencias bibliográficas

### Fenomenología y filosofía

- Husserl, E. (1991). *La crisis de las ciencias europeas y la fenomenología trascendental* (J. Muñoz y S. Mas, Trads.). Crítica. (Obra original publicada en 1936).
- Merleau-Ponty, M. (1993). *Fenomenología de la percepción* (J. Cabanes, Trad.). Planeta-Agostini. (Obra original publicada en 1945).
- Kinkaid, E. (2020). Re-encountering Lefebvre: Toward a critical phenomenology of social space. *Environment and Planning D: Society and Space, 38*(1), 167–186. https://doi.org/10.1177/0263775819854765

### Teoría crítica urbana

- Foucault, M. (2002). *Vigilar y castigar: nacimiento de la prisión* (A. Garzón del Camino, Trad.). Siglo XXI Editores. (Obra original publicada en 1975).
- Deleuze, G. (1990). Post-scriptum sobre las sociedades de control. *L'Autre Journal*, 1.
- Lefebvre, H. (2017). *El derecho a la ciudad*. Capitán Swing. (Obra original publicada en 1968).
- Harvey, D. (2008). The right to the city. *New Left Review, 53*, 23–40.
- Sassen, S. (2014). *Expulsions: Brutality and complexity in the global economy*. Harvard University Press.
- Simmel, G. (1986). *El individuo y la libertad. Ensayos de crítica de la cultura* (S. Masó, Trad.). Península. (Obra original publicada en 1903).
- Velásquez Ocampo, O., & Tamayo Arboleda, F. L. (2025). Estrategias de seguridad urbana en Medellín y regulación de las geografías de la memoria. *Novum Jus, 19*(3), 75–100. https://doi.org/10.14718/NovumJus.2025.19.3.3

### Estudios urbanos empíricos recientes (2020–2025)

- Arellana, J., Saltarín, M., Larrañaga, A. M., Alvarez, V., & Henao, C. A. (2020). Urban walkability considering pedestrians' perceptions of the built environment: A 10-year review and a case study in a medium-sized city in Latin America. *Transport Reviews, 40*(2), 183–203. https://doi.org/10.1080/01441647.2019.1703842
- Soto, J., Orozco-Fontalvo, M., & Useche, S. A. (2022). Public transportation and fear of crime at BRT systems: Approaching to the case of Barranquilla (Colombia) through integrated choice and latent variable models. *Transportation Research Part A: Policy and Practice, 155*, 142–160. https://doi.org/10.1016/j.tra.2021.11.001
- Rodriguez-Valencia, A., Ortiz-Ramirez, H. A., Simancas, W., & Vallejo-Borda, J. A. (2022). Level of pedestrian stress in urban streetscapes. *Transportation Research Record, 2676*(7), 622–636. https://doi.org/10.1177/03611981211072804
- Quistberg, D. A., Hessel, P., Rodriguez, D. A., Sarmiento, O. L., Bilal, U., Caiaffa, W. T., … Diez Roux, A. V. (2022). Urban landscape and street-design factors associated with road traffic mortality in Latin America between 2010 and 2016 (SALURBAL): An ecological study. *The Lancet Planetary Health, 6*(2), e122–e131. https://doi.org/10.1016/S2542-5196(21)00323-5
- Peden, M., Puvanachandra, P., Keller, M.-E., Rodrigues, E.-M., Quistberg, D. A., & Jagnoor, J. (2022). How the Covid-19 pandemic has drawn attention to the issue of active mobility and co-benefits in Latin American cities. *Salud Pública de México, 64*, S14–S21. https://doi.org/10.21149/12786
- Heroy, S., Loaiza, I., Pentland, A., & O'Clery, N. (2023). Are neighbourhood amenities associated with more walking and less driving? Yes, but predominantly for the wealthy. *Environment and Planning B: Urban Analytics and City Science, 50*(8), 2167–2186. https://doi.org/10.1177/23998083221141439
- Garcia, S., Quistberg, D. A., Rodríguez, D. A., & Sarmiento, O. L. (2024). Pedestrian accessibility analysis of sidewalk-specific networks: Insights from three Latin American central squares. *Sustainability, 16*(21), 9294. https://doi.org/10.3390/su16219294
- Medellín Cómo Vamos & Invamer. (2024). *Percepción ciudadana 2024: Medellín*. Medellín Cómo Vamos. https://www.medellincomovamos.org/

### Modelación, simulación y métodos computacionales

- Helbing, D., & Molnár, P. (1995). Social force model for pedestrian dynamics. *Physical Review E, 51*(5), 4282–4286. https://doi.org/10.1103/PhysRevE.51.4282
- Bonabeau, E. (2002). Agent-based modeling: Methods and techniques for simulating human systems. *Proceedings of the National Academy of Sciences, 99*(suppl. 3), 7280–7287. https://doi.org/10.1073/pnas.082080899
- Epstein, J. M. (2006). *Generative social science: Studies in agent-based computational modeling*. Princeton University Press.
- Batty, M. (2013). *The new science of cities*. MIT Press.
- Aguilar, J. (2014). *Sistemas Emergentes y Control Inteligente*. Universidad de Los Andes.
- Johnson, S. (2001). *Sistemas emergentes: O qué tienen en común hormigas, neuronas, ciudades y software*. Fondo de Cultura Económica.
- Shannon, C. E. (1948). A mathematical theory of communication. *The Bell System Technical Journal, 27*(3), 379–423; *27*(4), 623–656. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
- Kullback, S., & Leibler, R. A. (1951). On information and sufficiency. *The Annals of Mathematical Statistics, 22*(1), 79–86. https://doi.org/10.1214/aoms/1177729694
- Bellman, R. (1957). *Dynamic programming*. Princeton University Press.
- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement learning: An introduction* (2nd ed.). MIT Press.

### Fuentes de datos públicas

- Alcaldía de Medellín. (s. f.). *MEData: Datos Abiertos de Medellín*. https://medata.gov.co/
- Área Metropolitana del Valle de Aburrá. (s. f.). *Datos abiertos ambientales del Valle de Aburrá / SIATA*. https://datosabiertos.metropol.gov.co/
- Departamento Administrativo Nacional de Estadística. (2018). *Censo Nacional de Población y Vivienda 2018*. https://www.dane.gov.co/
- Metro de Medellín. (s. f.). *Challenge: Mobility in San Antonio B*. https://www.metrodemedellin.gov.co/en/challenge-mobility-in-san-antonio-b
- OpenStreetMap contributors. (2026). *OpenStreetMap*. https://www.openstreetmap.org/copyright
- Haklay, M., & Weber, P. (2008). OpenStreetMap: User-generated street maps. *IEEE Pervasive Computing, 7*(4), 12–18. https://doi.org/10.1109/MPRV.2008.80
