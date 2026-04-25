# Bibliografía académica consolidada

Este archivo separa la bibliografía formal de la bitácora de construcción del proyecto. Su función es facilitar revisión por jurados: muestra qué fuentes sostienen el marco filosófico, el caso urbano, los datos empíricos y los métodos computacionales.

## Criterio de uso

- **Marco filosófico:** fuentes usadas para fenomenología, materialismo, poder, ciudad y experiencia urbana.
- **Métodos computacionales:** fuentes usadas para aprendizaje por refuerzo, agentes, entropía, divergencia estadística y dinámica peatonal.
- **Fuentes empíricas:** instituciones y portales de donde provienen datos públicos del pipeline.
- **Pendiente:** cuando una fuente sea usada para una cifra puntual en el texto final, conviene citarla en el párrafo correspondiente y conservar el archivo descargado en `investigacion/data/raw/`.

## Marco filosófico y urbano

- Badiou, A. (1999). *El ser y el acontecimiento* (R. Cerdeiras, Trad.). Manantial. (Obra original publicada en 1988).
- Bueno, G. (1972). *Ensayos materialistas*. Taurus.
- Deleuze, G. (1990). Post-scriptum sobre las sociedades de control. *L'Autre Journal*, 1.
- Foucault, M. (2002). *Vigilar y castigar: nacimiento de la prisión* (A. Garzón del Camino, Trad.). Siglo XXI Editores. (Obra original publicada en 1975).
- Harvey, D. (2008). The right to the city. *New Left Review, 53*, 23–40.
- Husserl, E. (1991). *La crisis de las ciencias europeas y la fenomenología trascendental* (J. Muñoz y S. Mas, Trads.). Crítica. (Obra original publicada en 1936).
- Lefebvre, H. (2017). *El derecho a la ciudad*. Capitán Swing. (Obra original publicada en 1968).
- Merleau-Ponty, M. (1993). *Fenomenología de la percepción* (J. Cabanes, Trad.). Planeta-Agostini. (Obra original publicada en 1945).
- Sassen, S. (2014). *Expulsions: Brutality and complexity in the global economy*. Harvard University Press.
- Simmel, G. (1986). *El individuo y la libertad. Ensayos de crítica de la cultura* (S. Masó, Trad.). Península. (Obra original publicada en 1903).

## Sistemas complejos, agentes y ciudad computacional

- Aguilar, J. (2014). *Sistemas Emergentes y Control Inteligente*. Universidad de Los Andes.
- Batty, M. (2013). *The new science of cities*. MIT Press.
- Bonabeau, E. (2002). Agent-based modeling: Methods and techniques for simulating human systems. *Proceedings of the National Academy of Sciences, 99*(suppl. 3), 7280–7287. https://doi.org/10.1073/pnas.082080899
- Epstein, J. M. (2006). *Generative social science: Studies in agent-based computational modeling*. Princeton University Press.
- Helbing, D., & Molnár, P. (1995). Social force model for pedestrian dynamics. *Physical Review E, 51*(5), 4282–4286. https://doi.org/10.1103/PhysRevE.51.4282
- Johnson, S. (2001). *Emergence: The Connected Lives of Ants, Brains, Cities, and Software*. Scribner.

## Aprendizaje por refuerzo, información e incertidumbre

- Bellman, R. (1957). *Dynamic programming*. Princeton University Press.
- Kullback, S., & Leibler, R. A. (1951). On information and sufficiency. *The Annals of Mathematical Statistics, 22*(1), 79–86. https://doi.org/10.1214/aoms/1177729694
- Mnih, V., Kavukcuoglu, K., Silver, D., Rusu, A. A., Veness, J., Bellemare, M. G., Graves, A., Riedmiller, M., Fidjeland, A. K., Ostrovski, G., Petersen, S., Beattie, C., Sadik, A., Antonoglou, I., King, H., Kumaran, D., Wierstra, D., Legg, S., & Hassabis, D. (2015). Human-level control through deep reinforcement learning. *Nature, 518*, 529–533. https://doi.org/10.1038/nature14236
- Shannon, C. E. (1948). A mathematical theory of communication. *The Bell System Technical Journal, 27*(3), 379–423; *27*(4), 623–656. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement learning: An introduction* (2nd ed.). MIT Press.

## Datos públicos y fuentes institucionales

- Alcaldía de Medellín. (s. f.). *MEData: Datos Abiertos de Medellín*. https://medata.gov.co/
- Área Metropolitana del Valle de Aburrá. (s. f.). *Datos abiertos ambientales del Valle de Aburrá / SIATA*. https://datosabiertos.metropol.gov.co/
- Departamento Administrativo Nacional de Estadística. (2018). *Censo Nacional de Población y Vivienda 2018*. https://www.dane.gov.co/
- Medellín Cómo Vamos. (2025). *Encuesta de Percepción Ciudadana 2024: Informe metodológico*. https://www.medellincomovamos.org/
- Metro de Medellín. (s. f.). *Challenge: Mobility in San Antonio B*. https://www.metrodemedellin.gov.co/en/challenge-mobility-in-san-antonio-b
- OpenStreetMap contributors. (2026). *OpenStreetMap*. https://www.openstreetmap.org/copyright
- Haklay, M., & Weber, P. (2008). OpenStreetMap: User-generated street maps. *IEEE Pervasive Computing, 7*(4), 12–18. https://doi.org/10.1109/MPRV.2008.80

## Observaciones para cierre ante jurados

1. No presentar los resultados como “prueba final” mientras `field_calibration_delta.json` siga en `pending_no_capture`.
2. Citar fuentes institucionales cuando se usen cifras de percepción, criminalidad, calidad del aire, pasajeros o indicadores barriales.
3. Citar métodos computacionales cuando se expliquen DRL, divergencia KL, entropía o modelos de agentes.
4. Mantener el lenguaje de inferencia moderado: “sugiere”, “permite interpretar”, “bajo los supuestos del modelo”, “requiere validación de campo”.
