import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import type { Payload } from '../../types'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { ChartPanel, PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'
import { motion } from 'framer-motion'

export function StressSlide({
  data,
}: {
  data: Payload
}) {
  const stress = data.advanced_reports?.hpc_stress
  const chaos = data.advanced_reports?.hpc_chaos
  const tipping = stress?.tipping_point_detected

  return (
    <SlideShell id="estres" className="stress-slide">
      <SlideHeader
        eyebrow="HPC Auditoría 10 · Stress Test"
        title="Punto de Quiebre Fenomenológico"
        text="La simulación de estrés detecta el colapso de la habitabilidad cuando la técnica procesa cuerpos en lugar de albergar vidas."
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
                  <YAxis yAxisId="left" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#141417', border: '1px solid var(--accent)', fontSize: '10px' }}
                  />
                  <Bar yAxisId="left" dataKey="pressure_index" fill="rgba(255, 45, 85, 0.3)" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="system_entropy" stroke="var(--accent)" strokeWidth={2} dot={false} />
                  {tipping ? (
                    <ReferenceLine
                      x={tipping.agents}
                      yAxisId="left"
                      stroke="var(--danger)"
                      strokeDasharray="3 3"
                      label={{ value: 'COLLAPSE', position: 'top', fill: 'var(--danger)', fontSize: 10 }}
                    />
                  ) : null}
                </ComposedChart>
              )}
            </MeasuredChart>
          </ChartPanel>

          <div className="slide-grid-side stress-aside">
            <PanelFrame
              eyebrow="Estado del sistema"
              title="Colapso crítico"
              tone="danger"
              className="stress-alert-panel panel-alert-pulse panel-frame-compact"
            >
              <strong className="alert-number">{tipping?.agents.toLocaleString() ?? '0'}</strong>
              <span className="alert-caption">agentes simultáneos</span>
            </PanelFrame>

            <PanelFrame
              eyebrow="Lectura de caos"
              title="Parámetros de caos"
              className="panel-frame-compact"
              bodyClassName="mini-stat-grid stress-chaos-grid"
            >
              <div className="mini-stat-card">
                <span>Obstrucción informal</span>
                <strong>{((chaos?.informality_obstruction_ratio ?? 0) * 100).toFixed(1) + '%'}</strong>
              </div>
              <div className="mini-stat-card">
                <span>Ratio flâneur</span>
                <strong>{((chaos?.flaneur_ratio ?? 0) * 100).toFixed(1) + '%'}</strong>
              </div>
              <div className="mini-stat-card">
                <span>Turbulencia media</span>
                <strong>{chaos?.mean_turbulence_index.toFixed(4) ?? '0.0000'}</strong>
              </div>
            </PanelFrame>

            <motion.div className="stress-verdict-shell" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <PanelFrame eyebrow="Síntesis computacional" title="Veredicto técnico" tone="teal" className="analysis-note-panel stress-verdict-panel panel-frame-compact">
                <p className="analysis-note-copy">{chaos?.conclusion ?? stress?.conclusion}</p>
              </PanelFrame>
            </motion.div>
          </div>
        </SlideGrid>
      </div>

      <div className="metrics-bar">
        <div className="metric-item">Engine: <b>HPC Urban Stress Test</b></div>
        <div className="metric-item">Method: <b>System Dynamics x SFM</b></div>
        <div className="metric-item">Status: <b>High-Intensity Simulated</b></div>
      </div>
    </SlideShell>
  )
}
