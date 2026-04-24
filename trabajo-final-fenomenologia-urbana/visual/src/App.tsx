import { startTransition, useDeferredValue, useState } from 'react'

import './App.css'
import { useProjectData } from './hooks/useProjectData'
import type { CaseNode, Payload, ScenarioSummary } from './types'

function App() {
  const state = useProjectData()
  const [scenarioId, setScenarioId] = useState('peak_pm')
  const [agentId, setAgentId] = useState('commuter_fast')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const deferredScenarioId = useDeferredValue(scenarioId)

  if (state.status === 'loading') {
    return (
      <main className="loading-shell">
        <div className="loading-card">
          <p className="eyebrow">Fenomenologia urbana operacional</p>
          <h1>Cargando pipeline visual</h1>
          <p>
            La app espera el payload generado por <code>investigacion/scripts/run_all.py</code>.
          </p>
        </div>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className="loading-shell">
        <div className="loading-card">
          <p className="eyebrow">Error de carga</p>
          <h1>No hay payload visual disponible</h1>
          <p>{state.message}</p>
        </div>
      </main>
    )
  }

  return <Dashboard data={state.data} scenarioId={deferredScenarioId} agentId={agentId} selectedNodeId={selectedNodeId} onScenarioChange={setScenarioId} onAgentChange={setAgentId} onSelectNode={setSelectedNodeId} />
}

type DashboardProps = {
  data: Payload
  scenarioId: string
  agentId: string
  selectedNodeId: string | null
  onScenarioChange: (value: string) => void
  onAgentChange: (value: string) => void
  onSelectNode: (value: string) => void
}

