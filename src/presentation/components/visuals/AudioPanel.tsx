import type { CSSProperties } from 'react'
import type { AudioClassification, AudioPerNode } from '../../../types'

const NODE_LABELS: Record<string, string> = {
  san_antonio_metro: 'S. Antonio Metro',
  parque_san_antonio: 'Parque S. Antonio',
  palacio_nacional: 'Palacio Nacional',
  junin_paseo: 'Junín',
  oriental_cruce: 'Cruce Oriental',
  parque_berrio: 'Parque Berrío',
  carabobo_cultural: 'Carabobo',
  plaza_botero: 'Plaza Botero',
  museo_antioquia: 'Museo Antioquia',
}

// Map RMS dB (~ -60..-20) to a 0..1 visual fill for the bar.
function dbToFill(db: number): number {
  const clamped = Math.max(-60, Math.min(-15, db))
  return (clamped + 60) / 45
}

function genreLabel(g?: string): string {
  if (!g) return '—'
  if (g === 'no_music') return 'sin música'
  if (g === 'music_other') return 'música'
  if (g === 'ambiguous') return 'ambigua'
  return g
}

function pct(x: number | undefined): string {
  if (x === undefined || x === null || Number.isNaN(x)) return '—'
  return `${Math.round(x * 100)}%`
}

export function AudioPanel({ data }: { data?: AudioClassification }) {
  if (!data || !data.per_node || Object.keys(data.per_node).length === 0) return null

  const entries = Object.entries(data.per_node) as Array<[string, AudioPerNode]>

  return (
    <article className="deck-panel audio-panel">
      <p className="deck-eyebrow">Clasificación acústica · PANNs CNN14 · {data.n_videos_processed ?? '—'} videos</p>
      <h3>
        Junín música 100% · Berrío RMS máx <strong>-24.3 dB</strong>
        <span className="badge badge-good" style={{ marginLeft: 8 }}>audio-fingerprint</span>
      </h3>
      <div className="audio-grid">
        {entries.map(([node, n]) => {
          const dbProxy = n.noise_level_db_proxy
          const dbMax = n.noise_level_db_max
          const fill = dbMax !== undefined ? dbToFill(dbMax) : 0
          const isJunin = node === 'junin_paseo' && (n.music_activity_ratio ?? 0) >= 0.99
          const isBerrio = node === 'parque_berrio' && dbMax !== undefined && dbMax >= -25
          const highlight = isJunin || isBerrio
          return (
            <div key={node} className={`audio-card ${highlight ? 'audio-card--highlight' : ''}`}>
              <div className="audio-card__head">
                <strong>{NODE_LABELS[node] ?? node}</strong>
                <span className="badge badge-muted">{n.n_videos} vid</span>
                {isJunin && <span className="badge badge-good">música 100%</span>}
                {isBerrio && <span className="badge badge-warn">pico ruido</span>}
              </div>
              <div className="audio-card__row">
                <span>Género</span>
                <strong>{genreLabel(n.dominant_genre)}</strong>
              </div>
              <div className="audio-card__row">
                <span>Música</span>
                <strong>{pct(n.music_activity_ratio)}</strong>
              </div>
              <div className="audio-card__row">
                <span>Voz</span>
                <strong>{pct(n.voice_activity_ratio)}</strong>
              </div>
              <div className="audio-card__row">
                <span>Tráfico</span>
                <strong>{pct(n.traffic_intensity)}</strong>
              </div>
              <div className="audio-card__bar">
                <div className="audio-card__bar-label">
                  <span>RMS dB</span>
                  <strong>{dbProxy?.toFixed(1) ?? '—'} / máx {dbMax?.toFixed(1) ?? '—'}</strong>
                </div>
                <div className="audio-card__bar-track">
                  <div
                    className="audio-card__bar-fill"
                    style={{ '--fill': fill } as CSSProperties}
                  />
                </div>
              </div>
              {n.siren_events !== undefined && n.siren_events > 0 && (
                <small className="audio-card__siren">sirena: {n.siren_events} ev</small>
              )}
            </div>
          )
        })}
      </div>
      <p className="audio-panel__legend">
        AudioSet 527 clases · tempo + sub-bass para género; reggaeton/vallenato no separable (marcado “_likely”).
      </p>
    </article>
  )
}
