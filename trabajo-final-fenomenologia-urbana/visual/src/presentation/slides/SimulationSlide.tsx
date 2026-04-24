import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import { motion } from 'framer-motion'
import type { ModalKind } from '../deckTypes'
import { AnimatedSimulationStage } from '../components/visuals/AnimatedSimulationStage'
import { RecordedSimulationClip } from '../components/visuals/RecordedSimulationClip'
import { RouteStack } from '../components/visuals/RouteVisuals'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { formatRatio, mapScenarioStatus } from '../utils'

export function SimulationSlide({
  data,
  scenario,
  selectedNode,
  onOpenModal,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  onOpenModal: (kind: ModalKind) => void
}) {
  return (
    <SlideShell id="simulacion" className="simulation-slide">
      <SlideHeader
        eyebrow="Slide 06 · cine de agentes"
        title="Simulación convertida en movimiento"
        text="Las trayectorias calculadas por el pipeline se animan como partículas sobre la red: no son observación física inventada, son rutas proxy ejecutadas y trazables."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Detalles de simulación</button>}
      />

      <div className="simulation-grid">
        <div className="simulation-theater">
          <RecordedSimulationClip scenario={scenario} />
          <motion.div
            className="live-network-inset"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
          >
            <span className="live-network-label">Red SVG viva · nodo seleccionado</span>
            <AnimatedSimulationStage data={data} scenario={scenario} selectedNodeId={selectedNode.id} />
          </motion.div>
        </div>
        <motion.aside
          className="deck-panel sim-panel"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
        >
          <p className="deck-eyebrow">Escenario activo</p>
          <h2>{scenario.label}</h2>
          <p>{scenario.note}</p>
          <div className="cinema-metrics">
            <KpiPill
              label="Presión media"
              value={scenario.metrics.mean_pressure.toFixed(1)}
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <KpiPill
              label="Concentración"
              value={formatRatio(scenario.metrics.concentration_index)}
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <KpiPill
              label="Entropía"
              value={scenario.metrics.route_entropy.toFixed(2)}
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
          </div>
          <RouteStack data={data} routes={scenario.top_routes.slice(0, 4)} />
        </motion.aside>
      </div>
    </SlideShell>
  )
}
