# Procesamiento de video en torre HPC (dual-GPU)

Pipeline para procesar los videos POV / saturación de campo en la torre HPC del autor, usando ambas GPUs en paralelo: **RTX 5070 Ti** (Blackwell, sm_120) y **RTX 2060** (Turing, sm_75). La salida alimenta la condición C4 del colapso fenomenológico (`investigacion/data/processed/video_saturation_*.json`).

## 1. Requisitos en la torre

- Driver NVIDIA reciente con soporte Blackwell (≥ 570.x).
- Docker Engine (≥ 24).
- NVIDIA Container Toolkit (`nvidia-ctk` configurado).
- Python solo si se quiere correr fuera de Docker; el flujo recomendado es Docker.

Verificación rápida (correr una vez en la torre, **no aquí**):

```bash
nvidia-smi --query-gpu=index,name,driver_version,compute_cap --format=csv
docker info | grep -E 'Runtimes|Default Runtime'
docker run --rm --gpus all nvcr.io/nvidia/pytorch:25.02-py3 \
  python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.device_count())"
```

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

- 2026-05-07: artefactos creados localmente; pendiente que la torre vuelva a estar conectada en NetBird (`100.98.81.177` actualmente con "no route to host" desde el cliente del autor).
- Próximo paso: confirmar conectividad → subir con `rsync` → `docker compose up`.
