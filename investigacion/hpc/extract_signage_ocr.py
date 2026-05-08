#!/usr/bin/env python3
"""
extract_signage_ocr.py
======================
Extrae texto OCR (graffiti tags, signage comercial, marcas, tipografía) de las
fotos de campo en investigacion/data/raw/photo/. Enriquece M3 (capa social /
heterotopía) y M1 (densidad informacional).

Salidas:
  - investigacion/data/processed/m3_signage_ocr.json       (agregado por nodo)
  - investigacion/data/processed/m3_signage_per_photo.json (detalle por foto)

Estrategia OCR (en orden de preferencia):
  1) easyocr (GPU si disponible)  <- usado actualmente
  2) tesseract + pytesseract       <- fallback no implementado en este run (no instalado)
  3) paddleocr                     <- fallback no implementado en este run (no instalado)

Uso:
    /tmp/ocr_venv/bin/python investigacion/hpc/extract_signage_ocr.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path("/datos/repos/FenomenologiaUrbana")
PHOTO_DIR = ROOT / "investigacion/data/raw/photo"
ASSIGN_PATH = ROOT / "investigacion/data/processed/photo_node_assignments.json"
OUT_AGG = ROOT / "investigacion/data/processed/m3_signage_ocr.json"
OUT_PER_PHOTO = ROOT / "investigacion/data/processed/m3_signage_per_photo.json"

MIN_LEN = 3            # > 2 chars
MIN_CONF = 0.5         # confianza > 0.5

# ---------- heurísticas de clasificación ----------
COMMERCIAL_KEYWORDS = {
    "pague", "oferta", "venta", "promocion", "promoción", "descuento", "abierto",
    "cerrado", "entrada", "salida", "tienda", "almacen", "almacén", "panaderia",
    "panadería", "farmacia", "drogueria", "droguería", "restaurante", "cafe",
    "café", "bar", "hotel", "banco", "minuto", "minutos", "internet", "papeleria",
    "papelería", "ferreteria", "ferretería", "fruteria", "frutería", "carniceria",
    "carnicería", "peluqueria", "peluquería", "lavanderia", "lavandería",
    "parqueadero", "credito", "crédito", "dolares", "dólares", "pesos", "menu",
    "menú", "desayuno", "almuerzo", "cena", "domicilio", "delivery", "sale",
    "open", "closed", "shop", "store", "for", "rent", "vende", "vendo",
    "se", "arrienda", "alquila",
}

KNOWN_BRANDS = {
    "exito", "éxito", "olimpica", "olímpica", "carulla", "d1", "ara", "justo",
    "jumbo", "metro", "bbva", "bancolombia", "davivienda", "avianca", "claro",
    "movistar", "tigo", "etb", "epm", "postobon", "postobón", "coca", "cola",
    "pepsi", "redbull", "nike", "adidas", "puma", "samsung", "iphone", "apple",
    "huawei", "xiaomi", "shell", "terpel", "biomax", "mobil", "totto", "arturo",
    "calvo", "frisby", "presto", "burger", "king", "mcdonalds", "subway", "kfc",
    "dominos", "papa", "johns", "juan", "valdez", "oma", "tostao", "americino",
}

DIRECTION_RE = re.compile(r"^(cra|cl|calle|carrera|av|avenida|kr|tv|transversal|dg|diagonal)\s*[-#°ºo0-9]", re.I)
NUMERIC_RE = re.compile(r"^[#nº°\s]*\d{1,4}\s*[-a-z]?\s*\d{0,4}$", re.I)


def strip_accents(s: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
    )


def normalize(s: str) -> str:
    return strip_accents(s.strip().lower())


def classify(text: str) -> str:
    """Devuelve TAG / COMERCIO / DIRECCION / MARCA / OTRO."""
    raw = text.strip()
    norm = normalize(raw)
    if not norm:
        return "OTRO"

    # DIRECCION
    if DIRECTION_RE.match(norm) or NUMERIC_RE.match(norm):
        return "DIRECCION"

    # MARCA
    tokens = set(re.findall(r"[a-záéíóúñ]+", norm))
    if tokens & KNOWN_BRANDS:
        return "MARCA"

    # COMERCIO
    if tokens & COMMERCIAL_KEYWORDS:
        return "COMERCIO"

    # TAG: corto, mayúsculas, con caracteres no estándar o estilizado.
    # Heurística: pocos chars (<=10), original mayoritariamente uppercase,
    # sin espacios y sin solo dígitos. Los graffiti tags suelen ser monogramas
    # cortos con grafía estilizada (las palabras españolas largas no caben).
    letters = [c for c in raw if c.isalpha()]
    if letters and len(raw.replace(" ", "")) <= 10:
        upper_ratio = sum(1 for c in letters if c.isupper()) / len(letters)
        no_spaces = " " not in raw
        if upper_ratio >= 0.6 and no_spaces and not raw.isdigit():
            return "TAG"

    return "OTRO"


# ---------- carga de assignments ----------
def load_assignments() -> dict[str, dict]:
    with open(ASSIGN_PATH) as f:
        d = json.load(f)
    return {a["photo"]: a for a in d.get("assignments", [])}


# ---------- detección de idioma muy simple ----------
SPANISH_HINTS = set("ñáéíóú")
SPANISH_WORDS = {
    "de", "la", "el", "y", "que", "para", "por", "con", "en", "pague", "oferta",
    "venta", "abierto", "cerrado", "calle", "carrera", "tienda", "se", "vende",
    "arrienda",
}
ENGLISH_WORDS = {
    "the", "and", "for", "open", "closed", "shop", "sale", "rent", "store",
    "free", "wifi",
}


def detect_lang(text: str) -> str:
    t = text.lower()
    if any(c in SPANISH_HINTS for c in t):
        return "es"
    toks = set(re.findall(r"[a-záéíóúñ]+", t))
    if toks & SPANISH_WORDS:
        return "es"
    if toks & ENGLISH_WORDS:
        return "en"
    return "other"


# ---------- main OCR ----------
def main() -> int:
    t0 = time.time()
    try:
        import easyocr  # type: ignore
    except ImportError:
        print("ERROR: easyocr no disponible. Instalar con `pip install easyocr`.", file=sys.stderr)
        return 2

    # Nota: easyocr+GPU dispara IndexError en decode_greedy con estos modelos
    # (numpy 2.x + torch reciente). Forzamos CPU; el OCR es suficientemente
    # rápido para 34 fotos.
    gpu = False
    if os.environ.get("EASYOCR_GPU") == "1":
        try:
            import torch  # type: ignore
            gpu = bool(torch.cuda.is_available())
        except Exception:
            gpu = False

    print(f"[init] easyocr Reader (es+en, gpu={gpu})", flush=True)
    reader = easyocr.Reader(["es", "en"], gpu=gpu, verbose=False)

    assigns = load_assignments()
    photos = sorted(p for p in PHOTO_DIR.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    print(f"[init] {len(photos)} fotos a procesar", flush=True)

    per_photo: list[dict] = []
    by_node: dict[str, list[dict]] = defaultdict(list)

    # Pre-resize helper: easyocr+CUDA falla con imágenes >~3000px en algunos drivers.
    from PIL import Image, ImageFile  # type: ignore
    import numpy as np  # type: ignore
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    MAX_SIDE = 2400

    def load_resized(path: Path):
        im = Image.open(path).convert("RGB")
        w, h = im.size
        m = max(w, h)
        if m > MAX_SIDE:
            scale = MAX_SIDE / m
            im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        return np.array(im)

    for i, p in enumerate(photos, 1):
        ts = time.time()
        results = []
        try:
            arr = load_resized(p)
            try:
                results = reader.readtext(arr, detail=1, paragraph=False)
            except Exception as e_gpu:
                # fallback CPU para esta imagen
                print(f"[warn-gpu] {p.name}: {e_gpu} -> retry CPU", file=sys.stderr)
                if gpu:
                    cpu_reader = getattr(main, "_cpu_reader", None)
                    if cpu_reader is None:
                        cpu_reader = easyocr.Reader(["es", "en"], gpu=False, verbose=False)
                        main._cpu_reader = cpu_reader  # type: ignore[attr-defined]
                    results = cpu_reader.readtext(arr, detail=1, paragraph=False)
                else:
                    raise
        except Exception as e:
            print(f"[err] {p.name}: {e}", file=sys.stderr)
            results = []

        strings = []
        for bbox, text, conf in results:
            text = (text or "").strip()
            if len(text) < MIN_LEN:
                continue
            if conf < MIN_CONF:
                continue
            klass = classify(text)
            lang = detect_lang(text)
            strings.append({
                "text": text,
                "norm": normalize(text),
                "conf": float(round(conf, 3)),
                "class": klass,
                "lang": lang,
            })

        meta = assigns.get(p.name, {})
        node = meta.get("nearest_node", "unknown")
        window = meta.get("inferred_window", "unknown")
        rec = {
            "photo": p.name,
            "node": node,
            "window": window,
            "n_strings": len(strings),
            "strings": strings,
        }
        per_photo.append(rec)
        by_node[node].append(rec)
        dt = time.time() - ts
        print(f"[{i:02d}/{len(photos)}] {p.name} node={node} n={len(strings)} ({dt:.1f}s)", flush=True)

    # ---------- agregados por nodo ----------
    aggregates: dict[str, dict] = {}
    for node, recs in by_node.items():
        all_strings = [s for r in recs for s in r["strings"]]
        n_total = len(all_strings)
        commerce = [s for s in all_strings if s["class"] == "COMERCIO"]
        marcas = [s for s in all_strings if s["class"] == "MARCA"]
        directions = [s for s in all_strings if s["class"] == "DIRECCION"]
        tags = [s for s in all_strings if s["class"] == "TAG"]

        tag_counter = Counter(s["norm"] for s in tags)
        repeated_tags = {k: c for k, c in tag_counter.items() if c >= 2}
        top_tags = tag_counter.most_common(5)

        # idioma diversity
        lang_counter = Counter(s["lang"] for s in all_strings)
        total_lang = sum(lang_counter.values()) or 1
        lang_ratio = {k: round(v / total_lang, 3) for k, v in lang_counter.items()}

        aggregates[node] = {
            "n_photos": len(recs),
            "n_text_strings": n_total,
            "n_tags": len(tags),
            "n_unique_tags": len(tag_counter),
            "tag_repetition_score": len(repeated_tags),  # cuántos tags se repiten >=2
            "tag_repetition_volume": int(sum(repeated_tags.values())),  # total apariciones de tags repetidos
            "top_repeated_tags": [{"tag": t, "count": c} for t, c in top_tags],
            "n_commerce": len(commerce),
            "commerce_density": round(len(commerce) / max(len(recs), 1), 3),
            "n_marcas": len(marcas),
            "n_direcciones": len(directions),
            "language_diversity": lang_ratio,
        }

    # ---------- totales globales ----------
    all_strings_global = [s for r in per_photo for s in r["strings"]]
    global_tags = Counter(
        s["norm"] for s in all_strings_global if s["class"] == "TAG"
    )

    out_agg = {
        "engine": "easyocr",
        "engine_gpu": gpu,
        "languages": ["es", "en"],
        "min_chars": MIN_LEN,
        "min_confidence": MIN_CONF,
        "n_photos_processed": len(per_photo),
        "n_strings_total": len(all_strings_global),
        "n_tags_total": sum(1 for s in all_strings_global if s["class"] == "TAG"),
        "n_unique_tags_global": len(global_tags),
        "global_top_repeated_tags": [
            {"tag": t, "count": c} for t, c in global_tags.most_common(10) if c >= 2
        ],
        "by_node": aggregates,
        "elapsed_seconds": round(time.time() - t0, 1),
    }

    OUT_AGG.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_AGG, "w") as f:
        json.dump(out_agg, f, indent=2, ensure_ascii=False)
    with open(OUT_PER_PHOTO, "w") as f:
        json.dump({"photos": per_photo}, f, indent=2, ensure_ascii=False)

    print(f"[done] {len(per_photo)} fotos, {len(all_strings_global)} strings totales, "
          f"{out_agg['n_tags_total']} TAGs ({out_agg['n_unique_tags_global']} únicos). "
          f"Salidas: {OUT_AGG.name}, {OUT_PER_PHOTO.name}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
