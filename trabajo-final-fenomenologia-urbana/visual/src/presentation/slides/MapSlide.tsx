import type { AgentProfile, CaseNode, Payload, ScenarioSummary } from '../../types'
import type { DeckRoute, ModalKind } from '../deckTypes'
import { CorridorMap } from '../components/visuals/CorridorMap'
import { NodeSpotlight } from '../components/visuals/NodeSpotlight'
import { SlideHeader, SlideShell, MetricLine } from '../components/ui'
import { motion } from 'framer-motion'

export function MapSlide({
  data,
  scenario,
  agent,
  compareAgent,
  selectedNode,
  leadRoute,
  onScenarioChange,
  onAgentChange,
  onSelectNode,
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
  return (
    <SlideShell id="mapa">
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: '100%' }}>
        
        {/* Left Control Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SlideHeader
            eyebrow="Auditoría 03 · Topología"
            title="Grafo Operativo"
            text="La ciudad como red de trayectorias y nodos de presión."
          />
          
          <div className="data-card">
            <h3>Filtros de Simulación</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>ESCENARIO HORARIO</label>
              <select 
                value={scenario.id} 
                onChange={(e) => onScenarioChange(e.target.value)}
                style={{ background: '#000', color: '#fff', border: '1px solid var(--accent)', padding: '8px', fontSize: '0.8rem' }}
              >
                {data.scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>

              <label style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>PERFIL FENOMENOLÓGICO</label>
              <select 
                value={agent.id} 
                onChange={(e) => onAgentChange(e.target.value)}
                style={{ background: '#000', color: '#fff', border: '1px solid var(--accent)', padding: '8px', fontSize: '0.8rem' }}
              >
                {data.agents.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
          </div>

          <NodeSpotlight node={selectedNode} scenario={scenario} />
          
          <div className="data-card" style={{ marginTop: 'auto' }}>
            <h3>Métricas en Tiempo Real</h3>
            <MetricLine label="Nodos Activos" value={data.nodes.length.toString()} />
            <MetricLine label="Aristas de Flujo" value={data.edges.length.toString()} />
            <MetricLine label="Presión Media" value={(scenario.pressure * 100).toFixed(1) + '%'} />
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

          {/* Trayectorias Marquee Replacement */}
          {leadRoute && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '20px',
                background: 'rgba(0,0,0,0.8)',
                padding: '1rem',
                borderLeft: '2px solid var(--accent)',
                maxWidth: '300px'
              }}
            >
              <h4 style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase' }}>Ruta de {agent.label}</h4>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                Entropía: {leadRoute.entropy.toFixed(3)} | Diversidad: {leadRoute.diversity.toFixed(3)}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </SlideShell>
  )
}
