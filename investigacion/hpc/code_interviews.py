"""
Codificación automática de transcripciones según el esquema C3:
  HABITABLE / DESEABLE / EVITABLE / NO_DESEABLE / DIFICIL_DE_VIVIR / AMBIVALENTE

Usa el LLM local Ollama corriendo en la torre (`localhost:11434`) con qwen3:14b
por defecto. Soporta dos formatos de entrada:

1. Archivos `.txt` o `.md` en `data/interim/YYYY_MM_DD/interviews/` (transcripción
   manual del colaborador externo). Cada archivo es una entrevista o segmento.

2. Archivos `transcript_*.json` en `data/processed/` (transcripciones de Whisper
   de videos). Solo se procesan si tienen texto sustancial (>50 chars).

Salida: un `*.coded.json` por entrada, con:
  {
    "source": <ruta>,
    "video": <opcional>,
    "node": <id de nodo si se detecta>,
    "window": <franja si se detecta>,
    "captured_at": <opcional>,
    "language": "es",
    "model": "qwen3:14b",
    "codes": ["HABITABLE", ...],
    "evidence": [{"code": "...", "quote": "...", "rationale": "..."}],
    "raw_classifications": [...]
  }

El JSON resultado es lo que `build_collapse_matrix.py` consume para C3.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

NODES = [
    "san_antonio_metro", "parque_san_antonio", "palacio_nacional",
    "junin_paseo", "oriental_cruce", "parque_berrio",
    "carabobo_cultural", "plaza_botero", "museo_antioquia",
]
NODE_ALIASES = {
    "san_antonio_metro": ["san antonio metro", "metro san antonio", "estacion san antonio", "san antonio"],
    "parque_san_antonio": ["parque san antonio"],
    "palacio_nacional": ["palacio nacional", "palacio"],
    "junin_paseo": ["junin", "junín", "paseo junin", "paseo junín"],
    "oriental_cruce": ["cruce oriental", "oriental", "avenida oriental"],
    "parque_berrio": ["parque berrio", "parque berrío", "berrio", "berrío"],
    "carabobo_cultural": ["carabobo"],
    "plaza_botero": ["plaza botero", "botero"],
    "museo_antioquia": ["museo de antioquia", "museo antioquia", "museo"],
}
WINDOWS = ["peak_am", "midday", "peak_pm", "night"]
WINDOW_ALIASES = {
    "peak_am": ["mañana", "amanecer", "temprano", "7 de la mañana", "8 de la mañana", "9 de la mañana", "antes del mediodia"],
    "midday": ["mediodia", "mediodía", "almuerzo", "12 del dia", "1 de la tarde", "2 de la tarde"],
    "peak_pm": ["tarde", "atardecer", "5 de la tarde", "6 de la tarde", "salida del trabajo", "hora pico de la tarde"],
    "night": ["noche", "tarde-noche", "8 de la noche", "9 de la noche", "10 de la noche", "oscuridad", "ya de noche"],
}
CODES = ["HABITABLE", "DESEABLE", "EVITABLE", "NO_DESEABLE", "DIFICIL_DE_VIVIR", "AMBIVALENTE"]

SYSTEM_PROMPT = """Eres un asistente que codifica testimonios sobre la habitabilidad del corredor Junín-San Antonio en el centro de Medellín, Colombia, para una tesis de fenomenología urbana.

Códigos disponibles (asigna uno o más, solo si hay evidencia textual clara):
- HABITABLE: la persona declara que el lugar es vivible, transitable sin costo subjetivo significativo.
- DESEABLE: la persona declara que es agradable estar ahí, lo busca, lo recomienda.
- EVITABLE: la persona declara que evita ese lugar o esa franja horaria.
- NO_DESEABLE: la persona declara que no es agradable estar ahí.
- DIFICIL_DE_VIVIR: la persona declara que el lugar es duro de habitar (inseguridad, ruido, suciedad, miedo, expulsión).
- AMBIVALENTE: la persona expresa contradicciones o matiza ("a veces sí, a veces no", "depende de la hora").

