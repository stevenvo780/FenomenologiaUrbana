import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { KpiPill, MetricLine, PanelFrame, SlideHeader, SlideShell } from '../components/ui'

export function EnvironmentSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const report = data.advanced_reports?.hpc_environmental
  const pm25 = data.fields_manifest?.pm25
  const noise = data.fields_manifest?.noise

  return (
    <SlideShell id="ambiente" className="environment-slide">
      <SlideHeader
        eyebrow="Capítulo 11 · M1 · campos estigmérgicos"
        title="El aire también decide la ruta"
        text="Señales estigmérgicas negativas: el campo ambiental organiza la experiencia antes de que el sujeto elija."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('evidence')}>Cruzar con evidencia</button>}
      />

      <div className="environment-raster-grid">
        <article className="deck-panel environment-raster-panel">
          <div className="status-strip">
            <KpiPill label="Malla" value={report?.resolution?.split(' ')[0] ?? '4096×4096'} status="documented" />
            <KpiPill label="Estación PM2.5" value={data.empirical.environmental_context.air.pm25.nearest_station?.short_name ?? 's/d'} status="documented" />
          </div>
          <p className="environment-poetic">
            Antes de la decisión hay un campo: aire que pesa, ruido que ocupa. La ruta libre se inclina hacia donde el cuerpo respira.
          </p>
          <div className="environment-field-split">
            {pm25 ? (
              <figure className="environment-field-figure">
                <FieldRaster
                  src={pm25.src}
                  alt="Campo PM2.5 4K"
                  colormap={pm25.cmap}
                  legend={{ min: pm25.min, max: pm25.max, unit: pm25.units }}
                  motionMode="breathing"
                />
                <figcaption>
                  <strong>PM2.5 — material particulado</strong>
                  <span>Manchas oscuras = aire denso. Las rutas peatonales se desvían hacia las zonas claras.</span>
                </figcaption>
              </figure>
            ) : null}
            {noise ? (
              <figure className="environment-field-figure">
                <FieldRaster
                  src={noise.src}
                  alt="Campo de ruido 4K"
                  colormap={noise.cmap}
                  legend={{ min: noise.min, max: noise.max, unit: noise.units }}
                  motionMode="breathing"
                />
                <figcaption>
                  <strong>Ruido — presión acústica</strong>
                  <span>Los focos brillantes saturan la audición; el cuerpo busca corredores de baja intensidad.</span>
                </figcaption>
              </figure>
            ) : null}
          </div>
        </article>

        <PanelFrame eyebrow="Lectura derecha" title="Estadísticas del campo" tone="teal" className="environment-side-panel">
          <div className="environment-stat-row">
            <MetricLine label="PM2.5 pico" value={`${(report?.pm25.peak ?? 0).toFixed(2)} µg/m³`} />
            <span className="environment-stat-hint" title="Concentración máxima alcanzada en cualquier celda durante la jornada">i</span>
          </div>
          <div className="environment-stat-row">
            <MetricLine label="PM2.5 medio" value={`${(report?.pm25.ambient_avg ?? 0).toFixed(2)} µg/m³`} />
            <span className="environment-stat-hint" title="Promedio espacial sobre la malla 4096×4096">i</span>
          </div>
          <div className="environment-stat-row">
            <MetricLine label="Ruido pico" value={`${(report?.noise.peak_db ?? 0).toFixed(1)} dB`} />
            <span className="environment-stat-hint" title="Decibeles máximos. Por encima de 70 dB inicia disconfort sostenido">i</span>
          </div>
          <div className="environment-stat-row">
            <MetricLine label="Ruido varianza espacial" value={(report?.noise.spatial_variance ?? 0).toFixed(2)} />
            <span className="environment-stat-hint" title="Mide qué tan heterogénea es la presión acústica entre nodos">i</span>
          </div>

          <div className="environment-flow-card">
            <p className="environment-flow-eyebrow">Flujo estigmérgico</p>
            <svg viewBox="0 0 280 120" className="environment-flow-svg" aria-hidden="true">
              <defs>
                <linearGradient id="envFlowGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#1f7f79" />
                  <stop offset="100%" stopColor="#e07a46" />
                </linearGradient>
              </defs>
              <path d="M10 60 Q70 20 140 60 T270 60" fill="none" stroke="url(#envFlowGrad)" strokeWidth={1.5} strokeOpacity={0.45} />
              <circle r={5} fill="#f4c87a">
                <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path="M10 60 Q70 20 140 60 T270 60" />
              </circle>
              <circle r={4} fill="#1f7f79" opacity={0.85}>
                <animateMotion dur="7s" begin="1s" repeatCount="indefinite" rotate="auto" path="M10 60 Q70 20 140 60 T270 60" />
              </circle>
              <circle r={3} fill="#e07a46" opacity={0.8}>
                <animateMotion dur="5s" begin="2s" repeatCount="indefinite" rotate="auto" path="M10 60 Q70 20 140 60 T270 60" />
              </circle>
            </svg>
            <p className="environment-flow-caption">El cuerpo no decide en abstracto: lee el aire. Las partículas y los decibeles actúan como señales que repelen rutas.</p>
          </div>
        </PanelFrame>
      </div>

      <p className="slide-citation">Johnson, 2001 · Aguilar, 2014</p>
    </SlideShell>
  )
}
