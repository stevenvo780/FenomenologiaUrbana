import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from 'recharts'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber, formatRatio } from '../utils'

export function StressSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const stress = data.advanced_reports?.hpc_stress
  const chaos = data.advanced_reports?.hpc_chaos
  const tipping = stress?.tipping_point_detected

  return (
    <SlideShell id="estres" className="stress-slide">
      <SlideHeader
        eyebrow="Slide 10 · estrés y caos"
        title="El corredor tiene un punto de quiebre y un caos cotidiano medible"
        text="La simulación de estrés no solo dibuja una curva: detecta el momento de colapso sistémico y lo pone en relación con la informalidad y la deriva peatonal."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Abrir reporte de estrés</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel chart-panel">
          <div className="status-strip">
            <KpiPill label="Tipping point" value={compactNumber(tipping?.agents ?? 0)} status="documented" />
            <KpiPill label="Presión crítica" value={tipping?.pressure_index.toFixed(2) ?? 's/d'} status="proxy" />
            <KpiPill label="Entropía crítica" value={tipping?.system_entropy.toFixed(2) ?? 's/d'} status="proxy" />
          </div>
          <div className="chart-shell chart-shell-tall">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <ComposedChart data={stress?.full_curve ?? []} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="agents" tickFormatter={(value) => compactNumber(Number(value))} tick={{ fill: 'rgba(255,248,236,0.65)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,248,236,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                <Bar yAxisId="left" dataKey="pressure_index" fill="#e07a46" radius={[10, 10, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="system_entropy" stroke="#f4c87a" strokeWidth={2.4} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="deck-panel stress-side-panel">
          <div className="spotlight-grid spotlight-grid-compact">
            <article className="spotlight-card highlight">
              <span>Velocidad crítica</span>
              <strong>{tipping?.mean_velocity.toFixed(3) ?? 's/d'}</strong>
              <p>El colapso sistémico emerge con {compactNumber(tipping?.agents ?? 0)} agentes simultáneos.</p>
            </article>
            <article className="spotlight-card">
              <span>Obstrucción informal</span>
              <strong>{formatRatio(chaos?.informality_obstruction_ratio ?? 0)}</strong>
              <p>Proporción de informalidad incorporada al caos cotidiano.</p>
            </article>
            <article className="spotlight-card">
              <span>Ratio flâneur</span>
              <strong>{formatRatio(chaos?.flaneur_ratio ?? 0)}</strong>
              <p>Deriva peatonal como estrategia emergente del sistema.</p>
            </article>
          </div>

          <div className="stress-callout">
            <p className="deck-eyebrow">Conclusión sintética</p>
            <h3>{chaos?.engine ?? stress?.engine}</h3>
            <p>{chaos?.conclusion ?? stress?.conclusion}</p>
            <em>Turbulencia media {chaos?.mean_turbulence_index.toFixed(4) ?? 's/d'}</em>
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
