import { Eye, Radar } from 'lucide-react'
import type { CSSProperties } from 'react'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
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

      <div className="doctoral-grid doctoral-grid-tight">
        <article className="deck-panel visibility-hero-panel">
          <div className="visibility-meter">
            <div className="visibility-meter-core" style={{ '--pct': `${opennessPct}%` } as CSSProperties}>
              <Eye size={30} aria-hidden="true" />
              <strong>{opennessPct.toFixed(2)}%</strong>
              <span>openness medio</span>
            </div>
          </div>
          <div className="status-strip">
            <KpiPill label="Puntos muestreados" value={compactNumber(visibility?.points_sampled ?? 0)} status="documented" />
            <KpiPill label="Rayos" value={compactNumber(visibility?.ray_count ?? 0)} status="documented" />
            <KpiPill label="Resolución" value={visibility?.resolution ?? '2048×2048'} status="proxy" />
          </div>
        </article>

        <aside className="deck-panel visibility-side-panel">
          <div className="spotlight-grid spotlight-grid-compact">
            <article className="spotlight-card highlight">
              <span>Exposición máxima</span>
              <strong>{compactNumber(visibility?.max_panoptic_exposure ?? 0)}</strong>
              <p>Máxima acumulación de líneas de vista registradas por el análisis isovístico.</p>
            </article>
            <article className="spotlight-card">
              <span>Lectura del régimen visual</span>
              <strong><Radar size={18} aria-hidden="true" /> Panoptismo computable</strong>
              <p>La exposición ya no es una intuición interpretativa: queda cuantificada.</p>
            </article>
          </div>

          <div className="visibility-note">
            <p className="deck-eyebrow">Clave fenomenológica</p>
            <h3>Ver, ser visto y anticipar el riesgo</h3>
            <p>
              La apertura del corredor roza el {formatRatio(visibility?.mean_openness ?? 0)}. Eso significa que orientación, vigilancia y
              vulnerabilidad comparten infraestructura perceptiva.
            </p>
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