function Dashboard({
  data,
  scenarioId,
  agentId,
  selectedNodeId,
  onScenarioChange,
  onAgentChange,
  onSelectNode,
}: DashboardProps) {
  const scenario = data.scenarios.find((entry) => entry.id === scenarioId) ?? data.scenarios[0]
  const agent = data.agents.find((entry) => entry.id === agentId) ?? data.agents[0]
  const selectedNode =
    data.nodes.find((entry) => entry.id === selectedNodeId) ?? data.nodes[0]
  const selectedProfile =
    scenario.profile_stats.find((entry) => entry.agent_id === agent.id) ??
    scenario.profile_stats[0]
  const topRoutes =
    scenario.top_routes.filter((entry) => entry.agent_id === agent.id).slice(0, 3)
  const downloadedRatio = `${data.source_summary.downloaded}/${data.source_summary.total}`
  const scenarioSequence = data.scenarios
  const nodeLoad = scenario.node_loads[selectedNode.id] ?? 0
  const nodeBottleneck = scenario.top_bottlenecks.find(
    (entry) => entry.node_id === selectedNode.id,
  )
  const nodeNarrative = buildNodeNarrative(selectedNode, scenario, nodeLoad, nodeBottleneck)

  return (
    <main className="app-shell">
      <div className="backdrop" aria-hidden="true" />

      <header className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">Fenomenologia contemporanea de la ciudad</p>
          <h1>Centro de Medellin como red de decisiones condicionadas</h1>
          <p className="hero-text">
            Esta interfaz conecta el plan filosofico con un pipeline investigativo que
            modela el corredor <strong>{data.case_study.focus}</strong> como red
            multicapa, ejecuta simulaciones de agentes y deja trazabilidad explicita de
            que proviene de fuentes publicas y que sigue siendo proxy.
          </p>
        </div>

        <div className="hero-panel">
          <div className="status-grid">
            <MetricCard label="Escenario activo" value={scenario.label} accent="clay" />
            <MetricCard
              label="Restriccion decisional"
              value={formatRatio(scenario.metrics.decision_restriction)}
              accent="ink"
            />
            <MetricCard
              label="Ruta media"
              value={`${scenario.metrics.avg_travel_minutes.toFixed(1)} min`}
              accent="teal"
            />
            <MetricCard label="Fuentes descargadas" value={downloadedRatio} accent="sand" />
          </div>
          <p className="meta-line">
            Pipeline {data.meta.pipeline_version} · generado {formatDate(data.meta.generated_at)}
          </p>
        </div>
      </header>

      <section className="control-shell">
        <div className="control-block">
          <p className="control-label">Escenarios</p>
          <div className="chip-row">
            {data.scenarios.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={entry.id === scenario.id ? 'chip chip-active' : 'chip'}
                onClick={() => {
                  startTransition(() => onScenarioChange(entry.id))
                }}
              >
                <span>{entry.label}</span>
                <small>{entry.time_window}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="control-block">
          <p className="control-label">Perfil de agente</p>
          <div className="chip-row">
            {data.agents.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={entry.id === agent.id ? 'chip chip-subtle chip-active' : 'chip chip-subtle'}
                onClick={() => {
                  startTransition(() => onAgentChange(entry.id))
                }}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="card map-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Topologia del corredor</p>
              <h2>Grafo operativo del caso</h2>
            </div>
            <p className="muted">
              Clic en un nodo para ver lectura fenomenologica, carga simulada y centralidad.
            </p>
          </div>
          <NetworkView
            nodes={data.nodes}
            edges={data.edges}
            scenario={scenario}
            selectedNodeId={selectedNode.id}
            onSelectNode={onSelectNode}
          />
          <div className="node-strip">
            {data.nodes.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={entry.id === selectedNode.id ? 'node-pill node-pill-active' : 'node-pill'}
                onClick={() => onSelectNode(entry.id)}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </article>

        <article className="card inspector-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Inspector de nodo</p>
              <h2>{selectedNode.label}</h2>
            </div>
            <span className="tag">{selectedNode.kind.replaceAll('_', ' ')}</span>
          </div>
          <p className="lead">{selectedNode.description}</p>
          <div className="metric-table">
            <MetricRow label="Carga simulada" value={`${nodeLoad} trayectorias`} />
            <MetricRow
              label="Betweenness"
              value={selectedNode.centrality.betweenness.toFixed(3)}
            />
            <MetricRow
              label="Closeness"
              value={selectedNode.centrality.closeness.toFixed(3)}
            />
            <MetricRow label="Seguridad estructural" value={formatRatio(selectedNode.security)} />
            <MetricRow label="Atraccion comercial" value={formatRatio(selectedNode.commerce)} />
            <MetricRow label="Control visible" value={formatRatio(selectedNode.control)} />
            <MetricRow label="Memoria urbana" value={formatRatio(selectedNode.memory)} />
          </div>
          <div className="insight-box">
            <p className="eyebrow">Lectura fenomenologica</p>
            <p>{selectedNode.phenomenology}</p>
          </div>
          <div className="insight-box insight-warm">
            <p className="eyebrow">Lectura sistemica</p>
            <p>{nodeNarrative}</p>
          </div>
        </article>

        <article className="card route-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Perfil seleccionado</p>
              <h2>{agent.label}</h2>
            </div>
            <span className="tag">{scenario.label}</span>
          </div>
          <div className="metric-table">
            <MetricRow label="Costo medio" value={selectedProfile.avg_cost.toFixed(2)} />
            <MetricRow
              label="Tiempo medio"
              value={`${selectedProfile.avg_travel_minutes.toFixed(1)} min`}
            />
            <MetricRow label="Entropia de rutas" value={formatRatio(selectedProfile.route_entropy)} />
            <MetricRow label="Viajes simulados" value={`${selectedProfile.trip_count}`} />
          </div>
          <div className="route-list">
            {topRoutes.map((route) => (
              <div key={`${route.agent_id}-${route.path.join('-')}`} className="route-item">
                <div className="route-meta">
                  <p>{route.path.map((nodeId) => resolveNodeLabel(data, nodeId)).join(' -> ')}</p>
                  <span>{Math.round(route.share * 100)}%</span>
                </div>
                <div className="route-bar">
                  <div style={{ width: `${route.share * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card scenario-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Comparativa horaria</p>
              <h2>Matriz de presion y restriccion</h2>
            </div>
          </div>
          <div className="scenario-list">
            {scenarioSequence.map((entry) => (
              <div key={entry.id} className={entry.id === scenario.id ? 'scenario-row scenario-row-active' : 'scenario-row'}>
                <div className="scenario-row-head">
                  <strong>{entry.label}</strong>
                  <span>{entry.time_window}</span>
                </div>
                <BarRow label="Restriccion" value={entry.metrics.decision_restriction} />
                <BarRow label="Entropia" value={entry.metrics.route_entropy} />
                <BarRow label="Presion" value={normalizePressure(entry.metrics.mean_pressure, data.scenarios)} />
              </div>
            ))}
          </div>
        </article>

        <article className="card bottleneck-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Bottlenecks</p>
              <h2>Nodos de mayor condicionamiento</h2>
            </div>
          </div>
          <div className="bottleneck-list">
            {scenario.top_bottlenecks.map((entry, index) => (
              <div key={entry.node_id} className="bottleneck-item">
                <span className="bottleneck-rank">{index + 1}</span>
                <div>
                  <p>{entry.label}</p>
                  <small>{entry.phenomenology}</small>
                </div>
                <strong>{entry.load}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="card trace-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Trazabilidad</p>
              <h2>Fuentes y pendientes</h2>
            </div>
          </div>
          <div className="trace-grid">
            <div className="trace-column">
              <p className="trace-title">Fuentes intentadas</p>
              {data.sources.slice(0, 6).map((entry) => (
                <div key={entry.id} className="trace-row">
                  <span>{entry.label}</span>
                  <strong className={entry.status === 'downloaded' ? 'ok' : 'warn'}>
                    {entry.status}
                  </strong>
                </div>
              ))}
            </div>
            <div className="trace-column">
              <p className="trace-title">Pendientes de campo</p>
              {data.fieldwork.pending.map((entry) => (
                <div key={entry.task} className="trace-task">
                  <strong>{entry.task}</strong>
                  <p>
                    {entry.variable} · {entry.method}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="footer-band">
        <div>
          <p className="eyebrow">Estado epistemico</p>
          <p>
            <strong>{data.case_study.status}</strong> · {data.case_study.epistemic_note}
          </p>
        </div>
        <div>
          <p className="eyebrow">Principio filosofico</p>
          <p>
            El sujeto no decide desde un vacio soberano. Decide dentro de una topologia
            de acceso, ruido, vigilancia, habito, comercio y memoria.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'clay' | 'ink' | 'teal' | 'sand'
}) {
  return (
    <div className={`metric-card metric-${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function BarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="bar-row">
      <div className="bar-head">
        <span>{label}</span>
        <strong>{Math.round(value * 100)}%</strong>
      </div>
      <div className="bar-track">
        <div style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}

function NetworkView({
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

  return (
    <svg className="network-svg" viewBox="0 0 880 560" role="img" aria-label="Grafo del corredor">
      <defs>
        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
        const width = 1.5 + load / 30

        return (
          <line
            key={edgeKey}
            x1={sourcePoint.x}
            y1={sourcePoint.y}
            x2={targetPoint.x}
            y2={targetPoint.y}
            stroke="url(#edgeGradient)"
            strokeWidth={width}
            strokeLinecap="round"
            opacity={0.72}
          />
        )
      })}

      {nodes.map((node) => {
        const point = projectNode(node, bounds)
        const load = scenario.node_loads[node.id] ?? 0
        const radius = 12 + load / 18
        const active = node.id === selectedNodeId

        return (
          <g key={node.id} className="node-group" onClick={() => onSelectNode(node.id)}>
            <circle
              cx={point.x}
              cy={point.y}
              r={radius + 8}
              className={active ? 'node-halo node-halo-active' : 'node-halo'}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={radius}
              className={active ? 'node-core node-core-active' : 'node-core'}
            />
            <text x={point.x} y={point.y - radius - 14} textAnchor="middle" className="node-label">
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function getBounds(nodes: CaseNode[]) {
  const lats = nodes.map((node) => node.lat)
  const lons = nodes.map((node) => node.lon)

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
  }
}

function projectNode(node: CaseNode, bounds: ReturnType<typeof getBounds>) {
  const width = 760
  const height = 430
  const paddingX = 60
  const paddingY = 65
  const xRatio = (node.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1)
  const yRatio = (node.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)

  return {
    x: paddingX + xRatio * width,
    y: 520 - (paddingY + yRatio * height),
  }
}

function resolveNodeLabel(data: Payload, nodeId: string) {
  return data.nodes.find((node) => node.id === nodeId)?.label ?? nodeId
}

function formatRatio(value: number) {
  return `${Math.round(value * 100)}%`
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function normalizePressure(value: number, scenarios: ScenarioSummary[]) {
  const all = scenarios.map((scenario) => scenario.metrics.mean_pressure)
  const min = Math.min(...all)
  const max = Math.max(...all)

  if (max === min) {
    return 1
  }

  return (value - min) / (max - min)
}

function buildNodeNarrative(
  node: CaseNode,
  scenario: ScenarioSummary,
  nodeLoad: number,
  bottleneck: ScenarioSummary['top_bottlenecks'][number] | undefined,
) {
  const pressure =
    nodeLoad > scenario.metrics.mean_pressure ? 'por encima' : 'por debajo'
  const bottleneckNote = bottleneck
    ? ` En este escenario aparece entre los cuellos de botella principales con ${bottleneck.load} trayectorias simuladas.`
    : ''

  return `${node.label} se comporta como un nodo ${pressure} de la presion media del sistema. Su mezcla de control ${formatRatio(node.control)}, comercio ${formatRatio(node.commerce)} y memoria ${formatRatio(node.memory)} explica por que el espacio no se vive solo como forma fisica sino como regimen de circulacion y permanencia.${bottleneckNote}`
}
