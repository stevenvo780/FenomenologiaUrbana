import type { AgentProfile, Payload, ScenarioSummary } from '../../types'
import type { ModalKind, ProfileComparison } from '../deckTypes'
import { ProfileRadar } from '../components/visuals/ProfileRadar'
import { RouteDuel } from '../components/visuals/RouteVisuals'
import { DeltaTile, SlideHeader, SlideShell } from '../components/ui'
import { formatSignedInteger, formatSignedMinutes, formatSignedNumber, formatSignedPercent } from '../utils'

export function ProfilesSlide({
  data,
  scenario,
  agent,
  compareAgent,
  profileComparison,
  topRoutes,
  compareTopRoutes,
  onAgentChange,
  onCompareAgentChange,
  onOpenModal,
}: {
  data: Payload
  scenario: ScenarioSummary
  agent: AgentProfile
  compareAgent: AgentProfile
  profileComparison: ProfileComparison
  topRoutes: ScenarioSummary['top_routes']
  compareTopRoutes: ScenarioSummary['top_routes']
  onAgentChange: (value: string) => void
  onCompareAgentChange: (value: string) => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const activeStats = scenario.advanced_stats?.find((entry) => entry.agent_id === agent.id)
  const compareStats = scenario.advanced_stats?.find((entry) => entry.agent_id === compareAgent.id)

  return (
    <SlideShell id="perfiles" className="profile-slide">
      <SlideHeader
        eyebrow="Capítulo 5 · perfiles de caminante"
        title="No son personas: son lentes de comparación"
        text="Cada perfil pesa distinto tiempo, riesgo, ruido y obstáculos. Sirven para preguntar quién gana o pierde libertad relativa en el mismo corredor."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Ver pesos</button>}
      />

      <div className="profile-stage-grid">
        <article className="deck-panel radar-panel">
          <div className="profile-select-grid">
            <label className="deck-control-stack">
              <span className="deck-control-label">Perfil fenomenológico</span>
              <select className="deck-select" value={agent.id} onChange={(event) => onAgentChange(event.target.value)}>
                {data.agents.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
              </select>
            </label>
            <label className="deck-control-stack">
              <span className="deck-control-label">Perfil de contraste</span>
              <select className="deck-select" value={compareAgent.id} onChange={(event) => onCompareAgentChange(event.target.value)}>
                {data.agents.filter((entry) => entry.id !== agent.id).map((entry) => (
                  <option key={entry.id} value={entry.id}>{entry.label}</option>
                ))}
              </select>
            </label>
          </div>
          <ProfileRadar primary={agent} secondary={compareAgent} />
        </article>
        <article className="deck-panel comparison-panel">
          <div className="comparison-headline">
            <span>{agent.label}</span>
            <strong>vs</strong>
            <span>{compareAgent.label}</span>
          </div>
          <div className="delta-grid">
            <DeltaTile label="Tiempo" value={formatSignedMinutes(profileComparison.deltaTravelMinutes)} />
            <DeltaTile label="Costo" value={formatSignedNumber(profileComparison.deltaCost)} />
            <DeltaTile label="Entropía" value={formatSignedPercent(profileComparison.deltaEntropy)} />
            <DeltaTile label="Viajes" value={formatSignedInteger(profileComparison.deltaTrips)} />
          </div>
          <div className="profile-entropy-bar">
            <span className="profile-entropy-chip" title="Entropía de Shannon sobre la distribución de rutas elegidas. Cuanto más alto, más diverso es el repertorio del perfil. Índice de diversidad: 1 − Herfindahl, mide concentración de las rutas.">
              {agent.label}: E={activeStats?.path_entropy.toFixed(3) ?? 'n/d'} · D={activeStats?.diversity_index.toFixed(3) ?? 'n/d'}
            </span>
            <span className="profile-entropy-chip" title="Entropía de Shannon sobre la distribución de rutas elegidas. Cuanto más alto, más diverso es el repertorio del perfil. Índice de diversidad: 1 − Herfindahl, mide concentración de las rutas.">
              {compareAgent.label}: E={compareStats?.path_entropy.toFixed(3) ?? 'n/d'} · D={compareStats?.diversity_index.toFixed(3) ?? 'n/d'}
            </span>
          </div>
          <RouteDuel
            data={data}
            primaryTitle={agent.label}
            secondaryTitle={compareAgent.label}
            primaryRoutes={topRoutes}
            secondaryRoutes={compareTopRoutes}
          />
        </article>
      </div>
      <p className="slide-citation">Deleuze, 1990 · Simmel, 1903/1986</p>
    </SlideShell>
  )
}
