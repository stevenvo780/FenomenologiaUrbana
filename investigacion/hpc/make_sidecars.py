"""
Genera sidecars <video>.meta.json con captured_at derivado del nombre del archivo.

Soporta dos convenciones:
  1. NODE__WINDOW__YYYY-MM-DD__libre.ext  (ya preconfigurada → no se sobrescribe)
  2. VID_YYYYMMDD_HHMMSS.ext               (timestamp del celular → captured_at -05:00)

Uso:
  python make_sidecars.py --dir /ruta/a/videos [--node X] [--window Y]

No sobrescribe sidecars existentes a menos que se pase --force.
Si --node y --window se pasan en CLI, se aplican a todos los videos (útil cuando
una jornada entera se grabó en un mismo nodo y franja).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

VIDEO_EXTS = (".mp4", ".mov", ".mkv", ".avi", ".m4v")
PHONE_RE = re.compile(r"VID_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})", re.IGNORECASE)
NAMED_RE = re.compile(r"^([a-z_]+)__([a-z_]+)__(\d{4}-\d{2}-\d{2})__")


def derive_meta(name: str) -> dict:
    base = name.rsplit(".", 1)[0]
    meta: dict = {"node": None, "window": None, "captured_at": None}
    m_named = NAMED_RE.match(base)
    if m_named:
        meta["node"] = m_named.group(1)
        meta["window"] = m_named.group(2)
        meta["captured_at"] = m_named.group(3)
        return meta
    m_phone = PHONE_RE.search(base)
    if m_phone:
        y, mo, d, h, mi, s = m_phone.groups()
        meta["captured_at"] = f"{y}-{mo}-{d}T{h}:{mi}:{s}-05:00"
    return meta


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", type=Path, required=True)
    ap.add_argument("--node", default=None)
    ap.add_argument("--window", default=None)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    if not args.dir.is_dir():
        print(f"no existe {args.dir}", file=sys.stderr)
        return 2

    written = skipped = 0
    for v in sorted(args.dir.iterdir()):
        if not v.is_file() or v.suffix.lower() not in VIDEO_EXTS:
            continue
        sidecar = v.with_suffix(v.suffix + ".meta.json")
        if sidecar.exists() and not args.force:
            skipped += 1
            continue
        meta = derive_meta(v.name)
        if args.node:
            meta["node"] = args.node
        if args.window:
            meta["window"] = args.window
        sidecar.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{v.name} -> node={meta['node']} window={meta['window']} captured_at={meta['captured_at']}")
        written += 1

    print(f"\nTotal: {written} sidecars escritos, {skipped} preexistentes preservados.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
