import type { AgentProfile, CaseNode, Payload, ScenarioSummary } from '../../types'
import type { DeckRoute, ModalKind } from '../deckTypes'
import { CorridorMap } from '../components/visuals/CorridorMap'
import { NodeSpotlight } from '../components/visuals/NodeSpotlight'
import { RouteMarquee } from '../components/visuals/RouteVisuals'
import { SlideHeader, SlideShell, MetricLine } from '../components/ui'
import { motion } from 'framer-motion'

const controlLabelStyle = {
  fontSize: '0.6rem',
  color: 'var(--text-dim)',
} as const

const selectStyle = {
  background: 'rgba(8, 8, 9, 0.92)',
  color: '#fff8ec',
  border: '1px solid rgba(224, 122, 70, 0.35)',
  borderRadius: '12px',
  padding: '0.65rem 0.75rem',
  fontSize: '0.8rem',
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
  const compareStats = scenario.advanced_stats?.find((entry) => entry.agent_id === compareAgent.id)

  return (
    <SlideShell id="mapa">
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: '100%' }}>
        {/* Left Control Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SlideHeader
            eyebrow="Auditoría 03 · Topología"
            title="Grafo Operativo"
            text="La ciudad como red de trayectorias y nodos de presión."
            action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Abrir modelo</button>}
          />

          <div className="data-card">
            <h3>Filtros de Simulación</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={controlLabelStyle}>ESCENARIO HORARIO</label>
              <select
                value={scenario.id}
                onChange={(e) => onScenarioChange(e.target.value)}
                style={selectStyle}
              >
                {data.scenarios.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
              </select>

              <label style={{ ...controlLabelStyle, marginTop: '0.5rem' }}>PERFIL FENOMENOLÓGICO</label>
              <select
                value={agent.id}
                onChange={(e) => onAgentChange(e.target.value)}
                style={selectStyle}
              >
                {data.agents.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
              </select>

              <label style={{ ...controlLabelStyle, marginTop: '0.5rem' }}>PERFIL DE CONTRASTE</label>
              <select
                value={compareAgent.id}
                onChange={(e) => onCompareAgentChange(e.target.value)}
                style={selectStyle}
              >
                {data.agents.filter((entry) => entry.id !== agent.id).map((entry) => (
                  <option key={entry.id} value={entry.id}>{entry.label}</option>
                ))}
              </select>
            </div>
          </div>

          <NodeSpotlight node={selectedNode} scenario={scenario} />

          <div className="data-card" style={{ marginTop: 'auto' }}>
            <h3>Métricas en Tiempo Real</h3>
            <MetricLine label="Nodos Activos" value={data.nodes.length.toString()} />
            <MetricLine label="Aristas de Flujo" value={data.edges.length.toString()} />
            <MetricLine label="Presión Media" value={scenario.metrics.mean_pressure.toLocaleString('es-CO', { maximumFractionDigits: 0 })} />
            <MetricLine label={`${agent.label} · Entropía`} value={activeStats ? activeStats.path_entropy.toFixed(3) : 'n/d'} />
            <MetricLine label={`${compareAgent.label} · Diversidad`} value={compareStats ? compareStats.diversity_index.toFixed(3) : 'n/d'} />
          </div>
        </div>

        {/* Main Map Area */}
        <div style={{ position: 'relative', border: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute',
              left: '20px',
              bottom: '20px',
              width: 'min(420px, calc(100% - 180px))',
            }}
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
