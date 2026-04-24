import * as L from 'leaflet'
import { startTransition, useDeferredValue, useEffect, useRef, useState } from 'react'

import './App.css'
import { useProjectData } from './hooks/useProjectData'
import type { CaseNode, Payload, ScenarioSummary } from './types'

type EpistemicStatus = 'documented' | 'proxy' | 'pending'

function App() {
  const state = useProjectData()
  const [scenarioId, setScenarioId] = useState('peak_pm')
  const [agentId, setAgentId] = useState('commuter_fast')
  const [compareAgentId, setCompareAgentId] = useState('reduced_mobility')
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

  return (
    <Dashboard
      data={state.data}
      scenarioId={deferredScenarioId}
      agentId={agentId}
      compareAgentId={compareAgentId}
      selectedNodeId={selectedNodeId}
      onScenarioChange={setScenarioId}
      onAgentChange={setAgentId}
      onCompareAgentChange={setCompareAgentId}
      onSelectNode={setSelectedNodeId}
    />
  )
}

type DashboardProps = {
  data: Payload
  scenarioId: string
  agentId: string
  compareAgentId: string
  selectedNodeId: string | null
  onScenarioChange: (value: string) => void
  onAgentChange: (value: string) => void
  onCompareAgentChange: (value: string) => void
  onSelectNode: (value: string) => void
}

