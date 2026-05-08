#!/usr/bin/env python3
"""
classify_audio.py — M3 audio classification (Tarea R).

Procesa videos de campo en investigacion/data/raw/video/, extrae audio a 16kHz mono,
clasifica con PANNs (CNN14 sobre AudioSet, 527 clases) + features espectrales librosa,
y agrega por nodo×ventana usando video_node_assignments.json.

Salidas:
- investigacion/data/interim/2026-05-05/audio_features/<basename>.json (per-video)
- investigacion/data/processed/m3_audio_classification.json (agregado)

Heurística género:
  AudioSet no separa reggaetón/vallenato. Usamos:
    * Si "Music of Latin America" / "Salsa music" / "Reggae" en top-k AND tempo BPM ~85-105
      con energía baja-media en sub-bass → likely vallenato (acordeón, tempo de paseo)
    * Si "Music of Latin America" / "Hip hop music" / "Reggae" AND tempo 88-100 con
      energía fuerte en sub-bass (kick + dembow) → likely reggaetón
    * Si tempo > 110 o salsa específica → salsa/cumbia
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import time
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np

# Rutas (montadas en el contenedor en /workspace si se invoca dentro)
REPO_ROOT_HOST = Path("/datos/repos/FenomenologiaUrbana")
REPO_ROOT = Path(os.environ.get("REPO_ROOT", "/workspace"))
if not REPO_ROOT.exists():
    REPO_ROOT = REPO_ROOT_HOST

VIDEO_DIR = REPO_ROOT / "investigacion/data/raw/video"
ASSIGN_JSON = REPO_ROOT / "investigacion/data/processed/video_node_assignments.json"
INTERIM_DIR = REPO_ROOT / "investigacion/data/interim/2026-05-05/audio_features"
OUT_JSON = REPO_ROOT / "investigacion/data/processed/m3_audio_classification.json"

INTERIM_DIR.mkdir(parents=True, exist_ok=True)

# Categorías AudioSet
LABEL_CATEGORIES = {
    "speech": [0, 1, 2, 3, 7, 69, 70],         # Speech, Crowd, Hubbub
    "siren":  [322, 323, 324, 325, 396, 397],  # Emergency vehicle / sirens
    "vehicle":[300, 306, 308, 327, 343, 344, 348, 349, 350, 351],
    "wind":   [283, 285],
    "music":  [137],                            # generic music
    "music_latin_am": [248],
    "salsa":  [249],
    "reggae": [228],
    "hip_hop":[217],
    "rapping":[36],
    "pop":    [216],
    "rock":   [219],
    "electronic": [239, 240, 245, 247, 274],
}


def have_ffmpeg() -> bool:
    return subprocess.run(["which", "ffmpeg"], capture_output=True).returncode == 0


def extract_audio(video: Path, out_wav: Path) -> bool:
    if out_wav.exists() and out_wav.stat().st_size > 1024:
        return True
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(video),
        "-vn", "-ac", "1", "-ar", "16000",
        "-f", "wav", str(out_wav),
    ]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        sys.stderr.write(f"[ffmpeg fail] {video.name}: {res.stderr.decode()[:200]}\n")
        return False
    return True


def spectral_features(wav_path: Path) -> dict:
    import librosa
    y, sr = librosa.load(str(wav_path), sr=16000, mono=True)
    if y.size == 0:
        return {"duration_s": 0.0}
    duration = float(len(y) / sr)
    rms = float(np.sqrt(np.mean(y ** 2) + 1e-12))
    rms_db = 20.0 * np.log10(rms + 1e-9)
    sc = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
    sb = float(np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)))
    # tempo
    try:
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        tempo = float(np.atleast_1d(tempo)[0])
    except Exception:
        tempo = 0.0
    # sub-bass energy ratio (40-120 Hz)
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    sub = (freqs >= 40) & (freqs <= 120)
    total_e = float(np.sum(S))
    sub_e = float(np.sum(S[sub, :]))
    sub_ratio = sub_e / (total_e + 1e-9)
    return {
        "duration_s": round(duration, 2),
        "rms": round(rms, 5),
        "rms_db": round(rms_db, 2),
        "spectral_centroid_hz": round(sc, 1),
        "spectral_bandwidth_hz": round(sb, 1),
        "zero_crossing_rate": round(zcr, 4),
        "tempo_bpm": round(tempo, 1),
        "sub_bass_ratio": round(sub_ratio, 4),
    }


_AT = None
_LABELS = None


def get_tagger():
    global _AT, _LABELS
    if _AT is None:
        from panns_inference import AudioTagging, labels
        # Usa GPU si está disponible
        device = "cuda" if os.environ.get("USE_CUDA", "1") == "1" else "cpu"
        try:
            import torch
            if not torch.cuda.is_available():
                device = "cpu"
        except Exception:
            device = "cpu"
        _AT = AudioTagging(checkpoint_path=None, device=device)
        _LABELS = labels
    return _AT, _LABELS


def panns_classify(wav_path: Path, top_k: int = 10) -> dict:
    import librosa
    at, labels = get_tagger()
    # PANNs CNN14 espera 32kHz mono
    y, sr = librosa.load(str(wav_path), sr=32000, mono=True)
    if y.size == 0:
        return {"top": [], "categories": {}}
    audio = y[None, :].astype(np.float32)
    clipwise, _ = at.inference(audio)
    probs = clipwise[0]
    top_idx = np.argsort(probs)[::-1][:top_k]
    top = [{"idx": int(i), "label": labels[int(i)], "score": float(probs[int(i)])} for i in top_idx]

    cat_scores = {}
    for cat, idxs in LABEL_CATEGORIES.items():
        cat_scores[cat] = float(max(probs[i] for i in idxs))
    return {"top": top, "categories": cat_scores}


def detect_genre(panns_cats: dict, feats: dict) -> str:
    """Heurística para reggaetón vs vallenato vs salsa vs otro."""
    if not panns_cats:
        return "unknown"
    music_score = panns_cats.get("music", 0.0)
    latin = panns_cats.get("music_latin_am", 0.0)
    salsa = panns_cats.get("salsa", 0.0)
    reggae = panns_cats.get("reggae", 0.0)
    hip = panns_cats.get("hip_hop", 0.0)
    rap = panns_cats.get("rapping", 0.0)

    if music_score < 0.15 and latin < 0.10 and salsa < 0.05 and reggae < 0.05:
        return "no_music"

    tempo = feats.get("tempo_bpm", 0.0) or 0.0
    sub = feats.get("sub_bass_ratio", 0.0) or 0.0

    # Reggaetón: dembow → tempo 88-100, sub_bass alto, hip-hop/reggae fuerte
    is_reggaeton = (
        (reggae > 0.08 or hip > 0.08 or rap > 0.05 or latin > 0.10)
        and 85.0 <= tempo <= 105.0
        and sub >= 0.10
    )
    # Vallenato: paseo 90-120 bpm, sub_bass bajo (acordeón, no kick electrónico)
    is_vallenato = (
        latin > 0.08
        and 80.0 <= tempo <= 130.0
        and sub < 0.10
        and reggae < 0.10
        and hip < 0.10
    )
    if salsa > 0.10 and tempo >= 95.0:
        return "salsa"
    if is_reggaeton:
        return "reggaeton_likely"
    if is_vallenato:
        return "vallenato_likely"
    if latin > 0.08:
        return "latin_other"
    if hip > 0.08 or rap > 0.05:
        return "hip_hop"
    if reggae > 0.10:
        return "reggae"
    if music_score > 0.30:
        return "music_other"
    return "ambiguous"


def process_video(video: Path, tmpdir: Path) -> dict | None:
    base = video.name
    out_json = INTERIM_DIR / f"{base}.audio.json"
    if out_json.exists():
        try:
            with out_json.open() as f:
                return json.load(f)
        except Exception:
            pass

    wav = tmpdir / f"{base}.wav"
    t0 = time.time()
    if not extract_audio(video, wav):
        return None
    feats = spectral_features(wav)
    try:
        panns = panns_classify(wav, top_k=10)
    except Exception as e:
        sys.stderr.write(f"[panns fail] {base}: {e}\n")
        panns = {"top": [], "categories": {}}
    genre = detect_genre(panns.get("categories", {}), feats)

    rec = {
        "video": base,
        "duration_s": feats.get("duration_s"),
        "spectral": feats,
        "panns_top10": panns.get("top", []),
        "panns_categories": panns.get("categories", {}),
        "detected_genre": genre,
        "elapsed_s": round(time.time() - t0, 1),
    }
    with out_json.open("w") as f:
        json.dump(rec, f, indent=2, ensure_ascii=False)
    try:
        wav.unlink()
    except Exception:
        pass
    return rec


def aggregate_per_node(records: list[dict], assignments: list[dict]) -> dict:
    by_video = {a["video"]: a for a in assignments}
    by_node_window: dict[tuple[str, str], list[dict]] = defaultdict(list)
    by_node: dict[str, list[dict]] = defaultdict(list)
    for rec in records:
        a = by_video.get(rec["video"])
        if not a:
            continue
        node = a.get("node") or "unknown"
        win = a.get("window") or "unknown"
        rec["_node"] = node
        rec["_window"] = win
        by_node_window[(node, win)].append(rec)
        by_node[node].append(rec)

    def summarize(recs: list[dict]) -> dict:
        if not recs:
            return {}
        genres = Counter(r["detected_genre"] for r in recs)
        rms_db_vals = [r["spectral"].get("rms_db", -100.0) for r in recs if r.get("spectral")]
        sc_vals = [r["spectral"].get("spectral_centroid_hz", 0.0) for r in recs if r.get("spectral")]
        speech_scores = [r["panns_categories"].get("speech", 0.0) for r in recs]
        siren_scores = [r["panns_categories"].get("siren", 0.0) for r in recs]
        vehicle_scores = [r["panns_categories"].get("vehicle", 0.0) for r in recs]
        music_scores = [r["panns_categories"].get("music", 0.0) for r in recs]
        # Counts (umbral 0.20)
        siren_events = sum(1 for s in siren_scores if s >= 0.20)
        speech_events = sum(1 for s in speech_scores if s >= 0.20)
        vehicle_events = sum(1 for s in vehicle_scores if s >= 0.20)
        dominant = genres.most_common(1)[0][0]
        return {
            "n_videos": len(recs),
            "dominant_genre": dominant,
            "genre_counts": dict(genres),
            "noise_level_db_proxy": round(float(np.mean(rms_db_vals)), 2) if rms_db_vals else None,
            "noise_level_db_max": round(float(np.max(rms_db_vals)), 2) if rms_db_vals else None,
            "spectral_centroid_mean_hz": round(float(np.mean(sc_vals)), 1) if sc_vals else None,
            "voice_activity_ratio": round(speech_events / len(recs), 3),
            "music_activity_ratio": round(sum(1 for s in music_scores if s >= 0.20) / len(recs), 3),
            "siren_events": siren_events,
            "traffic_intensity": round(sum(vehicle_scores) / len(recs), 3),
            "mean_speech_score": round(float(np.mean(speech_scores)), 3),
            "mean_siren_score": round(float(np.mean(siren_scores)), 3),
            "mean_vehicle_score": round(float(np.mean(vehicle_scores)), 3),
            "mean_music_score": round(float(np.mean(music_scores)), 3),
            "videos": [r["video"] for r in recs],
        }

    nodes_summary = {n: summarize(recs) for n, recs in by_node.items()}
    nw_summary = {f"{n}|{w}": summarize(recs) for (n, w), recs in by_node_window.items()}
    return {"per_node": nodes_summary, "per_node_window": nw_summary}


def main() -> int:
    if not have_ffmpeg():
        sys.stderr.write("ffmpeg no disponible\n")
        return 2
    if not ASSIGN_JSON.exists():
        sys.stderr.write(f"missing {ASSIGN_JSON}\n")
        return 2
    with ASSIGN_JSON.open() as f:
        assign = json.load(f)
    assignments = assign["assignments"]

    videos = sorted([p for p in VIDEO_DIR.glob("VID_*.mp4") if not p.name.endswith(".meta.json")])
    sys.stderr.write(f"[init] {len(videos)} videos to process\n")

    records: list[dict] = []
    with tempfile.TemporaryDirectory(prefix="m3audio_", dir=str(INTERIM_DIR)) as td:
        tmpdir = Path(td)
        for i, v in enumerate(videos, 1):
            sys.stderr.write(f"[{i}/{len(videos)}] {v.name} ...\n")
            rec = process_video(v, tmpdir)
            if rec is not None:
                records.append(rec)
                sys.stderr.write(
                    f"   genre={rec['detected_genre']} "
                    f"rms_db={rec['spectral'].get('rms_db')} "
                    f"tempo={rec['spectral'].get('tempo_bpm')} "
                    f"top1={rec['panns_top10'][0]['label'] if rec['panns_top10'] else 'NA'}\n"
                )

    agg = aggregate_per_node(records, assignments)

    out = {
        "schema": "m3_audio_classification.v1",
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "method": {
            "audio_extraction": "ffmpeg -ac 1 -ar 16000 wav (clasificación PANNs interna 32kHz)",
            "classifier": "PANNs CNN14 (AudioSet 527 classes)",
            "genre_heuristic": "PANNs categories + tempo (librosa beat_track) + sub-bass ratio (40-120Hz STFT)",
            "thresholds": {"event_score": 0.20, "music_floor": 0.15},
            "notes": "AudioSet no separa reggaeton/vallenato. Detecciones marcadas '_likely'.",
        },
        "n_videos_processed": len(records),
        "n_videos_total": len(videos),
        "per_video": [
            {
                "video": r["video"],
                "node": r.get("_node"),
                "window": r.get("_window"),
                "detected_genre": r["detected_genre"],
                "duration_s": r["duration_s"],
                "spectral": r["spectral"],
                "panns_categories": r["panns_categories"],
                "panns_top5": r["panns_top10"][:5],
            }
            for r in records
        ],
        "per_node": agg["per_node"],
        "per_node_window": agg["per_node_window"],
    }
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUT_JSON.open("w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    sys.stderr.write(f"[done] wrote {OUT_JSON}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
