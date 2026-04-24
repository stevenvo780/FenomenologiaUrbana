import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

import type { CaseNode, Payload, ScenarioSummary } from '../../../types'
import { maxObjectValue } from '../../utils'

export function HeroConstellation({
  data,
  scenario,
  selectedNode,
  onSelectNode,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  onSelectNode: (nodeId: string) => void
}) {
  const maxLoad = maxObjectValue(scenario.node_loads)

  return (
    <motion.aside
      className="deck-panel constellation-panel"
      aria-label="Constelación fenomenológica"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.4, once: false }}
      transition={{ duration: 0.7 }}
    >
      <div className="constellation-core">
        <span className="core-ring ring-one" />
        <span className="core-ring ring-two" />
        <span className="core-ring ring-three" />
        <div className="core-label">
          <span>{selectedNode.label}</span>
          <strong>{scenario.label}</strong>
        </div>
        {data.nodes.map((node, index) => {
          const load = scenario.node_loads[node.id] ?? 0
          const angle = (index / data.nodes.length) * Math.PI * 2
          const distance = 34 + (load / maxLoad) * 24
          const x = 50 + Math.cos(angle) * distance
          const y = 50 + Math.sin(angle) * distance

          return (
            <motion.button
              key={node.id}
              type="button"
              className={node.id === selectedNode.id ? 'constellation-node active' : 'constellation-node'}
              style={{ left: `${x}%`, top: `${y}%`, '--delay': `${index * 0.18}s` } as CSSProperties}
              title={`${node.label}: ${load} trayectorias`}
              onClick={() => onSelectNode(node.id)}
              whileHover={{ scale: 1.35 }}
              whileTap={{ scale: 0.9 }}
            />
          )
        })}
      </div>
      <div className="constellation-caption">
        <p className="deck-eyebrow">Lectura escénica</p>
        <p>
          Cada punto es un nodo del corredor. El tamaño orbital responde a cargas simuladas;
          el centro mantiene viva la tesis: la experiencia está estructurada.
        </p>
      </div>
    </motion.aside>
  )
}
