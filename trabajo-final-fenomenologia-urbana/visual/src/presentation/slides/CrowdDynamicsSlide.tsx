import { Area, AreaChart, CartesianGrid, Line, Tooltip, XAxis, YAxis } from 'recharts'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber } from '../utils'

export function CrowdDynamicsSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const report = data.advanced_reports?.hpc_24h
  const micro = data.advanced_models?.micro_simulation?.results ?? []
  const hourly = report?.hourly_metrics ?? []
  const peakHour = hourly.reduce((peak, current) => (current.max_load > peak.max_load ? current : peak), hourly[0] ?? { hour: 0, agents: 0, max_load: 0, mean_energy: 0 })

  return (
    <SlideShell id="multitudes" className="crowd-slide">
      <SlideHeader
        eyebrow="Slide 09 · multitudes 24h"
        title="La micro-simulación convierte el día entero en una curva viva"
        text="Ya no miramos solo cuatro franjas discretas: el corredor se ensaya a lo largo de 24 horas, con 640 mil agentes simulados y densidades que mutan hora a hora."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Abrir resumen HPC</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel chart-panel">
          <div className="panel-topline">
            <p className="deck-eyebrow">Carga horaria del corredor</p>
            <div className="status-strip">
              <KpiPill label="Agentes / día" value={compactNumber(report?.total_simulated_agents_day ?? 0)} status="documented" />
              <KpiPill label="Hora crítica" value={`${peakHour.hour}:00`} status="proxy" />
            </div>
          </div>
          <div className="chart-shell chart-shell-tall">
            <MeasuredChart minHeight={240}>
              {({ width, height }) => (
                <AreaChart width={width} height={height} data={hourly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="agentsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f4c87a" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#f4c87a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} tick={{ fill: 'rgba(255,248,236,0.68)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,248,236,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                  <Area yAxisId="left" type="monotone" dataKey="agents" stroke="#f4c87a" fill="url(#agentsFill)" strokeWidth={2.4} />
                  <Line yAxisId="right" type="monotone" dataKey="max_load" stroke="#1f7f79" strokeWidth={2.2} dot={false} />
                </AreaChart>
              )}
            </MeasuredChart>
          </div>
        </article>

        <aside className="deck-panel micro-panel">
          <div className="spotlight-grid spotlight-grid-compact">
            <article className="spotlight-card highlight">
              <span>Pico de carga</span>
              <strong>{peakHour.max_load.toFixed(1)}</strong>
              <p>{compactNumber(peakHour.agents)} agentes simulados a las {peakHour.hour}:00.</p>
            </article>
            <article className="spotlight-card">
              <span>Energía media</span>
              <strong>{peakHour.mean_energy.toFixed(3)}</strong>
              <p>Estabilidad cinética de la simulación durante la hora crítica.</p>
            </article>
          </div>
          <div className="micro-result-grid">
            {micro.map((entry) => (
              <article key={entry.scenario_id} className="micro-result-card">
                <span>{entry.scenario_id}</span>
                <strong>{entry.max_density.toFixed(2)}</strong>
                <p>{compactNumber(entry.agents_simulated)} agentes · turbulencia {entry.turbulence_index.toFixed(3)}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
