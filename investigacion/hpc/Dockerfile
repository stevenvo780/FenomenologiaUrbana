# Imagen base liviana CUDA 12.8 con cuDNN runtime.
# La torre ya cachea esta imagen (~4.5 GB), evitando el pull de NGC PyTorch (~22 GB).
# RTX 5070 Ti (Blackwell sm_120) requiere CUDA >= 12.8.
# RTX 2060 (Turing sm_75) compatible.
# PyTorch se instala vía wheel oficial cu128.
FROM nvidia/cuda:12.8.1-cudnn-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    YOLO_CONFIG_DIR=/workspace/.yolo \
    MPLCONFIGDIR=/workspace/.mpl \
    TORCH_HOME=/workspace/.torch

RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        python3-venv \
        ffmpeg \
        libgl1 \
        libglib2.0-0 \
        libsndfile1 \
        tini \
        ca-certificates \
        wget \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /workspace

# PyTorch con wheels para CUDA 12.8 (incluye soporte Blackwell sm_120).
RUN pip install --upgrade pip && \
    pip install --index-url https://download.pytorch.org/whl/cu128 \
        torch==2.7.0 torchvision==0.22.0

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY process_video.py /workspace/process_video.py
COPY process_photos.py /workspace/process_photos.py

ENTRYPOINT ["/usr/bin/tini", "--", "python"]
CMD ["/workspace/process_video.py"]
