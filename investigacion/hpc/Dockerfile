# Imagen base NGC PyTorch — incluye CUDA 12.8 + cuDNN + PyTorch con soporte Blackwell (sm_120)
# RTX 5070 Ti (Blackwell sm_120) requiere CUDA >= 12.8.
# RTX 2060 (Turing sm_75) compatible.
# Si esta tag no está disponible en el registro, probar 25.01-py3 o la más reciente.
FROM nvcr.io/nvidia/pytorch:25.02-py3

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        ffmpeg \
        libgl1 \
        libglib2.0-0 \
        tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

COPY process_video.py /workspace/process_video.py

ENTRYPOINT ["/usr/bin/tini", "--", "python", "/workspace/process_video.py"]
