# Handoff 2026-05-07 — retomar desde otro equipo

> Documento autocontenido para retomar el trabajo desde la torre o desde otro equipo. La instancia de Claude (o el operador) que retome puede leer SOLO este archivo y el `MEMORY.md` correspondiente para tener contexto suficiente.

## 1. Estado vivo del proyecto

**Tesis:** Fenomenología urbana del corredor Junín–San Antonio (Medellín). Marco computacional + campo + colapso fenomenológico operacionalizado.

**Fase actual:** `field_ingest_in_progress`. Campo realizado el 2026-05-05. Procesamiento multimedia (video, foto, audio, transcripción) en torre HPC. Codificación de entrevistas pendiente porque las transcripciones del colaborador externo todavía no llegan.

**Último commit relevante:** `519c69b docs(3.12bis): matriz actualizada tras ciclo 2 (junin_paseo|peak_am)`. Branch `main` al día con `origin/main`.

## 2. Inventario rápido

### En la torre HPC `ubuntu-raid` (NetBird IP `100.98.81.177`, LAN `192.168.80.24`)

- 17 videos en `~/FenomenologiaUrbana/investigacion/data/raw/video/` (originales + comprimidos).
- 15 `video_saturation_*.json` en `~/FenomenologiaUrbana/investigacion/data/processed/` (uno por video procesado; `VID_20260505_114547` se omite por ser <30 frames).
- 5 `transcript_*.json` (Whisper).
- 34 `photo_summary_*.json` (todas con GPS resuelto a uno de 4 nodos).
- 4 JSON de cruce: `collapse_matrix.json`, `photo_node_assignments.json`, `video_node_assignments.json`, `c1_hourly_projection.json`.
- 4 contenedores corriendo: `fenomurb_proc_2060`, `fenomurb_proc_5070ti`, `fenomurb_proc_photos`, `fenomurb_proc_transcribe`. Imagen `fenomurb/proc:cuda128` (12.6 GB) ya construida con CDI.
- Servicios externos: `stt-whisper` en `localhost:8007`, `ollama` en `localhost:11434` (qwen3:14b, qwen3:32b, qwen2.5:3b), `open-webui`.

### En el equipo de origen (este, `portatil-stev`)

- `FenomenologiaUrbanaVideos/`: **17 videos originales** (~11 GB) + **11 comprimidos** (~1.97 GB) + **38 fotos JPG**. La carpeta NO está versionada (la usamos como staging).
- Repo limpio. Solo `.gitignore` con cambio menor sin staged.

### Discrepancia que hay que resolver desde la torre / LAN

- En torre solo hay 34 fotos procesadas; localmente hay 38. Hay 4 fotos nuevas que no se subieron. Sólo subirlas desde LAN gigabit toma segundos.
- En torre hay 17 videos; localmente también 17 originales. Pero los videos GRANDES en torre quizás son los comprimidos. Cuando estés en LAN podés subir los 17 originales de una para que el procesamiento se haga sobre la calidad real, no sobre la versión comprimida con CRF.

## 3. La matriz de colapso al cierre de la sesión

`investigacion/data/processed/collapse_matrix.json`:

```
flujo_ordinario: 3
  san_antonio_metro|peak_am  (sat_p75 ~0.328)
  junin_paseo|midday         (sat_p75 ~0.281)
  parque_berrio|midday       (sat_p75 ~0.395)

friccion_acumulada: 1
  junin_paseo|peak_am        (sat_p75 ~0.465, flag C4)

inconcluyente: 32
```

La fricción se desplazó entre pasadas (antes era `parque_berrio|midday`). Ese desplazamiento es **resultado defendible**: muestra estabilidad relativa del método ante muestreo creciente. Documentado en `tesis/03-resultados-y-analisis-de-turbulencia.md` §3.12bis.

**Ninguna celda en colapso fenomenológico todavía**, porque C2 (encuesta) y C3 (entrevistas codificadas) están vacíos. La regla 3-de-4 no puede alcanzarse con solo C1+C4.

