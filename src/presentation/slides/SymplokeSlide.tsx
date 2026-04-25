import { motion } from 'framer-motion'
import { Atom, Brain, Eye } from 'lucide-react'

import type { Payload } from '../../types'
import { PanelFrame, SlideGrid, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber } from '../utils'

export function SymplokeSlide({ data }: { data: Payload }) {
  const pdeResolution = data.advanced_models?.environmental_pde?.resolution ?? '4096 × 4096'
  const rayCount = data.advanced_models?.perceptual_visibility?.ray_count ?? 0

  const cards = [
    {
      key: 'm1',
      eyebrow: 'M1 · campo físico',
      title: 'El aire que decide',
      tone: 'teal' as const,
      Icon: Atom,
      copy: 'Ruido y partículas no son fondo: son señales que el cuerpo lee antes de que el sujeto elija.',
      metric: { label: 'Malla ambiental', value: pdeResolution },
      delay: 0.15,
    },
    {
      key: 'm2',
      eyebrow: 'M2 · sujeto situado',
      title: 'Cinco maneras de caminar',
      tone: 'amber' as const,
      Icon: Brain,
      copy: 'Cada perfil filtra la ciudad con pesos distintos: tiempo, riesgo, ruido, obstáculo, atracción.',
      metric: { label: 'Perfiles', value: data.agents.length },
      delay: 0.32,
    },
    {
      key: 'm3',
      eyebrow: 'M3 · panóptico de flujo',
      title: 'La distancia entre libertad y coacción',
      tone: 'danger' as const,
      Icon: Eye,
      copy: 'La trayectoria libre y la coaccionada se separan: esa distancia es la medida de la asfixia.',
      metric: { label: 'Rayos visuales', value: compactNumber(rayCount) },
      delay: 0.5,
    },
  ]

  return (
    <SlideShell id="symploke" className="symploke-slide">
      <SlideHeader
        eyebrow="Capítulo 2 · Symploké urbana"
        title="Tres materialidades, un solo entrelazamiento"
        text="La calle se compone de tres planos que operan a la vez: el aire que filtra, el cuerpo que decide y la mirada que mide la libertad."
      />

      <div className="slide-content symploke-content">
        <svg className="symploke-connector" viewBox="0 0 1000 120" aria-hidden="true" preserveAspectRatio="none">
          <motion.path
            d="M120 60 C300 6 380 6 500 60 S720 114 880 60"
            fill="none"
            stroke="url(#symplokeLine)"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
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
          {cards.map(({ key, eyebrow, title, tone, Icon, copy, metric, delay }) => (
            <motion.div
              key={key}
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <PanelFrame eyebrow={eyebrow} title={title} tone={tone} className="symploke-card">
                <div className="symploke-glyph" aria-hidden="true">
                  <Icon size={44} strokeWidth={1.4} />
                </div>
                <p className="symploke-copy">{copy}</p>
                <div className="symploke-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              </PanelFrame>
            </motion.div>
          ))}
        </SlideGrid>

        <p className="slide-citation">Bueno, 1972 · Husserl, 1936/1991</p>
      </div>
    </SlideShell>
  )
}
