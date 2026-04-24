import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'

export function EnvironmentSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const pde = data.advanced_models?.environmental_pde?.fields
  const report = data.advanced_reports?.hpc_environmental
  const metrics = [
    {
      label: 'PM2.5 pico',
      value: report?.pm25.peak ?? pde?.pm25.max_concentration ?? 0,
      unit: 'µg/m³ proxy',
      tone: 'amber',
      helper: 'Máximo del campo de difusión-reacción.',
    },
    {
      label: 'PM2.5 promedio',
      value: report?.pm25.ambient_avg ?? pde?.pm25.mean_concentration ?? 0,
      unit: 'µg/m³ proxy',
      tone: 'teal',
      helper: 'Promedio ambiental base del corredor.',
    },
    {
      label: 'Ruido pico',
      value: report?.noise.peak_db ?? pde?.noise.max_intensity ?? 0,
      unit: 'dB proxy',
      tone: 'ember',
      helper: 'Pico máximo en el campo acústico.',
    },
    {
      label: 'Varianza espacial',
      value: report?.noise.spatial_variance ?? pde?.noise.mean_intensity ?? 0,
      unit: 'σ²',
      tone: 'sand',
      helper: 'Heterogeneidad del campo de ruido.',
    },
  ]
  const maxValue = Math.max(...metrics.map((entry) => entry.value), 1)

  return (
    <SlideShell id="ambiente" className="environment-slide">
      <SlideHeader
        eyebrow="Slide 11 · PDE ambiental"
        title="El ambiente deja de ser fondo: se modela como campo continuo"
        text="Ruido y material particulado ya no aparecen como anotaciones sueltas; ahora se resuelven sobre una malla 4K para mostrar gradientes, picos y heterogeneidad espacial."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('evidence')}>Cruzar con evidencia</button>}
      />

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel field-panel">
          <div className="status-strip">
            <KpiPill label="Malla" value={report?.resolution?.split(' ')[0] ?? '4096×4096'} status="documented" />
            <KpiPill label="Estación PM2.5" value={data.empirical.environmental_context.air.pm25.nearest_station?.short_name ?? 's/d'} status="documented" />
            <KpiPill label="Muestras ruido" value={`${data.empirical.environmental_context.noise.valid_samples ?? 0}`} status="proxy" />
          </div>

          <div className="field-grid">
            {metrics.map((entry) => (
              <article key={entry.label} className={`field-card tone-${entry.tone}`}>
                <div className="field-meter">
                  <i style={{ height: `${Math.max(10, (entry.value / maxValue) * 100)}%` }} />
                </div>
                <div>
                  <span>{entry.label}</span>
                  <strong>{entry.value.toFixed(2)}</strong>
                  <p>{entry.unit}</p>
                </div>
                <small>{entry.helper}</small>
              </article>
            ))}
          </div>
        </article>

        <aside className="deck-panel environment-side-panel">
          <div className="spotlight-card highlight full-height">
            <span>Lectura interpretativa</span>
            <strong>La atmósfera urbana también organiza la experiencia</strong>
            <p>
              La malla ambiental muestra que la fenomenología del recorrido está atravesada por acumulaciones locales de ruido
              y contaminación: no es solo por dónde se puede pasar, sino bajo qué condiciones sensibles se atraviesa el centro.
            </p>
            <em>Campo continuo · 16.7 millones de celdas</em>
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
