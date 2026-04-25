import { CartesianGrid, ComposedChart, Line, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import type { Payload, ScenarioSummary } from '../../types'
import { AnimatedSimulationStage } from '../components/visuals/AnimatedSimulationStage'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { ChartPanel, PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'
import { motion } from 'framer-motion'

export function StressSlide({
  data,
  scenario,
  selectedNodeId,
}: {
  data: Payload
  scenario: ScenarioSummary
  selectedNodeId: string
}) {
  const stress = data.advanced_reports?.hpc_stress
  const chaos = data.advanced_reports?.hpc_chaos
  const tipping = stress?.tipping_point_detected
  const first = stress?.full_curve[0]
  const chaosField = data.fields_manifest?.chaos

  return (
    <SlideShell id="estres" className="stress-slide">
      <SlideHeader
        eyebrow="Capítulo 9 · El Acontecimiento"
        title="500.000"
        text="En este umbral la cuenta-por-uno fracasa. La ciudad revela su vacío del ser."
      />

      <div className="slide-content">
        <SlideGrid className="slide-grid-analysis stress-layout">
          <ChartPanel
            eyebrow="Tipping point analysis"
            title="Curva de Presión vs Entropía"
            className="stress-chart-panel"
            bodyClassName="stress-chart-body"
          >
            <MeasuredChart minHeight={280}>
              {({ width, height }) => (
                <ComposedChart width={width} height={height} data={stress?.full_curve ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="agents" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--accent)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#141417', border: '1px solid var(--accent)', fontSize: '10px' }}
                  />
                  <Line type="monotone" dataKey="system_entropy" stroke="var(--accent)" strokeWidth={2.8} dot={false} />
                  {tipping ? (
                    <ReferenceLine
                      x={tipping.agents}
                      stroke="var(--danger)"
                      strokeDasharray="3 3"
                      label={{ value: 'COLAPSO', position: 'top', fill: 'var(--danger)', fontSize: 10 }}
                    />
                  ) : null}
                </ComposedChart>
              )}
            </MeasuredChart>
            <div className="stress-simulation-wash">
              <AnimatedSimulationStage data={data} scenario={scenario} selectedNodeId={selectedNodeId} />
            </div>
          </ChartPanel>

          <div className="slide-grid-side stress-aside">
            <PanelFrame
              eyebrow="Estado del sistema"
              title={`H: ${first?.system_entropy.toFixed(2) ?? '0.00'} → ${tipping?.system_entropy.toFixed(2) ?? '0.00'}`}
              tone="danger"
              className="stress-alert-panel panel-alert-pulse panel-frame-compact"
            >
              <strong className="alert-number">{tipping?.agents.toLocaleString() ?? '0'}</strong>
              <span className="alert-caption">agentes simultáneos</span>
            </PanelFrame>

            {chaosField ? (
              <FieldRaster
                src={chaosField.src}
                alt="Mapa de caos cotidiano"
                colormap={chaosField.cmap}
                legend={{ min: chaosField.min, max: chaosField.max, unit: chaosField.units }}
                motionMode="pulse"
                className="stress-chaos-raster"
              />
            ) : null}

            <motion.div className="stress-verdict-shell" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <PanelFrame eyebrow="Síntesis computacional" title="Veredicto técnico" tone="teal" className="analysis-note-panel stress-verdict-panel panel-frame-compact">
                <p className="analysis-note-copy">{chaos?.conclusion ?? stress?.conclusion}</p>
              </PanelFrame>
            </motion.div>
          </div>
        </SlideGrid>
      </div>
      <p className="slide-citation">Badiou, 1988/1999</p>
    </SlideShell>
  )
}
