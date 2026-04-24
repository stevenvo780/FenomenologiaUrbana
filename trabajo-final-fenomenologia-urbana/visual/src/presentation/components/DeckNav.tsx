import { Activity, ChevronLeft, ChevronRight, Database, Flag, Gauge, MapPinned, Network, Sparkles, UsersRound, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

import { SLIDES } from '../constants'
import type { SlideId } from '../deckTypes'

const slideIcons: Record<SlideId, LucideIcon> = {
  apertura: Sparkles,
  mapa: MapPinned,
  simulacion: Activity,
  perfiles: UsersRound,
  presion: Gauge,
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
    <motion.header
      className="deck-nav"
      aria-label="Navegación de presentación"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="deck-brand" onClick={() => onGoToSlide('apertura')}>
        <Network size={18} aria-hidden="true" />
        <span>FU</span>
      </button>
      <nav>
        {SLIDES.map((slide) => {
          const Icon = slideIcons[slide.id]

          return (
            <button
              key={slide.id}
              type="button"
              className={slide.id === activeSlide ? 'nav-dot nav-dot-active' : 'nav-dot'}
              onClick={() => onGoToSlide(slide.id)}
              aria-current={slide.id === activeSlide ? 'step' : undefined}
            >
              <Icon size={14} aria-hidden="true" />
              <small>{slide.shortLabel}</small>
              <span>{slide.label}</span>
            </button>
          )
        })}
      </nav>
      <button type="button" className="data-room-button" onClick={onOpenData}>
        <Database size={15} aria-hidden="true" />
        data room
      </button>
      <div className="deck-arrows" aria-label="Controles de presentación">
        <button type="button" onClick={onPrevious} disabled={activeIndex === 0} aria-label="Slide anterior">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
        <button type="button" onClick={onNext} disabled={activeIndex === SLIDES.length - 1} aria-label="Slide siguiente">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="deck-progress" style={{ '--progress': `${progress}%` } as CSSProperties} />
    </motion.header>
  )
}
