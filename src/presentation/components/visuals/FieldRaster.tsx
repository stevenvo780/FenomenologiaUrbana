import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'

import type { FieldColormap } from '../../../types'

const gradientByColormap: Record<FieldColormap, string> = {
  viridis: 'linear-gradient(90deg, #440154, #3b528b, #21918c, #5ec962, #fde725)',
  magma: 'linear-gradient(90deg, #000004, #4a106b, #922667, #dd513a, #fcfdbf)',
  plasma: 'linear-gradient(90deg, #0d0887, #5403a0, #8b0aa5, #cc4778, #f0f921)',
  inferno: 'linear-gradient(90deg, #000004, #420a68, #932667, #e65c2c, #fcffa4)',
  turbo: 'linear-gradient(90deg, #30123b, #28a4d9, #32d875, #f5db3f, #a41212)',
}

type FieldRasterProps = {
  src: string
  alt: string
  colormap: FieldColormap
  legend?: {
    min: number
    max: number
    unit: string
    scale?: 'linear' | 'log'
  }
  motionMode?: 'static' | 'breathing' | 'pulse' | 'reveal'
  overlaySrc?: string
  overlayBlendMode?: CSSProperties['mixBlendMode']
  overlayOpacity?: number
  className?: string
  style?: CSSProperties
}

export function FieldRaster({
  src,
  alt,
  colormap,
  legend,
  motionMode = 'static',
  overlaySrc,
  overlayBlendMode = 'screen',
  overlayOpacity = 0.5,
  className = '',
  style,
}: FieldRasterProps) {
  const reducedMotion = useReducedMotion()
  const activeMotion = reducedMotion ? 'static' : motionMode
  const animate =
    activeMotion === 'breathing'
      ? { opacity: [0.72, 1, 0.72] }
      : activeMotion === 'pulse'
        ? { scale: [1, 1.02, 1] }
        : activeMotion === 'reveal'
          ? { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }
          : undefined
  const transition =
    activeMotion === 'breathing'
      ? { duration: 8, repeat: Infinity, ease: 'easeInOut' as const }
      : activeMotion === 'pulse'
        ? { duration: 4, repeat: Infinity, ease: 'easeInOut' as const }
        : activeMotion === 'reveal'
          ? { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
          : undefined

  return (
    <motion.figure
      className={`field-raster${className ? ` ${className}` : ''}`}
      style={style}
      animate={animate}
      transition={transition}
    >
      <img src={src} alt={alt} loading="eager" />
      {overlaySrc ? (
        <img
          className="field-raster-overlay"
          src={overlaySrc}
          alt=""
          aria-hidden="true"
          style={{ mixBlendMode: overlayBlendMode, opacity: overlayOpacity }}
          loading="eager"
        />
      ) : null}
      {legend ? (
        <figcaption className="legend">
          <span>{legend.scale === 'log' ? 'log' : 'lin'}</span>
          <i style={{ background: gradientByColormap[colormap] }} />
          <em>{legend.min.toLocaleString('es-CO', { maximumFractionDigits: 1 })}</em>
          <strong>
            {legend.max.toLocaleString('es-CO', { maximumFractionDigits: 1 })} {legend.unit}
          </strong>
        </figcaption>
      ) : null}
    </motion.figure>
  )
}
