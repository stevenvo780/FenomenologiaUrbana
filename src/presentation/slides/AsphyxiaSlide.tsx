import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { MetricLine, PanelFrame, SlideHeader, SlideShell, TexInline } from '../components/ui'

export function AsphyxiaSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const uncertainty = data.advanced_reports?.hpc_uncertainty.results ?? {}
  const sigma = Object.values(uncertainty).at(-1)?.relative_uncertainty ?? 0.00026
  const multipoint = data.advanced_reports?.hpc_multipoint_calibration
  const inequality = data.advanced_reports?.urban_inequality.scenarios ?? []
  const density = data.fields_manifest?.density_peak_pm
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
      {density ? (
        <FieldRaster
          src={density.src}
          alt="Densidad de hora pico PM"
          colormap={density.cmap}
          motionMode="breathing"
          className="asphyxia-backdrop"
        />
      ) : null}

      <SlideHeader
        eyebrow="Capítulo 10 · asfixia de la emergencia"
        title="La precisión del modelo es la asfixia de la libertad"
        text="Cuando la incertidumbre relativa cae a escala microscópica, la ciudad revela un régimen de trayectorias estrechamente coaccionadas."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('calibration-detail')}>Abrir detalle</button>}
      />

      <div className="asphyxia-grid">
        <PanelFrame eyebrow="σ relativa" title={<motion.strong className="hero-number">{sigmaText}</motion.strong>} tone="danger" className="asphyxia-hero">
          <p>incertidumbre relativa · asfixia de la emergencia</p>
          <p className="formula-line">
            Divergencia <TexInline tex="D_{KL}(P\\Vert Q)" /> como distancia entre libertad y coacción.
          </p>
          <MetricLine label="spatial_accuracy_score" value={(multipoint?.spatial_accuracy_score ?? 0).toFixed(4)} />
          <MetricLine label="residual_error" value={(multipoint?.residual_error ?? 0).toFixed(4)} />
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
      </div>

      <p className="slide-citation">Foucault, 1975/2002</p>
    </SlideShell>
  )
}
