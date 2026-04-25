import { Eye, Radar } from 'lucide-react'
import type { CSSProperties } from 'react'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber, formatRatio } from '../utils'

export function VisibilitySlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const visibility = data.advanced_models?.perceptual_visibility
  const opennessPct = Math.min(100, (visibility?.mean_openness ?? 0) * 100)

  return (
    <SlideShell id="visibilidad" className="visibility-slide">
      <SlideHeader
        eyebrow="Slide 12 · panóptico urbano"
        title="La ciudad también se reparte como visibilidad y exposición"
        text="Con miles de puntos de observación y millones de rayos trazados, el corredor puede leerse como un régimen panóptico: zonas abiertas, zonas expuestas y zonas menos legibles."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('model')}>Modelo perceptual</button>}
      />

      <div className="slide-content">
        <SlideGrid className="slide-grid-analysis visibility-layout">
          <PanelFrame
            eyebrow="Campo perceptual"
            title="Apertura, exposición y legibilidad"
            className="visibility-hero-panel"
            bodyClassName="visibility-hero-stage"
          >
            <div className="visibility-meter">
              <div className="visibility-meter-core" style={{ '--pct': `${opennessPct}%` } as CSSProperties}>
                <Eye size={30} aria-hidden="true" />
                <strong>{opennessPct.toFixed(2)}%</strong>
                <span>openness medio</span>
              </div>
            </div>
            <div className="surface-pill-grid">
              <KpiPill label="Puntos muestreados" value={compactNumber(visibility?.points_sampled ?? 0)} status="documented" compact />
              <KpiPill label="Rayos" value={compactNumber(visibility?.ray_count ?? 0)} status="documented" compact />
              <KpiPill label="Resolución" value={visibility?.resolution ?? '2048×2048'} status="proxy" compact />
            </div>
          </PanelFrame>

          <div className="slide-grid-side visibility-aside">
            <div className="visibility-insight-grid">
              <PanelFrame eyebrow="Exposición máxima" tone="amber" className="panel-frame-compact">
                <strong className="insight-number">{compactNumber(visibility?.max_panoptic_exposure ?? 0)}</strong>
                <p className="analysis-note-copy">Máxima acumulación de líneas de vista registradas por el análisis isovístico.</p>
              </PanelFrame>

              <PanelFrame eyebrow="Lectura del régimen visual" className="panel-frame-compact">
                <strong className="insight-heading"><Radar size={18} aria-hidden="true" /> Panoptismo computable</strong>
                <p className="analysis-note-copy">La exposición ya no es una intuición interpretativa: queda cuantificada.</p>
              </PanelFrame>
            </div>

            <PanelFrame
              eyebrow="Clave fenomenológica"
              title="Ver, ser visto y anticipar el riesgo"
              tone="teal"
              className="analysis-note-panel visibility-note-panel"
            >
              <p className="analysis-note-copy">
                La apertura del corredor roza el {formatRatio(visibility?.mean_openness ?? 0)}. Eso significa que orientación, vigilancia y
                vulnerabilidad comparten infraestructura perceptiva.
              </p>
            </PanelFrame>
          </div>
        </SlideGrid>
      </div>
    </SlideShell>
  )
}