## 4. Cobertura del corpus

| Nodo | Fotos GPS | Videos asignados | Confianza |
| --- | ---: | ---: | --- |
| `junin_paseo` | 12 | 4 | high/medium |
| `san_antonio_metro` | 11 | 3 | medium |
| `parque_berrio` | 9 | 3 | medium/low |
| `palacio_nacional` | 2 | 0 | — |
| `parque_san_antonio`, `oriental_cruce`, `carabobo_cultural`, `plaza_botero`, `museo_antioquia` | 0 | 0 | — |

Cobertura temporal: jornada 8:30–11:46 + un único 21:30. `peak_pm` y la mayoría de `night` SIN cobertura de campo en esta jornada.

## 5. Acceso SSH a la torre

```bash
ssh stev@100.98.81.177       # vía NetBird (Relayed ~200 ms, lento)
ssh stev@192.168.80.24       # LAN gigabit cuando estés en su red
```

**Reglas:**
- Solo clave pública; password está deshabilitado en `sshd_config`.
- fail2ban activo: NO iterar credenciales. Si falla auth, NO reintentar — diagnosticar.
- NetBird Relayed se satura con concurrencia. Una sola sesión SSH a la vez para tareas grandes.

**Clave pública del portátil ya autorizada en `~/.ssh/authorized_keys` de la torre:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHc/KG2Q38MpBLmd3uXSo335D+jJtkpEvqFMomv2OhNl stev@fedora
```

Si el equipo nuevo es OTRO equipo, hay que añadir SU clave al `authorized_keys` de la torre. Si es la torre misma como cliente, no necesitás SSH para nada local; solo para git.

## 6. Pipeline en torre — cómo funciona

Carpeta: `~/FenomenologiaUrbana/investigacion/hpc/`

| Script | Hace | Cuándo correrlo |
| --- | --- | --- |
| `process_video.py` | YOLO11 + BoTSORT por video. Detecciones, tracking, audio dB-FS, brillo/contraste/saturación visual | Automático (workers `proc-2060`, `proc-5070ti` lo corren al ver videos nuevos) |
| `process_photos.py` | YOLO11x + EXIF GPS sobre fotos | Automático (worker `proc-photos`) |
| `transcribe_audio.py` | Audio del video → Whisper ASR (`localhost:8007`) | Automático (worker `proc-transcribe`) |
| `assign_nodes.py` | Foto → nodo más cercano por GPS haversine | Manual: `python3 hpc/assign_nodes.py` |
| `assign_videos_by_time.py` | Video → nodo de la foto temporalmente más cercana | Manual |
| `update_video_metadata.py` | Aplica las asignaciones a sidecars + JSONs | Manual, vía docker run con runtime=runc |
| `c1_project_hourly.py` | Proyecta serie mensual MEData → 4 franjas con supuesto Cohen-Felson | Manual |
| `code_interviews.py` | LLM (qwen3:14b vía Ollama) codifica `*.txt`/`*.md` con esquema HABITABLE/EVITABLE/... | Manual cuando lleguen entrevistas |
| `build_collapse_matrix.py` | Cruza C1+C2+C3+C4 → `collapse_matrix.json` | Manual tras ingesta de cualquier capa |
| `inspect_matrix.py` | Imprime resumen legible de la matriz | Manual |
| `make_sidecars.py` | Genera `*.meta.json` para videos/fotos según convención de nombre | Manual al ingerir multimedia nueva |

### Receta para "actualizar la matriz tras ingesta nueva"

```bash
# en torre
cd ~/FenomenologiaUrbana && git pull --ff-only
cd investigacion
python3 hpc/assign_videos_by_time.py
docker run --rm --runtime=runc --entrypoint python \
  -v ~/FenomenologiaUrbana/investigacion:/inv \
  fenomurb/proc:cuda128 /inv/hpc/update_video_metadata.py --root /inv
