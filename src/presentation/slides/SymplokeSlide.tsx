import { motion } from 'framer-motion'

import type { Payload } from '../../types'
import { FieldRaster } from '../components/visuals/FieldRaster'
import { PanelFrame, SlideGrid, SlideHeader, SlideShell, TexBlock } from '../components/ui'
import { compactNumber } from '../utils'

export function SymplokeSlide({ data }: { data: Payload }) {
  const pm25Thumb = data.fields_manifest?.pm25_thumb
  const pdeResolution = data.advanced_models?.environmental_pde?.resolution ?? '4096x4096'
  const rayCount = data.advanced_models?.perceptual_visibility?.ray_count ?? 0

  return (
    <SlideShell id="symploke" className="symploke-slide">
      <SlideHeader
        eyebrow="Capítulo 2 · Symploké Urbana"
        title="Tres materialidades, un solo entrelazamiento"
        text="La calle se vuelve legible como composición materialista: campos físicos, intencionalidad sintética y panóptico de flujo operan a la vez."
      />

      <div className="slide-content symploke-content">
        <svg className="symploke-connector" viewBox="0 0 1000 120" aria-hidden="true">
          <motion.path
            d="M90 60 C260 6 360 6 500 60 S740 114 910 60"
            fill="none"
            stroke="url(#symplokeLine)"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="symplokeLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#1f7f79" />
              <stop offset="50%" stopColor="#f4c87a" />
              <stop offset="100%" stopColor="#e07a46" />
            </linearGradient>
          </defs>
        </svg>

        <SlideGrid className="symploke-grid">
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <PanelFrame eyebrow="M1 · Materialidad física" title="Reacción-difusión" tone="teal" className="symploke-card">
              <p>PDE ambiental sobre malla {pdeResolution}; el aire y el ruido dejan de ser fondo.</p>
              <TexBlock tex={'\\frac{\\partial u}{\\partial t}=D\\nabla^2u-\\kappa u+S(x,t)'} />
              {pm25Thumb ? (
                <FieldRaster
                  src={pm25Thumb.src}
                  alt="Miniatura del campo PM2.5"
                  colormap={pm25Thumb.cmap}
                  legend={{ min: pm25Thumb.min, max: pm25Thumb.max, unit: pm25Thumb.units }}
                  motionMode="reveal"
                  className="symploke-thumb"
                />
              ) : null}
            </PanelFrame>
          </motion.div>

          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
            <PanelFrame eyebrow="M2 · Intencionalidad sintética" title="DRL situado" tone="amber" className="symploke-card">
              <p>{data.agents.length} perfiles fenomenológicos filtran pesos de tiempo, riesgo, ruido, obstáculo y atracción.</p>
              <TexBlock tex={"Q^*(s,a)=E[R+\\gamma\\max_a Q^*(s',a')]"} />
              <div className="symploke-metric">
                <span>Perfiles</span>
                <strong>{data.agents.length}</strong>
              </div>
            </PanelFrame>
          </motion.div>

          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
            <PanelFrame eyebrow="M3 · Panóptico de flujo" title="Divergencia de posibilidad" tone="danger" className="symploke-card">
              <p>La libertad se mide como distancia entre trayectoria abierta y trayectoria coaccionada.</p>
              <TexBlock tex={'D_{KL}(P\\Vert Q)=\\sum_x P(x)\\log\\frac{P(x)}{Q(x)}'} />
              <div className="symploke-metric">
                <span>Rayos</span>
                <strong>{compactNumber(rayCount)}</strong>
              </div>
            </PanelFrame>
          </motion.div>
        </SlideGrid>

        <p className="slide-citation">Bueno, 1972 · Husserl, 1936/1991</p>
      </div>
    </SlideShell>
  )
}
