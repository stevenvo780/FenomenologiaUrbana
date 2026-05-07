# Progreso 2026-05-07: colapso fenomenológico + entorno HPC dual-GPU

Fecha: 7 de mayo de 2026.
Contexto: el usuario cambia de equipo. Este documento deja el estado completo de la sesión para retomar desde otra máquina sin perder contexto.

## 1. Decisión de fondo

El campo se realizó antes del 6 de mayo de 2026. La narrativa de la tesis se reorientó alrededor del concepto operacional de **colapso fenomenológico**: una franja-evento (nodo × hora) donde convergen al menos tres de cuatro condiciones independientes:

- **C1 — Criminalidad objetiva.** Hurto a persona en comuna 10 por encima del percentil 75 mensual de su serie pública (MEData).
- **C2 — Seguridad percibida deprimida.** `security_score` ≤ 2/5 en encuesta breve situada y/o codificación dominante de `RIESGO_PERCIBIDO` en notas de campo.
- **C3 — Habitabilidad declarada negativa.** Codificación dominante de `EVITABLE`/`NO_DESEABLE`/`DIFICIL_DE_VIVIR` en transcripciones de entrevistas.
- **C4 — Saturación material.** Densidad y conteo automático por encima del percentil 75 en videos POV procesados en torre HPC con GPU.

Regla de decisión: **3 de 4 ⇒ colapso fenomenológico**, 1–2 ⇒ fricción acumulada, 0 ⇒ flujo ordinario, cobertura insuficiente ⇒ `inconcluyente`. La síntesis se reportará en `investigacion/data/processed/collapse_matrix.json` (no construida aún).

## 2. Cambios en la tesis

Todos los capítulos quedaron alineados con la nueva fase `field_ingest_in_progress` (reemplaza `pending_no_capture`).

| Archivo | Cambios principales |
| --- | --- |
| `tesis/01-introduccion-y-marco-teorico.md` | Pregunta general ampliada al colapso; añadida pregunta específica 5; hipótesis incluye colapso como franja-evento; *symploké* descrita como acoplamiento crítico de los tres planos; añadido riesgo 5 (no generalizar el colapso). |
| `tesis/02-metodologia-y-diseno-hpc.md` | Método pasa de 5 a 6 momentos (campo + triangulación); tabla de operacionalización suma C1–C4; nueva sección 2.9.1 con definición operacional y regla 3-de-4; sección 2.11 incorpora triangulación; ética actualizada (difuminado de rostros, torre HPC local); diagrama mermaid actualizado. |
| `tesis/03-resultados-y-analisis-de-turbulencia.md` | 3.2 ahora discute la serie MEData mes a mes; **3.12 reescrita** como "campo realizado, triangulación en curso" con sub-andamiajes 3.12.1–3.12.6 (placeholders por condición, sin inventar resultados); tabla 3.13 cambia `pending_no_capture` por `Pendiente de matriz`. |
| `tesis/04-conclusiones-y-referencias-bibliograficas.md` | Conclusión general absorbe el colapso; respuesta a pregunta 5 añadida; tabla de limitaciones realineada; 4.7 y 4.8 reorganizadas en "agenda mientras la torre procesa" e "ingesta y triangulación"; cierre actualizado; diagrama final con torre HPC. |
| `tesis/guion-presentacion-publico.md` | Slides 6, 7, 8, 9, 10, 15, 16 reescritas; bloque de preguntas + cierre actualizado; fecha → 2026-05-07. |
| `tesis/pendientes/preguntas-defensa.md` | Q1 reescrita (campo hecho + ingesta); Q11 (qué es y cómo se mide el colapso) y Q12 (qué pasa si la matriz sale vacía) añadidas. |
| `tesis/pendientes/colapso-fenomenologico.md` | **Nuevo.** Definición completa: cuatro condiciones, falsabilidad, salvaguardas, qué no se afirma, vínculo con marco teórico. |

## 3. Entorno HPC dual-GPU

Carpeta nueva: `investigacion/hpc/`. Listo para `rsync` a la torre y `docker compose up`.

| Archivo | Función |
| --- | --- |
| `Dockerfile` | Base `nvcr.io/nvidia/pytorch:25.02-py3` (CUDA 12.8, soporte Blackwell sm_120 para RTX 5070 Ti). Incluye ffmpeg, OpenCV. |
| `docker-compose.yml` | Dos servicios: `proc-5070ti` (GPU 0, `yolo11x.pt`, lote primario) y `proc-2060` (GPU 1, `yolo11s.pt`, lote secundario). Cada uno ve solo su GPU vía `device_ids`. |
| `process_video.py` | Worker cooperativo. Reclama videos por lock files en `jobs/`, corre detección de personas con YOLO en GPU, calcula p50/p75/p90, escribe `video_saturation_<basename>.json` en `data/processed/`. Sin colisión entre contenedores sobre el mismo `data/raw/video/`. |
| `requirements.txt` | `ultralytics`, `opencv-python-headless`, `numpy`, `pandas`, `tqdm`, `shapely`. |
| `README.md` | Instrucciones de despliegue completas, convención de nombres `NODE__WINDOW__YYYY-MM-DD__libre.ext`, comandos `rsync`, instalación de `nvidia-container-toolkit` si falta. |
| `.gitignore` | Ignora `jobs/`, `logs/`, pesos `.pt`. |

