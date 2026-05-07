# Procesamiento de video en torre HPC (dual-GPU)

Pipeline para procesar los videos POV / saturación de campo en la torre HPC del autor, usando ambas GPUs en paralelo: **RTX 5070 Ti** (Blackwell, sm_120) y **RTX 2060** (Turing, sm_75). La salida alimenta la condición C4 del colapso fenomenológico (`investigacion/data/processed/video_saturation_*.json`).

## 1. Requisitos en la torre

Estado verificado en `ubuntu-raid` (2026-05-07):

- Driver NVIDIA **580.142** (soporte Blackwell ✓).
- Docker Engine **29.1.3**, runtime `nvidia` como default.
- NVIDIA Container Toolkit **1.19.0**.
- CDI specs auto-generadas en `/var/run/cdi/nvidia.yaml`.
- GPU 0 = RTX 5070 Ti (sm_120), GPU 1 = RTX 2060 (sm_75).

Verificación rápida (correr en la torre):

```bash
nvidia-smi --query-gpu=index,name,driver_version,compute_cap --format=csv
nvidia-ctk cdi list
docker run --rm --device=nvidia.com/gpu=all nvidia/cuda:12.6.0-base-ubuntu22.04 nvidia-smi -L
```

⚠️ **No usar `--gpus all`** en kernel 6.17 + docker 29: tropieza con un bug de eBPF
device-filter en `nvidia-container-cli` (`failed to add device rules: load program:
invalid argument`). El compose ya usa CDI (`devices: ["nvidia.com/gpu=N"]`) para
evitar ese path. Aislamiento per-GPU verificado: cada contenedor ve su GPU como
índice 0 internamente.

Si la torre no tiene `nvidia-container-toolkit`:

```bash
distribution=$(. /etc/os-release; echo $ID$VERSION_ID)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

## 2. Estructura de carpetas esperada en la torre

```
~/FenomenologiaUrbana/
├── investigacion/
│   ├── data/
│   │   ├── raw/video/                  # videos crudos (subir desde campo)
│   │   └── processed/                  # JSON de saturación generados
│   └── hpc/                            # este directorio
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── process_video.py
│       ├── requirements.txt
│       ├── jobs/                       # locks/done/error (se crea solo)
│       └── logs/                       # opcional
```

Subida desde la máquina del autor:

```bash
rsync -avz --progress investigacion/hpc/ stev@100.98.81.177:~/FenomenologiaUrbana/investigacion/hpc/
rsync -avz --progress investigacion/data/raw/video/ stev@100.98.81.177:~/FenomenologiaUrbana/investigacion/data/raw/video/
```

## 3. Convención de nombre de video

Para que `process_video.py` ubique cada video en una celda nodo × franja sin sidecar:

```
NODE__WINDOW__YYYY-MM-DD__libre.mp4
```

- `NODE`: uno de los IDs del modelo (`san_antonio_metro`, `parque_san_antonio`, `palacio_nacional`, `junin_paseo`, `oriental_cruce`, `parque_berrio`, `carabobo_cultural`, `plaza_botero`, `museo_antioquia`).
- `WINDOW`: `peak_am`, `midday`, `peak_pm` o `night`.
- `YYYY-MM-DD`: fecha de captura.
- `libre`: cualquier sufijo libre (recorrido, observador, toma).

Ejemplo: `parque_berrio__peak_pm__2026-05-04__pov-A.mp4`.

Alternativa: dejar un sidecar `<video>.meta.json` con `{"node": "...", "window": "...", "captured_at": "..."}`.

## 4. Build y ejecución

```bash
cd ~/FenomenologiaUrbana/investigacion/hpc
docker compose build
docker compose up -d
docker compose logs -f
```

El servicio `proc-5070ti` se queda con la GPU 0 (primario, modelo `yolo11x.pt`) y `proc-2060` con la GPU 1 (secundario, modelo `yolo11s.pt`). Los workers cooperan: cada video crea un lock en `jobs/`, evitando que ambas GPUs procesen el mismo archivo.

Si `nvidia-smi` lista la 5070 Ti en otro índice, ajustar `device_ids` en `docker-compose.yml`.

## 5. Salida

Por cada video de entrada se produce:

```
investigacion/data/processed/video_saturation_<basename>.json
```

con campos `summary` (nodo, franja, p50/p75/p90 de personas, saturation_index) y `frames` (estadística por frame muestreado). Estos archivos son el insumo C4 para la matriz de colapso (`collapse_matrix.json`), descrita en `tesis/pendientes/colapso-fenomenologico.md`.

## 6. Ética y datos

- Los videos crudos no salen de la torre (procesamiento local, no servicios de terceros).
- Antes de cualquier exportación pública, aplicar difuminado de rostros (script aparte, fuera del alcance de este pipeline).
- Los `video_saturation_*.json` solo contienen conteos agregados, sin imágenes ni rostros.

## 7. Modelo YOLO

Por defecto:
- 5070 Ti → `yolo11x.pt` (el más grande, mejor recall, más VRAM).
- 2060 → `yolo11s.pt` (rápido, suficiente para POV con planos cercanos).

La primera ejecución descargará los pesos automáticamente desde Ultralytics. Si la torre está sin internet, se pueden subir los `.pt` manualmente y montarlos en `/workspace`.

## 8. Estado actual

- 2026-05-07 — torre `ubuntu-raid` confirmada vía NetBird (`100.98.81.177`, modo Relayed ~200ms RTT).
- Inventario validado: 2× GPUs detectadas, driver 580.142, Docker 29.1.3, NVIDIA Container Toolkit 1.19.0, default runtime `nvidia`, CDI specs publicadas. CPU 32 cores, RAM 123 GiB, `/home` con 388 GiB libres.
- GitHub SSH funciona desde la torre (autenticada como `stevenvo780`); el repo se puede clonar con `git clone git@github.com:stevenvo780/FenomenologiaUrbana.git`.
- Bug detectado: `--gpus all` falla con eBPF device-filter en este kernel; resuelto migrando el compose a CDI.
- Próximo paso: clonar repo en la torre → subir videos crudos a `investigacion/data/raw/video/` → `docker compose build` → `docker compose up -d`.
