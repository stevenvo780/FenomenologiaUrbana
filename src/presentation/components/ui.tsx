import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import type { EpistemicStatus, SlideId } from '../deckTypes'

type SlideShellProps = {
  id: SlideId
  className?: string
  children: ReactNode
}

type PanelTone = 'default' | 'danger' | 'teal' | 'amber'

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
      <div className="slide-header-copy">
        <p className="deck-eyebrow slide-header-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="slide-header-text">{text}</p>
      </div>
      {action ? <div className="slide-action">{action}</div> : null}
    </header>
  )
}

export function KpiPill({
  label,
  value,
  status,
  compact = false,
}: {
  label: string
  value: string | number
  status: EpistemicStatus
  compact?: boolean
}) {
  return (
    <div className={`kpi-pill${compact ? ' kpi-compact' : ''}`}>
      <span className="kpi-pill-label">{label}</span>
      <strong className="kpi-pill-value">{value}</strong>
      <EpistemicBadge status={status} compact />
    </div>
  )
}

export function SlideGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`slide-grid ${className}`}>{children}</div>
}

export function PanelFrame({
  eyebrow,
  title,
  children,
  className = '',
  bodyClassName = '',
  tone = 'default',
}: {
  eyebrow?: string
  title?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  tone?: PanelTone
}) {
  return (
    <article className={`deck-panel panel-frame panel-tone-${tone}${className ? ` ${className}` : ''}`}>
      {eyebrow || title ? (
        <div className="panel-frame-header">
          {eyebrow ? <p className="deck-eyebrow">{eyebrow}</p> : null}
          {title ? <div className="panel-frame-title">{title}</div> : null}
        </div>
      ) : null}
      <div className={`panel-frame-body${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
    </article>
  )
}

export function ChartPanel({
  eyebrow,
  title,
  children,
  className = '',
  bodyClassName = '',
}: {
  eyebrow?: string
  title?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <PanelFrame
      eyebrow={eyebrow}
      title={title}
      className={`chart-panel-frame${className ? ` ${className}` : ''}`}
      bodyClassName={`chart-panel-body${bodyClassName ? ` ${bodyClassName}` : ''}`}
    >
      {children}
    </PanelFrame>
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

export function MetricLine({
  label,
  value,
  compact = false,
}: {
  label: string
  value: ReactNode
  compact?: boolean
}) {
  return (
    <div className={`metric-line${compact ? ' compact' : ''}`}>
      <span className="metric-line-label">{label}</span>
      <strong className="metric-line-value">{value}</strong>
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
      <span className="delta-tile-label">{label}</span>
      <strong className="delta-tile-value">{value}</strong>
    </div>
  )
}

export function StatTile({
  label,
  value,
  note,
  tone = 'default',
  className = '',
}: {
  label: string
  value: ReactNode
  note?: ReactNode
  tone?: PanelTone
  className?: string
}) {
  return (
    <article className={`stat-tile stat-tone-${tone}${className ? ` ${className}` : ''}`}>
      <span className="stat-tile-label">{label}</span>
      <strong className="stat-tile-value">{value}</strong>
      {note ? <p className="stat-tile-note">{note}</p> : null}
    </article>
  )
}

export function TexInline({ tex }: { tex: string }) {
  return <InlineMath math={tex} />
}

export function TexBlock({ tex }: { tex: string }) {
  return <BlockMath math={tex} />
}
