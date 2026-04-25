import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { MetricLine, PanelFrame, SlideHeader, SlideShell } from '../components/ui'

export function AsphyxiaSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const uncertainty = useMemo(
    () => data.advanced_reports?.hpc_uncertainty.results ?? {},
    [data.advanced_reports?.hpc_uncertainty.results],
  )
  const sigma = Object.values(uncertainty).at(-1)?.relative_uncertainty ?? 0.00026
  const multipoint = data.advanced_reports?.hpc_multipoint_calibration
  const inequality = data.advanced_reports?.urban_inequality.scenarios ?? []
  const [activeIndex, setActiveIndex] = useState(0)
  const sigmaValue = useMotionValue(0)
  const sigmaText = useTransform(sigmaValue, (value) => value.toFixed(5))
  const activeScenario = inequality[activeIndex % Math.max(inequality.length, 1)]
  const uncertaintyRows = useMemo(() => Object.entries(uncertainty), [uncertainty])

  useEffect(() => {
    const controls = animate(sigmaValue, sigma, { duration: 2.5, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [sigma, sigmaValue])

  useEffect(() => {
    if (!inequality.length) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % inequality.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [inequality.length])

  return (
    <SlideShell id="asfixia" className="asphyxia-slide">
      <div className="asphyxia-aura" aria-hidden="true" />

      <SlideHeader
        eyebrow="Capítulo 10 · asfixia de la emergencia"
        title="La precisión del modelo es la asfixia de la libertad"
        text="Cuando la incertidumbre relativa cae a escala microscópica, la ciudad revela un régimen de trayectorias estrechamente coaccionadas."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('calibration-detail')}>Abrir detalle</button>}
      />

      <div className="asphyxia-grid">
        <PanelFrame eyebrow="σ relativa" title={<motion.strong className="hero-number">{sigmaText}</motion.strong>} tone="danger" className="asphyxia-hero">
          <p className="asphyxia-hero-copy">incertidumbre relativa · la libertad de andar comprimida a una escala microscópica.</p>
          <MetricLine label="Precisión espacial" value={(multipoint?.spatial_accuracy_score ?? 0).toFixed(4)} />
          <MetricLine label="Error residual" value={(multipoint?.residual_error ?? 0).toFixed(4)} />
        </PanelFrame>

        <PanelFrame eyebrow="Gini por escenario" title="Desigualdad fenomenológica" tone="amber" className="asphyxia-gini-panel">
          <AnimatePresence mode="wait">
            {activeScenario ? (
              <motion.article
                key={activeScenario.scenario_id}
                className="asphyxia-gini-active"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <span>{activeScenario.label}</span>
                <strong>{activeScenario.entropy_gini.toFixed(4)}</strong>
                <p>{activeScenario.most_restricted_profile} es el perfil más restringido.</p>
              </motion.article>
            ) : null}
          </AnimatePresence>

          <div className="asphyxia-tile-grid">
            {inequality.map((entry, index) => (
              <button
                key={entry.scenario_id}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                onClick={() => setActiveIndex(index)}
              >
                <span>{entry.label}</span>
                <strong>{entry.entropy_gini.toFixed(4)}</strong>
                <em>{entry.inequity_ratio.toFixed(2)}x</em>
              </button>
            ))}
          </div>
        </PanelFrame>

        <PanelFrame eyebrow="UQ Monte Carlo" title="Horas medidas" className="asphyxia-uncertainty">
          {uncertaintyRows.map(([hour, entry]) => (
            <MetricLine
              key={hour}
              label={hour.replace('_', ' ')}
              value={`${entry.relative_uncertainty.toFixed(5)} · v=${entry.mean_velocity.toFixed(3)}`}
            />
          ))}
        </PanelFrame>

        <PanelFrame eyebrow="Compresión de trayectorias" title="Cono de libertad" tone="teal" className="asphyxia-compression">
          <p className="asphyxia-compression-copy">Cinco perfiles entran al corredor con divergencia máxima; salen con trayectorias casi indistinguibles.</p>
          <svg viewBox="0 0 320 140" className="asphyxia-compression-svg" aria-hidden="true">
            <defs>
              <linearGradient id="asphyxiaConvergence" x1="0" x2="1">
                <stop offset="0%" stopColor="#1f7f79" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#e07a46" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {[0.05, 0.28, 0.5, 0.72, 0.95].map((y, idx) => (
              <motion.path
                key={idx}
                d={`M0 ${20 + y * 100} C120 ${20 + y * 100}, 200 70, 320 70`}
                fill="none"
                stroke="url(#asphyxiaConvergence)"
                strokeWidth={1.6}
                strokeOpacity={0.78}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.2 }}
              />
            ))}
            <motion.circle
              cx={320}
              cy={70}
              r={6}
              fill="#e07a46"
              animate={{ scale: [1, 1.6, 1], opacity: [0.85, 0.4, 0.85] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
          </svg>
          <div className="asphyxia-compression-legend">
            <span><i style={{ background: '#1f7f79' }} /> entrada · 5 perfiles</span>
            <span><i style={{ background: '#e07a46' }} /> salida · 1 régimen</span>
          </div>
        </PanelFrame>
      </div>

      <p className="slide-citation">Foucault, 1975/2002</p>
    </SlideShell>
  )
}
