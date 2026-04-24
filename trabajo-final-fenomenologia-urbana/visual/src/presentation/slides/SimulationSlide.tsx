import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import type { ModalKind } from '../deckTypes'
import { AnimatedSimulationStage } from '../components/visuals/AnimatedSimulationStage'
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
        eyebrow="Slide 03 · cine de agentes"
        title="Simulación convertida en movimiento"
        text="Las trayectorias calculadas por el pipeline se animan como partículas sobre la red: no son observación física inventada, son rutas proxy ejecutadas y trazables."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Detalles de simulación</button>}
      />

      <div className="simulation-grid">
        <AnimatedSimulationStage data={data} scenario={scenario} selectedNodeId={selectedNode.id} />
        <aside className="deck-panel sim-panel">
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
              label="Restricción"
              value={formatRatio(scenario.metrics.decision_restriction)}
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <KpiPill
              label="Entropía"
              value={formatRatio(scenario.metrics.route_entropy)}
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
          </div>
          <RouteStack data={data} routes={scenario.top_routes.slice(0, 6)} />
        </aside>
      </div>
    </SlideShell>
  )
}
