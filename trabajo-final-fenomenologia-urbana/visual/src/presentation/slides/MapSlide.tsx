import type { AgentProfile, CaseNode, Payload, ScenarioSummary } from '../../types'
import type { DeckRoute, ModalKind } from '../deckTypes'
import { ControlTheatre } from '../components/Controls'
import { CorridorMap } from '../components/visuals/CorridorMap'
import { NetworkView } from '../components/visuals/NetworkView'
import { NodeSpotlight } from '../components/visuals/NodeSpotlight'
import { RouteMarquee } from '../components/visuals/RouteVisuals'
import { SlideHeader, SlideShell } from '../components/ui'

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
  return (
    <SlideShell id="mapa" className="map-slide">
      <SlideHeader
        eyebrow="Slide 03 · geografía y topología"
        title="Mapa vivo del corredor"
        text="La vista principal dibuja el corredor real, las rutas dominantes y el grafo operativo como capas de una misma experiencia urbana."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Abrir modelo</button>}
      />

      <ControlTheatre
        scenarios={data.scenarios}
        agents={data.agents}
        scenarioId={scenario.id}
        agentId={agent.id}
        compareAgentId={compareAgent.id}
        onScenarioChange={onScenarioChange}
        onAgentChange={onAgentChange}
        onCompareAgentChange={onCompareAgentChange}
      />

      <div className="map-stage-grid">
        <article className="deck-panel map-panel">
          <CorridorMap
            nodes={data.nodes}
            edges={data.edges}
            scenario={scenario}
            selectedNodeId={selectedNode.id}
            onSelectNode={onSelectNode}
            primaryHighlightedPath={leadRoute?.path ?? []}
            secondaryHighlightedPath={compareLeadRoute?.path ?? []}
          />
          <RouteMarquee
            data={data}
            agent={agent}
            compareAgent={compareAgent}
            route={leadRoute}
            compareRoute={compareLeadRoute}
          />
        </article>

        <aside className="deck-panel node-panel">
          <NetworkView
            nodes={data.nodes}
            edges={data.edges}
            scenario={scenario}
            selectedNodeId={selectedNode.id}
            onSelectNode={onSelectNode}
          />
          <NodeSpotlight node={selectedNode} scenario={scenario} />
        </aside>
      </div>
    </SlideShell>
  )
}
