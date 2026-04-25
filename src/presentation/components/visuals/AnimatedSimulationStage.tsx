import { motion } from 'framer-motion'

import type { Payload, ScenarioSummary } from '../../../types'
import { buildSvgPath, getBounds, maxObjectValue, projectNode } from '../../utils'

export function AnimatedSimulationStage({
  data,
  scenario,
  selectedNodeId,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNodeId: string
}) {
  const bounds = getBounds(data.nodes)
  const maxLoad = maxObjectValue(scenario.node_loads)
  const routes = scenario.top_routes.slice(0, 7)

  return (
    <motion.article
      className="deck-panel simulation-canvas"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.25, once: false }}
      transition={{ duration: 0.6 }}
    >
      <svg viewBox="0 0 980 660" role="img" aria-label="Simulación animada de trayectorias">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff4cf" />
            <stop offset="70%" stopColor="#e07a46" />
            <stop offset="100%" stopColor="rgba(224, 122, 70, 0)" />
          </radialGradient>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f4c87a" />
            <stop offset="45%" stopColor="#e07a46" />
            <stop offset="100%" stopColor="#1f7f79" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="980" height="660" rx="46" className="sim-bg" />

        {data.edges.map((edge) => {
          const source = data.nodes.find((node) => node.id === edge.source)
          const target = data.nodes.find((node) => node.id === edge.target)

          if (!source || !target) {
            return null
          }

          const sourcePoint = projectNode(source, bounds, 880, 520, 70, 70)
          const targetPoint = projectNode(target, bounds, 880, 520, 70, 70)
          const edgeKey = `${edge.source}__${edge.target}`
          const reverseKey = `${edge.target}__${edge.source}`
          const load = scenario.edge_loads[edgeKey] ?? scenario.edge_loads[reverseKey] ?? 0

          return (
            <line
              key={edgeKey}
              x1={sourcePoint.x}
              y1={sourcePoint.y}
              x2={targetPoint.x}
              y2={targetPoint.y}
              className="sim-edge"
              strokeWidth={1 + load / 28}
            />
          )
        })}

        {routes.map((route, routeIndex) => {
          const pathId = `flow-${scenario.id}-${routeIndex}`
          const d = buildSvgPath(route.path, data.nodes, bounds)
          const particles = Math.max(2, Math.min(7, Math.round(route.share * 24)))

          return (
            <g key={pathId}>
              <motion.path
                id={pathId}
                d={d}
                className="flow-path"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.58 }}
                transition={{ duration: 1.2, delay: routeIndex * 0.08 }}
              />
              {Array.from({ length: particles }).map((_, particleIndex) => (
                <circle key={`${pathId}-${particleIndex}`} r={4 + route.share * 10} className="flow-particle">
                  <animateMotion
                    dur={`${9 + route.path.length * 1.2}s`}
                    begin={`${particleIndex * 0.75 + routeIndex * 0.18}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </circle>
              ))}
            </g>
          )
        })}

        {data.nodes.map((node) => {
          const point = projectNode(node, bounds, 880, 520, 70, 70)
          const load = scenario.node_loads[node.id] ?? 0
          const radius = 10 + (load / maxLoad) * 34
          const active = node.id === selectedNodeId

          return (
            <g key={node.id} className="sim-node">
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={radius + 14}
                className={active ? 'sim-node-glow active' : 'sim-node-glow'}
                animate={{ scale: active ? [0.94, 1.16, 0.94] : [0.96, 1.06, 0.96] }}
                transition={{ duration: active ? 1.6 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx={point.x} cy={point.y} r={radius} className={active ? 'sim-node-core active' : 'sim-node-core'} />
              <text x={point.x} y={point.y - radius - 16} textAnchor="middle">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
    </motion.article>
  )
}
