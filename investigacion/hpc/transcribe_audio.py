"""
Extrae audio de los videos crudos y los transcribe con el servicio Whisper ASR
que ya corre en la torre (`localhost:8007` -> contenedor `stt-whisper`,
imagen `onerahmet/openai-whisper-asr-webservice`).

Salida: investigacion/data/processed/transcript_<basename>.json

Cooperativo con los demás workers vía locks .transcript.lock/.done en --jobs-dir.
No usa GPU directamente: solo CPU + ffmpeg + HTTP a Whisper. Ideal para ejecutar
en la misma máquina sin competir con proc-5070ti / proc-2060.
"""

from __future__ import annotations

import argparse
import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Iterable

VIDEO_EXTS = (".mp4", ".mov", ".mkv", ".avi", ".m4v")
LOCK_SUFFIX = ".transcript.lock"
DONE_SUFFIX = ".transcript.done"
ERR_SUFFIX = ".transcript.error"


def parse_metadata(video_path: Path) -> dict:
    sidecar = video_path.with_suffix(video_path.suffix + ".meta.json")
    if sidecar.exists():
        try:
            return json.loads(sidecar.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def claim_job(jobs_dir: Path, video: Path) -> bool:
    jobs_dir.mkdir(parents=True, exist_ok=True)
    if (jobs_dir / f"{video.name}{DONE_SUFFIX}").exists():
        return False
    if (jobs_dir / f"{video.name}{ERR_SUFFIX}").exists():
        return False
    lock = jobs_dir / f"{video.name}{LOCK_SUFFIX}"
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        with os.fdopen(fd, "w") as f:
            f.write(json.dumps({"host": socket.gethostname(), "ts": time.time()}))
        return True
    except FileExistsError:
        return False


def mark_done(jobs_dir: Path, video: Path, info: dict) -> None:
    (jobs_dir / f"{video.name}{LOCK_SUFFIX}").unlink(missing_ok=True)
    (jobs_dir / f"{video.name}{DONE_SUFFIX}").write_text(
        json.dumps(info, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def mark_error(jobs_dir: Path, video: Path, msg: str) -> None:
    (jobs_dir / f"{video.name}{LOCK_SUFFIX}").unlink(missing_ok=True)
    (jobs_dir / f"{video.name}{ERR_SUFFIX}").write_text(msg, encoding="utf-8")


def iter_videos(raw_dir: Path) -> Iterable[Path]:
    for p in sorted(raw_dir.rglob("*")):
        if p.is_file() and p.suffix.lower() in VIDEO_EXTS:
            yield p


def extract_audio_to_wav(video: Path, target_sr: int = 16000) -> Path:
    tmp = Path(tempfile.mkstemp(suffix=".wav")[1])
    cmd = [
        "ffmpeg", "-v", "error", "-y", "-i", str(video),
        "-vn", "-ac", "1", "-ar", str(target_sr),
        str(tmp),
    ]
    proc = subprocess.run(cmd, capture_output=True, check=False)
    if proc.returncode != 0:
        tmp.unlink(missing_ok=True)
        raise RuntimeError(f"ffmpeg falló: {proc.stderr.decode(errors='ignore')[:300]}")
    if tmp.stat().st_size < 1024:
        tmp.unlink(missing_ok=True)
        raise RuntimeError("audio extraído vacío o nulo")
    return tmp


def whisper_transcribe(wav_path: Path, base_url: str, language: str, task: str, timeout_s: int) -> dict:
    """Envía un WAV al endpoint /asr de openai-whisper-asr-webservice."""
    boundary = f"----fenomurb-{int(time.time()*1000)}"
    field_name = "audio_file"
    filename = wav_path.name
    file_bytes = wav_path.read_bytes()
    body_parts = [
        f"--{boundary}\r\n".encode(),
        f"Content-Disposition: form-data; name=\"{field_name}\"; filename=\"{filename}\"\r\n".encode(),
        b"Content-Type: audio/wav\r\n\r\n",
        file_bytes,
        f"\r\n--{boundary}--\r\n".encode(),
    ]
    body = b"".join(body_parts)
    url = f"{base_url.rstrip('/')}/asr?task={task}&language={language}&output=json&word_timestamps=true"
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"text": raw}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    parser.add_argument("--jobs-dir", type=Path, required=True)
    parser.add_argument("--whisper-url", default=os.environ.get("WHISPER_URL", "http://localhost:8007"))
    parser.add_argument("--language", default=os.environ.get("WHISPER_LANG", "es"))
    parser.add_argument("--task", default=os.environ.get("WHISPER_TASK", "transcribe"))
    parser.add_argument("--timeout", type=int, default=int(os.environ.get("WHISPER_TIMEOUT", "1800")))
    parser.add_argument("--poll-seconds", type=int, default=20)
    args = parser.parse_args()

    while True:
        any_claimed = False
        for video in iter_videos(args.raw_dir):
            if not claim_job(args.jobs_dir, video):
                continue
            any_claimed = True
            t0 = time.time()
            try:
                wav = extract_audio_to_wav(video)
                try:
                    result = whisper_transcribe(
                        wav,
                        base_url=args.whisper_url,
                        language=args.language,
                        task=args.task,
                        timeout_s=args.timeout,
                    )
                finally:
                    wav.unlink(missing_ok=True)

                meta = parse_metadata(video)
                wrapped = {
                    "video": video.name,
                    "node": meta.get("node"),
                    "window": meta.get("window"),
                    "captured_at": meta.get("captured_at"),
                    "language": args.language,
                    "task": args.task,
                    "duration_processing_s": time.time() - t0,
                    "whisper": result,
                }
                args.out_dir.mkdir(parents=True, exist_ok=True)
                out_path = args.out_dir / f"transcript_{video.stem}.json"
                out_path.write_text(json.dumps(wrapped, ensure_ascii=False, indent=2), encoding="utf-8")
                mark_done(args.jobs_dir, video, {"out": str(out_path), "duration_s": time.time() - t0})
                text = (result.get("text") or "")[:120].replace("\n", " ")
                print(f"[transcribe] OK {video.name} t={time.time()-t0:.1f}s text='{text}...'", flush=True)
            except Exception as exc:
                msg = f"{type(exc).__name__}: {exc}"
                print(f"[transcribe] FAIL {video.name}: {msg}", file=sys.stderr, flush=True)
                mark_error(args.jobs_dir, video, msg)
        if not any_claimed:
            time.sleep(args.poll_seconds)


if __name__ == "__main__":
    sys.exit(main() or 0)
