import type { CSSProperties } from 'react'
import type { CollapseMatrixSensitivity } from '../../../types'

const NODE_ORDER = [
  'san_antonio_metro',
  'parque_san_antonio',
  'palacio_nacional',
  'junin_paseo',
  'oriental_cruce',
  'parque_berrio',
  'carabobo_cultural',
  'plaza_botero',
  'museo_antioquia',
] as const

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

const WINDOW_ORDER = ['peak_am', 'midday', 'peak_pm', 'night'] as const
const WINDOW_LABELS: Record<string, string> = {
  peak_am: 'AM',
  midday: 'Med',
  peak_pm: 'PM',
  night: 'Noche',
}

export function SensitivityPanel({ data }: { data: CollapseMatrixSensitivity }) {
  const robustness = data.robustness
  if (!robustness) return null

  let robustCount = 0
  let fragileCount = 0
  Object.values(robustness).forEach((r) => {
    if (r.robust) robustCount++
    if (r.fragile) fragileCount++
  })

  return (
    <article className="deck-panel sensitivity-panel">
      <p className="deck-eyebrow">Sensibilidad de la matriz · bootstrap + thresholds</p>
      <h3>
        <span className="badge badge-good">{robustCount} robustas</span>{' '}
        <span className="badge badge-warn">{fragileCount} frágiles</span>
      </h3>
      <div
        className="sensitivity-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${WINDOW_ORDER.length}, 1fr)`,
          gap: 4,
          fontSize: '0.74rem',
        }}
      >
        <div />
        {WINDOW_ORDER.map((w) => (
          <div key={w} className="sensitivity-grid__head">{WINDOW_LABELS[w]}</div>
        ))}
        {NODE_ORDER.map((node) => (
          <div key={node} style={{ display: 'contents' }}>
            <div className="sensitivity-grid__rowhead">{NODE_LABELS[node] ?? node}</div>
            {WINDOW_ORDER.map((w) => {
              const key = `${node}|${w}`
              const r = robustness[key]
              if (!r) {
                return <div key={key} className="sensitivity-grid__cell sensitivity-grid__cell--empty">—</div>
              }
              const cls = r.robust
                ? 'sensitivity-grid__cell sensitivity-grid__cell--robust'
                : r.fragile
                ? 'sensitivity-grid__cell sensitivity-grid__cell--fragile'
                : 'sensitivity-grid__cell'
              const style: CSSProperties = { '--share': r.min_share } as CSSProperties
              return (
                <div
                  key={key}
                  className={cls}
                  style={style}
                  title={`${node} | ${w}\nbase: ${r.baseline_decision}\nv1 share=${r.v1_share_baseline.toFixed(2)} · v2 share=${r.v2_share_baseline.toFixed(2)}\nmin=${r.min_share.toFixed(2)} → ${r.robust ? 'robusta' : r.fragile ? 'frágil' : '—'}`}
                >
                  <strong>{r.min_share.toFixed(2)}</strong>
                  <small>{r.robust ? 'robusta' : r.fragile ? 'frágil' : '—'}</small>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <p className="sensitivity-panel__legend">
        Bootstrap n={data.meta?.n_iter_bootstrap ?? '—'} · thresholds n={data.meta?.n_threshold_scenarios ?? '—'} ·
        LOO C3 n={data.meta?.n_interviews_loo ?? '—'}. Regla: robusta si share ≥ 0.80 en V1 y V2.
      </p>
    </article>
  )
}
