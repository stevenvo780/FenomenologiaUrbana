import { useState } from 'react'
import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { CollapseMatrixPanel } from '../components/visuals/CollapseMatrixPanel'
import { InterRaterPanel } from '../components/visuals/InterRaterPanel'
import { SensitivityPanel } from '../components/visuals/SensitivityPanel'
import { CrossValidationPanel } from '../components/visuals/CrossValidationPanel'
import { SubZonesPanel } from '../components/visuals/SubZonesPanel'
import { AudioPanel } from '../components/visuals/AudioPanel'
import { VisualAggregatesPanel } from '../components/visuals/VisualAggregatesPanel'
import { SlideHeader, SlideShell } from '../components/ui'

type TabId = 'matriz' | 'validacion' | 'espacio'

const TABS: Array<{ id: TabId; label: string; hint: string }> = [
  { id: 'matriz', label: 'Matriz · pilares · sensibilidad', hint: '0/6/30 · 2 robustos · bootstrap' },
  { id: 'validacion', label: 'Inter-rater · cross-val · audio', hint: 'κ=0 · texto↔imagen · ruido' },
  { id: 'espacio', label: 'Sub-zonas · agregados visuales', hint: 'qué falta · qué no se finge' },
]

export function TriangulationSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const [activeTab, setActiveTab] = useState<TabId>('matriz')
  const field = data.field_calibration

  return (
    <SlideShell id="triangulacion" className="triangulation-slide">
      <SlideHeader
        eyebrow="Capítulo 15b · triangulación de campo"
        title="Lo que sobrevive a la triangulación · qué falta · qué no se debe fingir"
        text="Tres vistas: la matriz y sus pilares · la validación inter-observador y cruzada · el espacio y sus límites."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('fieldwork')}>Campo y ética</button>}
      />

      <nav className="triangulation-tabs" role="tablist" aria-label="Vistas de triangulación">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`triangulation-tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="triangulation-tab-label">{tab.label}</span>
            <span className="triangulation-tab-hint">{tab.hint}</span>
          </button>
        ))}
      </nav>

      <div className="triangulation-panel-area" role="tabpanel">
        {activeTab === 'matriz' && (
          <div className="triangulation-gallery triangulation-gallery--single">
            {field?.collapse_matrix && (
              <CollapseMatrixPanel
                field={field}
                sensitivity={field.collapse_matrix_sensitivity}
              />
            )}
            {field?.collapse_matrix_sensitivity && (
              <SensitivityPanel data={field.collapse_matrix_sensitivity} />
            )}
          </div>
        )}

        {activeTab === 'validacion' && (
          <div className="triangulation-gallery triangulation-gallery--single">
            {field?.inter_rater_reliability && (
              <InterRaterPanel data={field.inter_rater_reliability} />
            )}
            {field?.cross_validation && (
              <CrossValidationPanel data={field.cross_validation} />
            )}
            {field?.audio_classification && (
              <AudioPanel data={field.audio_classification} />
            )}
          </div>
        )}

        {activeTab === 'espacio' && (
          <div className="triangulation-gallery triangulation-gallery--single">
            {(field?.node_geometry_v2 || field?.signage_ocr) && (
              <SubZonesPanel
                geometry={field?.node_geometry_v2}
                signage={field?.signage_ocr}
              />
            )}
            {(field?.m1_visual_aggregate || field?.m3_visual_aggregate) && (
              <VisualAggregatesPanel
                m1={field?.m1_visual_aggregate}
                m3={field?.m3_visual_aggregate}
              />
            )}
          </div>
        )}
      </div>

      <p className="slide-citation">Husserl, 1936/1991 · Haraway, 1988</p>
    </SlideShell>
  )
}
