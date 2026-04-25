import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { EpistemicStatus, SlideId } from '../deckTypes'

type SlideShellProps = {
  id: SlideId
  className?: string
  children: ReactNode
}

export function SlideShell({ id, className = '', children }: SlideShellProps) {
  return (
    <motion.section
      id={id}
      className={`slide ${className}`}
      data-slide-id={id}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.section>
  )
}

export function SlideHeader({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string
  title: string
  text: string
  action?: ReactNode
}) {
  return (
    <header className="slide-header">
      <p className="deck-eyebrow" style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
        {eyebrow}
      </p>
      <h1>{title}</h1>
      <p style={{ color: 'var(--text-dim)', maxWidth: '800px', fontSize: '0.95rem', lineHeight: 1.5 }}>
        {text}
      </p>
      {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </header>
  )
}

export function KpiPill({
  label,
  value,
  status,
}: {
  label: string
  value: string | number
  status: EpistemicStatus
}) {
  return (
    <div className="kpi-pill">
      <span>{label}</span>
      <strong>{value}</strong>
      <EpistemicBadge status={status} compact />
    </div>
  )
}

export function EpistemicBadge({
  status,
  compact = false,
}: {
  status: EpistemicStatus
  compact?: boolean
}) {
  return (
    <span className={`epistemic-badge epistemic-${status}${compact ? ' badge-compact' : ''}`}>
      {status}
    </span>
  )
}

export function MetricLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      fontSize: '0.85rem'
    }}>
      <span style={{ color: 'var(--text-dim)' }}>{label}</span>
      <strong style={{ color: 'var(--accent)' }}>{value}</strong>
    </div>
  )
}

export function ModalCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="modal-card">
      <h3>{title}</h3>
      {children}
    </article>
  )
}

export function DeltaTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="delta-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
