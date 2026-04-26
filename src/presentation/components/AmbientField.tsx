import { motion, useReducedMotion } from 'framer-motion'
import { memo } from 'react'

const orbs = [
  { className: 'orb orb-one', x: [0, 72, 20], y: [0, 28, -12], duration: 18 },
  { className: 'orb orb-two', x: [0, -60, -14], y: [0, 42, 8], duration: 24 },
  { className: 'orb orb-three', x: [0, 36, 76], y: [0, -46, 18], duration: 28 },
]

export const AmbientField = memo(function AmbientField() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="ambient-field" aria-hidden="true">
      {orbs.map((orb) => (
        <motion.span
          key={orb.className}
          className={orb.className}
          animate={reduceMotion ? undefined : { x: orb.x, y: orb.y, scale: [1, 1.12, 0.96] }}
          transition={reduceMotion ? undefined : { duration: orb.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      ))}
      <span className="grid-noise" />
    </div>
  )
})
