import type { ScenarioSummary } from '../../types'
import { motion } from 'framer-motion'
import { RecordedSimulationClip } from '../components/visuals/RecordedSimulationClip'
import { SlideHeader, SlideShell, MetricLine } from '../components/ui'

export function SimulationSlide({
  scenario,
}: {
  scenario: ScenarioSummary
}) {
  return (
    <SlideShell id="simulacion" className="simulation-slide">
      <SlideHeader
        eyebrow="Cine Fenomenológico 06 · M-MASS Animation"
        title="Simulación Dinámica de Agentes"
        text="100,000 agentes ejecutan trayectorias estocásticas sobre el corredor San Antonio - Junín."
      />

      <div className="simulation-grid">
        <article className="deck-panel simulation-theater">
          <RecordedSimulationClip scenario={scenario} />
        </article>

        <aside className="simulation-sidebar">
          <section className="deck-panel simulation-meta-card">
            <div className="simulation-meta-grid">
              <article className="simulation-meta-section">
                <h3>Parámetros de Renderizado</h3>
                <MetricLine compact label="Motor" value="M-MASS v0.2" />
                <MetricLine compact label="Física" value="Social Force Model" />
                <MetricLine compact label="Sampling" value="100k agentes" />
              </article>

              <article className="simulation-meta-section">
                <h3>Métricas del Escenario</h3>
                <MetricLine
                  compact
                  label="Presión media"
                  value={scenario.metrics.mean_pressure.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                />
                <MetricLine compact label="Entropía de ruta" value={scenario.metrics.route_entropy.toFixed(3)} />
                <MetricLine compact label="Diversidad" value={scenario.metrics.concentration_index.toFixed(3)} />
              </article>
            </div>
          </section>

          <motion.article
            className="deck-panel simulation-note-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="deck-eyebrow">Lectura situada</p>
            <h3>Análisis fenomenológico</h3>
            <p className="simulation-note-copy">{scenario.note}</p>
          </motion.article>
        </aside>
      </div>

      <div className="metrics-bar">
        <div className="metric-item">Renderer: <b>FFmpeg x GPU</b></div>
        <div className="metric-item">Frame Rate: <b>60 FPS</b></div>
        <div className="metric-item">Status: <b>Pre-rendered Output</b></div>
      </div>
    </SlideShell>
  )
}
