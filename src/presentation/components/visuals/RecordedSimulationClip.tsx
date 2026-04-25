import { useState } from 'react'
import { motion } from 'framer-motion'
import { Film, RadioTower, Sparkles } from 'lucide-react'
import type { ScenarioSummary } from '../../../types'

type RecordedSimulationClipProps = {
  scenario: ScenarioSummary
}

export function RecordedSimulationClip({ scenario }: RecordedSimulationClipProps) {
  const src = `/data/simulations/${scenario.id}.mp4`
  const poster = `/data/simulations/${scenario.id}_poster.png`
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasFailed = failedSrc === src

  return (
    <motion.figure
      className="recorded-sim"
      initial={{ opacity: 0, y: 34, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      <div className="recorded-sim-frame">
        {!hasFailed ? (
          <video
            key={src}
            src={src}
            poster={poster}
            className="recorded-sim-video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={`Clip MP4 renderizado para ${scenario.label}`}
            onError={() => setFailedSrc(src)}
          />
        ) : (
          <div className="recorded-sim-fallback" role="status">
            <Film aria-hidden="true" />
            <strong>Clip no disponible</strong>
            <span>La animación SVG en vivo sigue disponible como respaldo.</span>
          </div>
        )}
        <div className="recorded-sim-vignette" aria-hidden="true" />
        <div className="recorded-sim-scan" aria-hidden="true" />
        <div className="recorded-sim-corners" aria-hidden="true" />
      </div>

      <figcaption className="recorded-sim-caption">
        <span><RadioTower size={16} aria-hidden="true" /> MP4 grabado del pipeline</span>
        <strong>{scenario.time_window}</strong>
      </figcaption>

      <div className="recorded-sim-badges" aria-label="Especificación del clip renderizado">
        <span><Sparkles size={14} aria-hidden="true" /> 72 frames</span>
        <span>18 fps</span>
        <span>4 s</span>
      </div>
    </motion.figure>
  )
}
