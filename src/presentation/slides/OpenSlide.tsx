import type { CaseNode, Payload, ScenarioSummary } from '../../types'
import type { EpistemicStatus, ModalKind, SlideId } from '../deckTypes'
import { KpiPill, SlideShell } from '../components/ui'

export function OpenSlide({
  data,
  downloadedRatio,
  fieldworkBadge,
  onGoToSlide,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNode: CaseNode
  downloadedRatio: string
  fieldworkBadge: EpistemicStatus
  onGoToSlide: (id: SlideId) => void
  onOpenModal: (kind: ModalKind) => void
  onSelectNode: (nodeId: string) => void
}) {
  return (
    <SlideShell id="apertura">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', height: '100%' }}>
        <div>
          <p className="deck-eyebrow" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
            Instituto de Filosofía · Universidad de Antioquia
          </p>
          <h1 style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '2rem', textTransform: 'uppercase' }}>
            Fenomenología <br /> 
            <span style={{ color: 'var(--accent)' }}>Contemporánea</span> <br />
            del Centro
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px' }}>
            Modelado Computacional de Alto Rendimiento (HPC) y Auditoría Crítica del Corredor San Antonio - Junín.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="data-card" 
              style={{ padding: '1rem 2rem', cursor: 'pointer', border: '1px solid var(--accent)', background: 'var(--accent-dim)', color: 'var(--accent)' }}
              onClick={() => onGoToSlide('mapa')}
            >
              INICIAR AUDITORÍA
            </button>
          </div>
        </div>

        <div className="data-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <KpiPill label="Pipeline" value={data.meta.pipeline_version} status="proxy" />
          <KpiPill label="Fuentes" value={downloadedRatio} status="documented" />
          <KpiPill label="Escenarios" value={data.scenarios.length} status="proxy" />
          <KpiPill label="Campo" value="Stand-by" status={fieldworkBadge} />
          
          <div className="data-card" style={{ gridColumn: 'span 2', background: 'rgba(0,242,255,0.02)' }}>
            <h3>Tesis Central</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              "El espacio urbano no es un contenedor neutro, sino una estructura de expulsión y 
              acogida formalizable mediante supercómputo."
            </p>
          </div>
        </div>
      </div>

      <div className="metrics-bar">
        <div className="metric-item">Corte: <b>24 ABR 2026</b></div>
        <div className="metric-item">Localización: <b>Comuna 10, Medellín</b></div>
        <div className="metric-item">Status: <b>Ready for Fieldwork Calibration</b></div>
      </div>
    </SlideShell>
  )
}
