import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import type { EpistemicStatus, ModalKind, SlideId } from '../deckTypes'
import { motion } from 'framer-motion'
import { HeroConstellation } from '../components/visuals/HeroConstellation'
import { SlideShell } from '../components/ui'

import { memo } from 'react'

export const OpenSlide = memo(function OpenSlide({
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
          <motion.p variants={openChild} className="deck-eyebrow">Apertura · Capítulo 1 · tesis central</motion.p>
          <motion.h1 variants={openChild}>La fenomenología sola no basta</motion.h1>
          <motion.p variants={openChild} className="open-subtitle">
            Dos observadores formados, mismo corredor, mismo día: κ = 0.0 sobre 4 nodos compartidos.
            La atmósfera urbana es ineliminablemente subjetiva, y por eso esta tesis triangula
            fenomenología (M2) + simulación M-MASS + datos cuantitativos HPC + matriz falsable 3-de-4.
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
            VER RECORRIDO
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
      <p className="slide-citation">Husserl, 1936/1991 · Merleau-Ponty, 1945/1993 · Kinkaid, 2020</p>
    </SlideShell>
  )
})

const openChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
