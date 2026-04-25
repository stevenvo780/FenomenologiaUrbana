import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { Heatline24h } from '../components/visuals/Heatline24h'
import { PanelFrame, SlideGrid, SlideHeader, SlideShell, StatTile } from '../components/ui'
import { compactNumber } from '../utils'

export function CrowdDynamicsSlide({
  data,
  paused,
  onTogglePaused,
  onOpenModal,
}: {
  data: Payload
  paused: boolean
  onTogglePaused: () => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const report = data.advanced_reports?.hpc_24h
  const hourly = report?.hourly_metrics ?? []
  const micro = data.advanced_models?.micro_simulation?.results ?? []
  const peakHour = hourly.reduce(
    (peak, current) => (current.max_load > peak.max_load ? current : peak),
    hourly[0] ?? { hour: 0, agents: 0, max_load: 0, mean_energy: 0 },
  )
  const valley = hourly.reduce(
    (low, current) => (current.agents < low.agents ? current : low),
    hourly[0] ?? { hour: 0, agents: 0, max_load: 0, mean_energy: 0 },
  )

  return (
    <SlideShell id="multitudes" className="crowd-slide">
      <SlideHeader
        eyebrow="Capítulo 8 · el pulso de la ciudad"
        title="24 horas son un latido, no una serie de barras"
        text="El pulso diario evidencia la modulación biopolítica: demanda, intensidad ambiental y densidad acumulada se sincronizan."
        action={(
          <div className="slide-action-pair">
            <button type="button" className="ghost-action" onClick={onTogglePaused}>{paused ? 'Reanudar 24h' : 'Pausar 24h'}</button>
            <button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Resumen HPC</button>
          </div>
        )}
      />

      <div className="slide-content">
        <SlideGrid className="slide-grid-analysis crowd-layout">
          <PanelFrame eyebrow="Loop horario sincronizado" title="Reloj · heatmap · curva" className="crowd-chart-panel">
            <Heatline24h
              hourly={hourly}
              temporal={data.temporal_24h}
              paused={paused}
            />
          </PanelFrame>

          <PanelFrame
            eyebrow="Lecturas HPC"
            title={`${compactNumber(report?.total_simulated_agents_day ?? 0)} agentes / día`}
            className="crowd-side-panel"
            bodyClassName="stat-tile-grid crowd-side-grid"
          >
            <StatTile
              label="Valle"
              value={`${valley.hour}:00`}
              note={`${compactNumber(valley.agents)} agentes · carga ${valley.max_load.toFixed(1)}`}
              tone="teal"
            />
            <StatTile
              label="Pico PM"
              value={`${peakHour.hour}:00`}
              note={`${compactNumber(peakHour.agents)} agentes · carga ${peakHour.max_load.toFixed(1)}`}
              tone="amber"
            />
            {micro.slice(0, 2).map((entry) => (
              <StatTile
                key={entry.scenario_id}
                label={entry.scenario_id}
                value={entry.max_density.toFixed(2)}
                note={`${compactNumber(entry.agents_simulated)} agentes · turbulencia ${entry.turbulence_index.toFixed(3)}`}
              />
            ))}
          </PanelFrame>
        </SlideGrid>

        <PanelFrame
          eyebrow="Lectura biopolítica"
          title="El día no respira igual en cada hora"
          className="crowd-bottom-panel"
          bodyClassName="crowd-bottom-body"
        >
          <p className="crowd-bottom-copy">
            Entre las {valley.hour}:00 y las {peakHour.hour}:00 la calle multiplica por
            <strong> {peakHour.agents > 0 ? Math.max(1, Math.round(peakHour.agents / Math.max(valley.agents, 1))) : 1}×</strong>
            su demanda peatonal. La modulación no es un detalle logístico: es la forma en que el corredor disciplina cuerpos.
          </p>
          <div className="crowd-bottom-strip" aria-hidden="true">
            {hourly.map((h) => {
              const intensity = peakHour.max_load ? h.max_load / peakHour.max_load : 0
              return (
                <span
                  key={h.hour}
                  className="crowd-bottom-tick"
                  style={{
                    height: `${10 + intensity * 36}px`,
                    background: `hsl(${60 - intensity * 50} ${70 + intensity * 20}% ${50 + intensity * 8}%)`,
                  }}
                  title={`${h.hour}:00 · ${compactNumber(h.agents)} agentes`}
                />
              )
            })}
          </div>
          <div className="crowd-bottom-axis">
            <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>24h</span>
          </div>
        </PanelFrame>
      </div>
      <p className="slide-citation">Simmel, 1903/1986</p>
    </SlideShell>
  )
}
