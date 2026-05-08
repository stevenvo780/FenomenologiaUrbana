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

export function TriangulationSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const field = data.field_calibration

  return (
    <SlideShell id="triangulacion" className="triangulation-slide">
      <SlideHeader
        eyebrow="Capítulo 15b · triangulación de campo"
        title="Lo que sobrevive a la triangulación · qué falta · qué no se debe fingir"
        text="Matriz de colapso, sensibilidad, validación cruzada, sub-zonas, audio y agregados visuales: lo que el trabajo de campo sostiene y lo que aún no podemos fingir saber."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('fieldwork')}>Campo y ética</button>}
      />
      <div className="triangulation-gallery">
        {field?.collapse_matrix && (
          <CollapseMatrixPanel
            field={field}
            sensitivity={field.collapse_matrix_sensitivity}
          />
        )}
        {field?.inter_rater_reliability && (
          <InterRaterPanel data={field.inter_rater_reliability} />
        )}
        {field?.collapse_matrix_sensitivity && (
          <SensitivityPanel data={field.collapse_matrix_sensitivity} />
        )}
        {field?.cross_validation && (
          <CrossValidationPanel data={field.cross_validation} />
        )}
        {(field?.node_geometry_v2 || field?.signage_ocr) && (
          <SubZonesPanel
            geometry={field?.node_geometry_v2}
            signage={field?.signage_ocr}
          />
        )}
        {field?.audio_classification && (
          <AudioPanel data={field.audio_classification} />
        )}
        {(field?.m1_visual_aggregate || field?.m3_visual_aggregate) && (
          <VisualAggregatesPanel
            m1={field?.m1_visual_aggregate}
            m3={field?.m3_visual_aggregate}
          />
        )}
      </div>
      <p className="slide-citation">Husserl, 1936/1991 · Haraway, 1988</p>
    </SlideShell>
  )
}
