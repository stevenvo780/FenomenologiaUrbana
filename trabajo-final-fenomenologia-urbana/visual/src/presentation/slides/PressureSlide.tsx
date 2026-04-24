import { motion } from 'framer-motion'
import { startTransition, type CSSProperties } from 'react'

import type { ScenarioSummary } from '../../types'
import type { ModalKind } from '../deckTypes'
import { MetricLine, SlideHeader, SlideShell } from '../components/ui'
import { formatRatio, normalizePressure } from '../utils'

export function PressureSlide({
  scenarios,
  scenario,
  onScenarioChange,
  onSelectNode,
  onOpenModal,
}: {
  scenarios: ScenarioSummary[]
  scenario: ScenarioSummary
  onScenarioChange: (value: string) => void
  onSelectNode: (value: string) => void
  onOpenModal: (kind: ModalKind) => void
}) {
  return (
    <SlideShell id="presion" className="pressure-slide">
      <SlideHeader
        eyebrow="Slide 05 · presión temporal"
        title="La hora modifica el campo de posibilidades"
        text="La ciudad cambia de régimen: hora pico, mediodía y noche no son fondos neutros, sino configuraciones distintas de carga, concentración y libertad de trayecto."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Abrir escenarios</button>}
      />

      <div className="pressure-grid">
        <ScenarioPressureStage
          scenarios={scenarios}
          activeScenarioId={scenario.id}
          onScenarioChange={onScenarioChange}
        />
        <BottleneckPodium scenario={scenario} onSelectNode={onSelectNode} />
      </div>
    </SlideShell>
  )
}

function ScenarioPressureStage({
  scenarios,
  activeScenarioId,
  onScenarioChange,
}: {
  scenarios: ScenarioSummary[]
  activeScenarioId: string
  onScenarioChange: (value: string) => void
}) {
  return (
    <article className="deck-panel pressure-stage">
      {scenarios.map((scenario, index) => {
        const pressure = normalizePressure(scenario.metrics.mean_pressure, scenarios)
        const active = scenario.id === activeScenarioId

        return (
          <motion.button
            key={scenario.id}
            type="button"
            className={active ? 'pressure-card active' : 'pressure-card'}
            style={{ '--pressure': `${pressure * 100}%` } as CSSProperties}
            onClick={() => startTransition(() => onScenarioChange(scenario.id))}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -8, rotate: active ? 0 : -0.8 }}
          >
            <span>{scenario.time_window}</span>
            <strong>{scenario.label}</strong>
            <div className="pressure-orb">
              <em>{scenario.metrics.mean_pressure.toFixed(0)}</em>
            </div>
            <div className="pressure-lines">
              <MetricLine label="Concentración" value={formatRatio(scenario.metrics.concentration_index)} />
              <MetricLine label="Entropía" value={scenario.metrics.route_entropy.toFixed(2)} />
              <MetricLine label="Carga" value={scenario.metrics.mean_pressure.toFixed(0)} />
            </div>
          </motion.button>
        )
      })}
    </article>
  )
}

function BottleneckPodium({
  scenario,
  onSelectNode,
}: {
  scenario: ScenarioSummary
  onSelectNode: (value: string) => void
}) {
  return (
    <aside className="deck-panel podium-panel">
      <p className="deck-eyebrow">Cuellos de botella</p>
      <h2>{scenario.label}</h2>
      <div className="podium-list">
        {scenario.top_bottlenecks.map((entry, index) => (
          <motion.button
            key={entry.node_id}
            type="button"
            onClick={() => onSelectNode(entry.node_id)}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span>{index + 1}</span>
            <div>
              <strong>{entry.label}</strong>
              <p>{entry.phenomenology}</p>
            </div>
            <em>{entry.load}</em>
          </motion.button>
        ))}
      </div>
    </aside>
  )
}
