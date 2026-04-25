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
        </aside>
      </div>
      <p className="slide-citation">Mutación longitudinal · capítulo 3.1</p>
    </SlideShell>
  )
}
