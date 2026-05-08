import type { InterRaterReliability } from '../../../types'

const NODE_LABELS: Record<string, string> = {
  san_antonio_metro: 'S. Antonio Metro',
  parque_san_antonio: 'Parque S. Antonio',
  junin_paseo: 'Junín',
  parque_botero: 'Plaza Botero',
  plaza_botero: 'Plaza Botero',
}

function kappaBadgeClass(k: number): string {
  if (k >= 0.6) return 'badge badge-good'
  if (k >= 0.4) return 'badge badge-warn'
  return 'badge badge-bad'
}

function binaryClass(b: string | undefined): string {
  if (b === 'alto') return 'irr-cell irr-cell--alto'
  if (b === 'bajo') return 'irr-cell irr-cell--bajo'
  return 'irr-cell'
}

export function InterRaterPanel({ data }: { data: InterRaterReliability }) {
  if (!data || !data.cohens_kappa) return null
  const kappa = data.cohens_kappa.kappa
  const observers = data.raters || []
  const nodes = data.shared_nodes || Object.keys(data.scoring_per_observer_per_node || {})

  return (
    <article className="deck-panel irr-panel">
      <p className="deck-eyebrow">Confiabilidad inter-observador</p>
      <h3>
        Cohen's κ = {kappa.toFixed(2)}{' '}
        <span className={kappaBadgeClass(kappa)}>{data.cohens_kappa.interpretation?.split('.')[0] ?? '—'}</span>
      </h3>
      <div className="irr-grid" style={{ gridTemplateColumns: `auto repeat(${observers.length}, 1fr)` }}>
        <div />
        {observers.map((o) => (
          <div key={o} className="irr-grid__head">{o}</div>
        ))}
        {nodes.map((node) => {
          const row = data.scoring_per_observer_per_node?.[node] ?? {}
          const isDivergent = node === 'parque_san_antonio'
          return (
            <div key={node} className="irr-row" style={{ display: 'contents' }}>
              <div className={`irr-grid__rowhead ${isDivergent ? 'irr-grid__rowhead--alert' : ''}`}>
                {NODE_LABELS[node] ?? node}
                {isDivergent && <small> · divergencia radical</small>}
              </div>
              {observers.map((o) => {
                const cell = row[o]
                return (
                  <div key={`${node}-${o}`} className={binaryClass(cell?.binary)} title={cell?.atmosphere_keywords?.join(' · ')}>
                    <strong>{cell?.perceived_safety_1_5 ?? '—'}/5</strong>
                    <small>{cell?.binary ?? '—'}</small>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      {data.cohens_kappa.defensive_reading && (
        <p className="irr-panel__note">{data.cohens_kappa.defensive_reading}</p>
      )}
      {data.summary?.divergencias && data.summary.divergencias.length > 0 && (
        <p className="irr-panel__legend">
          Divergencias: <strong>{data.summary.divergencias.join(' · ')}</strong>
        </p>
      )}
    </article>
  )
}
