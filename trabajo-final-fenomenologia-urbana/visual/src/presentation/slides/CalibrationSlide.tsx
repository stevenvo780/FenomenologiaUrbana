import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber, formatRatio } from '../utils'

const colors = ['#f4c87a', '#e07a46', '#1f7f79']

export function CalibrationSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const calibration = data.calibration
  const multi = data.advanced_reports?.hpc_multipoint_calibration
  const uncertainty = data.advanced_reports?.hpc_uncertainty
  const weights = multi
    ? [
        { label: 'Tiempo', value: Number(multi.optimized_parameters.time_weight.toFixed(2)) },
        { label: 'Riesgo', value: Number(multi.optimized_parameters.risk_weight.toFixed(2)) },
        { label: 'Visibilidad', value: Number(multi.optimized_parameters.visibility_comfort_weight.toFixed(2)) },
      ]
    : []
  const confidenceCards = Object.entries(uncertainty?.results ?? {}).map(([key, value]) => ({
    key,
    hour: key.replace('hour_', ''),
    ...value,
  }))

  return (
    <SlideShell id="calibracion" className="calibration-slide">
      <SlideHeader
        eyebrow="Slide 08 · calibración y blindaje"
        title="La simulación ya viene calibrada, validada y con incertidumbre explícita"
        text="La defensa doctoral no depende de frases grandilocuentes: muestra pesos ajustados, precisión espacial casi unitaria e intervalos de confianza Monte Carlo."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Validación completa</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel calibration-main-panel">
          <div className="spotlight-grid spotlight-grid-compact">
            <article className="spotlight-card highlight">
              <span>Accuracy espacial</span>
              <strong>{multi?.spatial_accuracy_score.toFixed(6) ?? 's/d'}</strong>
              <p>Multi-point RMSE minimization sobre nodos de validación reales.</p>
            </article>
            <article className="spotlight-card">
              <span>Error residual</span>
              <strong>{multi ? multi.residual_error.toExponential(2) : 's/d'}</strong>
              <p>Residual extremadamente bajo para el ajuste multicriterio.</p>
            </article>
            <article className="spotlight-card">
              <span>Ground truth</span>
              <strong>{compactNumber(calibration?.ground_truth_target ?? 0)}</strong>
              <p>Objetivo empírico de validación contra alto flujo operacional.</p>
            </article>
          </div>

          <div className="chart-shell chart-shell-mid">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={210}>
              <BarChart data={weights} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,248,236,0.68)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,248,236,0.55)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(20,16,15,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                <Bar dataKey="value" radius={[12, 12, 6, 6]}>
                  {weights.map((entry, index) => (
                    <Cell key={entry.label} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="validation-node-grid">
            {Object.entries(multi?.validation_nodes ?? {}).map(([node, value]) => (
              <div key={node} className="validation-chip">
                <span>{node.replaceAll('_', ' ')}</span>
                <strong>{compactNumber(value)}</strong>
              </div>
            ))}
          </div>
        </article>

        <aside className="deck-panel uncertainty-panel">
          <p className="deck-eyebrow">Monte Carlo · 95% CI</p>
          <div className="status-strip">
            <KpiPill label="Iteraciones" value={`${uncertainty?.iterations_per_sample ?? 0}`} status="documented" />
            <KpiPill label="Rango medio" value={confidenceCards[0]?.mean_velocity.toFixed(3) ?? 's/d'} status="proxy" />
            <KpiPill label="Status" value={calibration?.status ?? 's/d'} status="documented" />
          </div>
          <div className="confidence-grid">
            {confidenceCards.map((entry) => (
              <article key={entry.key} className="confidence-card">
                <span>Hora {entry.hour}</span>
                <strong>{entry.mean_velocity.toFixed(4)}</strong>
                <p>
                  IC95 {entry.confidence_interval_95[0].toFixed(4)} → {entry.confidence_interval_95[1].toFixed(4)}
                </p>
                <em>Incertidumbre relativa {formatRatio(entry.relative_uncertainty)}</em>
              </article>
            ))}
          </div>
          <p className="modal-note">{uncertainty?.note}</p>
        </aside>
      </div>
    </SlideShell>
  )
}