python3 hpc/assign_nodes.py
python3 hpc/build_collapse_matrix.py
python3 hpc/inspect_matrix.py
```

### Receta para "publicar la matriz al frontend del deck"

```bash
# en cualquier equipo con el repo
cd /ruta/a/FenomenologiaUrbana
# Necesitas los 4 JSONs en investigacion/data/processed/
python3 investigacion/scripts/visualization/publish_collapse_to_frontend.py
git add public/data/frontend_payload.json investigacion/data/processed/*.json
git commit -m "data: matriz publicada al frontend"
git push
```

### Bug conocido — `--gpus all` falla

Kernel 6.17 + nvidia-container-toolkit 1.19 + docker 29 → `--gpus all` y `runtime: nvidia` legacy tropiezan con un eBPF device-filter (`failed to add device rules: load program: invalid argument`). **Solución aplicada:** los servicios compose usan `devices: ["nvidia.com/gpu=N"]` (CDI). Para `docker run` ad-hoc que NO necesita GPU, usar `--runtime=runc` para evitar que el Default Runtime (nvidia) tropiece con el mismo bug.

## 7. Lo que falta — orden de prioridad

### Alta prioridad (para defensa)

1. **Subir los 17 videos originales sin comprimir** desde LAN (gigabit) a `~/FenomenologiaUrbana/investigacion/data/raw/video/` reemplazando los `.compressed.mp4`. Esto reprocesa con calidad nativa. Comando:
   ```bash
   rsync -avh --progress FenomenologiaUrbanaVideos/VID_*.mp4 \
     stev@192.168.80.24:~/FenomenologiaUrbana/investigacion/data/raw/video/
   ```
   En LAN gigabit son <2 min. Después limpiar locks:
   ```bash
   ssh stev@192.168.80.24 'rm -f ~/FenomenologiaUrbana/investigacion/hpc/jobs/*.lock ~/FenomenologiaUrbana/investigacion/hpc/jobs/*.error'
   ```
   Los workers reprocesan automáticamente.

2. **Subir las 4 fotos faltantes** (en torre hay 34, local hay 38).
   ```bash
   rsync -avh --progress FenomenologiaUrbanaVideos/IMG_*.jpg \
     stev@192.168.80.24:~/FenomenologiaUrbana/investigacion/data/raw/photo/
   ```

3. **Codificar C3 (entrevistas)** cuando lleguen. Cualquier `.txt`/`.md` puesto en `~/FenomenologiaUrbana/investigacion/data/interim/YYYY_MM_DD/interviews/` es suficiente. Después:
   ```bash
   cd ~/FenomenologiaUrbana/investigacion
   python3 hpc/code_interviews.py
   python3 hpc/build_collapse_matrix.py
   python3 hpc/inspect_matrix.py
   ```

4. **Ingerir C2 (encuesta de seguridad percibida)**. Necesita un CSV con columnas `node_id, time_window, security_score (1-5)` por respuesta. Plantilla en `investigacion/data/interim/templates/field_counts_template.csv`. Cuando exista `data/processed/field_observations_aggregate.csv`, la matriz lo levanta solo.

### Media prioridad

5. **Limpiar `*.bak.*`** que el `git pull` dejó en torre (el agente paralelo lo notó).
6. **Estabilidad bajo bootstrap**: anunciado en 3.12bis. Requiere implementar.
7. **Ampliar bibliografía empírica reciente** (literatura 2020–2025 sobre Medellín, percepción de seguridad).

### Baja prioridad / estético

8. **Refinar visualización CollapseMatrixPanel** (ahora muestra grid 9×4 con colores y flags; podría agregar tooltips ricos).
9. **Limpiar imagen Docker antigua** `fenomurb/video-proc:cuda128` (25.7 GB) en torre. Cuidado: es la NGC pytorch original; verificar que nada la use antes de borrarla.

## 8. Decisiones documentadas

- **Regla 3-de-4** sobre C1/C2/C3/C4 para colapso fenomenológico (`tesis/pendientes/colapso-fenomenologico.md`). Una celda con 1-2 condiciones se reporta como `friccion_acumulada`; con 3-4 como `colapso_fenomenologico`; con cobertura insuficiente como `inconcluyente`.
- **Supuesto distribucional C1** (Cohen & Felson 1979; Brantingham & Brantingham): peak_am 0.20, midday 0.20, peak_pm 0.45, night 0.15. Documentado en `data/processed/c1_hourly_projection.json` y citado en cap. 3.
- **Asignación de videos a nodos** vía correlación temporal con fotos GPS (la cámara del celular no embebe GPS en MP4). Confianza por delta_seconds: high <300, medium <1800, low <7200, very_low resto.
- **Memoria como dimensión** (`memory` por nodo en `case_model.json`). El anexo `tesis/anexos/A-memoria-filosofia-mente.md` integra Aristóteles/Locke/Bartlett/Loftus/Schacter/Tonegawa como soporte teórico de C3 (entrevistas reconstructivas).
- **Frontend** (`public/data/frontend_payload.json` con clave `field_calibration`): rendereado en el deck React por `CollapseMatrixPanel` (nuevo) e integrado en `EvidenceSlide`. Tipos en `src/types.ts`.

## 9. Comando de verificación rápida tras retomar

Para confirmar que todo sigue en orden:

```bash
# desde el equipo donde retomes
cd /ruta/a/FenomenologiaUrbana
git pull --ff-only
git log --oneline -5

# probar SSH a torre (un solo intento)
ssh -o BatchMode=yes -o ConnectTimeout=15 stev@192.168.80.24 'echo OK; hostname; uptime -p'
# o vía NetBird si no estás en LAN
ssh -o BatchMode=yes -o ConnectTimeout=15 stev@100.98.81.177 'echo OK'

# inspeccionar la matriz actual
cat investigacion/data/processed/collapse_matrix.json | python3 -m json.tool | head -40

# o si no la tienes localmente
ssh stev@192.168.80.24 'cd ~/FenomenologiaUrbana/investigacion && python3 hpc/inspect_matrix.py'
```

## 10. Frente a la ventana corta del usuario

Lo que más impacta para la defensa, en este orden:

1. Llegada de transcripciones de entrevistas → **convierte la matriz de "1 fricción" en celdas potencialmente en `colapso_fenomenologico`** (la diferencia narrativa es enorme).
2. Reprocesar con videos sin comprimir → confirma que la fricción detectada no es artefacto de compresión.
3. Ingesta de C2 → confirma el cuadrante por percepción.

Sin las tres, la tesis igual se sostiene como "campo realizado, triangulación parcial, fricción detectada en franja-evento". Con las tres, se sostiene como "matriz de colapso completa con celdas confirmadas".

## 11. Archivos clave (ubicaciones)

- Capítulos: `tesis/01-introduccion-y-marco-teorico.md` ... `tesis/04-conclusiones-y-referencias-bibliograficas.md`.
- Anexo de memoria: `tesis/anexos/A-memoria-filosofia-mente.md`.
- Definición operacional del colapso: `tesis/pendientes/colapso-fenomenologico.md`.
- Pipeline: `investigacion/hpc/`.
- Outputs procesados: `investigacion/data/processed/`.
- Modelo M-MASS: `investigacion/outputs/case_model.json`.
- Frontend deck: `src/presentation/`, `public/data/frontend_payload.json`.

## 12. Última nota

Si la próxima sesión es Claude desde la torre como cliente, ya no necesita NetBird para nada (todo es local). El docker compose corre como antes; el git push sale por la red de la torre directamente.

Si la próxima sesión es Claude desde otro portátil, hay que (a) añadir su clave SSH al `authorized_keys` de la torre y (b) tolerar la lentitud de NetBird Relayed (~500 KB/s) para subidas grandes. Para subidas grandes desde fuera de la LAN, comprimir con `ffmpeg -c:v libopenh264 -b:v 3500k` antes de subir reduce 80% el peso.

Y siempre: leer este archivo + `MEMORY.md` + `tesis/pendientes/colapso-fenomenologico.md` antes de actuar.
