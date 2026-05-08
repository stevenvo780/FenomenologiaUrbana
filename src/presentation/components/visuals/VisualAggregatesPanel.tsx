import { useState } from 'react'
import type {
  M1VisualAggregate,
  M1VisualBucket,
  M3VisualAggregate,
  M3VisualBucket,
} from '../../../types'

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

const WINDOW_LABELS: Record<string, string> = {
  peak_am: 'AM',
  midday: 'Med',
  peak_pm: 'PM',
  night: 'Noche',
}

function bucketLabel(b: { node: string; window: string }): string {
  return `${NODE_LABELS[b.node] ?? b.node} · ${WINDOW_LABELS[b.window] ?? b.window}`
}

function topBy<T>(rows: T[], pick: (r: T) => number, n = 3): T[] {
  return [...rows].sort((a, b) => pick(b) - pick(a)).slice(0, n)
}

function fmt(x: number | undefined | null, digits = 2): string {
  if (x === undefined || x === null || Number.isNaN(x)) return '—'
  return x.toFixed(digits)
}

export function VisualAggregatesPanel({
  m1,
  m3,
}: {
  m1?: M1VisualAggregate
  m3?: M3VisualAggregate
}) {
  const [expanded, setExpanded] = useState(false)
  const m1Rows: M1VisualBucket[] = m1?.by_node_window ? Object.values(m1.by_node_window) : []
  const m3Rows: M3VisualBucket[] = m3?.by_node_window ? Object.values(m3.by_node_window) : []
  if (m1Rows.length === 0 && m3Rows.length === 0) return null

  const topDensity = topBy(m1Rows, (r) => r.human_density_p75 ?? 0)
  const topObstacle = topBy(m1Rows, (r) => r.obstacle_proxy_count ?? 0)
  const topSat = topBy(m1Rows, (r) => r.saturation_p75 ?? 0)
  const topHet = topBy(m3Rows, (r) => r.heterogeneity_index_visual ?? 0)
  const topTourist = topBy(m3Rows, (r) => r.tourist_proxy_ratio ?? 0)
  const topCommerce = topBy(m3Rows, (r) => r.commerce_proxy ?? 0)

  return (
    <article className="deck-panel visual-aggregates-panel">
      <p className="deck-eyebrow">
        M1 / M3 · agregados visuales por nodo×ventana · {m1Rows.length} buckets
      </p>
      <h3>
        Top densidad p75: <strong>{topDensity[0] ? bucketLabel(topDensity[0]) : '—'}</strong> ·
        Top heterogeneidad Shannon: <strong>{topHet[0] ? bucketLabel(topHet[0]) : '—'}</strong>
      </h3>

      <div className="va-tops">
        {m1Rows.length > 0 && (
          <>
            <VaTop title="M1 · densidad humana p75" rows={topDensity} pick={(r) => r.human_density_p75} digits={1} />
            <VaTop
              title="M1 · obstáculo (mochilas/bolsos)"
              rows={topObstacle}
              pick={(r) => r.obstacle_proxy_count}
              digits={0}
            />
            <VaTop title="M1 · saturación p75" rows={topSat} pick={(r) => r.saturation_p75 ?? 0} digits={2} />
          </>
        )}
        {m3Rows.length > 0 && (
          <>
            <VaTop
              title="M3 · heterogeneidad Shannon"
              rows={topHet}
              pick={(r) => r.heterogeneity_index_visual}
              digits={2}
            />
            <VaTop
              title="M3 · turista proxy (ratio)"
              rows={topTourist}
              pick={(r) => r.tourist_proxy_ratio}
              digits={3}
            />
            <VaTop title="M3 · comercio proxy" rows={topCommerce} pick={(r) => r.commerce_proxy} digits={3} />
          </>
        )}
      </div>

      <button
        type="button"
        className="ghost-action"
        onClick={() => setExpanded((v) => !v)}
        style={{ marginTop: 10 }}
      >
        {expanded ? `Ocultar tabla (${m1Rows.length})` : `Ver tabla completa (${m1Rows.length} buckets)`}
      </button>

      {expanded && (
        <div className="va-table">
          <div className="va-table__row va-table__row--head">
            <span>Bucket</span>
            <span>p75 ρ</span>
            <span>máx ρ</span>
            <span>obst.</span>
            <span>veh.</span>
            <span>sat75</span>
            <span>H Shannon</span>
            <span>turista</span>
            <span>comercio</span>
            <span>clases</span>
          </div>
          {m1Rows.map((r) => {
            const key = `${r.node}|${r.window}`
            const m3r = m3?.by_node_window?.[key]
            return (
              <div key={key} className="va-table__row">
                <strong>{bucketLabel(r)}</strong>
                <span>{fmt(r.human_density_p75, 1)}</span>
                <span>{fmt(r.human_density_max, 1)}</span>
                <span>{fmt(r.obstacle_proxy_count, 0)}</span>
                <span>{fmt(r.vehicle_intensity, 2)}</span>
                <span>{fmt(r.saturation_p75, 2)}</span>
                <span>{fmt(m3r?.heterogeneity_index_visual, 2)}</span>
                <span>{fmt(m3r?.tourist_proxy_ratio, 3)}</span>
                <span>{fmt(m3r?.commerce_proxy, 3)}</span>
                <span>{fmt(m3r?.n_distinct_classes, 0)}</span>
              </div>
            )
          })}
        </div>
      )}

      <p className="visual-aggregates-panel__legend">
        Fuentes: {(m1?._meta as { sources?: { photo_summary_files?: number; video_saturation_files?: number } } | undefined)?.sources?.photo_summary_files ?? 0} fotos · {(m1?._meta as { sources?: { video_saturation_files?: number } } | undefined)?.sources?.video_saturation_files ?? 0} videos.
        Heterogeneidad = Shannon sobre clases YOLO COCO. Police proxy no disponible (uniforme no detectable).
      </p>
    </article>
  )
}

function VaTop<T extends { node: string; window: string }>({
  title,
  rows,
  pick,
  digits,
}: {
  title: string
  rows: T[]
  pick: (r: T) => number
  digits: number
}) {
  return (
    <div className="va-top">
      <p className="va-top__title">{title}</p>
      <ol className="va-top__list">
        {rows.map((r, idx) => (
          <li key={`${r.node}|${r.window}`}>
            <span className="va-top__rank">{idx + 1}</span>
            <span className="va-top__label">{bucketLabel(r)}</span>
            <strong>{fmt(pick(r), digits)}</strong>
          </li>
        ))}
        {rows.length === 0 && <li><small>sin datos</small></li>}
      </ol>
    </div>
  )
}
