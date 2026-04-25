import { CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis, Bar, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Payload } from '../../types'
import { SlideHeader, SlideShell, MetricLine } from '../components/ui'
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
    <SlideShell id="estres">
      <SlideHeader
        eyebrow="HPC Auditoría 10 · Stress Test"
        title="Punto de Quiebre Fenomenológico"
        text="La simulación de estrés detecta el colapso de la habitabilidad cuando la técnica procesa cuerpos en lugar de albergar vidas."
      />

      <div className="slide-content">
        <div className="data-grid">
          
          {/* Main Stress Chart */}
          <div className="data-card" style={{ gridColumn: 'span 8', height: '400px' }}>
            <h3>Curva de Presión vs Entropía (Tipping Point Analysis)</h3>
            <div style={{ height: '320px', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stress?.full_curve ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="agents" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#141417', border: '1px solid var(--accent)', fontSize: '10px' }}
                  />
                  <Bar yAxisId="left" dataKey="pressure_index" fill="rgba(255, 45, 85, 0.3)" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="system_entropy" stroke="var(--accent)" strokeWidth={2} dot={false} />
                  {tipping && <ReferenceLine x={tipping.agents} yAxisId="left" stroke="var(--danger)" strokeDasharray="3 3" label={{ value: 'COLLAPSE', position: 'top', fill: 'var(--danger)', fontSize: 10 }} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Metrics & Alerts */}
          <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="data-card" style={{ border: '1px solid var(--danger)', animation: 'pulse-red 2s infinite' }}>
              <h3 style={{ color: 'var(--danger)' }}>CRITICAL COLLAPSE DETECTED</h3>
              <div className="data-value" style={{ color: 'var(--danger)' }}>{tipping?.agents.toLocaleString() ?? '0'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>AGENTES SIMULTÁNEOS</div>
            </div>

            <div className="data-card">
              <h3>Parámetros de Caos</h3>
              <MetricLine label="Obstrucción Informal" value={((chaos?.informality_obstruction_ratio ?? 0) * 100).toFixed(1) + '%'} />
              <MetricLine label="Ratio Flâneur (Deriva)" value={((chaos?.flaneur_ratio ?? 0) * 100).toFixed(1) + '%'} />
              <MetricLine label="Turbulencia Media" value={chaos?.mean_turbulence_index.toFixed(4) ?? '0.0000'} />
            </div>

            <motion.div 
              className="data-card"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ background: 'rgba(0, 242, 255, 0.05)', flex: 1 }}
            >
              <h3>Veredicto Técnico</h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--text-main)' }}>
                {chaos?.conclusion ?? stress?.conclusion}
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 45, 85, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 45, 85, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 45, 85, 0); }
        }
      `}</style>

      <div className="metrics-bar">
        <div className="metric-item">Engine: <b>HPC Urban Stress Test</b></div>
        <div className="metric-item">Method: <b>System Dynamics x SFM</b></div>
        <div className="metric-item">Status: <b>High-Intensity Simulated</b></div>
      </div>
    </SlideShell>
  )
}
