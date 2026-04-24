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
      className={`deck-slide ${className}`}
      data-slide-id={id}
      initial={{ opacity: 0, y: 46, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ amount: 0.34, once: false }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
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
    <motion.header
      className="slide-header"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5, once: false }}
      transition={{ duration: 0.55 }}
    >
      <div>
        <p className="deck-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {action ? <div className="slide-action">{action}</div> : null}
    </motion.header>
  )
}

export function KpiPill({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: EpistemicStatus
}) {
  return (
    <motion.div className="kpi-pill" whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 260 }}>
      <span>{label}</span>
      <strong>{value}</strong>
      <EpistemicBadge status={status} compact />
    </motion.div>
  )
}

export function EpistemicBadge({
  status,
  compact = false,
}: {
  status: EpistemicStatus
  compact?: boolean
}) {
  const label = {
    documented: 'documented',
    proxy: 'proxy',
    pending: 'pending',
  }[status]

  return (
    <span className={compact ? `epistemic-badge epistemic-${status} badge-compact` : `epistemic-badge epistemic-${status}`}>
      {label}
    </span>
  )
}

export function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function DeltaTile({ label, value }: { label: string; value: string }) {
  return (
    <motion.div className="delta-tile" whileHover={{ y: -3 }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </motion.div>
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
