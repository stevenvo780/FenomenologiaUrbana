import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { KpiPill, MetricLine, PanelFrame, SlideHeader, SlideShell, TexBlock } from '../components/ui'

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
          <TexBlock tex={'\\frac{\\partial u}{\\partial t}=D\\nabla^2u-\\kappa u+S(x,t)'} />
          <div className="environment-field-split">
            {pm25 ? (
              <FieldRaster
                src={pm25.src}
                alt="Campo PM2.5 4K"
                colormap={pm25.cmap}
                legend={{ min: pm25.min, max: pm25.max, unit: pm25.units }}
                motionMode="breathing"
              />
            ) : null}
            {noise ? (
              <FieldRaster
                src={noise.src}
                alt="Campo de ruido 4K"
                colormap={noise.cmap}
                legend={{ min: noise.min, max: noise.max, unit: noise.units }}
                motionMode="breathing"
              />
            ) : null}
          </div>
        </article>

        <PanelFrame eyebrow="Lectura derecha" title="Estadísticas del campo" tone="teal" className="environment-side-panel">
          <MetricLine label="PM2.5 peak" value={(report?.pm25.peak ?? 0).toFixed(2)} />
          <MetricLine label="PM2.5 ambient_avg" value={(report?.pm25.ambient_avg ?? 0).toFixed(2)} />
          <MetricLine label="noise peak_db" value={(report?.noise.peak_db ?? 0).toFixed(2)} />
          <MetricLine label="noise spatial_variance" value={(report?.noise.spatial_variance ?? 0).toFixed(2)} />
          <p className="analysis-note-copy">
            La atmósfera urbana no acompaña el recorrido: lo filtra. Ruido y material particulado son condiciones de aparición.
          </p>
        </PanelFrame>
      </div>

      <p className="slide-citation">Johnson, 2001 · Aguilar, 2014</p>
    </SlideShell>
  )
}
