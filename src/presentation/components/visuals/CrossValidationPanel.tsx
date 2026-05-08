import type { CrossValidationReport, CrossValidationConvergence } from '../../../types'

function badgeClass(c: CrossValidationConvergence): string {
  switch (c) {
    case 'alta':
      return 'badge badge-good'
    case 'media':
      return 'badge badge-warn'
    case 'baja':
      return 'badge badge-bad'
    default:
      return 'badge badge-muted'
  }
}

export function CrossValidationPanel({ data }: { data: CrossValidationReport }) {
  if (!data || !data.claims || data.claims.length === 0) return null

  return (
    <article className="deck-panel xval-panel">
      <p className="deck-eyebrow">Cross-validation campo ↔ visión computacional</p>
      <h3>
        {data.summary?.alta_convergencia?.length ?? 0} alta ·{' '}
        {data.summary?.media_convergencia?.length ?? 0} media ·{' '}
        {data.summary?.baja_convergencia?.length ?? 0} baja ·{' '}
        {data.summary?.no_evaluable?.length ?? 0} no evaluable
      </h3>
      <div className="xval-table">
        {data.claims.map((c) => (
          <div key={c.claim_id} className="xval-row">
            <div className="xval-row__head">
              <strong>{c.node}</strong>
              <small>{c.window} · {c.field_observer}</small>
              <span className={badgeClass(c.convergence)}>{c.convergence}</span>
            </div>
            <div className="xval-row__body">
              <p>
                <em>Campo:</em> {c.field_value}
              </p>
              <p>
                <em>Visual ({c.visual_metric}):</em> {c.visual_value}
              </p>
              {c.note && <p className="xval-row__note">{c.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
