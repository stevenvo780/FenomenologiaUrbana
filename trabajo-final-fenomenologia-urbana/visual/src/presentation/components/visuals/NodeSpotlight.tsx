import type { CaseNode, ScenarioSummary } from '../../../types'
import { formatRatio } from '../../utils'
import { MetricLine } from '../ui'

export function NodeSpotlight({ node, scenario }: { node: CaseNode; scenario: ScenarioSummary }) {
  const load = scenario.node_loads[node.id] ?? 0
  const bottleneck = scenario.top_bottlenecks.find((entry) => entry.node_id === node.id)

  return (
    <div className="node-spotlight">
      <p className="deck-eyebrow">Inspector de nodo</p>
      <h3>{node.label}</h3>
      <p>{node.phenomenology}</p>
      <div className="node-metric-grid">
        <MetricLine label="Carga" value={`${load}`} />
        <MetricLine label="Seguridad" value={formatRatio(node.security)} />
        <MetricLine label="Comercio" value={formatRatio(node.commerce)} />
        <MetricLine label="Control" value={formatRatio(node.control)} />
      </div>
      <p className="spotlight-note">
        {bottleneck
          ? `Aparece como cuello de botella principal con ${bottleneck.load} trayectorias simuladas.`
          : `Opera ${load > scenario.metrics.mean_pressure ? 'por encima' : 'por debajo'} de la presión media del sistema.`}
      </p>
    </div>
  )
}
