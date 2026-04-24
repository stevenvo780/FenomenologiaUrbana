import type { AgentProfile, Payload, ScenarioSummary } from '../../types'
import type { ModalKind, ProfileComparison } from '../deckTypes'
import { ProfileRadar } from '../components/visuals/ProfileRadar'
import { RouteDuel } from '../components/visuals/RouteVisuals'
import { DeltaTile, SlideHeader, SlideShell } from '../components/ui'
import { formatSignedInteger, formatSignedMinutes, formatSignedNumber, formatSignedPercent } from '../utils'

export function ProfilesSlide({
  data,
  agent,
  compareAgent,
  profileComparison,
  topRoutes,
  compareTopRoutes,
  onOpenModal,
}: {
  data: Payload
  agent: AgentProfile
  compareAgent: AgentProfile
  profileComparison: ProfileComparison
  topRoutes: ScenarioSummary['top_routes']
  compareTopRoutes: ScenarioSummary['top_routes']
  onOpenModal: (kind: ModalKind) => void
}) {
  return (
    <SlideShell id="perfiles" className="profile-slide">
      <SlideHeader
        eyebrow="Slide 04 · cuerpos situados"
        title="El mismo centro no aparece igual para todos"
        text="Cambiar el perfil cambia costo, tiempo, ruta, sensibilidad al obstáculo y forma de habitar el corredor. La diferencia fenomenológica ya puede leerse como firma vectorial."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Ver pesos</button>}
      />

      <div className="profile-stage-grid">
        <article className="deck-panel radar-panel">
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
          <RouteDuel
            data={data}
            primaryTitle={agent.label}
            secondaryTitle={compareAgent.label}
            primaryRoutes={topRoutes}
            secondaryRoutes={compareTopRoutes}
          />
        </article>
      </div>
    </SlideShell>
  )
}
