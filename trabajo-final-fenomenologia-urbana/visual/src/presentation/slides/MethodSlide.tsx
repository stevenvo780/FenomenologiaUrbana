import { Bot, Cpu, Eye, Orbit, Waves, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

import type { Payload } from '../../types'
import type { ModalKind } from '../deckTypes'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber } from '../utils'

const engines = [
  {
    icon: Cpu,
    title: 'M-MASS x100',
    detail: 'Monte Carlo multiagente con presión sistémica y entropía de ruta.',
  },
  {
    icon: Bot,
    title: 'DRL PyTorch',
    detail: 'Cinco políticas entrenadas para navegación fenomenológica crítica.',
  },
  {
    icon: Waves,
    title: 'SFM 24h',
    detail: 'Micro-simulación peatonal de día completo con carga horaria.',
  },
  {
    icon: Zap,
    title: 'PDE 4K',
    detail: 'Campos de PM2.5 y ruido a 16.7 millones de celdas.',
  },
  {
    icon: Eye,
    title: 'Isovistas HPC',
    detail: 'Ray-casting panóptico para exposición visual y apertura espacial.',
  },
  {
    icon: Orbit,
    title: 'Gravedad urbana',
    detail: 'Concentración económica y atracción comercial del corredor.',
  },
]

export function MethodSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  const reports = data.advanced_reports
  const visibility = data.advanced_models?.perceptual_visibility
  const drlInventory = reports?.drl_inventory
  const dayReport = reports?.hpc_24h
  const environmental = reports?.hpc_environmental

  return (
    <SlideShell id="metodo" className="method-slide">
      <SlideHeader
        eyebrow="Slide 02 · stack doctoral"
        title="La tesis ya no solo argumenta: ahora corre como laboratorio computacional"
        text="Catorce pasos, múltiples motores HPC y una sola salida visual: la presentación resume la complejidad sin volverla una sopa de texto."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('status')}>Ver estatus reproducible</button>}
      />

      <div className="doctoral-grid">
        <article className="deck-panel method-panel">
          <div className="status-strip">
            <KpiPill label="Versión" value={data.meta.pipeline_version} status="proxy" />
            <KpiPill label="Escenarios" value={`${data.scenarios.length}`} status="documented" />
            <KpiPill label="Perfiles DRL" value={`${drlInventory?.trained_models ?? 0}`} status="documented" />
            <KpiPill label="Nodos" value={`${data.nodes.length}`} status="documented" />
          </div>

          <div className="engine-grid">
            {engines.map(({ icon: Icon, title, detail }, index) => (
              <motion.article
                key={title}
                className="engine-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.42 }}
              >
                <Icon size={20} aria-hidden="true" />
                <strong>{title}</strong>
                <p>{detail}</p>
              </motion.article>
            ))}
          </div>
        </article>

        <aside className="deck-panel artifact-panel">
          <div className="artifact-grid">
            <article className="artifact-card">
              <span>Agentes simulados / día</span>
              <strong>{compactNumber(dayReport?.total_simulated_agents_day ?? 0)}</strong>
              <p>Micro-simulación peatonal a 24 horas.</p>
            </article>
            <article className="artifact-card">
              <span>Rayos trazados</span>
              <strong>{compactNumber(visibility?.ray_count ?? 0)}</strong>
              <p>Exposición panóptica en resolución {visibility?.resolution ?? '2048²'}.</p>
            </article>
            <article className="artifact-card">
              <span>Resolución PDE</span>
              <strong>{environmental?.resolution?.split(' ')[0] ?? '4096×4096'}</strong>
              <p>PM2.5 y ruido difundidos en campo continuo.</p>
            </article>
          </div>

          <div className="method-note">
            <p className="deck-eyebrow">Narrativa de la deck</p>
            <h3>Topología · desigualdad · estrés · memoria urbana</h3>
            <p>
              Cada bloque abre un motor del pipeline y lo traduce a una sola lectura visual dominante.
            </p>
          </div>
        </aside>
      </div>
    </SlideShell>
  )
}
