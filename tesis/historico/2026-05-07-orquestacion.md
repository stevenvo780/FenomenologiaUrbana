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

## Ciclo 2 — 2026-05-07 22:20 (-05:00)

Subidas rsync (uno a uno, 30s entre cada uno, orden ASC por tamaño):

- 22:20:11 uploaded VID_20260505_095806.compressed.mp4 (49 MB) en ~5s
- 22:20:54 uploaded VID_20260505_094243902_02.compressed.mp4 (54 MB) en ~1s
- 22:21:33 uploaded VID_20260505_154051.compressed.mp4 (73 MB) en ~2s
- 22:22:11 uploaded VID_20260505_101033.compressed.mp4 (74 MB) en ~1s
- 22:22:51 uploaded VID_20260505_155144.compressed.mp4 (139 MB) en ~3s
- 22:23:32 uploaded VID_20260505_104808.compressed.mp4 (180 MB) en ~3s
- 22:24:12 uploaded VID_20260505_112136.compressed.mp4 (209 MB, resume from 122 MB partial) en ~2s

Total: 7 subidas exitosas, 0 fallos, 0 reintentos. La 8va planificada (`100656`, 220 MB) ya estaba en torre desde antes y se omitió.

Estado torre tras subidas:

- videos raw: 17 (5 originales + 11 .compressed + 1 corto excluido)
- video_saturation_*.json: 15 (todos los procesables; 114547 omitido por corto)
- .error files: ninguno
- workers: 2060 procesó 101033 en vivo; 5070ti procesó 104808 y 155144 en serie

Cruce de matriz (sobre torre):

- `git pull --ff-only`: aplicado tras backup de 4 archivos processed locales (c1_hourly_projection, collapse_matrix, photo_node_assignments, video_node_assignments).
- `assign_videos_by_time.py`: 17 videos asignados a nodos por proximidad temporal con fotos GPS.
- `update_video_metadata.py` (vía docker fenomurb/proc:cuda128): 12 sidecars + 12 saturation actualizados.
- `build_collapse_matrix.py`: decisiones = `{flujo_ordinario: 3, inconcluyente: 32, friccion_acumulada: 1}`.
- `inspect_matrix.py`:
  - friccion_acumulada: `junin_paseo | peak_am` (flag C4, cov=2)
  - flujo_ordinario: `san_antonio_metro|peak_am`, `junin_paseo|midday`, `parque_berrio|midday`
  - C1 p75 cases/hour por ventana: peak_am=46.27, midday=27.76, peak_pm=62.46, night=34.70

Bajada local (scp):

- `collapse_matrix.json`, `video_node_assignments.json`, `c1_hourly_projection.json` -> `investigacion/data/processed/`.

Publicación a frontend:

- `publish_collapse_to_frontend.py` -> `public/data/frontend_payload.json` (decisiones idénticas).

Eventos:

- Resumen rsync de 112136 con `--partial` funcionó: ahorró ~122 MB ya transferidos.
- Las asignaciones `peak_pm` y `night` quedan con `conf=very_low` (Δ>17000s) porque no hay fotos GPS en esas ventanas; las celdas correspondientes terminaron `inconcluyente` por baja cobertura.
- Solo `junin_paseo|peak_am` mantiene una decisión activa de fricción (señal C4 saturada).

Pendiente próximos ciclos:

- Aumentar cobertura temporal en peak_pm/night (más fotos GPS o videos con metadata explícita).
- Revisar si transcripts vacíos persisten en los nuevos comprimidos.
- Considerar limpieza de `*.bak.*` en torre si confirmamos que git pull no destruyó info válida.

## Ciclo 3 — 2026-05-07 (post-fix C1)

Fix aplicado a `build_collapse_matrix.py`: ahora respeta el bloque precomputado `c1_high_by_window` de `c1_hourly_projection.json` en lugar de reevaluar contra la mediana mensual. Tras regenerar la matriz:

- decisiones = `{colapso_fenomenologico: 0, friccion_acumulada: 4, inconcluyente: 32, flujo_ordinario: 0}`.
- friccion_acumulada: `san_antonio_metro|peak_am`, `junin_paseo|peak_am` (única 2/4: C1+C4, p75=0.465), `junin_paseo|midday`, `parque_berrio|midday`.
- 32 celdas inconcluyentes por cobertura < 2 fuentes (C2 vacío 0/36, C3 vacío 0/36).
- Hallazgo único defendible: `junin_paseo|peak_am`.

Bajada local: `collapse_matrix.json` regenerado y publicado a `public/data/frontend_payload.json`. Decisión metodológica registrada en `tesis/pendientes/colapso-validacion-2026-05-07.md`.
