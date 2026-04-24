import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber } from '../utils'

export function HistorySlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const history = data.advanced_models?.historical_evolution?.evolution ?? []

  return (
    <SlideShell id="historia" className="history-slide">
      <SlideHeader
        eyebrow="Slide 14 · evolución 2012–2024"
        title="La fenomenología del centro también tiene historia computable"
        text="La comparación longitudinal muestra que densidad, criminalidad, turbulencia y entropía espacial no permanecen estables: el corredor muta en el tiempo."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Abrir serie longitudinal</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel chart-panel">
          <div className="status-strip">
            <KpiPill label="Años" value={`${history.length}`} status="documented" />
            <KpiPill label="Motor" value={data.advanced_models?.historical_evolution?.engine?.split(' ').slice(0, 2).join(' ') ?? 'HPC'} status="proxy" />
          </div>
          <div className="chart-shell chart-shell-tall">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <ComposedChart data={history} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" tick={{ fill: 'rgba(255,248,236,0.68)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,248,236,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                <Bar yAxisId="left" dataKey="empirical_data.casos_crimen" fill="#e07a46" radius={[12, 12, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="entropy_spatial" stroke="#f4c87a" strokeWidth={2.4} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="turbulence" stroke="#1f7f79" strokeWidth={2.2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="deck-panel history-side-panel">
          <div className="year-card-stack">
            {history.map((entry) => (
              <article key={entry.year} className="year-card">
                <span>{entry.year}</span>
                <strong>{compactNumber(entry.agents_simulated)} agentes</strong>
                <p>Crimen {compactNumber(entry.empirical_data.casos_crimen)} · densidad máx. {entry.max_density.toFixed(2)}</p>
                <em>Entropía {entry.entropy_spatial.toFixed(2)} · turbulencia {entry.turbulence.toFixed(2)}</em>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
