import type { AgentProfile, CaseNode, Payload, ScenarioSummary } from '../../types'
import type { DeckRoute, ModalKind } from '../deckTypes'
import { CorridorMap } from '../components/visuals/CorridorMap'
import { NodeSpotlight } from '../components/visuals/NodeSpotlight'
import { RouteMarquee } from '../components/visuals/RouteVisuals'
import { SlideHeader, SlideShell } from '../components/ui'
import { motion } from 'framer-motion'

const controlLabelStyle = {
  fontSize: '0.56rem',
  color: 'var(--text-dim)',
} as const

const selectStyle = {
  background: 'rgba(8, 8, 9, 0.92)',
  color: '#fff8ec',
  border: '1px solid rgba(224, 122, 70, 0.35)',
  borderRadius: '12px',
  padding: '0.5rem 0.62rem',
  fontSize: '0.74rem',
} as const

export function MapSlide({
  data,
  scenario,
  agent,
  compareAgent,
  selectedNode,
  leadRoute,
  onScenarioChange,
  onSelectNode,
  onOpenModal,
}: {
  data: Payload
  scenario: ScenarioSummary
  agent: AgentProfile
  compareAgent: AgentProfile
  selectedNode: CaseNode
  leadRoute?: DeckRoute
  onScenarioChange: (value: string) => void
  onSelectNode: (value: string) => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const liveMetrics = [
    { label: 'Nodos activos', value: data.nodes.length.toString() },
    {
      label: 'Presión media',
      value: scenario.metrics.mean_pressure.toLocaleString('es-CO', { maximumFractionDigits: 0 }),
    },
  ]

  return (
    <SlideShell id="mapa" className="map-slide">
      <SlideHeader
        eyebrow="Capítulo 3 · El corredor como campo"
        title="El campo donde aparece la ciudad"
        text="No es un grafo de transporte: es un campo de aparición donde cada nodo condensa memoria, presión y posibilidad."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Abrir modelo</button>}
      />

      <div className="map-stage-grid">
        <aside className="map-sidebar">
          <section className="deck-panel map-control-card">
            <div>
              <p className="deck-eyebrow">Control topológico</p>
              <h3>Filtros de simulación</h3>
            </div>

            <div className="map-control-grid">
              <label style={controlLabelStyle}>ESCENARIO HORARIO</label>
              <select
                value={scenario.id}
                onChange={(e) => onScenarioChange(e.target.value)}
                style={{ ...selectStyle, width: '100%' }}
              >
                {data.scenarios.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
              </select>

            </div>

            <div className="map-live-grid">
              {liveMetrics.map((metric) => (
                <div key={metric.label} className="map-live-tile">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <NodeSpotlight node={selectedNode} scenario={scenario} compact />
        </aside>

        <div className="deck-panel map-panel">
          <CorridorMap
            nodes={data.nodes}
            edges={data.edges}
            scenario={scenario}
            selectedNodeId={selectedNode.id}
            onSelectNode={onSelectNode}
            primaryHighlightedPath={leadRoute?.path ?? []}
            secondaryHighlightedPath={[]}
          />

          {/* HUD Overlay Elements */}
          <div className="hud-overlay" style={{ top: '20px', left: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="node-pulse" style={{ position: 'static', width: '8px', height: '8px' }} />
              <span>SISTEMA VIVO · JUNÍN CORRIDOR</span>
            </div>
          </div>

          <div className="hud-overlay" style={{ bottom: '20px', right: '20px', textAlign: 'right' }}>
            <div>GPS: {selectedNode.lat.toFixed(4)}, {selectedNode.lon.toFixed(4)}</div>
            <div style={{ color: 'var(--text-dim)' }}>ID: {selectedNode.id}</div>
          </div>

          <motion.div
            className="map-route-marquee"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RouteMarquee
              data={data}
              agent={agent}
              compareAgent={compareAgent}
              route={leadRoute}
              compareRoute={undefined}
            />
          </motion.div>
        </div>
      </div>
      <p className="slide-citation">Bueno, 1972</p>
    </SlideShell>
  )
}
