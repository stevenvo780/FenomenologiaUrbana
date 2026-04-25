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
    <div className="data-card" style={{ padding: '1rem' }}>
      <h3>{label}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span className="data-value">{value}</span>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '0.6rem', 
          textTransform: 'uppercase',
          padding: '2px 6px',
          background: `var(--accent-dim)`,
          color: 'var(--accent)',
          borderRadius: '2px'
        }}>
          {status}
        </span>
      </div>
    </div>
  )
}

export function EpistemicBadge({
  status,
}: {
  status: EpistemicStatus
}) {
  return (
    <span className={`epistemic-badge epistemic-${status}`} style={{
      fontSize: '0.6rem',
      padding: '2px 6px',
      border: '1px solid currentColor',
      opacity: 0.8
    }}>
      {status}
    </span>
  )
}

export function MetricLine({ label, value }: { label: string; value: string }) {
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
