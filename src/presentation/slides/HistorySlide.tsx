import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber } from '../utils'

const rasterByYear: Record<string, string> = {
  '2012': 'hist_2012',
  '2018': 'hist_2018',
  '2024': 'hist_2024',
}

export function HistorySlide({
  data,
  activeYearIndex,
  paused,
  onYearIndexChange,
  onPause,
  onOpenModal,
}: {
  data: Payload
  activeYearIndex: number
  paused: boolean
  onYearIndexChange: (value: number) => void
  onPause: () => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const history = data.advanced_models?.historical_evolution?.evolution ?? []
  const safeIndex = Math.min(activeYearIndex, Math.max(history.length - 1, 0))
  const active = history[safeIndex]
  const field = active ? data.fields_manifest?.[rasterByYear[active.year]] : undefined

  useEffect(() => {
    if (!history.length || paused) {
      return undefined
    }

    const interval = window.setInterval(() => {
      onYearIndexChange((safeIndex + 1) % history.length)
    }, 2500)

    return () => window.clearInterval(interval)
  }, [history.length, onYearIndexChange, paused, safeIndex])

  return (
    <SlideShell id="historia" className="history-slide">
      <SlideHeader
        eyebrow="Capítulo 14 · mutación longitudinal"
        title="2012 → 2024: la mutación es computable"
        text="La comparación longitudinal muestra que densidad, criminalidad, turbulencia y entropía espacial no permanecen estables."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Abrir serie longitudinal</button>}
      />

      <div className="history-raster-grid">
        <article className="deck-panel history-raster-panel">
          <div className="status-strip">
            <KpiPill label="Años" value={`${history.length}`} status="documented" />
            <KpiPill label="Motor" value={data.advanced_models?.historical_evolution?.engine?.split(' ').slice(0, 2).join(' ') ?? 'HPC'} status="proxy" />
          </div>
          <AnimatePresence mode="wait">
            {field && active ? (
              <motion.div
                key={active.year}
                className="history-raster-motion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <FieldRaster
                  src={field.src}
                  alt={`Densidad histórica ${active.year}`}
                  colormap={field.cmap}
                  legend={{ min: field.min, max: field.max, unit: field.units }}
                  motionMode="reveal"
                  className="history-raster"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </article>

        <aside className="deck-panel history-side-panel">
          <div className="year-card-stack">
            {history.map((entry, index) => (
              <button
                key={entry.year}
                type="button"
                className={index === safeIndex ? 'year-card active' : 'year-card'}
                onClick={() => {
                  onPause()
                  onYearIndexChange(index)
                }}
              >
                <span>{entry.year}</span>
                <strong>{compactNumber(entry.agents_simulated)} agentes</strong>
                <p>Crimen {compactNumber(entry.empirical_data.casos_crimen)} · densidad máx. {entry.max_density.toFixed(2)}</p>
                <em>Entropía {entry.entropy_spatial.toFixed(2)} · turbulencia {entry.turbulence.toFixed(2)}</em>
              </button>
            ))}
          </div>

          <div className="history-trend">
            <p className="history-trend-eyebrow">Trayectoria longitudinal · entropía espacial</p>
            <svg viewBox="0 0 280 90" className="history-trend-svg" aria-hidden="true">
              <defs>
                <linearGradient id="historyTrendFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f4c87a" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#f4c87a" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              {(() => {
                if (!history.length) return null
                const max = Math.max(...history.map((h) => h.entropy_spatial), 0.001)
                const min = Math.min(...history.map((h) => h.entropy_spatial), 0)
                const range = max - min || 1
                const w = 260
                const h = 70
                const stepX = history.length > 1 ? w / (history.length - 1) : 0
                const points = history.map((entry, idx) => {
                  const x = 10 + idx * stepX
                  const y = 10 + h - ((entry.entropy_spatial - min) / range) * h
                  return `${x},${y}`
                })
                const path = `M${points.join(' L')}`
                const areaPath = `${path} L${10 + (history.length - 1) * stepX},${80} L10,${80} Z`
                return (
                  <>
                    <motion.path d={areaPath} fill="url(#historyTrendFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} />
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="#f4c87a"
                      strokeWidth={2}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                    {history.map((entry, idx) => {
                      const x = 10 + idx * stepX
                      const y = 10 + h - ((entry.entropy_spatial - min) / range) * h
                      const active = idx === safeIndex
                      return (
                        <g key={entry.year}>
                          <circle cx={x} cy={y} r={active ? 5 : 3} fill={active ? '#e07a46' : '#f4c87a'} stroke="#141417" strokeWidth={1} />
                          <text x={x} y={88} textAnchor="middle" fontSize="8" fill={active ? '#e07a46' : '#9aa3ab'} fontFamily="var(--mono)">
                            {entry.year}
                          </text>
                        </g>
                      )
                    })}
                  </>
                )
              })()}
            </svg>
          </div>
        </aside>
      </div>
      <p className="slide-citation">Mutación longitudinal · capítulo 3.1</p>
    </SlideShell>
  )
}
