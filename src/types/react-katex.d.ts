declare module 'react-katex' {
  import type { ReactElement } from 'react'

  export function InlineMath({ math }: { math: string }): ReactElement
  export function BlockMath({ math }: { math: string }): ReactElement
}
