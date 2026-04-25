import type { Payload, ScenarioSummary } from '../../types'
import { motion } from 'framer-motion'
import { RecordedSimulationClip } from '../components/visuals/RecordedSimulationClip'
import { SlideHeader, SlideShell, MetricLine } from '../components/ui'

export function SimulationSlide({
  scenario,
}: {
  data: Payload
  scenario: ScenarioSummary
  onOpenModal: (kind: any) => void
}) {
  return (
    <SlideShell id="simulacion">
      <SlideHeader
        eyebrow="Cine Fenomenológico 06 · M-MASS Animation"
        title="Simulación Dinámica de Agentes"
        text="La técnica se vuelve imagen: 100,000 agentes ejecutando trayectorias estocásticas sobre el corredor San Antonio - Junín."
      />

      <div className="slide-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: '100%' }}>
          
          {/* Main Simulation Theater */}
          <div style={{ position: 'relative', background: '#000', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <RecordedSimulationClip scenario={scenario} />
            
            {/* HUD Overlay for Cinema */}
            <div className="hud-overlay" style={{ top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%', animation: 'blink 1s infinite' }} />
              <span style={{ color: 'var(--danger)' }}>HPC RENDER · REC 4K</span>
            </div>

            <div className="hud-overlay" style={{ bottom: '20px', left: '20px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>ESCENARIO: {scenario.label.toUpperCase()}</span>
            </div>
          </div>

          {/* Metrics & Control Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="data-card">
              <h3>Parámetros de Renderizado</h3>
              <MetricLine label="Motor" value="M-MASS v0.2" />
              <MetricLine label="Física" value="Social Force Model" />
              <MetricLine label="Sampling" value="100k Agents" />
            </div>

            <div className="data-card">
              <h3>Métricas del Escenario</h3>
              <MetricLine label="Presión Media" value={(scenario.metrics.mean_pressure * 100).toFixed(1) + '%'} />
              <MetricLine label="Entropía de Ruta" value={scenario.metrics.route_entropy.toFixed(3)} />
              <MetricLine label="Diversidad" value={scenario.metrics.concentration_index.toFixed(3)} />
            </div>

            <motion.div 
              className="data-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ background: 'rgba(0, 242, 255, 0.05)', flex: 1 }}
            >
              <h3>Análisis Fenomenológico</h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-main)' }}>
                {scenario.note}
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="metrics-bar">
        <div className="metric-item">Renderer: <b>FFmpeg x GPU</b></div>
        <div className="metric-item">Frame Rate: <b>60 FPS</b></div>
        <div className="metric-item">Status: <b>Pre-rendered Output</b></div>
      </div>
    </SlideShell>
  )
}
