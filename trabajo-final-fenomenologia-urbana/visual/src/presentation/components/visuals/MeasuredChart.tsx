import { useEffect, useRef, useState, type ReactNode } from 'react'

type ChartSize = {
  width: number
  height: number
}

export function MeasuredChart({
  children,
  minHeight = 220,
}: {
  children: (size: ChartSize) => ReactNode
  minHeight?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<ChartSize>({ width: 0, height: minHeight })

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const update = () => {
      const bounds = node.getBoundingClientRect()
      const next = {
        width: Math.round(bounds.width),
        height: Math.max(minHeight, Math.round(bounds.height || minHeight)),
      }

      setSize((current) => (current.width === next.width && current.height === next.height ? current : next))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)

    return () => observer.disconnect()
  }, [minHeight])

  return (
    <div ref={ref} className="chart-measure" style={{ minHeight }}>
      {size.width > 10 ? children(size) : <div className="chart-shell-placeholder" style={{ minHeight }} aria-hidden="true" />}
    </div>
  )
}
