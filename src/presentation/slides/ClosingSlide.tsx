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
          <h2>Dos pilares defendibles, κ = 0 como fortaleza, agenda explícita</h2>
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
    title: 'Dos pilares se sostienen',
    tone: 'teal' as const,
    text: 'junin_paseo | peak_am (C1+C4, bootstrap 95.6%) y plaza_botero | midday (C1+C3, bootstrap 97%): fricción acumulada documentada con triangulación, no colapso confirmado.',
  },
  {
    title: 'κ = 0 como fortaleza, no defecto',
    tone: 'amber' as const,
    text: 'Que dos observadores formados diverjan (Stev↔Jacob, n=4 nodos) confirma que la atmósfera urbana no preexiste a la mirada. Justifica triangular en lugar de promediar.',
  },
  {
    title: 'Matriz 3-de-4 falla limpia',
    tone: 'danger' as const,
    text: '0/36 colapsos confirmados, 6/36 fricciones, 30/36 inconcluyentes. La regla podía fallar y falló donde debía: eso es ciencia urbana, no fracaso.',
  },
]

const finalQuote = 'La tesis no cierra el centro: lo deja abierto con celdas, pilares y umbrales explícitos. Lo siguiente es cerrar C2 y completar C3.'

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
