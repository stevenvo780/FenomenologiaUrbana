import { motion } from 'framer-motion'

import type { CaseNode, Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'

const groups = [
  {
    id: 'apertura_cierre',
    label: 'Apertura/cierre',
    tone: 'danger' as const,
  },
  {
    id: 'memoria_y_exposicion',
    label: 'Memoria y exposición',
    tone: 'amber' as const,
  },
  {
    id: 'ilusion_compensacion',
    label: 'Ilusión/compensación',
    tone: 'teal' as const,
  },
]

export function HeterotopiasSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  return (
    <SlideShell id="heterotopias" className="heterotopias-slide">
      <SlideHeader
        eyebrow="Capítulo 4 · heterotopías"
        title="Cada nodo es un contra-sitio"
        text="El tag heterotópico ya estaba en el modelo. El refactor lo vuelve visible para leer apertura, memoria, exposición y expulsión documental."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('fieldwork')}>Abrir protocolo de campo</button>}
      />

      <div className="slide-content">
        <SlideGrid className="heterotopia-grid">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              <PanelFrame
                eyebrow="Foucault · contra-sitio"
                title={group.label}
                tone={group.tone}
                className="heterotopia-panel"
              >
                <NodeList nodes={data.nodes.filter((node) => node.heterotopia === group.id)} />
              </PanelFrame>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
            <PanelFrame eyebrow="Sassen · estructura de expulsión" title="Expulsión documental" tone="danger" className="heterotopia-panel heterotopia-wide">
              <p>
                Los fallos de captura no son ruido técnico: forman parte del fenómeno. El sistema registra
                {` ${data.source_summary.failed} `}fuentes fallidas y mantiene visible el campo pendiente.
              </p>
              <div className="mini-stat-grid">
                <div className="mini-stat-card">
                  <span>Fuentes fallidas</span>
                  <strong>{data.source_summary.failed}</strong>
                </div>
                <div className="mini-stat-card">
                  <span>Campo</span>
                  <strong>{data.fieldwork.status}</strong>
                </div>
              </div>
            </PanelFrame>
          </motion.div>
        </SlideGrid>

        <p className="slide-citation">Foucault, 1975/2002 · Sassen, 2014</p>
      </div>
    </SlideShell>
  )
}

function NodeList({ nodes }: { nodes: CaseNode[] }) {
  if (!nodes.length) {
    return <p className="analysis-note-copy">Sin nodos etiquetados en esta categoría.</p>
  }

  return (
    <div className="heterotopia-node-list">
      {nodes.map((node) => (
        <article key={node.id}>
          <strong>{node.label}</strong>
          <p>{node.phenomenology}</p>
          <div className="heterotopia-bars">
            <i style={{ width: `${node.security * 100}%` }} />
            <i style={{ width: `${node.comfort * 100}%` }} />
            <i style={{ width: `${node.memory * 100}%` }} />
          </div>
        </article>
      ))}
    </div>
  )
}
