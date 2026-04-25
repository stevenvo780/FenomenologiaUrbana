import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cpu,
  Crosshair,
  Database,
  Eye,
  Film,
  Flag,
  LayoutGrid,
  LineChart,
  MapPinned,
  Network,
  Orbit,
  Scale,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
  UsersRound,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

import { SLIDES } from '../constants'
import type { SlideId } from '../deckTypes'

const slideIcons: Record<SlideId, LucideIcon> = {
  apertura: Sparkles,
  symploke: Cpu,
  mapa: MapPinned,
  heterotopias: Crosshair,
  perfiles: UsersRound,
  presion: Clock3,
  simulacion: Film,
  multitudes: Orbit,
  estres: TriangleAlert,
  asfixia: Scale,
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
  const [menuOpen, setMenuOpen] = useState(false)
  const ActiveIcon = slideIcons[activeSlide]

  function handleGoTo(id: SlideId) {
    onGoToSlide(id)
    setMenuOpen(false)
  }

  return (
    <>
      {/* ─── Floating bottom bar ─── */}
      <nav className="deck-nav-bar" aria-label="Navegación de slides">
        {/* Animated progress line at top of bar */}
        <div className="deck-nav-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

        {/* Brand */}
        <div className="nav-bar-brand">
          <Network size={14} />
          <span>Tesis</span>
        </div>

        {/* Prev */}
        <button
          type="button"
          className="nav-bar-arrow"
          onClick={onPrevious}
          disabled={activeIndex === 0}
          aria-label="Slide anterior"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Centre pill — opens slide picker */}
        <button
          type="button"
          className="nav-bar-pill"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir selector de slides"
        >
          <ActiveIcon size={13} />
          <span className="nav-bar-label">{SLIDES[activeIndex].label}</span>
          <span className="nav-bar-counter">{activeIndex + 1}/{SLIDES.length}</span>
          <LayoutGrid size={12} className="nav-bar-grid-icon" />
        </button>

        {/* Next */}
        <button
          type="button"
          className="nav-bar-arrow"
          onClick={onNext}
          disabled={activeIndex === SLIDES.length - 1}
          aria-label="Slide siguiente"
        >
          <ChevronRight size={18} />
        </button>

        {/* Data room */}
        <button
          type="button"
          className="nav-bar-data"
          onClick={onOpenData}
          aria-label="Abrir Data Room"
        >
          <Database size={13} />
          <span>Data</span>
        </button>

        <Link
          to="/tesis"
          target="_blank"
          className="nav-bar-data nav-bar-thesis"
          aria-label="Ver Tesis Escrita (abre en pestaña nueva)"
          style={{ textDecoration: 'none' }}
        >
          <BookOpen size={13} />
          <span>Tesis</span>
        </Link>
      </nav>

      {/* ─── Slide-picker modal ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="nav-modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-modal-header">
                <span>
                  <Network size={14} />
                  &nbsp;Fenomenología Urbana · tesis en 16 slides
                </span>
                <button
                  type="button"
                  className="nav-modal-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="nav-modal-grid">
                {SLIDES.map((slide, idx) => {
                  const Icon = slideIcons[slide.id]
                  const isActive = slide.id === activeSlide
                  return (
                    <motion.button
                      key={slide.id}
                      type="button"
                      className={`nav-modal-item${isActive ? ' active' : ''}`}
                      onClick={() => handleGoTo(slide.id)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.025, duration: 0.2 }}
                    >
                      <span className="nav-modal-num">{String(idx + 1).padStart(2, '0')}</span>
                      <Icon size={16} />
                      <span className="nav-modal-name">{slide.label}</span>
                      {isActive && <span className="nav-modal-dot" aria-hidden="true" />}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