function Dashboard({
  data,
  scenarioId,
  agentId,
  compareAgentId,
  selectedNodeId,
  onScenarioChange,
  onAgentChange,
  onCompareAgentChange,
  onSelectNode,
}: DashboardProps) {
  const scenario = data.scenarios.find((entry) => entry.id === scenarioId) ?? data.scenarios[0]
  const agent = data.agents.find((entry) => entry.id === agentId) ?? data.agents[0]
  const compareAgent =
    data.agents.find((entry) => entry.id === compareAgentId && entry.id !== agent.id) ??
    data.agents.find((entry) => entry.id !== agent.id) ??
    data.agents[0]
  const selectedNode =
    data.nodes.find((entry) => entry.id === selectedNodeId) ?? data.nodes[0]
  const selectedProfile =
    scenario.profile_stats.find((entry) => entry.agent_id === agent.id) ??
    scenario.profile_stats[0]
  const compareProfile =
    scenario.profile_stats.find((entry) => entry.agent_id === compareAgent.id) ??
    scenario.profile_stats[0]
  const topRoutes =
    scenario.top_routes.filter((entry) => entry.agent_id === agent.id).slice(0, 3)
  const compareTopRoutes =
    scenario.top_routes.filter((entry) => entry.agent_id === compareAgent.id).slice(0, 3)
  const leadRoute = topRoutes[0]
  const compareLeadRoute = compareTopRoutes[0]
  const downloadedRatio = `${data.source_summary.downloaded}/${data.source_summary.total}`
  const scenarioSequence = data.scenarios
  const nodeLoad = scenario.node_loads[selectedNode.id] ?? 0
  const nodeBottleneck = scenario.top_bottlenecks.find(
    (entry) => entry.node_id === selectedNode.id,
  )
  const nodeNarrative = buildNodeNarrative(selectedNode, scenario, nodeLoad, nodeBottleneck)
  const center = data.empirical.center_perception
  const crime = data.empirical.crime_comuna_10
  const barrio = data.empirical.barrio_la_candelaria
  const metro = data.empirical.source_evidence.metro_operational
  const densityComparison = barrio.metric_comparisons.find(
    (entry) => entry.metric === 'Densidad poblacional',
  )
  const businessComparison = barrio.metric_comparisons.find(
    (entry) => entry.metric === 'Densidad empresarial',
  )
  const publicSpaceMetric = barrio.la_candelaria_metrics.find(
    (entry) => entry.label === 'Espacio público efectivo por habitante',
  )
  const publicSpaceDeficitMetric = barrio.la_candelaria_metrics.find(
    (entry) => entry.label === 'Déficit espacio público efectivo',
  )
  const comparison = buildProfileComparison(selectedProfile, compareProfile)
  const fieldworkMatrix = buildFieldworkMatrix(data.fieldwork.pending)

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
            <MetricCard
              label="Escenario activo"
              value={scenario.label}
              accent="clay"
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <MetricCard
              label="Restriccion decisional"
              value={formatRatio(scenario.metrics.decision_restriction)}
              accent="ink"
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <MetricCard
              label="Ruta media"
              value={`${scenario.metrics.avg_travel_minutes.toFixed(1)} min`}
              accent="teal"
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <MetricCard
              label="Fuentes descargadas"
              value={downloadedRatio}
              accent="sand"
              status="documented"
            />
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

        <div className="control-block control-block-inline">
          <p className="control-label">Comparar con</p>
          <label className="select-shell">
            <span className="visually-hidden">Selecciona perfil de comparación</span>
            <select
              value={compareAgent.id}
              onChange={(event) => {
                startTransition(() => onCompareAgentChange(event.target.value))
              }}
            >
              {data.agents
                .filter((entry) => entry.id !== agent.id)
                .map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </section>

      <section className="content-grid">
        <article className="card map-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Geografia y topologia</p>
              <h2>Mapa y grafo operativo del caso</h2>
            </div>
            <p className="muted">
              El mapa ubica el corredor real y resalta la ruta dominante del perfil activo.
            </p>
          </div>
          <div className="spatial-grid">
            <div className="spatial-pane">
              <CorridorMap
                nodes={data.nodes}
                edges={data.edges}
                scenario={scenario}
                selectedNodeId={selectedNode.id}
                onSelectNode={onSelectNode}
                primaryHighlightedPath={leadRoute?.path ?? []}
                secondaryHighlightedPath={compareLeadRoute?.path ?? []}
              />
              <div className="spatial-caption">
                <p className="eyebrow">Ruta dominante del perfil</p>
                <div className="route-legend-list">
                  <div className="route-legend-item">
                    <span className="route-legend-swatch route-legend-primary" />
                    <p>
                      {leadRoute
                        ? `${agent.label}: ${leadRoute.path
                            .map((nodeId) => resolveNodeLabel(data, nodeId))
                            .join(' -> ')} (${Math.round(leadRoute.share * 100)}%)`
                        : 'Sin ruta dominante para el perfil principal.'}
                    </p>
                  </div>
                  <div className="route-legend-item">
                    <span className="route-legend-swatch route-legend-secondary" />
                    <p>
                      {compareLeadRoute
                        ? `${compareAgent.label}: ${compareLeadRoute.path
                            .map((nodeId) => resolveNodeLabel(data, nodeId))
                            .join(' -> ')} (${Math.round(compareLeadRoute.share * 100)}%)`
                        : 'Sin ruta dominante para el perfil comparado.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="spatial-pane spatial-pane-graph">
              <NetworkView
                nodes={data.nodes}
                edges={data.edges}
                scenario={scenario}
                selectedNodeId={selectedNode.id}
                onSelectNode={onSelectNode}
              />
            </div>
          </div>
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
          <div className="meta-pill-row">
            <span className="meta-pill">
              Heterotopia: {selectedNode.heterotopia.replaceAll('_', ' ')}
            </span>
            <EpistemicBadge status={selectedNode.proxy ? 'proxy' : 'documented'} />
          </div>
          <div className="metric-table">
            <MetricRow
              label="Carga simulada"
              value={`${nodeLoad} trayectorias`}
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <MetricRow
              label="Betweenness"
              value={selectedNode.centrality.betweenness.toFixed(3)}
              status={selectedNode.proxy ? 'proxy' : 'documented'}
            />
            <MetricRow
              label="Closeness"
              value={selectedNode.centrality.closeness.toFixed(3)}
              status={selectedNode.proxy ? 'proxy' : 'documented'}
            />
            <MetricRow
              label="Seguridad estructural"
              value={formatRatio(selectedNode.security)}
              status={selectedNode.proxy ? 'proxy' : 'documented'}
            />
            <MetricRow
              label="Atraccion comercial"
              value={formatRatio(selectedNode.commerce)}
              status={selectedNode.proxy ? 'proxy' : 'documented'}
            />
            <MetricRow
              label="Control visible"
              value={formatRatio(selectedNode.control)}
              status={selectedNode.proxy ? 'proxy' : 'documented'}
            />
            <MetricRow
              label="Memoria urbana"
              value={formatRatio(selectedNode.memory)}
              status={selectedNode.proxy ? 'proxy' : 'documented'}
            />
          </div>
          <div className="insight-box">
            <p className="eyebrow">Lectura fenomenologica</p>
            <p>{selectedNode.phenomenology}</p>
          </div>
          <div className="insight-box insight-neutral">
            <p className="eyebrow">Lectura heterotopica</p>
            <p>
              Este nodo opera como <strong>{selectedNode.heterotopia.replaceAll('_', ' ')}</strong>
              , articulando umbral, memoria, comercio o friccion segun el regimen de uso.
            </p>
          </div>
          <div className="insight-box insight-warm">
            <p className="eyebrow">Lectura sistemica</p>
            <p>{nodeNarrative}</p>
          </div>
        </article>

        <article className="card route-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Comparacion de perfiles</p>
              <h2>{agent.label} vs. {compareAgent.label}</h2>
            </div>
            <span className="tag">{scenario.label}</span>
          </div>
          <div className="route-delta-grid">
            <DeltaCard
              label="Delta tiempo"
              value={formatSignedMinutes(comparison.deltaTravelMinutes)}
              note="positivo = el perfil principal tarda mas"
            />
            <DeltaCard
              label="Delta costo"
              value={formatSignedNumber(comparison.deltaCost)}
              note="positivo = mayor costo para el perfil principal"
            />
            <DeltaCard
              label="Delta entropia"
              value={formatSignedPercent(comparison.deltaEntropy)}
              note="positivo = mas diversidad de rutas"
            />
            <DeltaCard
              label="Delta viajes"
              value={formatSignedInteger(comparison.deltaTrips)}
              note="diferencia de carga simulada del escenario"
            />
          </div>

          <div className="route-compare-grid">
            <ProfileRoutePanel
              title={agent.label}
              profile={selectedProfile}
              routes={topRoutes}
              data={data}
              accent="primary"
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
            <ProfileRoutePanel
              title={compareAgent.label}
              profile={compareProfile}
              routes={compareTopRoutes}
              data={data}
              accent="secondary"
              status={mapScenarioStatus(scenario.epistemic_status)}
            />
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
              {data.sources.slice(0, 8).map((entry) => (
                <div key={entry.id} className="trace-row">
                  <span>{entry.label}</span>
                  <strong className={entry.status === 'downloaded' ? 'ok' : 'warn'}>
                    {entry.status}
                  </strong>
                </div>
              ))}
            </div>
            <div className="trace-column">
              <p className="trace-title">Actualizacion conocida</p>
              <div className="trace-task">
                <strong>MEData criminalidad</strong>
                <p>{data.empirical.source_evidence.freshness.medata_criminalidad_last_updated ?? 'sin dato'}</p>
              </div>
              <div className="trace-task">
                <strong>MEData bateria barrial</strong>
                <p>{data.empirical.source_evidence.freshness.medata_barrio_last_updated ?? 'sin dato'}</p>
              </div>
              <div className="trace-task">
                <strong>San Antonio B</strong>
                <p>
                  flujo alto diurno: {String(metro.high_flow_day)} · presion PM:{' '}
                  {String(metro.afternoon_rush_pressure)}
                </p>
              </div>
            </div>
            <div className="trace-column">
              <p className="trace-title">Pendientes de campo</p>
              <div className="trace-task trace-task-legend">
                <strong>Estado del frente de campo</strong>
                <p>
                  {data.fieldwork.pending.length} tareas siguen pendientes antes de pasar de
                  baseline proxy a calibracion de campo.
                </p>
                <EpistemicBadge status="pending" />
              </div>
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

        <article className="card fieldwork-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Trabajo de campo</p>
              <h2>Matriz minima para calibracion</h2>
            </div>
            <EpistemicBadge status="pending" />
          </div>

          <div className="fieldwork-summary">
            <div className="fieldwork-summary-copy">
              <p>
                La version actual ya es demostrable, pero todavia necesita una captura minima
                de campo para mover el sistema desde <strong>baseline proxy</strong> hacia una
                calibracion mas defendible.
              </p>
              <p>
                Archivo operativo: <code>investigacion/docs/protocolo-campo-minimo.md</code>
              </p>
            </div>
            <div className="fieldwork-summary-stats">
              <MetricCard
                label="Pendientes clave"
                value={`${data.fieldwork.pending.length}`}
                accent="sand"
                status="pending"
              />
            </div>
          </div>

          <div className="fieldwork-grid">
            {fieldworkMatrix.map((group) => (
              <div key={group.title} className="fieldwork-group">
                <div className="fieldwork-group-head">
                  <h3>{group.title}</h3>
                  <EpistemicBadge status="pending" compact />
                </div>
                <p>{group.description}</p>
                <div className="fieldwork-task-list">
                  {group.tasks.map((task) => (
                    <div key={task.task} className="fieldwork-task-item">
                      <strong>{task.task}</strong>
                      <span>{task.variable}</span>
                      <small>{task.method}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="fieldwork-assets">
            <div className="fieldwork-asset-card">
              <strong>Plantillas sugeridas</strong>
              <p>`investigacion/data/interim/templates/field_counts_template.csv`</p>
              <p>`investigacion/data/interim/templates/field_notes_template.md`</p>
              <p>`investigacion/data/interim/templates/field_points_template.geojson`</p>
            </div>
            <div className="fieldwork-asset-card">
              <strong>Salida esperada</strong>
              <p>conteo peatonal + flujo direccional + permanencia + ruido + iluminacion</p>
            </div>
          </div>
        </article>

        <article className="card evidence-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Evidencia empirica ya integrada</p>
              <h2>Centro, criminalidad y estructura barrial</h2>
            </div>
            <p className="muted">
              Esta capa ya no es proxy puro: resume datos reales de percepcion ciudadana,
              criminalidad y capacidad de soporte del centro.
            </p>
          </div>

          <div className="evidence-grid">
            <section className="evidence-column">
              <p className="trace-title">Percepcion del centro 2024</p>
              <div className="metric-table">
                <MetricRow
                  label="Imagen favorable"
                  value={`${center.image_favorable_pct.toFixed(1)}%`}
                  status="documented"
                />
                <MetricRow
                  label="Imagen desfavorable"
                  value={`${center.image_unfavorable_pct.toFixed(1)}%`}
                  status="documented"
                />
                <MetricRow
                  label="Visita al menos mensual"
                  value={`${center.visited_monthly_pct.toFixed(1)}%`}
                  status="documented"
                />
                <MetricRow
                  label="Motivo principal"
                  value={`${center.main_motives[0].label} ${center.main_motives[0].pct.toFixed(1)}%`}
                  status="documented"
                />
              </div>
              <div className="micro-bars">
                {center.word_associations.map((entry) => (
                  <BarRow
                    key={`${entry.dimension}-${entry.label}`}
                    label={`${entry.dimension}: ${entry.label}`}
                    value={entry.pct / 100}
                  />
                ))}
              </div>
            </section>

            <section className="evidence-column">
              <p className="trace-title">Criminalidad comuna 10</p>
              <div className="metric-table">
                <MetricRow
                  label="Ultimo mes disponible"
                  value={crime.latest_month}
                  status="documented"
                />
                <MetricRow
                  label="Conducta dominante 2023"
                  value={`${crime.top_conducts_2023[0].label} ${compactNumber(crime.top_conducts_2023[0].cases)}`}
                  status="documented"
                />
                <MetricRow
                  label="Pico 2023"
                  value={`${findPeakPeriod(crime.monthly_2023).period} · ${findPeakPeriod(crime.monthly_2023).cases}`}
                  status="documented"
                />
              </div>
              <div className="timeline-bars">
                {crime.monthly_2023.map((entry) => (
                  <div key={entry.period} className="timeline-bar">
                    <span>{entry.period.slice(5)}</span>
                    <div className="timeline-track">
                      <div
                        style={{
                          width: `${(entry.cases / findPeakPeriod(crime.monthly_2023).cases) * 100}%`,
                        }}
                      />
                    </div>
                    <strong>{entry.cases}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="evidence-column">
              <p className="trace-title">Barrio La Candelaria 2021</p>
              <div className="metric-table">
                <MetricRow
                  label="Densidad poblacional"
                  value={`${barrio.highlights.population_density.toFixed(1)} hab/ha`}
                  status="documented"
                />
                <MetricRow
                  label="Densidad empresarial"
                  value={`${barrio.highlights.business_density.toFixed(1)} empresas/1000 hab`}
                  status="documented"
                />
                <MetricRow
                  label="Espacio publico efectivo"
                  value={`${publicSpaceMetric?.value.toFixed(2) ?? '0.00'} m2/hab`}
                  status="documented"
                />
                <MetricRow
                  label="Deficit de espacio publico"
                  value={`${publicSpaceDeficitMetric?.value.toFixed(2) ?? '0.00'} m2/hab`}
                  status="documented"
                />
              </div>
              <div className="comparison-stack">
                <ComparisonList
                  title="Ranking por densidad poblacional"
                  entries={densityComparison?.ranked_values.slice(0, 5) ?? []}
                />
                <ComparisonList
                  title="Ranking por densidad empresarial"
                  entries={businessComparison?.ranked_values.slice(0, 5) ?? []}
                />
              </div>
            </section>
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
        <div>
          <p className="eyebrow">Leyenda epistemica</p>
          <div className="legend-row">
            <EpistemicBadge status="documented" />
            <EpistemicBadge status="proxy" />
            <EpistemicBadge status="pending" />
          </div>
          <p>
            Documented = dato trazable desde fuente o derivacion consolidada; Proxy =
            baseline analitico aun no calibrado en campo; Pending = frente abierto.
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
  status,
}: {
  label: string
  value: string
  accent: 'clay' | 'ink' | 'teal' | 'sand'
  status?: EpistemicStatus
}) {
  return (
    <div className={`metric-card metric-${accent}`}>
      <div className="metric-card-head">
        <span>{label}</span>
        {status ? <EpistemicBadge status={status} compact /> : null}
      </div>
      <strong>{value}</strong>
    </div>
  )
}

function MetricRow({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status?: EpistemicStatus
}) {
  return (
    <div className="metric-row">
      <div className="metric-row-label">
        <span>{label}</span>
        {status ? <EpistemicBadge status={status} compact /> : null}
      </div>
      <strong>{value}</strong>
    </div>
  )
}

function EpistemicBadge({
  status,
  compact = false,
}: {
  status: EpistemicStatus
  compact?: boolean
}) {
  const config = {
    documented: {
      label: 'documented',
      title: 'Dato sustentado en fuente publica o derivacion consolidada.',
    },
    proxy: {
      label: 'proxy',
      title: 'Dato o metrica analitica todavia no calibrada con trabajo de campo fino.',
    },
    pending: {
      label: 'pending',
      title: 'Frente todavia abierto o pendiente de captura.',
    },
  }[status]

  return (
    <span
      className={compact ? `epistemic-badge epistemic-${status} epistemic-compact` : `epistemic-badge epistemic-${status}`}
      title={config.title}
    >
      {config.label}
    </span>
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

function ComparisonList({
  title,
  entries,
}: {
  title: string
  entries: Array<{ barrio: string; value: number; unit: string }>
}) {
  const max = Math.max(...entries.map((entry) => entry.value), 1)

  return (
    <div className="comparison-card">
      <p className="comparison-title">{title}</p>
      {entries.map((entry) => (
        <div key={`${title}-${entry.barrio}`} className="timeline-bar">
          <span>{entry.barrio}</span>
          <div className="timeline-track">
            <div style={{ width: `${(entry.value / max) * 100}%` }} />
          </div>
          <strong>{compactNumber(entry.value)}</strong>
        </div>
      ))}
    </div>
  )
}

function DeltaCard({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="delta-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  )
}

function ProfileRoutePanel({
  title,
  profile,
  routes,
  data,
  accent,
  status,
}: {
  title: string
  profile: ScenarioSummary['profile_stats'][number]
  routes: ScenarioSummary['top_routes']
  data: Payload
  accent: 'primary' | 'secondary'
  status: EpistemicStatus
}) {
  return (
    <div className={`profile-route-panel profile-route-${accent}`}>
      <div className="profile-route-head">
        <h3>{title}</h3>
        <EpistemicBadge status={status} compact />
      </div>

      <div className="metric-table">
        <MetricRow label="Costo medio" value={profile.avg_cost.toFixed(2)} status={status} />
        <MetricRow
          label="Tiempo medio"
          value={`${profile.avg_travel_minutes.toFixed(1)} min`}
          status={status}
        />
        <MetricRow
          label="Entropia de rutas"
          value={formatRatio(profile.route_entropy)}
          status={status}
        />
        <MetricRow label="Viajes simulados" value={`${profile.trip_count}`} status={status} />
      </div>

      <div className="route-list compact-route-list">
        {routes.map((route) => (
          <div key={`${title}-${route.path.join('-')}`} className="route-item">
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

function CorridorMap({
  nodes,
  edges,
  scenario,
  selectedNodeId,
  onSelectNode,
  primaryHighlightedPath,
  secondaryHighlightedPath,
}: {
  nodes: CaseNode[]
  edges: Payload['edges']
  scenario: ScenarioSummary
  selectedNodeId: string
  onSelectNode: (value: string) => void
  primaryHighlightedPath: string[]
  secondaryHighlightedPath: string[]
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)
  const primaryHighlightedEdges = buildPathEdgeKeys(primaryHighlightedPath)
  const secondaryHighlightedEdges = buildPathEdgeKeys(secondaryHighlightedPath)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const mapInstance = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance)

    layerGroupRef.current = L.layerGroup().addTo(mapInstance)
    mapRef.current = mapInstance

    return () => {
      layerGroupRef.current?.clearLayers()
      layerGroupRef.current?.remove()
      mapInstance.remove()
      mapRef.current = null
      layerGroupRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) {
      return
    }

    const mapInstance = mapRef.current
    const layerGroup = layerGroupRef.current
    const bounds = L.latLngBounds(nodes.map((node) => [node.lat, node.lon] as [number, number]))

    layerGroup.clearLayers()
    mapInstance.fitBounds(bounds.pad(0.12))

    for (const edge of edges) {
      const source = nodes.find((node) => node.id === edge.source)
      const target = nodes.find((node) => node.id === edge.target)

      if (!source || !target) {
        continue
      }

      const edgeKey = `${edge.source}__${edge.target}`
      const reverseKey = `${edge.target}__${edge.source}`
      const load = scenario.edge_loads[edgeKey] ?? scenario.edge_loads[reverseKey] ?? 0

      L.polyline(
        [
          [source.lat, source.lon],
          [target.lat, target.lon],
        ],
        {
          color: '#1f7f79',
          opacity: 0.42,
          weight: 2 + load / 45,
        },
      ).addTo(layerGroup)
    }

    const primaryCoordinates = getPathCoordinates(primaryHighlightedPath, nodes)

    if (primaryCoordinates.length > 1) {
      L.polyline(primaryCoordinates, {
        color: '#cf5d2d',
        opacity: 0.94,
        weight: 6,
      }).addTo(layerGroup)
    }

    const secondaryCoordinates = getPathCoordinates(secondaryHighlightedPath, nodes)

    if (secondaryCoordinates.length > 1) {
      L.polyline(secondaryCoordinates, {
        color: '#1f7f79',
        opacity: 0.96,
        weight: 5,
        dashArray: '10 8',
      }).addTo(layerGroup)
    }

    for (const node of nodes) {
      const load = scenario.node_loads[node.id] ?? 0
      const active = node.id === selectedNodeId
      const primaryHighlighted =
        primaryHighlightedEdges.has(node.id) || primaryHighlightedPath.includes(node.id)
      const secondaryHighlighted =
        secondaryHighlightedEdges.has(node.id) || secondaryHighlightedPath.includes(node.id)

      const marker = L.circleMarker([node.lat, node.lon], {
        radius: active ? 12 : primaryHighlighted || secondaryHighlighted ? 10 : 7 + load / 45,
        color: active ? '#cf5d2d' : primaryHighlighted ? '#cf5d2d' : secondaryHighlighted ? '#1f7f79' : '#171311',
        fillColor: active ? '#cf5d2d' : primaryHighlighted ? '#cf5d2d' : secondaryHighlighted ? '#1f7f79' : getNodeColor(node),
        fillOpacity: 0.92,
        weight: active ? 3 : 2,
      })

      marker.bindTooltip(
        `<div class="map-tooltip"><strong>${node.label}</strong><span>${node.phenomenology}</span><small>Carga: ${load} · Seguridad: ${formatRatio(node.security)}</small></div>`,
        {
          direction: 'top',
          offset: [0, -8],
          opacity: 1,
          className: 'corridor-tooltip',
        },
      )
      marker.on('click', () => onSelectNode(node.id))
      marker.addTo(layerGroup)
    }
  }, [
    edges,
    nodes,
    onSelectNode,
    primaryHighlightedEdges,
    primaryHighlightedPath,
    scenario,
    secondaryHighlightedEdges,
    secondaryHighlightedPath,
    selectedNodeId,
  ])

  return <div ref={containerRef} className="corridor-map" role="img" aria-label="Mapa del corredor" />
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

function buildPathEdgeKeys(path: string[]) {
  const keys = new Set<string>()

  for (const [source, target] of pairwise(path)) {
    keys.add(`${source}__${target}`)
    keys.add(source)
    keys.add(target)
  }

  return keys
}

function* pairwise(path: string[]) {
  for (let index = 0; index < path.length - 1; index += 1) {
    yield [path[index], path[index + 1]] as const
  }
}

function getNodeColor(node: CaseNode) {
  if (node.security >= 0.55) {
    return '#1f7f79'
  }

  if (node.security >= 0.45) {
    return '#b79862'
  }

  return '#cf5d2d'
}

function getPathCoordinates(path: string[], nodes: CaseNode[]) {
  return path
    .map((nodeId) => nodes.find((node) => node.id === nodeId))
    .filter((node): node is CaseNode => Boolean(node))
    .map((node) => [node.lat, node.lon] as [number, number])
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

function mapScenarioStatus(value: string): EpistemicStatus {
  if (value.includes('proxy')) {
    return 'proxy'
  }

  if (value.includes('pending')) {
    return 'pending'
  }

  return 'documented'
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

function compactNumber(value: number) {
  return new Intl.NumberFormat('es-CO', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function findPeakPeriod(entries: Array<{ period: string; cases: number }>) {
  return entries.reduce((peak, current) => (current.cases > peak.cases ? current : peak), entries[0])
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

function buildProfileComparison(
  primary: ScenarioSummary['profile_stats'][number],
  secondary: ScenarioSummary['profile_stats'][number],
) {
  return {
    deltaCost: primary.avg_cost - secondary.avg_cost,
    deltaTravelMinutes: primary.avg_travel_minutes - secondary.avg_travel_minutes,
    deltaEntropy: primary.route_entropy - secondary.route_entropy,
    deltaTrips: primary.trip_count - secondary.trip_count,
  }
}

function buildFieldworkMatrix(
  pending: Payload['fieldwork']['pending'],
) {
  const groups = [
    {
      title: 'Movilidad y flujo',
      description: 'Sirve para recalibrar crowding, flujo direccional y comparacion entre rutas simuladas y trayectorias observadas.',
      matcher: (task: Payload['fieldwork']['pending'][number]) =>
        /densidad|peatonal|flujo/i.test(task.variable) || /conteo/i.test(task.task),
    },
    {
      title: 'Permanencia y uso',
      description: 'Afina la permanencia base de nodos y la diferencia entre paso, pausa, espera y refugio.',
      matcher: (task: Payload['fieldwork']['pending'][number]) =>
        /permanencia/i.test(task.variable) || /permanencia/i.test(task.task),
    },
    {
      title: 'Seguridad percibida',
      description: 'Permite contrastar criminalidad estructural con experiencia situada por subtramo.',
      matcher: (task: Payload['fieldwork']['pending'][number]) =>
        /seguridad/i.test(task.variable) || /seguridad/i.test(task.task),
    },
    {
      title: 'Ambiente y accesibilidad',
      description: 'Completa ruido e iluminacion para horas nocturnas y momentos de sobrecarga sensorial.',
      matcher: (task: Payload['fieldwork']['pending'][number]) =>
        /ambiental|iluminacion|ruido/i.test(task.variable) || /ruido|iluminacion/i.test(task.task),
    },
  ]

  return groups
    .map((group) => ({
      title: group.title,
      description: group.description,
      tasks: pending.filter(group.matcher),
    }))
    .filter((group) => group.tasks.length > 0)
}

function formatSignedNumber(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

function formatSignedMinutes(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)} min`
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${Math.round(value * 100)}%`
}

function formatSignedInteger(value: number) {
  return `${value >= 0 ? '+' : ''}${value}`
}
