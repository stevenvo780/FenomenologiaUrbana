import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'

import type { Payload } from '../../types'
import { DECK_CHART_TEXT } from '../constants'
import type { ModalKind } from '../deckTypes'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { formatRatio } from '../utils'

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
        eyebrow="Capítulo 13 · gravitación comercial"
        title="El comercio curva el espacio"
        text="La actividad comercial se usa como capa de atracción. El modelo pregunta cómo esa concentración puede orientar flujos y permanencias."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('evidence')}>Cruzar con barrio y comercio</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel chart-panel">
          <div className="panel-topline">
            <p className="deck-eyebrow">Top nodos por intensidad comercial</p>
            <div className="status-strip">
              <KpiPill label="Gini" value={formatRatio(gravity?.spatial_concentration_gini ?? 0)} status="documented" tooltip="Índice de Gini espacial: mide qué tan concentrada está la actividad económica. 0 = repartida por igual, 1 = todo en pocas manzanas." />
            </div>
          </div>
          <div className="chart-shell chart-shell-tall">
            <MeasuredChart minHeight={220}>
              {({ width, height }) => (
                <BarChart width={width} height={height} data={topCommerce} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,248,236,0.68)', fontSize: DECK_CHART_TEXT.axis }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: DECK_CHART_TEXT.axis }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, fontSize: DECK_CHART_TEXT.tooltip }} />
                  <Bar dataKey="commerce" fill="#f4c87a" radius={[12, 12, 6, 6]} />
                </BarChart>
              )}
            </MeasuredChart>
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
            <strong>Concentración de atracción</strong>
            <p>
              Un gini de {formatRatio(gravity?.spatial_concentration_gini ?? 0)} indica que la gravitación comercial se concentra
              en pocos nodos del modelo, lo que puede intensificar convergencia peatonal y desigualdad de trayectorias.
            </p>
          </div>
          <div className="economy-pulse-card">
            <p className="economy-pulse-eyebrow">Gravitación · atracción acumulada</p>
            <svg viewBox="0 0 280 90" className="economy-pulse-svg" aria-hidden="true">
              <defs>
                <linearGradient id="economyPulseGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#1f7f79" />
                  <stop offset="55%" stopColor="#f4c87a" />
                  <stop offset="100%" stopColor="#e07a46" />
                </linearGradient>
              </defs>
              <path d="M5 80 Q60 70 90 60 T160 35 T260 12" fill="none" stroke="url(#economyPulseGrad)" strokeWidth={2.4} strokeOpacity={0.55} />
              {topCommerce.map((node, i) => {
                const max = Math.max(...topCommerce.map((n) => n.commerce), 1)
                const x = 20 + i * 60
                const y = 80 - (node.commerce / max) * 65
                return (
                  <motion.circle
                    key={node.label}
                    cx={x}
                    cy={y}
                    r={4}
                    fill="#f4c87a"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.85] }}
                    transition={{ duration: 1.6, delay: i * 0.18, repeat: Infinity, repeatDelay: 2.4 }}
                  />
                )
              })}
            </svg>
            <p className="economy-pulse-caption">Cada destello marca un nodo del Top-5: la curva muestra cómo el comercio acumula gravedad a medida que sube el ranking.</p>
          </div>
        </aside>
      </div>
      <p className="slide-citation">Sassen, 2014</p>
    </SlideShell>
  )
}
