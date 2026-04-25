import { motion } from 'framer-motion'

import type { CaseNode, Payload, ScenarioSummary } from '../../../types'
import { getBounds, maxObjectValue, projectNode } from '../../utils'

export function NetworkView({
  nodes,
  edges,
  scenario,
  selectedNodeId,
  onSelectNode,
}: {
  nodes: CaseNode[]
  edges: Payload['edges']
  scenario: ScenarioSummary
  selectedNodeId: string
  onSelectNode: (value: string) => void
}) {
  const bounds = getBounds(nodes)
  const maxLoad = maxObjectValue(scenario.node_loads)
  const safeMaxLoad = maxLoad || 1

  return (
    <svg className="network-svg" viewBox="0 0 880 560" role="img" aria-label="Grafo del corredor">
      <defs>
        <linearGradient id="edgeGradientDeck" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e07a46" />
          <stop offset="100%" stopColor="#1f7f79" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="880" height="560" rx="32" className="network-bg" />
      {edges.map((edge) => {
        const source = nodes.find((node) => node.id === edge.source)
        const target = nodes.find((node) => node.id === edge.target)

        if (!source || !target) {
          return null
        }

        const sourcePoint = projectNode(source, bounds)
        const targetPoint = projectNode(target, bounds)
        const edgeKey = `${edge.source}__${edge.target}`
        const reverseKey = `${edge.target}__${edge.source}`
        const load = scenario.edge_loads[edgeKey] ?? scenario.edge_loads[reverseKey] ?? 0

        return (
          <motion.line
            key={edgeKey}
            x1={sourcePoint.x}
            y1={sourcePoint.y}
            x2={targetPoint.x}
            y2={targetPoint.y}
            stroke="url(#edgeGradientDeck)"
            strokeWidth={1.4 + load / 24}
            strokeLinecap="round"
            opacity={0.74}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.75 }}
          />
        )
      })}
      {nodes.map((node) => {
        const point = projectNode(node, bounds)
        const load = scenario.node_loads[node.id] ?? 0
        const radius = 11 + (load / safeMaxLoad) * 28
        const active = node.id === selectedNodeId

        return (
          <g key={node.id} className="node-group" onClick={() => onSelectNode(node.id)}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={radius + 8}
              className={active ? 'node-halo active' : 'node-halo'}
              animate={{ scale: active ? [1, 1.18, 1] : 1 }}
              transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
            />
            <circle cx={point.x} cy={point.y} r={radius} className={active ? 'node-core active' : 'node-core'} />
            <text x={point.x} y={point.y - radius - 12} textAnchor="middle" className="node-label">
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
