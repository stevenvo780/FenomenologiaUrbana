import type { Payload } from '../../types'
import type { EpistemicStatus, ModalKind } from '../deckTypes'
import { motion } from 'framer-motion'
import { EpistemicBadge, PanelFrame, SlideShell } from '../components/ui'
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
          <p className="deck-eyebrow">Capítulo 16 · cierre crítico</p>
          <h2>Lo que sabemos, lo que falta y lo que queda abierto</h2>
          <div className="closing-postulates">
            {postulates.map((postulate, index) => (
              <motion.div
                key={postulate.title}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.3 }}
              >
                <PanelFrame eyebrow={`Postulado ${index + 1}`} title={postulate.title} tone={postulate.tone}>
                  <p>{postulate.text}</p>
                </PanelFrame>
              </motion.div>
            ))}
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onOpenModal('fieldwork')}>
              Pendientes de campo
            </button>
            <button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>
              Estatus completo
            </button>
          </div>
          <p className="closing-typewriter" aria-label={finalQuote}>
            {finalQuote.split('').map((char, index) => (
              <motion.span key={`${char}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.035 }}>
                {char}
              </motion.span>
            ))}
          </p>
        </article>
        <ClosureGates data={data} fieldworkBadge={fieldworkBadge} />
      </div>
      <p className="slide-citation">Husserl · Bueno · Badiou · Foucault · Deleuze · Merleau-Ponty · Simmel · Johnson · Sassen · Aguilar</p>
    </SlideShell>
  )
}

const postulates = [
  {
    title: 'Contra el instrumentalismo',
    tone: 'danger' as const,
    text: 'La simulación no sirve para vender una certeza total: sirve para hacer visibles supuestos, fricciones y preguntas de campo.',
  },
  {
    title: 'Soberanía fenomenológica',
    tone: 'amber' as const,
    text: 'La ciudad se evalúa también por cómo permite orientarse, detenerse, respirar, sentirse seguro y escoger rutas cotidianas.',
  },
  {
    title: 'Validación pendiente como honestidad',
    tone: 'teal' as const,
    text: 'El estado pending_no_capture no debilita la tesis si se declara: separa lo ya trazable de lo que exige observación situada.',
  },
]

const finalQuote = 'La tesis no cierra el centro: deja claro cómo seguir midiéndolo sin inventarlo.'

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
