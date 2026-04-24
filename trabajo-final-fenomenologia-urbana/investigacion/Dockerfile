# Dockerfile optimizado para Investigación Top LVL
FROM nvidia/cuda:12.4.1-cudnn-devel-ubuntu22.04

# Evitar diálogos interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias de sistema
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    ffmpeg \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Actualizar pip e instalar stack científico HPC
RUN pip3 install --upgrade pip
RUN pip3 install \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124 \
    numpy \
    pandas \
    scipy \
    networkx \
    pillow \
    tqdm \
    geopandas \
    matplotlib \
    rich

# Directorio de trabajo
WORKDIR /workspace

# Variables de entorno para optimización de GPU
ENV PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
ENV CUDA_VISIBLE_DEVICES=0,1

CMD ["bash"]
