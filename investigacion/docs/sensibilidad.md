# Anexo de sensibilidad y ablación

Fecha de consolidación: 25 de abril de 2026.  
Estado: protocolo PC completo; ejecuciones cuantitativas extensivas quedan sujetas a tiempo de cómputo.

## 1. Propósito

Este anexo define cómo evaluar si los resultados dependen demasiado de parámetros arbitrarios. No reemplaza el campo. Su función es mostrar qué debe variar, qué métrica mirar y qué afirmaciones quedan permitidas.

## 2. Hipótesis de sensibilidad

| Parámetro | Hipótesis esperada | Riesgo si no cambia nada | Riesgo si cambia demasiado |
| --- | --- | --- | --- |
| Peso de riesgo | mayor riesgo concentra rutas y reduce libertad relativa | el modelo no representa seguridad percibida | el modelo está dominado por un proxy débil |
| Peso de tiempo | mayor costo de tiempo favorece rutas cortas | el agente ignora eficiencia funcional | la experiencia queda reducida a velocidad |
| Peso de ruido | mayor ruido desplaza rutas hacia zonas menos expuestas | campo ambiental irrelevante | ruido domina sin calibración real |
| Peso de densidad | mayor congestión reduce fluidez y puede elevar entropía | presión peatonal no incide | rutas dependen solo de crowding |
| Atracción comercial | mayor atracción aumenta permanencia o desvíos | comercio no incide | comercio absorbe todo el comportamiento |
| Iluminación nocturna | menor luz aumenta costo/riesgo nocturno | escenario noche es indistinto | lux no medido domina inferencia |

## 3. Matriz mínima de variación

Aplicar a cada parámetro sensible:

| Escenario | Factor |
| --- | ---: |
| reducción fuerte | -30% |
| reducción media | -20% |
| reducción leve | -10% |
| base | 0% |
| aumento leve | +10% |
| aumento medio | +20% |
| aumento fuerte | +30% |

La salida no debe interpretarse como “verdad urbana”; solo indica robustez interna.

## 4. Métricas a comparar

| Métrica | Archivo probable | Lectura crítica |
| --- | --- | --- |
| velocidad media | `hpc_uncertainty_quantification.json`, reportes de simulación | fluidez simulada, no comodidad real |
| entropía | `hpc_urban_stress_test.json` | diversidad/desorden bajo supuestos |
| Gini de entropía | `urban_inequality_analysis.json` | desigualdad relativa entre perfiles |
| KL divergence | outputs de rutas si se exporta | desviación respecto a distribución base |
| presión urbana | `hpc_urban_stress_test.json` | escenario interno, no capacidad real |
| cambios de arista | `field_calibration_delta.json` tras campo real | solo válido con datos observados |

## 5. Diseño de ablaciones

| Ablación | Qué se apaga | Pregunta que responde |
| --- | --- | --- |
| Sin ruido | costo/field acústico | ¿el ruido explica cambios de ruta o es decorativo? |
| Sin riesgo | proxy de seguridad | ¿las rutas dependen de percepción de seguridad? |
| Sin congestión | crowding/densidad | ¿la presión peatonal explica fluidez? |
| Sin atracción comercial | atracción/permanencia | ¿el comercio afecta permanencia y desvío? |
| Sin ambiente | ruido + PM2.5 | ¿el modelo se reduce a grafo-tiempo? |
| Perfiles homogéneos | pesos iguales entre agentes | ¿la desigualdad surge de perfiles o de geometría? |

## 6. Criterios de robustez

Un resultado se considera relativamente robusto si:

- conserva dirección general bajo variaciones de ±10%;
- no se invierte sin explicación bajo ±20%;
- bajo ±30% cambia de manera interpretable, no caótica;
- las conclusiones se redactan como “bajo los supuestos del modelo”.

Un resultado se considera frágil si:

- se invierte con cambios leves;
- depende de un único parámetro no calibrado;
- desaparece al apagar una capa cuya evidencia es débil;
- contradice intuición empírica y no hay campo para resolverlo.

## 7. Registro recomendado de resultados

Crear una tabla por corrida:

| run_id | parámetro | factor | velocidad | entropía | gini | nota |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| risk_m10 | riesgo | -10% | pendiente | pendiente | pendiente | corrida no ejecutada |
| risk_p10 | riesgo | +10% | pendiente | pendiente | pendiente | corrida no ejecutada |

Hasta ejecutar corridas, este anexo funciona como protocolo defendible, no como resultado cuantitativo.

## 8. Cómo citar en la tesis

Formulación correcta:

> Se diseñó una matriz de sensibilidad y ablación para evaluar dependencia paramétrica. Mientras no se ejecuten todas las corridas, los resultados se interpretan como baseline exploratorio.

Formulación incorrecta:

> El modelo demostró que el riesgo/ruido/densidad causa la experiencia urbana real.

## 9. Próximo paso computacional

Implementar un script `scripts/analysis/run_sensitivity_matrix.py` que:

1. lea `case_model.json`;
2. genere variantes controladas;
3. ejecute simulación reducida;
4. exporte `outputs/sensitivity_matrix_results.json`;
5. no toque `field_calibration_delta.json`.
