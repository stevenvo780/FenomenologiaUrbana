import type { CaseNode, ScenarioSummary } from '../../../types'
import { formatRatio } from '../../utils'
import { MetricLine } from '../ui'

export function NodeSpotlight({
  node,
  scenario,
  compact = false,
}: {
  node: CaseNode
  scenario: ScenarioSummary
  compact?: boolean
}) {
  const load = scenario.node_loads[node.id] ?? 0
  const bottleneck = scenario.top_bottlenecks.find((entry) => entry.node_id === node.id)
  const summary = compact ? '' : node.phenomenology
  const spotlightMessage = bottleneck
    ? compact
      ? `Cuello de botella · ${bottleneck.load} trayectorias.`
      : `Aparece como cuello de botella principal con ${bottleneck.load} trayectorias simuladas.`
    : compact
      ? `Opera ${load > scenario.metrics.mean_pressure ? 'sobre' : 'bajo'} la presión media.`
      : `Opera ${load > scenario.metrics.mean_pressure ? 'por encima' : 'por debajo'} de la presión media del sistema.`

  return (
    <div className={`node-spotlight${compact ? ' compact' : ''}`}>
      <p className="deck-eyebrow">Inspector de nodo</p>
      <h3>{node.label}</h3>
      {summary ? <p>{summary}</p> : null}
      <div className="node-metric-grid">
        <MetricLine compact={compact} label="Carga" value={`${load}`} />
        <MetricLine compact={compact} label="Seguridad" value={formatRatio(node.security)} />
        <MetricLine compact={compact} label="Comercio" value={formatRatio(node.commerce)} />
        <MetricLine compact={compact} label="Control" value={formatRatio(node.control)} />
      </div>
      <p className="spotlight-note">{spotlightMessage}</p>
    </div>
  )
}
