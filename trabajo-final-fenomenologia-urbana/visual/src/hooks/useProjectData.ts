import { useEffect, useState } from 'react'

import type { Payload } from '../types'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; data: Payload }
  | { status: 'error'; message: string }

export function useProjectData() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/data/frontend_payload.json')

        if (!response.ok) {
          throw new Error(`No se pudo cargar el payload (${response.status})`)
        }

        const payload = (await response.json()) as Payload

        if (!cancelled) {
          setState({ status: 'ready', data: payload })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message:
              error instanceof Error ? error.message : 'Fallo desconocido al cargar datos',
          })
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
