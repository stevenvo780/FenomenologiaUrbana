import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts'

import type { Payload, ScenarioSummary } from '../../types'
import type { ModalKind } from '../deckTypes'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'

const palette = ['#f4c87a', '#e07a46', '#1f7f79', '#b79862']

export function InequalitySlide({
  data,
  scenario,
  onScenarioChange,
  onOpenModal,
}: {
  data: Payload
  scenario: ScenarioSummary
  onScenarioChange: (value: string) => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const inequality = data.advanced_reports?.urban_inequality?.scenarios ?? []
  const active = inequality.find((entry) => entry.scenario_id === scenario.id) ?? inequality[0]
  const advancedStats = scenario.advanced_stats ?? []
  const entropyBars = advancedStats.map((entry) => ({
    label: entry.label.replace(' cultural', ''),
    entropy: Number(entry.path_entropy.toFixed(2)),
    diversity: Number(entry.diversity_index.toFixed(2)),
  }))

  return (
    <SlideShell id="desigualdad" className="inequality-slide">
      <SlideHeader
        eyebrow="Slide 07 · desigualdad fenomenológica"
        title="La libertad de ruta también se distribuye de forma desigual"
        text="El M-MASS avanzado ya no solo mide presión: también muestra quién puede desviarse, quién queda más encerrado y cuánto se abre o se cierra el corredor según el cuerpo que lo atraviesa."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Abrir métricas M-MASS</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel chart-panel">
          <div className="panel-topline">
            <p className="deck-eyebrow">Gini de entropía por escenario</p>
            <div className="chip-cloud">
              {data.scenarios.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={entry.id === scenario.id ? 'deck-chip active' : 'deck-chip'}
                  onClick={() => onScenarioChange(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-shell chart-shell-tall">
            <MeasuredChart minHeight={220}>
              {({ width, height }) => (
                <BarChart width={width} height={height} data={inequality} margin={{ top: 10, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,248,236,0.7)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 'dataMax + 0.005']} />
                  <Tooltip
                    cursor={{ fill: 'rgba(244,200,122,0.08)' }}
                    contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }}
                    formatter={(value) => [Number(value ?? 0).toFixed(4), 'entropy_gini']}
                  />
                  <Bar dataKey="entropy_gini" radius={[14, 14, 6, 6]}>
                    {inequality.map((entry, index) => (
                      <Cell key={entry.scenario_id} fill={palette[index % palette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </MeasuredChart>
          </div>
        </article>

        <aside className="deck-panel spotlight-panel">
          <div className="spotlight-grid">
            <article className="spotlight-card highlight">
              <span>Escenario activo</span>
              <strong>{active?.label ?? scenario.label}</strong>
              <p>{active ? `Gini ${active.entropy_gini.toFixed(4)} · ratio ${active.inequity_ratio.toFixed(2)}×` : 'Sin reporte agregado.'}</p>
            </article>
            <article className="spotlight-card">
              <span>Perfil más restringido</span>
              <strong>{active?.most_restricted_profile ?? 's/d'}</strong>
              <p>Es el cuerpo con menor libertad de deriva en el corredor.</p>
            </article>
            <article className="spotlight-card">
              <span>Perfil más libre</span>
              <strong>{active?.most_free_profile ?? 's/d'}</strong>
              <p>Se beneficia de mayor diversidad de trayectorias disponibles.</p>
            </article>
          </div>

          <div className="chart-shell chart-shell-mid">
            <MeasuredChart minHeight={190}>
              {({ width, height }) => (
                <BarChart width={width} height={height} data={entropyBars} layout="vertical" margin={{ top: 8, right: 10, left: 8, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="label" type="category" tick={{ fill: 'rgba(255,248,236,0.72)', fontSize: 11 }} axisLine={false} tickLine={false} width={92} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }}
                  />
                  <Bar dataKey="entropy" fill="#f4c87a" radius={[0, 10, 10, 0]} />
                  <Bar dataKey="diversity" fill="#1f7f79" radius={[0, 10, 10, 0]} />
                </BarChart>
              )}
            </MeasuredChart>
          </div>

          <div className="status-strip">
            <KpiPill label="Escalas analizadas" value={`${advancedStats.length}`} status="documented" />
            <KpiPill label="Ratio desigualdad" value={active ? `${active.inequity_ratio.toFixed(2)}×` : 's/d'} status="proxy" />
            <KpiPill label="Entropy gini" value={active ? active.entropy_gini.toFixed(4) : 's/d'} status="proxy" />
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
