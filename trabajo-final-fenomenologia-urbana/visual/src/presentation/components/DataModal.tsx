import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

import type { AgentProfile, CaseNode, Payload, ScenarioSummary, SourceEntry } from '../../types'
import { MODAL_TITLES } from '../constants'
import type { ModalKind } from '../deckTypes'
import { compactNumber, findPeakPeriod, formatDate, formatRatio, mapGateStatus, resolveNodeLabel } from '../utils'
import { EpistemicBadge, MetricLine, ModalCard } from './ui'

export function DataModal({
  kind,
  data,
  scenario,
  selectedNode,
  agent,
  compareAgent,
  onClose,
}: {
  kind: ModalKind
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  agent: AgentProfile
  compareAgent: AgentProfile
  onClose: () => void
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="data-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="data-modal-title"
        onClick={(event) => event.stopPropagation()}
        initial={{ y: 34, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 28, scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 210, damping: 25 }}
      >
        <header className="modal-header">
          <div>
            <p className="deck-eyebrow">Data room</p>
            <h2 id="data-modal-title">{MODAL_TITLES[kind]}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            <X size={24} aria-hidden="true" />
          </button>
        </header>
        <div className="modal-body">
          <ModalContent
            kind={kind}
            data={data}
            scenario={scenario}
            selectedNode={selectedNode}
            agent={agent}
            compareAgent={compareAgent}
          />
        </div>
      </motion.section>
    </motion.div>
  )
}

