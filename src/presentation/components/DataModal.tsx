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
        {data.calibration && (
          <ModalCard title="Calibración proxy y pesos del modelo">
            <MetricLine label="Referencia agregada Metro" value={compactNumber(data.calibration.ground_truth_target)} />
            <MetricLine label="Status" value={data.calibration.status} />
            <div className="calibration-weights">
              <p>Pesos usados por el baseline:</p>
              <MetricLine label="Tiempo" value={data.calibration.optimized_weights.time.toFixed(3)} />
              <MetricLine label="Riesgo" value={data.calibration.optimized_weights.risk.toFixed(3)} />
              <MetricLine label="Congestión" value={data.calibration.optimized_weights.crowding.toFixed(3)} />
            </div>
            <p className="modal-note">Referencia agregada contra ~100k pax/día en San Antonio; no sustituye conteos por nodo ni percepción situada.</p>
          </ModalCard>
        )}
        {data.advanced_models?.historical_evolution && (
          <ModalCard title="Transformación Longitudinal (2012-2024)">
            {data.advanced_models.historical_evolution.evolution.map((evo) => (
              <div key={evo.year} className="modal-row">
                <strong>{evo.year}</strong>
                <p>
                  Agentes: {compactNumber(evo.agents_simulated)} · Crimen: {compactNumber(evo.empirical_data.casos_crimen)} · Entropía Espacial: {evo.entropy_spatial.toFixed(2)}
                </p>
              </div>
            ))}
            <p className="modal-note">Aproximación basada en fuentes públicas agregadas; requiere archivo urbano y campo para lectura histórica completa.</p>
          </ModalCard>
        )}
        {data.advanced_reports?.urban_inequality && (
          <ModalCard title="Desigualdad fenomenológica">
            {data.advanced_reports.urban_inequality.scenarios.map((entry) => (
              <div key={entry.scenario_id} className="modal-row">
                <strong>{entry.label}</strong>
                <p>Gini {entry.entropy_gini.toFixed(4)} · ratio {entry.inequity_ratio.toFixed(2)}× · {entry.most_restricted_profile} ↔ {entry.most_free_profile}</p>
              </div>
            ))}
          </ModalCard>
        )}
        {data.advanced_reports?.hpc_stress && (
          <ModalCard title="Prueba de estrés computacional">
            <MetricLine label="Umbral simulado" value={compactNumber(data.advanced_reports.hpc_stress.tipping_point_detected.agents)} />
            <MetricLine label="Presión crítica" value={data.advanced_reports.hpc_stress.tipping_point_detected.pressure_index.toFixed(2)} />
            <MetricLine label="Entropía crítica" value={data.advanced_reports.hpc_stress.tipping_point_detected.system_entropy.toFixed(2)} />
            <p className="modal-note">Escenario interno para probar estabilidad; no representa capacidad real del corredor.</p>
            <p className="modal-note">{data.advanced_reports.hpc_stress.conclusion}</p>
          </ModalCard>
        )}
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
    const fc = data.field_calibration
    const matrixDecisions = fc?.collapse_matrix?.decisions ?? {}
    const friccion = matrixDecisions['friccion_acumulada'] ?? 0
    const inconcluyente = matrixDecisions['inconcluyente'] ?? 0
    const colapso = matrixDecisions['colapso_fenomenologico'] ?? 0
    const photos = fc?.photo_assignments?.n_total ?? 0
    const videos = fc?.video_assignments?.n_videos ?? 0
    return (
      <div className="modal-grid">
        <ModalCard title="Ejercicio propuesto · cerrado">
          <p>
            La salida de campo solicitada por la profesora se ejecutó el 2026-05-05 con
            dos observadores (Steven Vallejo y Jacob Agudelo) sobre 5 nodos del centro
            de Medellín. El entregable está completo.
          </p>
          <MetricLine label="Nodos visitados" value="5 (San Antonio, Parque San Antonio, La Bastilla, Junín, Botero)" />
          <MetricLine label="Entrevistas codificadas" value="15 (14 Stev + 1 Jacob)" />
          <MetricLine label="Fotos georreferenciadas" value={`${photos}`} />
          <MetricLine label="Videos procesados" value={`${videos}`} />
          <MetricLine label="Inter-rater κ (Stev↔Jacob)" value="0.0 (n=4 nodos compartidos)" />
        </ModalCard>

        <ModalCard title="Lo que se sostiene · pilares defendibles">
          <div className="modal-row">
            <strong>junin_paseo | peak_am</strong>
            <p>C1+C4 · bootstrap 95.6% · sensibilidad 88.0%</p>
          </div>
          <div className="modal-row">
            <strong>plaza_botero | midday</strong>
            <p>C1+C3 · bootstrap 97.0% · sensibilidad 100% (único caso con C3 confirmatorio)</p>
          </div>
          <p>
            Matriz: {colapso}/36 colapso · {friccion}/36 fricción acumulada · {inconcluyente}/36 inconcluyente.
          </p>
        </ModalCard>

        <ModalCard title="Limitaciones honestas (declaradas, no fingidas)">
          <div className="modal-row">
            <strong>C2 ausente</strong>
            <p>Encuesta cuantitativa de seguridad percibida ≤2/5 no realizada. Sesga el sistema hacia "fricción" antes que "colapso".</p>
          </div>
          <div className="modal-row">
            <strong>Sub-zonas vacías</strong>
            <p>Coltejer-Ayacucho y "calle del consumo" definidas en el campo pero no muestreadas (sesgo de itinerario).</p>
          </div>
          <div className="modal-row">
            <strong>n=2 observadores</strong>
            <p>κ con n=2 es estadísticamente débil. Enmarcado como piloto, no medición poblacional.</p>
          </div>
        </ModalCard>

        <ModalCard title="Marco funcional para replicar o extender">
          <p>
            El pipeline completo es reproducible. Para quien quiera completar los datos
            o replicar el modelo en otro corredor:
          </p>
          <p><code>investigacion/hpc/</code> · 9 scripts (YOLO, audio PANNs, OCR, kappa, bootstrap, geometría)</p>
          <p><code>investigacion/scripts/</code> · pipeline M-MASS multicapa</p>
          <p><code>investigacion/data/interim/templates/</code> · plantillas de campo (counts, notes, geojson)</p>
          <p><code>investigacion/docs/instrumentos-campo.md</code> · protocolo</p>
          <p><code>investigacion/docs/etica-campo.md</code> · consentimiento, anonimización</p>
          <p><code>tesis/historico/bitacora-consolidada-2026-05-08.md</code> · trazabilidad</p>
          <p>
            Repo público: <a href="https://github.com/stevenvo780/FenomenologiaUrbana" target="_blank" rel="noopener noreferrer">github.com/stevenvo780/FenomenologiaUrbana</a>
          </p>
        </ModalCard>

        <ModalCard title="Extensiones opcionales (no bloquean el entregable)">
          <div className="modal-row">
            <strong>Cierre de C2</strong>
            <p>Encuesta de seguridad percibida (escala 1-5 por subtramo) en una jornada adicional. Permite que la regla 3-de-4 opere realmente como 3-de-4.</p>
          </div>
          <div className="modal-row">
            <strong>Muestreo de sub-zonas</strong>
            <p>Coltejer-Ayacucho y calle del consumo, idealmente en ventanas peak_pm y night.</p>
          </div>
          <div className="modal-row">
            <strong>Ampliar inter-rater</strong>
            <p>Sumar 2-3 observadores adicionales para que κ sea estadísticamente sólido.</p>
          </div>
          <div className="modal-row">
            <strong>Audio profesional</strong>
            <p>Grabador de campo dedicado para no saturar la firma armónica (limita reggaetón vs vallenato).</p>
          </div>
        </ModalCard>
      </div>
    )
  }

  if (kind === 'calibration-detail') {
    const calibration = data.advanced_reports?.hpc_multipoint_calibration
    const uncertainty = data.advanced_reports?.hpc_uncertainty
    const inequality = data.advanced_reports?.urban_inequality

    return (
      <div className="modal-grid wide">
        <ModalCard title="Calibración multipunto">
          <MetricLine label="Método" value={calibration?.method ?? 's/d'} />
          <MetricLine label="Spatial accuracy" value={(calibration?.spatial_accuracy_score ?? 0).toFixed(4)} />
          <MetricLine label="Residual error" value={(calibration?.residual_error ?? 0).toFixed(4)} />
          {Object.entries(calibration?.optimized_parameters ?? {}).map(([key, value]) => (
            <MetricLine key={key} label={key} value={Number(value).toFixed(4)} />
          ))}
        </ModalCard>

        <ModalCard title="Nodos de validación">
          {Object.entries(calibration?.validation_nodes ?? {}).map(([nodeId, value]) => (
            <MetricLine key={nodeId} label={resolveNodeLabel(data, nodeId)} value={Number(value).toFixed(4)} />
          ))}
        </ModalCard>

        <ModalCard title="Incertidumbre Monte Carlo">
          <MetricLine label="Iteraciones" value={`${uncertainty?.iterations_per_sample ?? 0}`} />
          {Object.entries(uncertainty?.results ?? {}).map(([hour, entry]) => (
            <MetricLine
              key={hour}
              label={hour.replace('_', ' ')}
              value={`σrel ${entry.relative_uncertainty.toFixed(5)} · v ${entry.mean_velocity.toFixed(3)}`}
            />
          ))}
          <p className="modal-note">{uncertainty?.note}</p>
        </ModalCard>

        <ModalCard title="Desigualdad fenomenológica">
          {inequality?.scenarios.map((entry) => (
            <div key={entry.scenario_id} className="modal-row">
              <strong>{entry.label}</strong>
              <p>
                Gini {entry.entropy_gini.toFixed(4)} · ratio {entry.inequity_ratio.toFixed(2)}x ·
                restringido: {entry.most_restricted_profile} · libre: {entry.most_free_profile}
              </p>
            </div>
          ))}
          <p className="modal-note">{inequality?.conclusion}</p>
        </ModalCard>
      </div>
    )
  }

  if (kind === 'stress-detail') {
    const stress = data.advanced_reports?.hpc_stress
    const chaos = data.advanced_reports?.hpc_chaos
    const advanced = data.raw_reports?.advanced_scenarios ?? []

    return (
      <div className="modal-grid wide">
        <ModalCard title="Curva completa del stress test">
          {stress?.full_curve.map((entry) => (
            <MetricLine
              key={entry.agents}
              label={compactNumber(entry.agents)}
              value={`H ${entry.system_entropy.toFixed(2)} · presión ${entry.pressure_index.toFixed(2)}`}
            />
          ))}
          <p className="modal-note">{stress?.conclusion}</p>
        </ModalCard>

        <ModalCard title="Caos cotidiano">
          <MetricLine label="Obstrucción informal" value={`${((chaos?.informality_obstruction_ratio ?? 0) * 100).toFixed(1)}%`} />
          <MetricLine label="Ratio flâneur" value={`${((chaos?.flaneur_ratio ?? 0) * 100).toFixed(1)}%`} />
          <MetricLine label="Turbulencia media" value={(chaos?.mean_turbulence_index ?? 0).toFixed(4)} />
          <p className="modal-note">{chaos?.conclusion}</p>
        </ModalCard>

        <ModalCard title="Presión sistémica por escenario">
          {advanced.map((entry) => (
            <MetricLine
              key={entry.id}
              label={entry.label}
              value={`${entry.metrics.systemic_pressure.toFixed(2)} · H ${entry.metrics.m_mass_entropy.toFixed(3)}`}
            />
          ))}
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
        <MetricLine label="Entropía M-MASS" value={scenario.metrics.route_entropy.toFixed(2)} />
        <MetricLine label="Concentración" value={formatRatio(scenario.metrics.concentration_index)} />
        <MetricLine label="Nodo seleccionado" value={selectedNode.label} />
      </ModalCard>
      <ModalCard title="Desigualdad de Experiencia (M-MASS)">
        {scenario.advanced_stats?.map((stat) => (
          <MetricLine 
            key={stat.agent_id} 
            label={stat.label} 
            value={`${stat.path_entropy.toFixed(2)} (E) | ${stat.diversity_index.toFixed(2)} (D)`} 
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
