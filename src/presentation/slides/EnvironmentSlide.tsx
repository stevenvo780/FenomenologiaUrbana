import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { EnvironmentMeter } from '../components/visuals/EnvironmentMeter'
import { KpiPill, MetricLine, PanelFrame, SlideHeader, SlideShell } from '../components/ui'

export function EnvironmentSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const report = data.advanced_reports?.hpc_environmental
  const pm25Peak = report?.pm25.peak ?? 0
  const pm25Avg = report?.pm25.ambient_avg ?? 0
  const noisePeak = report?.noise.peak_db ?? 0
  const noiseAvg = Math.max(0, noisePeak - (report?.noise.spatial_variance ?? 0) * 1.5)
  // Cap PM2.5 scale to a meaningful upper band (peak can be an extreme outlier)
  const pm25Scale = Math.max(50, Math.min(pm25Peak * 1.05, 600))
  const noiseScale = Math.max(100, noisePeak * 1.05)

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
            <KpiPill label="Malla" value={report?.resolution?.split(' ')[0] ?? '4096×4096'} status="documented" tooltip="Resolución de la malla de simulación: cuántas celdas se calculan para reproducir ruido y contaminación. Más celdas = más detalle espacial." />
            <KpiPill label="Estación PM2.5" value={data.empirical.environmental_context.air.pm25.nearest_station?.short_name ?? 's/d'} status="documented" tooltip="Estación oficial más cercana que mide PM2.5: partículas finas en el aire (humo, polvo) que afectan la salud respiratoria." />
          </div>
          <p className="environment-poetic">
            Antes de la decisión hay un campo: aire que pesa, ruido que ocupa. La ruta libre se inclina hacia donde el cuerpo respira.
          </p>
          <div className="environment-field-split">
            <EnvironmentMeter
              kind="pm25"
              title="PM2.5 — material particulado"
              unit="µg/m³"
              peak={pm25Peak}
              average={pm25Avg}
              scaleMax={pm25Scale}
              seed={11}
              thresholds={[
                { value: 15, label: 'OMS · seguro', tone: 'safe' },
                { value: 35, label: 'Riesgo', tone: 'warn' },
                { value: 75, label: 'Crítico', tone: 'danger' },
              ]}
            />
            <EnvironmentMeter
              kind="noise"
              title="Ruido — presión acústica"
              unit="dB"
              peak={noisePeak}
              average={noiseAvg}
              scaleMax={noiseScale}
              seed={29}
              contrast={1.6}
              fillStrip
              thresholds={[
                { value: 50, label: 'Calma', tone: 'safe' },
                { value: 70, label: 'Estrés', tone: 'warn' },
                { value: 85, label: 'Daño', tone: 'danger' },
              ]}
            />
          </div>
        </article>

        <PanelFrame eyebrow="Lectura derecha" title="Estadísticas del campo" tone="teal" className="environment-side-panel">
          <div className="environment-stat-row">
            <MetricLine label="PM2.5 pico" value={`${(report?.pm25.peak ?? 0).toFixed(2)} µg/m³`} tooltip="Concentración máxima de partículas finas (PM2.5) en el corredor. La OMS recomienda no superar 15 µg/m³ en promedio diario." />
            <span className="environment-stat-hint" title="Concentración máxima alcanzada en cualquier celda durante la jornada">i</span>
          </div>
          <div className="environment-stat-row">
            <MetricLine label="PM2.5 medio" value={`${(report?.pm25.ambient_avg ?? 0).toFixed(2)} µg/m³`} tooltip="Promedio de PM2.5 en todo el corredor: lo que respira un peatón típico durante el día." />
            <span className="environment-stat-hint" title="Promedio espacial sobre la malla 4096×4096">i</span>
          </div>
          <div className="environment-stat-row">
            <MetricLine label="Ruido pico" value={`${(report?.noise.peak_db ?? 0).toFixed(1)} dB`} tooltip="Nivel sonoro máximo en decibelios. Por encima de 70 dB el ruído causa estrés; sobre 85 dB sostenido daña la audición." />
            <span className="environment-stat-hint" title="Decibeles máximos. Por encima de 70 dB inicia disconfort sostenido">i</span>
          </div>
          <div className="environment-stat-row">
            <MetricLine label="Ruido varianza espacial" value={(report?.noise.spatial_variance ?? 0).toFixed(2)} tooltip="Qué tanto cambia el ruido entre un punto y otro del corredor. Alto = paisaje sonoro contrastado (zonas calmas y muy ruidosas alternan)." />
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