function ModalContent({
  kind,
  data,
  scenario,
  selectedNode,
  agent,
  compareAgent,
}: {
  kind: ModalKind
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  agent: AgentProfile
  compareAgent: AgentProfile
}) {
  if (kind === 'status') {
    return (
      <div className="modal-grid">
        <ModalCard title="Estado epistemológico">
          <MetricLine label="Caso" value={data.case_study.status} />
          <MetricLine label="Pipeline" value={data.meta.pipeline_version} />
          <MetricLine label="Generado" value={formatDate(data.meta.generated_at)} />
          <p>{data.case_study.epistemic_note}</p>
        </ModalCard>
        <ModalCard title="Cierre operativo">
          {data.closure.gates.map((gate) => (
            <div key={gate.id} className="modal-row">
              <EpistemicBadge status={mapGateStatus(gate.status)} compact />
              <div>
                <strong>{gate.label}</strong>
                <p>{gate.evidence}</p>
              </div>
            </div>
          ))}
        </ModalCard>
        <ModalCard title="Fuentes fallidas">
          {data.closure.failed_sources.map((source) => (
            <div key={source.id} className="modal-row danger">
              <strong>{source.label}</strong>
              <p>{source.note ?? 'sin nota'} · {source.url}</p>
            </div>
          ))}
        </ModalCard>
      </div>
    )
  }

  if (kind === 'evidence') {
    const center = data.empirical.center_perception
    const crime = data.empirical.crime_comuna_10
    const barrio = data.empirical.barrio_la_candelaria
    const environment = data.empirical.environmental_context
    const peak = findPeakPeriod(crime.monthly_2023)

    return (
      <div className="modal-grid wide">
        <ModalCard title="Percepción del centro">
          <MetricLine label="Imagen favorable" value={`${center.image_favorable_pct.toFixed(1)}%`} />
          <MetricLine label="Imagen desfavorable" value={`${center.image_unfavorable_pct.toFixed(1)}%`} />
          <MetricLine label="Visita mensual" value={`${center.visited_monthly_pct.toFixed(1)}%`} />
          {center.word_associations.map((entry) => (
            <MetricLine key={`${entry.dimension}-${entry.label}`} label={`${entry.dimension}: ${entry.label}`} value={`${entry.pct.toFixed(1)}%`} />
          ))}
        </ModalCard>
        <ModalCard title="Criminalidad comuna 10">
          <MetricLine label="Último mes" value={crime.latest_month} />
          {crime.top_conducts_2023.map((entry) => (
            <MetricLine key={entry.label} label={entry.label} value={compactNumber(entry.cases)} />
          ))}
          <div className="modal-bars">
            {crime.monthly_2023.map((entry) => (
              <div key={entry.period}>
                <span>{entry.period.slice(5)}</span>
                <div><i style={{ width: `${(entry.cases / Math.max(peak.cases, 1)) * 100}%` }} /></div>
                <strong>{entry.cases}</strong>
              </div>
            ))}
          </div>
        </ModalCard>
        <ModalCard title="Barrio y ambiente">
          {barrio.la_candelaria_metrics.map((entry) => (
            <MetricLine key={entry.label} label={entry.label} value={`${compactNumber(entry.value)} ${entry.unit}`} />
          ))}
          <MetricLine label="PM2.5 estación cercana" value={environment.air.pm25.nearest_station?.short_name ?? 'sin dato'} />
          <MetricLine label="PM10 estación cercana" value={environment.air.pm10.nearest_station?.short_name ?? 'sin dato'} />
          <MetricLine label="Ruido muestras válidas" value={`${environment.noise.valid_samples ?? 0}`} />
        </ModalCard>
      </div>
    )
  }

  if (kind === 'sources') {
    return (
      <div className="source-table">
        {data.sources.map((source) => (
          <SourceRow key={source.id} source={source} />
        ))}
      </div>
    )
  }

  if (kind === 'fieldwork') {
    return (
      <div className="modal-grid">
        <ModalCard title="Dependencia externa declarada">
          <MetricLine label="Sesiones cargadas" value={`${data.fieldwork.summary.sessions_count}`} />
          <MetricLine label="Cobertura nodal" value={formatRatio(data.fieldwork.summary.node_coverage_ratio)} />
          <p>{data.closure.non_fabrication_note}</p>
        </ModalCard>
        <ModalCard title="Tareas pendientes">
          {data.fieldwork.pending.map((task) => (
            <div key={task.task} className="modal-row">
              <strong>{task.task}</strong>
              <p>{task.variable} · {task.method}</p>
            </div>
          ))}
        </ModalCard>
        <ModalCard title="Plantillas listas">
          <p><code>investigacion/data/interim/templates/field_counts_template.csv</code></p>
          <p><code>investigacion/data/interim/templates/field_notes_template.md</code></p>
          <p><code>investigacion/data/interim/templates/field_points_template.geojson</code></p>
        </ModalCard>
      </div>
    )
  }

  return (
    <div className="modal-grid wide">
      <ModalCard title="Escenario activo">
        <MetricLine label="Escenario" value={scenario.label} />
        <MetricLine label="Franja" value={scenario.time_window} />
        <MetricLine label="Costo medio" value={scenario.metrics.avg_path_cost.toFixed(2)} />
        <MetricLine label="Restricción" value={formatRatio(scenario.metrics.decision_restriction)} />
        <MetricLine label="Nodo seleccionado" value={selectedNode.label} />
      </ModalCard>
      <ModalCard title="Desigualdad de Experiencia (M-MASS)">
        {scenario.advanced_stats?.map((stat: any) => (
          <MetricLine 
            key={stat.agent_id} 
            label={stat.label} 
            value={`${formatRatio(stat.path_entropy)} (E) | ${formatRatio(stat.diversity_index)} (D)`} 
          />
        ))}
        <p className="modal-note">E: Entropía de ruta (Libertad) | D: Índice de diversidad.</p>
      </ModalCard>
      <ModalCard title="Nodos del grafo">
        {data.nodes.map((node) => (
          <div key={node.id} className="modal-row">
            <strong>{node.label}</strong>
            <p>
              {node.kind} · seguridad {formatRatio(node.security)} · comercio {formatRatio(node.commerce)} · control {formatRatio(node.control)}
            </p>
          </div>
        ))}
      </ModalCard>
      <ModalCard title={`Pesos: ${agent.label} vs ${compareAgent.label}`}>
        {Object.entries(agent.weights).map(([key, value]) => (
          <MetricLine
            key={key}
            label={key}
            value={`${value.toFixed(2)} / ${(compareAgent.weights[key] ?? 0).toFixed(2)}`}
          />
        ))}
      </ModalCard>
      <ModalCard title="Rutas principales">
        {scenario.top_routes.map((route) => (
          <div key={`${route.agent_id}-${route.path.join('-')}`} className="modal-row">
            <strong>{route.label} · {Math.round(route.share * 100)}%</strong>
            <p>{route.path.map((nodeId) => resolveNodeLabel(data, nodeId)).join(' → ')}</p>
          </div>
        ))}
      </ModalCard>
    </div>
  )
}

function SourceRow({ source }: { source: SourceEntry }) {
  return (
    <div className={source.status === 'downloaded' ? 'source-row ok' : 'source-row warn'}>
      <div>
        <strong>{source.label}</strong>
        <p>{source.url}</p>
      </div>
      <span>{source.status}</span>
      <em>{source.http_status ?? 's/r'}</em>
      <small>{source.note}</small>
    </div>
  )
}
