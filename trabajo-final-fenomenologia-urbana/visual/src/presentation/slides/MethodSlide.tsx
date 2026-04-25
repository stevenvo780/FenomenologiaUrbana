import { Bot, Cpu, Eye, Orbit, Waves, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Payload } from '../../types'
import { SlideHeader, SlideShell, KpiPill } from '../components/ui'

const engines = [
  { icon: Cpu, title: 'M-MASS x100k', detail: 'Monte Carlo de trayectorias estocásticas.' },
  { icon: Bot, title: 'DRL PyTorch', detail: 'Políticas de navegación fenomenológica.' },
  { icon: Waves, title: 'SFM 24h', detail: 'Micro-simulación de fuerzas sociales.' },
  { icon: Zap, title: 'PDE 4K', detail: 'Difusión de campos ambientales.' },
  { icon: Eye, title: 'Isovistas HPC', detail: 'Ray-casting de exposición panóptica.' },
  { icon: Orbit, title: 'Gravedad', detail: 'Concentración de atractores urbanos.' },
]

export function MethodSlide({
  data,
}: {
  data: Payload
  onOpenModal: (kind: any) => void
}) {
  return (
    <SlideShell id="metodo">
      <SlideHeader
        eyebrow="Stack Doctoral 02 · Metodología"
        title="Laboratorio de Fenomenología Operacional"
        text="La tesis no es solo un texto: es un motor de cálculo que formaliza el mundo de la vida en Medellín."
      />

      <div className="slide-content">
        <div className="data-grid">
          
          {/* Engine Cards - Animated Sequence */}
          {engines.map((engine, idx) => (
            <motion.div 
              key={engine.title}
              className="data-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{ gridColumn: 'span 4', borderLeft: '2px solid var(--accent)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <engine.icon size={20} color="var(--accent)" />
                <h3 style={{ margin: 0 }}>{engine.title}</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                {engine.detail}
              </p>
            </motion.div>
          ))}

          {/* Stats Bar */}
          <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <KpiPill label="Nodos de Red" value={data.nodes.length} status="documented" />
            <KpiPill label="Agentes/Día" value="4.2M" status="proxy" />
            <KpiPill label="Rayos GPU" value="16.7M" status="proxy" />
            <KpiPill label="Version" value={data.meta.pipeline_version} status="documented" />
          </div>

          <div className="data-card" style={{ gridColumn: 'span 12', background: 'var(--accent-dim)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent)', textAlign: 'center', letterSpacing: '2px' }}>
              REPRODUCTIBILIDAD: TODA LA DECK SE GENERA DESDE EL PIPELINE DE INVESTIGACIÓN
            </p>
          </div>
        </div>
      </div>

      <div className="metrics-bar">
        <div className="metric-item">Backend: <b>Python (PyTorch / CuPy)</b></div>
        <div className="metric-item">Frontend: <b>React x Vite x Recharts</b></div>
        <div className="metric-item">Status: <b>Operational Baseline</b></div>
      </div>
    </SlideShell>
  )
}
