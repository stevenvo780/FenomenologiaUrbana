import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import type { Payload, ScenarioSummary } from '../../types'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { MetricLine, SlideHeader, SlideShell } from '../components/ui'

const ACCENT = '#00f2ff'

export function InequalitySlide({
  data,
  scenario,
  onScenarioChange,
}: {
  data: Payload
  scenario: ScenarioSummary
  onScenarioChange: (value: string) => void
}) {
  const inequality = data.advanced_reports?.urban_inequality?.scenarios ?? []
  const active = inequality.find((entry) => entry.scenario_id === scenario.id) ?? inequality[0]
  const advancedStats = scenario.advanced_stats ?? []
  
  const entropyData = advancedStats.map((entry) => ({
    label: entry.label.split(' ')[0],
    entropy: Number(entry.path_entropy.toFixed(3)),
    diversity: Number(entry.diversity_index.toFixed(3)),
  }))

  return (
    <SlideShell id="desigualdad">
      <SlideHeader
        eyebrow="Auditoría 07 · Desigualdad Fenomenológica"
        title="Inequidad Radical de la Libertad de Ruta"
        text="El supercómputo revela un 'Apartheid Espacial Técnico': mientras el turista goza de libertad de deriva, el vendedor ambulante opera en un régimen de restricción absoluta."
      />

      <div className="slide-content">
        <div className="data-grid">
          <div className="data-card" style={{ gridColumn: 'span 2' }}>
            <h3>Análisis de Entropía por Perfil de Agente (M-MASS)</h3>
            <div style={{ height: '300px', marginTop: '1rem' }}>
              <MeasuredChart minHeight={300}>
                {({ width, height }) => (
                  <BarChart width={width} height={height} data={entropyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#141417', border: '1px solid var(--accent)', fontSize: '10px' }}
                      cursor={{ fill: 'rgba(0,242,255,0.05)' }}
                    />
                    <Bar dataKey="entropy" fill={ACCENT} radius={[2, 2, 0, 0]} />
                  </BarChart>
                )}
              </MeasuredChart>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="data-card">
              <h3>Estatus del Escenario</h3>
              <div style={{ marginBottom: '1rem' }}>
                <select 
                  value={scenario.id} 
                  onChange={(e) => onScenarioChange(e.target.value)}
                  style={{ background: '#000', color: '#fff', border: '1px solid var(--accent)', padding: '5px', width: '100%', fontSize: '0.8rem' }}
                >
                  {data.scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <MetricLine label="Gini de Entropía" value={active?.entropy_gini.toFixed(4) ?? '0.0000'} />
              <MetricLine label="Ratio de Inequidad" value={`${active?.inequity_ratio.toFixed(2) ?? '1.00'}x`} />
            </div>

            <div className="data-card" style={{ border: '1px solid var(--danger)', background: 'rgba(255,45,85,0.05)' }}>
              <h3>Perfil Crítico</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--danger)', margin: '0.5rem 0' }}>
                {active?.most_restricted_profile ?? 'Calculando...'}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Presenta el menor horizonte de posibilidades en este escenario.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-bar">
        <div className="metric-item">Engine: <b>M-MASS x100k</b></div>
        <div className="metric-item">Metric: <b>Path Entropy (Shannon)</b></div>
        <div className="metric-item">Status: <b>HPC Calibrated</b></div>
      </div>
    </SlideShell>
  )
}
