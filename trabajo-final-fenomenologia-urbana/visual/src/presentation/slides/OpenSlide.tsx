import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import type { EpistemicStatus, ModalKind, SlideId } from '../deckTypes'
import { HeroConstellation } from '../components/visuals/HeroConstellation'
import { KpiPill, SlideShell } from '../components/ui'

export function OpenSlide({
  data,
  scenario,
  selectedNode,
  downloadedRatio,
  fieldworkBadge,
  onGoToSlide,
  onOpenModal,
  onSelectNode,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  downloadedRatio: string
  fieldworkBadge: EpistemicStatus
  onGoToSlide: (id: SlideId) => void
  onOpenModal: (kind: ModalKind) => void
  onSelectNode: (nodeId: string) => void
}) {
  return (
    <SlideShell id="apertura" className="hero-slide">
      <div className="hero-grid">
        <div className="hero-copy deck-panel">
          <p className="deck-eyebrow">Fenomenología contemporánea · demo visual</p>
          <h1>Centro de Medellín como red viva</h1>
          <p className="hero-lead">
            El dashboard se reorganiza como una presentación escénica: mapa, simulación,
            cuerpos, presión urbana y evidencia aparecen por actos, no como una tabla infinita.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onGoToSlide('mapa')}>
              Entrar al mapa vivo
            </button>
            <button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>
              Ver estatus general
            </button>
          </div>
          <div className="status-strip">
            <KpiPill label="Pipeline" value={data.meta.pipeline_version} status="proxy" />
            <KpiPill label="Fuentes" value={downloadedRatio} status="documented" />
            <KpiPill label="Escenarios" value={`${data.scenarios.length}`} status="proxy" />
            <KpiPill label="Campo" value="pendiente" status={fieldworkBadge} />
          </div>
        </div>

        <HeroConstellation
          data={data}
          scenario={scenario}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
        />
      </div>
    </SlideShell>
  )
}
