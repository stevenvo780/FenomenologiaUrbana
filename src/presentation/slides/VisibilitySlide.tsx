import { Eye, Radar } from 'lucide-react'
import type { CSSProperties } from 'react'

import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import type { ModalKind } from '../deckTypes'
import { CorridorMap } from '../components/visuals/CorridorMap'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { KpiPill, PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber, formatRatio } from '../utils'

export function VisibilitySlide({
  data,
  scenario,
  selectedNode,
  onSelectNode,
  onOpenModal,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  onSelectNode: (value: string) => void
  onOpenModal: (kind: ModalKind) => void
}) {
  const visibility = data.advanced_models?.perceptual_visibility
  const opennessPct = Math.min(100, (visibility?.mean_openness ?? 0) * 100)
  const isovist = data.fields_manifest?.isovist

  return (
    <SlideShell id="visibilidad" className="visibility-slide">
      <SlideHeader
        eyebrow="Capítulo 12 · M3 · Panóptico de flujo"
        title="Ver, ser visto, no poder no ser visto"
        text="Con miles de puntos de observación y millones de rayos trazados, el corredor se revela como régimen panóptico."
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
            <div className="visibility-map-overlay">
              <CorridorMap
                nodes={data.nodes}
                edges={data.edges}
                scenario={scenario}
                selectedNodeId={selectedNode.id}
                onSelectNode={onSelectNode}
                primaryHighlightedPath={scenario.top_routes[0]?.path ?? []}
                secondaryHighlightedPath={[]}
              />
              {isovist ? (
                <FieldRaster
                  src={isovist.src}
                  alt="Campo isovístico logarítmico"
                  colormap={isovist.cmap}
                  legend={{ min: isovist.min, max: isovist.max, unit: isovist.units, scale: 'log' }}
                  motionMode="breathing"
                  className="visibility-isovist-overlay"
                />
              ) : null}
            </div>
            <div className="surface-pill-grid">
              <KpiPill label="Puntos muestreados" value={compactNumber(visibility?.points_sampled ?? 0)} status="documented" compact tooltip="Cantidad de puntos del corredor desde donde se calculó qué se ve y qué queda oculto. Más puntos = mapa de visibilidad más fino." />
              <KpiPill label="Rayos" value={compactNumber(visibility?.ray_count ?? 0)} status="documented" compact tooltip="Número total de rayos de visión trazados (como linternas virtuales) para reconstruir qué ve un peatón en cada punto." />
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
              <div className="visibility-meter">
                <div className="visibility-meter-core" style={{ '--pct': `${opennessPct}%` } as CSSProperties}>
                  <Eye size={30} aria-hidden="true" />
                  <strong>{opennessPct.toFixed(2)}%</strong>
                  <span>openness medio</span>
                </div>
              </div>
            </PanelFrame>
          </div>
        </SlideGrid>
      </div>
      <p className="slide-citation">Foucault, 1975/2002</p>
    </SlideShell>
  )
}
