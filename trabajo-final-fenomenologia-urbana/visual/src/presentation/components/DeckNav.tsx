import { ChevronLeft, ChevronRight, Clock3, Cpu, Crosshair, Database, Eye, Film, Flag, LineChart, MapPinned, Network, Orbit, Scale, ShoppingBag, Sparkles, TriangleAlert, UsersRound, Wind, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

import { SLIDES } from '../constants'
import type { SlideId } from '../deckTypes'

const slideIcons: Record<SlideId, LucideIcon> = {
  apertura: Sparkles,
  metodo: Cpu,
  mapa: MapPinned,
  perfiles: UsersRound,
  presion: Clock3,
  simulacion: Film,
  desigualdad: Scale,
  calibracion: Crosshair,
  multitudes: Orbit,
  estres: TriangleAlert,
  ambiente: Wind,
  visibilidad: Eye,
  economia: ShoppingBag,
  historia: LineChart,
  evidencia: Database,
  cierre: Flag,
}

export function DeckNav({
  activeSlide,
  activeIndex,
  progress,
  onGoToSlide,
  onNext,
  onPrevious,
  onOpenData,
}: {
  activeSlide: SlideId
  activeIndex: number
  progress: number
  onGoToSlide: (id: SlideId) => void
  onNext: () => void
  onPrevious: () => void
  onOpenData: () => void
}) {
  return (
    <header className="deck-nav">
      <div className="nav-progress" style={{ width: `${progress}%` }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '2rem' }}>
        <Network size={20} color="var(--accent)" />
        <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px' }}>HPC-FENOM</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flex: 1, overflowX: 'auto', paddingBottom: '4px' }}>
        {SLIDES.map((slide) => {
          const Icon = slideIcons[slide.id]
          const isActive = slide.id === activeSlide

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => onGoToSlide(slide.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '4px 8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                opacity: isActive ? 1 : 0.6
              }}
            >
              <Icon size={14} />
              <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{slide.shortLabel}</span>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.7rem' }}>
          <button onClick={onPrevious} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{activeIndex + 1} / {SLIDES.length}</span>
          <button onClick={onNext} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>

        <button 
          onClick={onOpenData}
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontSize: '0.6rem',
            padding: '4px 8px',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Database size={12} />
          DATA ROOM
        </button>
      </div>
    </header>
  )
}
