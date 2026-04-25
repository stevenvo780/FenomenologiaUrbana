import { motion, useAnimationFrame, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'

import type { Hpc24hMetric, Temporal24h } from '../../../types'
import { compactNumber } from '../../utils'

type Heatline24hProps = {
  hourly: Hpc24hMetric[]
  temporal?: Temporal24h
  loopMs?: number
  paused?: boolean
}

export function Heatline24h({
  hourly,
  temporal,
  loopMs = 30000,
  paused = false,
}: Heatline24hProps) {
  const reducedMotion = useReducedMotion()
  const [hourProgress, setHourProgress] = useState(0)
  const safeHourly = hourly.length ? hourly : Array.from({ length: 24 }, (_, hour) => ({ hour, agents: 0, max_load: 0, mean_energy: 0 }))
  const hourIndex = Math.round(hourProgress) % safeHourly.length
  const active = safeHourly[hourIndex] ?? safeHourly[0]
  const maxAgents = Math.max(...safeHourly.map((entry) => entry.agents), 1)
  const maxLoad = Math.max(...safeHourly.map((entry) => entry.max_load), 1)
  const clockAngle = (hourProgress / 24) * Math.PI * 2 - Math.PI / 2
  const handX = 72 + Math.cos(clockAngle) * 48
  const handY = 72 + Math.sin(clockAngle) * 48
  const demand = temporal?.demand_multiplier ?? safeHourly.map((entry) => entry.agents / maxAgents)
  const environmental = temporal?.environmental_intensity ?? safeHourly.map((entry) => entry.max_load / maxLoad)
  const demandPath = useMemo(() => buildLinePath(demand, 420, 130), [demand])
  const environmentalPath = useMemo(() => buildLinePath(environmental, 420, 130), [environmental])

  useAnimationFrame((time) => {
    if (paused || reducedMotion) {
      return
    }

    setHourProgress(((time % loopMs) / loopMs) * 24)
  })

  return (
    <div className="heatline-24h">
      <article className="heatline-clock-card">
        <svg className="clock" viewBox="0 0 144 144" role="img" aria-label="Reloj de pulso urbano">
          <circle cx="72" cy="72" r="58" className="heatline-clock-ring" />
          {Array.from({ length: 24 }, (_, hour) => {
            const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2
            const x1 = 72 + Math.cos(angle) * 51
            const y1 = 72 + Math.sin(angle) * 51
            const x2 = 72 + Math.cos(angle) * 58
            const y2 = 72 + Math.sin(angle) * 58

            return <line key={hour} x1={x1} y1={y1} x2={x2} y2={y2} className={hour === active.hour ? 'active' : ''} />
          })}
          <motion.line x1="72" y1="72" x2={handX} y2={handY} className="heatline-hand" />
          <circle cx="72" cy="72" r="5" className="heatline-hand-core" />
        </svg>
        <div>
          <span className="deck-eyebrow">Hora activa</span>
          <strong>{String(active.hour).padStart(2, '0')}:00</strong>
          <p>{compactNumber(active.agents)} agentes · carga {active.max_load.toFixed(1)}</p>
        </div>
      </article>

      <article className="heatline-surface">
        <div className="heatline-strip" role="img" aria-label="Heatmap de 24 horas">
          {safeHourly.map((entry, index) => {
            const intensity = entry.agents / maxAgents
            const activeHour = index === hourIndex
            const hue = 60 - intensity * 50
            const sat = 70 + intensity * 20

            return (
              <motion.div
                key={entry.hour}
                className={activeHour ? 'active' : ''}
                style={{
                  background: `linear-gradient(180deg, hsl(${hue} ${sat}% 65%), hsl(${hue - 10} ${sat}% ${42 + intensity * 8}%))`,
                  opacity: 0.35 + intensity * 0.65,
                }}
                animate={{ scaleY: activeHour ? 1.14 : 1 }}
              >
                <span>{entry.hour}</span>
              </motion.div>
            )
          })}
        </div>

        <svg className="heatline-chart" viewBox="0 0 420 130" role="img" aria-label="Curvas de demanda e intensidad ambiental">
          <path className="heatline-grid-line" d="M0 32.5H420M0 65H420M0 97.5H420" />
          <path className="heatline-demand" d={demandPath} />
          <path className="heatline-environmental" d={environmentalPath} />
          <motion.line
            className="heatline-marker"
            x1={(hourIndex / 23) * 420}
            x2={(hourIndex / 23) * 420}
            y1="0"
            y2="130"
          />
        </svg>

        <div className="heatline-legend">
          <span>demanda</span>
          <span>intensidad ambiental</span>
          <em>{paused ? 'pausado' : 'loop 24h'}</em>
        </div>
      </article>
    </div>
  )
}

function buildLinePath(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const spread = Math.max(max - min, 1e-9)

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width
      const y = height - ((value - min) / spread) * (height - 16) - 8
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}
