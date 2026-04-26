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
          <motion.p variants={openChild} className="deck-eyebrow">Apertura · Capítulo 1</motion.p>
          <motion.h1 variants={openChild}>Volver a la calle misma</motion.h1>
          <motion.p variants={openChild} className="open-subtitle">
            Esta tesis pregunta cómo se vive caminar el centro de Medellín: qué facilita el paso,
            qué lo presiona y qué todavía falta medir con trabajo de campo.
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
      <p className="slide-citation">Husserl, 1936/1991</p>
    </SlideShell>
  )
})

const openChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}