### Convención de nombre de video
```
NODE__WINDOW__YYYY-MM-DD__libre.ext
```
- `NODE` ∈ {`san_antonio_metro`, `parque_san_antonio`, `palacio_nacional`, `junin_paseo`, `oriental_cruce`, `parque_berrio`, `carabobo_cultural`, `plaza_botero`, `museo_antioquia`}
- `WINDOW` ∈ {`peak_am`, `midday`, `peak_pm`, `night`}
- Alternativa: sidecar `<video>.meta.json`.

## 4. Estado de la torre HPC (verificado 2026-05-07 17:35)

Acceso SSH funcional con clave `id_ed25519` (stev@fedora) ya autorizada en la torre. **Reglas operativas:** no usar sshpass; no iterar credenciales (fail2ban activo); no ejecutar destructivos sin confirmación.

**Inventario `ubuntu-raid` (Ubuntu 25.10, kernel 6.17.0-23-generic):**
- GPU 0: **RTX 5070 Ti** 16 GB · driver 580.142 · sm_120 (Blackwell ✓)
- GPU 1: **RTX 2060** 6 GB · sm_75 (Turing ✓)
- Docker 29.1.3 · runtime `nvidia` como default · NVIDIA Container Toolkit 1.19.0
- CDI auto-generado en `/var/run/cdi/nvidia.yaml`
- 32 cores · 123 GiB RAM · `/` 189 GiB libres · `/home` 388 GiB libres
- GitHub SSH funcional (autenticada como `stevenvo780`)

**Bug encontrado y resuelto:** `docker run --gpus all` y `runtime: nvidia` legacy fallan con `nvidia-container-cli: failed to add device rules: load program: invalid argument` (bug eBPF device-filter en kernel 6.17 + docker 29). **Solución aplicada:** el `docker-compose.yml` migrado a CDI (`devices: ["nvidia.com/gpu=0"]` y `["nvidia.com/gpu=1"]`). Aislamiento per-GPU verificado: cada contenedor ve su GPU como índice 0.

**Próximos pasos (orden):**
1. Clonar repo en la torre: `git clone git@github.com:stevenvo780/FenomenologiaUrbana.git ~/FenomenologiaUrbana`.
2. Subir videos crudos: `rsync -avz <local_videos>/ stev@100.98.81.177:~/FenomenologiaUrbana/investigacion/data/raw/video/`.
3. `cd ~/FenomenologiaUrbana/investigacion/hpc && docker compose build && docker compose up -d`.
4. Monitorear con `docker compose logs -f`.
5. Recoger `video_saturation_*.json` desde `investigacion/data/processed/`.

## 5. Memoria del agente

`/home/stev/.claude/projects/-home-stev-Documentos-repos-FenomenologiaUrbana/memory/project_field_study_done.md` actualizado a fase de **ingesta multimedia en curso** con eje del colapso fenomenológico. Índice `MEMORY.md` también actualizado.

## 6. Pendientes para la próxima sesión (en orden)

1. **Verificar conectividad NetBird de la torre** y hacer reconocimiento real.
2. **Recibir transcripciones** del colaborador externo y empezar codificación C3 con esquema `HABITABLE / DESEABLE / EVITABLE / NO_DESEABLE / DIFICIL_DE_VIVIR / AMBIVALENTE`.
3. **Ingestar conteos y notas** del campo a `investigacion/data/interim/YYYY_MM_DD/`.
4. **Subir videos** y disparar el pipeline GPU.
5. **Construir `collapse_matrix.json`** cruzando C1–C4 con la regla 3-de-4. Esto es el resultado empírico central que falta.
6. **Escribir resultados** en 3.12.x solo después de tener la matriz.
7. **Ampliar bibliografía empírica** 2020–2025 sobre Medellín, percepción de seguridad y movilidad peatonal.

## 7. Cambios git de esta sesión

- Modificados: `tesis/01-*`, `tesis/02-*`, `tesis/03-*`, `tesis/04-*`, `tesis/guion-presentacion-publico.md`, `tesis/pendientes/preguntas-defensa.md`.
- Nuevos: `tesis/pendientes/colapso-fenomenologico.md`, `tesis/historico/2026-05-07-progreso-colapso-fenomenologico.md`, `investigacion/hpc/` (Dockerfile, docker-compose.yml, process_video.py, requirements.txt, README.md, .gitignore).

## 8. Qué no cambió

- `case_model.json`, salidas HPC en `investigacion/outputs/`, scripts de simulación.
- `tesis/pendientes/tareas-campo.md` y `tablas-listas.md` (estrategia previa, no estado).
- Bibliografía: pendiente de ampliación empírica reciente.
- `field_calibration_delta.json` sigue como `pending_no_capture` en disco; el cambio de fase a `field_ingest_in_progress` es declarativo en la narrativa, lo formaliza el script de ingesta cuando se ejecute.

## 9. Punto de retoma rápido (cuando vuelvas en otro equipo)

```bash
git pull
# Lee este archivo + tesis/pendientes/colapso-fenomenologico.md primero.
# Luego, según el bloqueante:
#   - si la torre ya levantó: sshpass -e ssh -o NumberOfPasswordPrompts=1 stev@100.98.81.177 (un solo intento)
#   - si llegan transcripciones: crear investigacion/data/interim/YYYY_MM_DD/interviews/ y empezar codificación
#   - si nada de lo anterior: avanzar bibliografía empírica reciente
```
