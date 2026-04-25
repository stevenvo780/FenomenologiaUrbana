import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

type Threshold = {
  value: number
  label: string
  tone: 'safe' | 'warn' | 'danger'
}

type EnvironmentMeterProps = {
  kind: 'pm25' | 'noise'
  title: string
  unit: string
  peak: number
  average: number
  thresholds: Threshold[]
  scaleMax: number
  /** Used to seed the corridor profile so PM2.5 and noise look distinct. */
  seed?: number
  /** Visual contrast amplifier for the corridor strip (1 = default). */
  contrast?: number
  /** When true, normalize the strip to fill the full vertical range. */
  fillStrip?: boolean
}

// Deterministic pseudo-random profile so the corridor strip looks textured and
// stable across renders. Not a real spatial sample — this is illustrative.
function seededProfile(samples: number, seed: number, peak: number, average: number, contrast = 1) {
  const out: number[] = []
  // Build a smooth curve with a couple of "hot spots" leaning toward the peak
  // and a baseline near the average. `contrast` widens the gap between
  // hotspots and baseline so flat-ish data still reads visually.
  const baseline = Math.max(average * (1 - 0.4 * contrast), peak * 0.05)
  const hotspot1 = (seed % samples) / samples
  const hotspot2 = ((seed * 7) % samples) / samples
  const hotspot3 = ((seed * 13) % samples) / samples
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1)
    const d1 = Math.exp(-Math.pow((t - hotspot1) / 0.07, 2))
    const d2 = Math.exp(-Math.pow((t - hotspot2) / 0.1, 2))
    const d3 = Math.exp(-Math.pow((t - hotspot3) / 0.09, 2)) * 0.7
    const wobble = 0.5 + 0.5 * Math.sin((i + seed) * 1.7) * Math.cos((i + seed) * 0.6)
    const hot = Math.max(d1, d2, d3)
    const value = baseline + (peak - baseline) * (0.9 * hot + 0.25 * wobble * (1 - hot))
    out.push(value)
  }
  return out
}

const GRADIENTS: Record<'pm25' | 'noise', string> = {
  pm25: 'linear-gradient(90deg, #1f7f79 0%, #f4c87a 45%, #e07a46 75%, #c33a3a 100%)',
  noise: 'linear-gradient(90deg, #2a4d6e 0%, #5b8fb9 35%, #f4c87a 65%, #e07a46 85%, #c33a3a 100%)',
}

export function EnvironmentMeter({
  kind,
  title,
  unit,
  peak,
  average,
  thresholds,
  scaleMax,
  seed = 17,
  contrast = 1,
  fillStrip = false,
}: EnvironmentMeterProps) {
  const reducedMotion = useReducedMotion()
  const profile = useMemo(
    () => seededProfile(28, seed, peak, average, contrast),
    [seed, peak, average, contrast],
  )
  // For visually flat data (e.g. dB scale where min and peak are close), we
  // optionally normalize the strip's vertical range to its own min/max so
  // differences read clearly. The numeric scale below remains absolute.
  const profileMin = Math.min(...profile)
  const profileMax = Math.max(...profile)
  const stripRange = fillStrip
    ? { lo: profileMin * 0.85, hi: profileMax }
    : { lo: 0, hi: Math.max(profileMax, scaleMax) }

  const peakPct = Math.min(100, (peak / scaleMax) * 100)
  const avgPct = Math.min(100, (average / scaleMax) * 100)

  return (
    <figure className={`env-meter env-meter-${kind}`}>
      <header className="env-meter-head">
        <span className="env-meter-icon" aria-hidden>
          {kind === 'pm25' ? '🫁' : '🔊'}
        </span>
        <div className="env-meter-titles">
          <strong>{title}</strong>
          <span className="env-meter-sub">
            {kind === 'pm25'
              ? 'Lo que respira el cuerpo a lo largo del corredor'
              : 'Lo que escucha el cuerpo a lo largo del corredor'}
          </span>
        </div>
      </header>

      {/* Corridor strip — 28 vertical bars representing west→east samples */}
      <div className="env-meter-strip" aria-hidden>
        {profile.map((v, i) => {
          const span = Math.max(stripRange.hi - stripRange.lo, 1e-6)
          const norm = Math.max(0, Math.min(1, (v - stripRange.lo) / span))
          const h = 12 + norm * 88
          const fillStop = Math.min(1, v / scaleMax)
          return (
            <motion.span
              key={i}
              className="env-meter-bar"
              style={{
                height: `${h}%`,
                background: `linear-gradient(180deg,
                  hsl(${20 + (1 - fillStop) * 160} 70% ${45 + fillStop * 15}%) 0%,
                  hsl(${0 + (1 - fillStop) * 80} 65% ${30 + fillStop * 10}%) 100%)`,
              }}
              initial={reducedMotion ? false : { scaleY: 0.2, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: i * 0.018, duration: 0.45, ease: 'easeOut' }}
            />
          )
        })}
      </div>
      <div className="env-meter-corridor-labels">
        <span>San Antonio</span>
        <span className="env-meter-corridor-mid">— corredor —</span>
        <span>Junín</span>
      </div>

      {/* Linear scale with thresholds + peak marker */}
      <div className="env-meter-scale" style={{ background: GRADIENTS[kind] }}>
        {thresholds.map((th) => {
          const left = Math.min(100, (th.value / scaleMax) * 100)
          return (
            <div
              key={th.label}
              className={`env-meter-threshold env-meter-threshold-${th.tone}`}
              style={{ left: `${left}%` }}
              title={`${th.label}: ${th.value} ${unit}`}
            >
              <span className="env-meter-threshold-tick" />
            </div>
          )
        })}
        <div className="env-meter-marker env-meter-marker-avg" style={{ left: `${avgPct}%` }} title={`Promedio: ${average.toFixed(2)} ${unit}`}>
          <span className="env-meter-marker-dot" />
          <span className="env-meter-marker-label">prom · {average.toFixed(2)}</span>
        </div>
        <div className="env-meter-marker env-meter-marker-peak" style={{ left: `${peakPct}%` }} title={`Pico: ${peak.toFixed(2)} ${unit}`}>
          <span className="env-meter-marker-dot" />
          <span className="env-meter-marker-label">pico · {peak.toFixed(2)}</span>
        </div>
      </div>
      <div className="env-meter-scale-axis">
        <span>0 {unit}</span>
        <span>{scaleMax.toFixed(0)} {unit}</span>
      </div>

      <figcaption className="env-meter-caption">
        {kind === 'pm25'
          ? 'Cada barra = un tramo del corredor. Las altas y rojas son zonas donde el aire pesa: el cuerpo desvía la ruta hacia las verdes.'
          : 'Cada barra = un tramo del corredor. Las altas y rojas son focos sonoros que saturan: el cuerpo busca corredores acústicos más bajos.'}
      </figcaption>
    </figure>
  )
}
