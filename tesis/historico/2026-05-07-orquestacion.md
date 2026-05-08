# Orquestación 2026-05-07 (Claude Opus 4.7, sesión torre HPC)

Append-only log. Cada ciclo registra hora local, conteos, decisiones, eventos.

## Ciclo 1 — 2026-05-07 20:10 (-05:00)

Estado torre tras conectar:

- videos raw: 10 (.mp4)
- video_saturation_*.json: 8
- .error files: 2 (`VID_20260505_113217.compressed.mp4.error` + transcript)
- workers activos: 2060 (OK), 5070ti (OK), photos (OK), transcribe (OK)

Hallazgos:

- `VID_20260505_113217.compressed.mp4` (272 MB, dur=607s, ffprobe score=100)
  ya está completo en disco; los `.error` eran stale del primer intento durante la subida tar-pipe.
- `VID_20260505_114547.mp4` (758 KB) demasiado corto, queda fuera intencionalmente.

Acciones:

- Push pendiente del commit `60acd3c fix(hpc): skip templates, examples y synthetic en code_interviews` -> origin/main, OK.
- Removí `VID_20260505_113217.compressed.mp4.error` y `*.transcript.error` para que los workers reintenten. Worker 5070ti arrancó descarga de yolo11x.pt y ya está reintentando.

Pendiente para el siguiente ciclo:

- Confirmar que `113217.compressed` quede en outputs.
- Revisar logs de `proc_transcribe` (varios .compressed devolvieron text vacío `'...'`, hay que decidir si bloqueamos o permitimos).
- Esperar entrevistas en `data/interim/*/interviews/`.

