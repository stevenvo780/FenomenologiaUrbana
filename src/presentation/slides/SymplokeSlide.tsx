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
                <SymplokeDecoration kind={key} />
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

function SymplokeDecoration({ kind }: { kind: string }) {
  if (kind === 'm1') {
    // Campo de partículas pulsantes
    const dots = Array.from({ length: 18 })
    return (
      <svg viewBox="0 0 240 70" className="symploke-decoration" aria-hidden="true" preserveAspectRatio="none">
        {dots.map((_, idx) => {
          const cx = 8 + (idx * 13) % 232
          const cy = 10 + ((idx * 19) % 50)
          return (
            <motion.circle
              key={idx}
              cx={cx}
              cy={cy}
              r={1.6}
              fill="#1f7f79"
              animate={{ opacity: [0.2, 0.9, 0.2], r: [1.2, 2.4, 1.2] }}
              transition={{ duration: 2.4 + (idx % 5) * 0.3, repeat: Infinity, delay: (idx % 6) * 0.18 }}
            />
          )
        })}
      </svg>
    )
  }
  if (kind === 'm2') {
    // 5 trayectorias caminando
    const paths = [
      'M5 55 C60 50 100 30 235 18',
      'M5 50 C70 40 130 38 235 30',
      'M5 40 C80 35 140 35 235 40',
      'M5 30 C70 30 140 50 235 50',
      'M5 20 C90 28 150 55 235 60',
    ]
    return (
      <svg viewBox="0 0 240 70" className="symploke-decoration" aria-hidden="true" preserveAspectRatio="none">
        {paths.map((d, idx) => (
          <motion.path
            key={idx}
            d={d}
            stroke="#f4c87a"
            strokeWidth={1.2}
            fill="none"
            strokeOpacity={0.55}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.6, delay: idx * 0.18, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1.4 }}
          />
        ))}
        {paths.map((d, idx) => (
          <circle key={`c-${idx}`} r={2.2} fill="#e07a46">
            <animateMotion dur={`${3 + idx * 0.3}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
      </svg>
    )
  }
  // m3: barrido panóptico
  return (
    <svg viewBox="0 0 240 70" className="symploke-decoration" aria-hidden="true" preserveAspectRatio="none">
      {Array.from({ length: 12 }).map((_, idx) => {
        const angle = (idx / 12) * Math.PI - Math.PI / 2
        const x2 = 120 + Math.cos(angle) * 110
        const y2 = 70 + Math.sin(angle) * 70
        return (
          <motion.line
            key={idx}
            x1={120}
            y1={70}
            x2={x2}
            y2={y2}
            stroke="#e07a46"
            strokeWidth={0.8}
            strokeOpacity={0.4}
            animate={{ strokeOpacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.12 }}
          />
        )
      })}
      <motion.circle
        cx={120}
        cy={70}
        r={5}
        fill="#e07a46"
        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  )
}