Nodos del corredor (úsalos si aparecen mencionados): san_antonio_metro, parque_san_antonio, palacio_nacional, junin_paseo, oriental_cruce, parque_berrio, carabobo_cultural, plaza_botero, museo_antioquia.

Franjas horarias: peak_am (07-10), midday (10-15), peak_pm (15-20), night (20-23).

Responde EXCLUSIVAMENTE en JSON válido con esta estructura:
{
  "node": "<id_nodo o null>",
  "window": "<peak_am|midday|peak_pm|night o null>",
  "codes": ["CODIGO1", ...],
  "evidence": [
    {"code": "CODIGO1", "quote": "fragmento literal del testimonio", "rationale": "justificación breve"}
  ]
}

Reglas estrictas:
- Solo asigna código si hay evidencia textual; si no hay, devuelve "codes": [].
- Si el testimonio no menciona nodo o franja explícitamente, devuelve null en esos campos.
- No inventes citas: la "quote" debe ser texto literal del testimonio.
- AMBIVALENTE solo si hay contradicción explícita; no lo uses como cajón de sastre.
- Si el texto no es un testimonio sobre el corredor (es ruido ambiente, conversación trivial, etc.), devuelve "codes": [] y "node": null.
"""


def call_ollama(base_url: str, model: str, prompt: str, timeout_s: int = 120) -> dict:
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.0, "num_ctx": 8192},
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/api/chat",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        raw = resp.read().decode("utf-8")
    out = json.loads(raw)
    content = (out.get("message") or {}).get("content") or ""
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # extraer primer bloque JSON
        m = re.search(r"\{[\s\S]*\}", content)
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                pass
        return {"node": None, "window": None, "codes": [], "evidence": [], "_raw": content}


def detect_node_window_textual(text: str) -> tuple[str | None, str | None]:
    t = text.lower()
    node = None
    for nid, aliases in NODE_ALIASES.items():
        if any(a in t for a in aliases):
            node = nid
            break
    window = None
    for wid, aliases in WINDOW_ALIASES.items():
        if any(a in t for a in aliases):
            window = wid
            break
    return node, window


def split_text(text: str, max_chars: int = 4000) -> list[str]:
    if len(text) <= max_chars:
        return [text.strip()]
    chunks = []
    cur = ""
    for line in text.splitlines(keepends=True):
        if len(cur) + len(line) > max_chars and cur:
            chunks.append(cur.strip())
            cur = ""
        cur += line
    if cur.strip():
        chunks.append(cur.strip())
    return chunks


def merge_results(parts: list[dict]) -> dict:
    codes: list[str] = []
    evidence: list[dict] = []
    nodes_set: list[str] = []
    windows_set: list[str] = []
    for p in parts:
        for c in p.get("codes") or []:
            if c.upper() in CODES and c.upper() not in codes:
                codes.append(c.upper())
        for e in p.get("evidence") or []:
            if isinstance(e, dict):
                evidence.append(e)
        if p.get("node") and p["node"] in NODES and p["node"] not in nodes_set:
            nodes_set.append(p["node"])
        if p.get("window") and p["window"] in WINDOWS and p["window"] not in windows_set:
            windows_set.append(p["window"])
    return {
        "codes": codes,
        "evidence": evidence,
        "node": nodes_set[0] if nodes_set else None,
        "window": windows_set[0] if windows_set else None,
        "node_candidates": nodes_set,
        "window_candidates": windows_set,
    }


def parse_metadata_from_path(path: Path, root: Path) -> dict:
    meta: dict = {}
    try:
        rel = path.relative_to(root)
        for part in rel.parts:
            if re.match(r"\d{4}_\d{2}_\d{2}", part):
                meta["jornada"] = part.replace("_", "-")
                break
    except ValueError:
        pass
    return meta


def process_text_file(path: Path, root: Path, base_url: str, model: str) -> dict | None:
    text = path.read_text(encoding="utf-8", errors="replace")
    if len(text.strip()) < 30:
        return None
    chunks = split_text(text)
    parts = [call_ollama(base_url, model, c) for c in chunks]
    merged = merge_results(parts)
    n_text, w_text = detect_node_window_textual(text)
    return {
        "source": str(path),
        "language": "es",
        "model": model,
        "node": merged["node"] or n_text,
        "window": merged["window"] or w_text,
        "node_candidates": merged["node_candidates"],
        "window_candidates": merged["window_candidates"],
        "node_textual": n_text,
        "window_textual": w_text,
        "codes": merged["codes"],
        "evidence": merged["evidence"],
        "raw_classifications": parts,
        "metadata_from_path": parse_metadata_from_path(path, root),
    }


def process_transcript_json(path: Path, base_url: str, model: str) -> dict | None:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None
    whisper = data.get("whisper") or {}
    text = whisper.get("text") or ""
    if len(text.strip()) < 50:
        return None
    chunks = split_text(text)
    parts = [call_ollama(base_url, model, c) for c in chunks]
    merged = merge_results(parts)
    n_text, w_text = detect_node_window_textual(text)
    return {
        "source": str(path),
        "video": data.get("video"),
        "node": data.get("node") or merged["node"] or n_text,
        "window": data.get("window") or merged["window"] or w_text,
        "captured_at": data.get("captured_at"),
        "language": data.get("language") or "es",
        "model": model,
        "codes": merged["codes"],
        "evidence": merged["evidence"],
        "raw_classifications": parts,
        "node_textual": n_text,
        "window_textual": w_text,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--ollama-url", default=os.environ.get("OLLAMA_URL", "http://localhost:11434"))
    ap.add_argument("--model", default=os.environ.get("OLLAMA_MODEL", "qwen3:14b"))
    ap.add_argument("--include-whisper", action="store_true",
                    help="También codifica las transcripciones de Whisper (transcript_*.json)")
    ap.add_argument("--out-suffix", default=".coded.json")
    args = ap.parse_args()

    interim = args.root / "data" / "interim"
    processed = args.root / "data" / "processed"

    todo: list[tuple[str, Path]] = []
    for txt in interim.rglob("*.txt"):
        todo.append(("text", txt))
    for md in interim.rglob("*.md"):
        if md.name.lower().startswith("readme"):
            continue
        todo.append(("text", md))
    if args.include_whisper:
        for j in processed.glob("transcript_*.json"):
            todo.append(("whisper", j))

    print(f"archivos a codificar: {len(todo)}")
    if not todo:
        print("Nada que codificar. Asegúrate de tener:")
        print(f"  - {interim}/YYYY_MM_DD/interviews/*.txt|.md  (entrevistas transcritas)")
        print(f"  - --include-whisper para procesar también transcript_*.json de video")
        return 0

    n_ok = n_skip = n_fail = 0
    for kind, path in todo:
        out_path = path.with_suffix(path.suffix + args.out_suffix) if kind == "text" else path.with_suffix(".coded.json")
        if out_path.exists():
            n_skip += 1
            continue
        try:
            if kind == "text":
                result = process_text_file(path, args.root, args.ollama_url, args.model)
            else:
                result = process_transcript_json(path, args.ollama_url, args.model)
            if result is None:
                n_skip += 1
                continue
            out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
            codes = ",".join(result.get("codes", [])) or "-"
            print(f"[ok] {path.name}: codes={codes} node={result.get('node')} window={result.get('window')}")
            n_ok += 1
        except Exception as exc:
            print(f"[fail] {path.name}: {exc}", file=sys.stderr)
            n_fail += 1

    print(f"\nresumen: ok={n_ok} skip={n_skip} fail={n_fail}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
