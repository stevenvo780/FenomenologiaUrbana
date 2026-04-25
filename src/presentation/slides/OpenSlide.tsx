import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import type { EpistemicStatus, ModalKind, SlideId } from '../deckTypes'
import { motion } from 'framer-motion'
import { HeroConstellation } from '../components/visuals/HeroConstellation'
import { SlideShell } from '../components/ui'

export function OpenSlide({
  data,
  scenario,
  selectedNode,
  onGoToSlide,
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
    <SlideShell id="apertura" className="open-slide">
      <div className="open-grid">
        <motion.article
          className="open-copy"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.18 } }, hidden: {} }}
        >
          <motion.p variants={openChild} className="deck-eyebrow">Apertura · Capítulo 1</motion.p>
          <motion.h1 variants={openChild}>Volver a la calle misma</motion.h1>
          <motion.p variants={openChild} className="open-subtitle">
            Husserl, 1936: la matematización amputa el Lebenswelt. El HPC aquí invierte su signo:
            se vuelve Reducción Eidética Computacional.
          </motion.p>
          <motion.div variants={openChild} className="open-terms">
            <span>phainómenon</span>
            <span>lógos</span>
            <span>Lebenswelt</span>
          </motion.div>
          <motion.button
            variants={openChild}
            type="button"
            className="primary-action"
            onClick={() => onGoToSlide('symploke')}
          >
            INICIAR REDUCCIÓN
          </motion.button>
        </motion.article>

        <HeroConstellation
          data={data}
          scenario={scenario}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
        />
      </div>

      <div className="open-footer">
        {data.case_study.focus} · {data.case_study.area} · {data.nodes.length} nodos / {data.edges.length} ejes
      </div>
      <p className="slide-citation">Husserl, 1936/1991</p>
    </SlideShell>
  )
}

const openChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
