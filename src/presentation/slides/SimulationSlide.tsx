import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'

import type { Payload, ScenarioSummary } from '../../types'
import { AnimatedSimulationStage } from '../components/visuals/AnimatedSimulationStage'
import { SlideHeader, SlideShell, MetricLine } from '../components/ui'
import { compactNumber } from '../utils'

export function SimulationSlide({
  data,
  scenario,
}: {
  data: Payload
  scenario: ScenarioSummary
}) {
  const totalAgents = data.advanced_reports?.hpc_24h.total_simulated_agents_day ?? 640000
  const count = useMotionValue(0)
  const formatted = useTransform(count, (value) => Math.round(value).toLocaleString('es-CO'))

  useEffect(() => {
    const controls = animate(count, totalAgents, { duration: 2 })
    return controls.stop
  }, [count, totalAgents])

  return (
    <SlideShell id="simulacion" className="simulation-slide">
      <SlideHeader
        eyebrow="Capítulo 7 · Presentación de lo múltiple"
        title="Cien mil cuerpos, seis horas, un corredor"
        text="La simulación no representa: presenta lo múltiple como aparición computable."
      />

      <motion.div
        className="simulation-counter-banner"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.strong className="hero-number">{formatted}</motion.strong>
        <div>
          <p className="deck-eyebrow">cuerpos simulados / día</p>
          <p className="simulation-counter-caption">actitud blasé computacional · seis horas de corredor</p>
        </div>
      </motion.div>

      <div className="simulation-grid">
        <article className="deck-panel simulation-theater">
          <AnimatedSimulationStage data={data} scenario={scenario} selectedNodeId={scenario.top_routes[0]?.path[0] ?? data.nodes[0]?.id ?? ''} />
          <div className="simulation-theater-overlay" aria-hidden="true">
            <span className="simulation-theater-pill">⬢ flujo en vivo · {scenario.top_routes.length} rutas top</span>
            <span className="simulation-theater-pill simulation-theater-pill-accent">{compactNumber(totalAgents)} cuerpos / día</span>
          </div>
        </article>

        <aside className="simulation-sidebar">
          <section className="deck-panel simulation-meta-card">
            <div className="simulation-meta-grid">
              <article className="simulation-meta-section">
                <h3>Parámetros de Renderizado</h3>
                <MetricLine compact label="Motor" value="M-MASS v0.2" />
                <MetricLine compact label="Física" value="Social Force Model" />
                <MetricLine compact label="Sampling" value={compactNumber(totalAgents)} />
              </article>

              <article className="simulation-meta-section">
                <h3>Métricas del Escenario</h3>
                <MetricLine
                  compact
                  label="Presión media"
                  value={scenario.metrics.mean_pressure.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                />
                <MetricLine compact label="Entropía de ruta" value={scenario.metrics.route_entropy.toFixed(3)} />
              </article>
            </div>
          </section>

          <motion.article
            className="deck-panel simulation-note-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="deck-eyebrow">Lectura situada · tesis central</p>
            <h3>Análisis fenomenológico</h3>
            <p className="simulation-note-copy">
              <strong>La simulación no representa: presenta lo múltiple.</strong> Siguiendo a Badiou, los {compactNumber(totalAgents)} cuerpos no son una metáfora estadística de Medellín: son la inscripción computacional de la <em>multiplicidad del ser</em>. Cada agente es una decisión local sobre tiempo, riesgo, ruido y atracción; la suma no es agregación, es <em>Symploké</em> &mdash; el entrelazamiento de tres materialidades (campo físico M₁, sujeto situado M₂, panóptico de flujo M₃) que el HPC vuelve auditable.
            </p>
            <p className="simulation-note-copy simulation-note-copy-second">
              En este escenario {scenario.metrics.route_entropy.toFixed(2)} bits de entropía de ruta y presión media de {scenario.metrics.mean_pressure.toLocaleString('es-CO', { maximumFractionDigits: 0 })} unidades muestran cómo la calle, lejos de “fluir libre”, opera como <em>estructura de expulsión</em> (Sassen): la eficiencia técnica produce regresión fenomenológica. La ciudad no se vive: se atraviesa.
            </p>
            <p className="simulation-note-extra">“{scenario.note}”</p>
          </motion.article>
        </aside>
      </div>
      <p className="slide-citation">Badiou, 1988/1999</p>
    </SlideShell>
  )
}
