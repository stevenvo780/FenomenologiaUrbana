import type { CSSProperties } from 'react'

import type { CollapseDecision, CollapseMatrixCell, FieldCalibration } from '../../../types'

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
  peak_am: 'AM 07-10',
  midday: 'Med 10-15',
  peak_pm: 'PM 15-20',
  night: 'Noche 20-23',
}

const DECISION_COLOR: Record<CollapseDecision, string> = {
  colapso_fenomenologico: '#c72b3b',
  friccion_acumulada: '#e07a46',
  flujo_ordinario: '#2f7d4a',
  inconcluyente: 'rgba(255,255,255,0.10)',
}

const DECISION_LABEL: Record<CollapseDecision, string> = {
  colapso_fenomenologico: 'colapso',
  friccion_acumulada: 'fricción',
  flujo_ordinario: 'ordinario',
  inconcluyente: '—',
}

function cellByKey(cells: CollapseMatrixCell[]): Record<string, CollapseMatrixCell> {
  return Object.fromEntries(cells.map((c) => [`${c.node}|${c.window}`, c]))
}

export function CollapseMatrixPanel({
  field,
  compact = false,
}: {
  field: FieldCalibration
  compact?: boolean
}) {
  const matrix = field.collapse_matrix
  if (!matrix) return null
  const cells = cellByKey(matrix.cells)

  return (
    <article className="deck-panel collapse-panel">
      <p className="deck-eyebrow">Matriz de colapso fenomenológico</p>
      <h3>
        {Object.entries(matrix.decisions || {})
          .map(([k, v]) => `${DECISION_LABEL[k as CollapseDecision] ?? k}: ${v}`)
          .join(' · ')}
      </h3>
      <div
        className="collapse-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${WINDOW_ORDER.length}, 1fr)`,
          gap: 4,
          fontSize: compact ? '0.72rem' : '0.84rem',
        }}
      >
        <div />
        {WINDOW_ORDER.map((w) => (
          <div key={w} className="collapse-grid__head">
            {WINDOW_LABELS[w]}
          </div>
        ))}
        {NODE_ORDER.map((n) => (
          <>
            <div key={`${n}-label`} className="collapse-grid__rowhead">
              {NODE_LABELS[n] ?? n}
            </div>
            {WINDOW_ORDER.map((w) => {
              const c = cells[`${n}|${w}`]
              if (!c) {
                return (
                  <div
                    key={`${n}|${w}`}
                    className="collapse-grid__cell"
                    style={{ background: DECISION_COLOR.inconcluyente }}
                    title="sin datos"
                  >
                    —
                  </div>
                )
              }
              const flags = [
                c.C1 && 'C1',
                c.C2 && 'C2',
                c.C3 && 'C3',
                c.C4 && 'C4',
              ].filter(Boolean) as string[]
              const style: CSSProperties = {
                background: DECISION_COLOR[c.decision],
                color: c.decision === 'inconcluyente' ? 'rgba(255,255,255,0.55)' : '#fff8ec',
              }
              return (
                <div
                  key={`${n}|${w}`}
                  className="collapse-grid__cell"
                  style={style}
                  title={`${n} | ${w} → ${c.decision} (${c.conditions_met}/4, cobertura ${c.coverage}/4)\nflags: ${flags.join(', ') || '—'}`}
                >
                  <strong>{DECISION_LABEL[c.decision]}</strong>
                  {flags.length > 0 && <small>{flags.join(' ')}</small>}
                </div>
              )
            })}
          </>
        ))}
      </div>
      <p className="collapse-panel__legend">
        Regla 3-de-4 sobre C1 criminalidad · C2 seguridad percibida · C3 habitabilidad declarada · C4
        saturación visual. Estado: <strong>{field.status}</strong>.
        {field.captured_on && ` Campo: ${field.captured_on}.`}
      </p>
    </article>
  )
}
