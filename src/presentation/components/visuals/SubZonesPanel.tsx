import type { NodeGeometryV2, SignageOcrReport } from '../../../types'

export function SubZonesPanel({
  geometry,
  signage,
}: {
  geometry?: NodeGeometryV2
  signage?: SignageOcrReport
}) {
  if (!geometry || !geometry.nodes) return null
  const subzones = geometry.nodes.filter((n) => n.kind === 'subzone')
  if (subzones.length === 0 && !signage) return null

  return (
    <article className="deck-panel subzones-panel">
      <p className="deck-eyebrow">Sub-zonas geométricas v2 · OCR signage</p>
      <h3>
        {subzones.length} sub-zonas · radio máx {geometry.subzone_max_radius_m ?? '—'} m
      </h3>
      {geometry.rationale && <p className="subzones-panel__rationale">{geometry.rationale}</p>}
      <ul className="subzones-list">
        {subzones.map((s) => (
          <li key={s.id} className="subzones-list__item">
            <div>
              <strong>{s.id}</strong>
              <small> ← {s.parent_hint}</small>
            </div>
            <p>{s.source}</p>
            <small>
              {s.lat.toFixed(4)}, {s.lon.toFixed(4)} · radio {s.max_radius_m ?? '—'} m
            </small>
          </li>
        ))}
      </ul>
      {signage && signage.by_node && (
        <div className="signage-block">
          <p className="deck-eyebrow">OCR signage por nodo · {signage.engine ?? 'easyocr'}</p>
          <div className="signage-table">
            {Object.entries(signage.by_node).map(([node, s]) => (
              <div key={node} className="signage-row">
                <strong>{node}</strong>
                <span>{s.n_photos} fotos</span>
                <span>{s.n_text_strings} strings</span>
                <span>{s.n_unique_tags} tags únicos</span>
                <span>densidad comercio {s.commerce_density.toFixed(2)}</span>
              </div>
            ))}
          </div>
          {signage.global_top_repeated_tags && signage.global_top_repeated_tags.length > 0 && (
            <p className="signage-top">
              Top tags globales:{' '}
              {signage.global_top_repeated_tags.map((t) => `${t.tag} (${t.count})`).join(' · ')}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
