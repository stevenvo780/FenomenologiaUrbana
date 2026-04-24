import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CSSProperties } from 'react'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber, formatRatio } from '../utils'

export function EconomySlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const gravity = data.advanced_models?.economic_gravity
  const topCommerce = [...data.nodes]
    .sort((left, right) => right.commerce - left.commerce)
    .slice(0, 5)
    .map((node) => ({ label: node.label, commerce: Number((node.commerce * 100).toFixed(1)) }))
  const giniPct = (gravity?.spatial_concentration_gini ?? 0) * 100

  return (
    <SlideShell id="economia" className="economy-slide">
      <SlideHeader
        eyebrow="Slide 13 · gravedad económica"
        title="El comercio también curva el espacio vivido"
        text="La concentración económica no solo atrae compradores: organiza trayectorias, fija centros de gravedad y refuerza asimetrías entre nodos del corredor."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('evidence')}>Cruzar con barrio y comercio</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel chart-panel">
          <div className="panel-topline">
            <p className="deck-eyebrow">Top nodos por intensidad comercial</p>
            <div className="status-strip">
              <KpiPill label="Hubs" value={`${gravity?.hubs_analyzed ?? 0}`} status="documented" />
              <KpiPill label="Pull total" value={compactNumber(gravity?.total_commercial_pull ?? 0)} status="proxy" />
            </div>
          </div>
          <div className="chart-shell chart-shell-tall">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <BarChart data={topCommerce} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,248,236,0.68)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                <Bar dataKey="commerce" fill="#f4c87a" radius={[12, 12, 6, 6]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="deck-panel economy-side-panel">
          <div className="economy-gauge">
            <div className="economy-gauge-ring" style={{ '--pct': `${giniPct}%` } as CSSProperties}>
              <strong>{giniPct.toFixed(1)}%</strong>
              <span>gini espacial</span>
            </div>
          </div>
          <div className="spotlight-card highlight">
            <span>Lectura del hallazgo</span>
            <strong>Concentración extrema de atracción</strong>
            <p>
              Un gini de {formatRatio(gravity?.spatial_concentration_gini ?? 0)} indica que la gravitación comercial se concentra
              en pocos nodos, intensificando la convergencia peatonal y la desigualdad de trayectorias.
            </p>
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
