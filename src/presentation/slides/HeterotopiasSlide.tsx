import { motion } from 'framer-motion'
import { DoorOpen, Eye, Sparkles } from 'lucide-react'

import type { CaseNode, Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'

type GroupId = 'apertura_cierre' | 'memoria_y_exposicion' | 'ilusion_compensacion'

const groups: { id: GroupId; label: string; tone: 'danger' | 'amber' | 'teal'; Icon: typeof DoorOpen; tagline: string }[] = [
  {
    id: 'apertura_cierre',
    label: 'Apertura / cierre',
    tone: 'danger',
    Icon: DoorOpen,
    tagline: 'Umbrales donde la calle se acelera o se detiene.',
  },
  {
    id: 'memoria_y_exposicion',
    label: 'Memoria · exposición',
    tone: 'amber',
    Icon: Eye,
    tagline: 'Vacíos cargados de pasado y vigilancia difusa.',
  },
  {
    id: 'ilusion_compensacion',
    label: 'Ilusión · compensación',
    tone: 'teal',
    Icon: Sparkles,
    tagline: 'Interiores que prometen otro orden, más ordenado.',
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
        text="El corredor no es una calle homogénea: en cada punto la ciudad funciona con otra lógica. Apertura y cierre, memoria y vigilancia, ilusión y compensación."
        action={(
          <button type="button" className="ghost-action" onClick={() => onOpenModal('fieldwork')}>
            Abrir protocolo de campo
          </button>
        )}
      />

      <div className="slide-content">
        <SlideGrid className="heterotopia-grid">
          {groups.map((group, index) => {
            const nodes = data.nodes.filter((node) => node.heterotopia === group.id)
            const lead = nodes[0]
            const others = nodes.slice(1)
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <PanelFrame
                  eyebrow={`${nodes.length} ${nodes.length === 1 ? 'nodo' : 'nodos'}`}
                  title={(
                    <span className="heterotopia-title">
                      <group.Icon size={20} strokeWidth={1.5} />
                      {group.label}
                    </span>
                  )}
                  tone={group.tone}
                  className="heterotopia-panel"
                >
                  <p className="heterotopia-tagline">{group.tagline}</p>
                  {lead ? <LeadNode node={lead} /> : <p className="analysis-note-copy">Sin nodos en esta categoría.</p>}
                  {others.length ? (
                    <div className="heterotopia-chip-row">
                      {others.map((node) => (
                        <span key={node.id} className="heterotopia-chip" title={node.phenomenology}>
                          {node.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </PanelFrame>
              </motion.div>
            )
          })}
        </SlideGrid>

        <motion.p
          className="heterotopia-footnote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          <strong>Estructura de expulsión.</strong> El sistema registra
          {` ${data.source_summary.failed} `}fuentes oficiales fallidas: lo que la ciudad no se deja capturar también es parte del fenómeno.
        </motion.p>

        <p className="slide-citation">Foucault, 1975/2002 · Sassen, 2014</p>
      </div>
    </SlideShell>
  )
}

function LeadNode({ node }: { node: CaseNode }) {
  return (
    <article className="heterotopia-lead">
      <header>
        <strong>{node.label}</strong>
      </header>
      <p>{node.phenomenology}</p>
      <div className="heterotopia-bars" aria-hidden="true">
        <i style={{ width: `${node.security * 100}%` }} />
        <i style={{ width: `${node.comfort * 100}%` }} />
        <i style={{ width: `${node.memory * 100}%` }} />
      </div>
      <div className="heterotopia-bar-legend">
        <span>seguridad</span>
        <span>confort</span>
        <span>memoria</span>
      </div>
    </article>
  )
}
