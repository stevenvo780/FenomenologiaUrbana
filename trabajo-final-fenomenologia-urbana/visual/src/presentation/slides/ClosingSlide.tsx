import type { Payload } from '../../types'
import type { EpistemicStatus, ModalKind } from '../deckTypes'
import { EpistemicBadge, SlideShell } from '../components/ui'
import { mapGateStatus } from '../utils'

export function ClosingSlide({
  data,
  fieldworkBadge,
  onOpenModal,
}: {
  data: Payload
  fieldworkBadge: EpistemicStatus
  onOpenModal: (kind: ModalKind) => void
}) {
  return (
    <SlideShell id="cierre" className="closing-slide">
      <div className="closing-grid">
        <article className="deck-panel closing-thesis">
          <p className="deck-eyebrow">Slide 16 · cierre defendible</p>
          <h2>La fenomenología no se opone al dato: se vuelve más precisa.</h2>
          <p>
            El espacio aparece al sujeto, pero aparece ya atravesado por transporte,
            comercio, ruido, vigilancia, memoria y poder. La app ahora comunica eso como
            una experiencia visual doctoral, no como una tabla infinita disfrazada de interfaz.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onOpenModal('fieldwork')}>
              Pendientes de campo
            </button>
            <button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>
              Estatus completo
            </button>
          </div>
        </article>
        <ClosureGates data={data} fieldworkBadge={fieldworkBadge} />
      </div>
    </SlideShell>
  )
}

function ClosureGates({
  data,
  fieldworkBadge,
}: {
  data: Payload
  fieldworkBadge: EpistemicStatus
}) {
  return (
    <article className="deck-panel closure-panel">
      <p className="deck-eyebrow">Gates de cierre</p>
      <div className="gate-stack">
        {data.closure.gates.map((gate) => (
          <div key={gate.id} className="gate-card">
            <EpistemicBadge status={mapGateStatus(gate.status)} compact />
            <div>
              <strong>{gate.label}</strong>
              <p>{gate.evidence}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="fieldwork-warning">
        <EpistemicBadge status={fieldworkBadge} />
        <p>{data.closure.non_fabrication_note}</p>
      </div>
    </article>
  )
}
