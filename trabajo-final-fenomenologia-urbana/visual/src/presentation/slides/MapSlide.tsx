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
  compareLeadRoute,
  onScenarioChange,
  onAgentChange,
  onCompareAgentChange,
  onSelectNode,
  onOpenModal,
}: {
  data: Payload
  scenario: ScenarioSummary
  agent: AgentProfile
  compareAgent: AgentProfile
  selectedNode: CaseNode
  leadRoute?: DeckRoute
  compareLeadRoute?: DeckRoute
  onScenarioChange: (value: string) => void
  onAgentChange: (value: string) => void
  onCompareAgentChange: (value: string) => void
  onSelectNode: (value: string) => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const activeStats = scenario.advanced_stats?.find((entry) => entry.agent_id === agent.id)
  const liveMetrics = [
    { label: 'Nodos activos', value: data.nodes.length.toString() },
    { label: 'Aristas', value: data.edges.length.toString() },
    {
      label: 'Presión media',
      value: scenario.metrics.mean_pressure.toLocaleString('es-CO', { maximumFractionDigits: 0 }),
    },
    {
      label: `${agent.label} · entropía`,
      value: activeStats ? activeStats.path_entropy.toFixed(3) : 'n/d',
    },
  ]

  return (
    <SlideShell id="mapa" className="map-slide">
      <SlideHeader
        eyebrow="Auditoría 03 · Topología"
        title="Grafo Operativo"
        text="La ciudad como red situada de trayectorias, nodos de presión y umbrales de decisión."
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

              <div className="map-select-pair">
                <div>
                  <label style={controlLabelStyle}>PERFIL FENOMENOLÓGICO</label>
                  <select
                    value={agent.id}
                    onChange={(e) => onAgentChange(e.target.value)}
                    style={{ ...selectStyle, width: '100%' }}
                  >
                    {data.agents.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={controlLabelStyle}>PERFIL DE CONTRASTE</label>
                  <select
                    value={compareAgent.id}
                    onChange={(e) => onCompareAgentChange(e.target.value)}
                    style={{ ...selectStyle, width: '100%' }}
                  >
                    {data.agents.filter((entry) => entry.id !== agent.id).map((entry) => (
                      <option key={entry.id} value={entry.id}>{entry.label}</option>
                    ))}
                  </select>
                </div>
              </div>
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
            secondaryHighlightedPath={compareLeadRoute?.path ?? []}
          />

          {/* HUD Overlay Elements */}
          <div className="hud-overlay" style={{ top: '20px', left: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="node-pulse" style={{ position: 'static', width: '8px', height: '8px' }} />
              <span>SISTEMA VIVO · JUNÍN CORRIDOR</span>
            </div>
          </div>

          <div className="hud-overlay" style={{ top: '20px', right: '20px', textAlign: 'right' }}>
            <div>{agent.label} · sólido</div>
            <div style={{ color: 'var(--accent-2)' }}>{compareAgent.label} · punteado</div>
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
              compareRoute={compareLeadRoute}
            />
          </motion.div>
        </div>
      </div>
    </SlideShell>
  )
}
