import { PresentationDeck } from './PresentationDeck'
import { useProjectData } from './hooks/useProjectData'

function App() {
  const state = useProjectData()

  if (state.status === 'loading') {
    return (
      <main className="loading-shell">
        <div className="loading-card">
          <p className="eyebrow">Fenomenología urbana operacional</p>
          <h1>Cargando laboratorio visual</h1>
          <p>
            La presentación espera el payload generado por{' '}
            <code>investigacion/scripts/run_all.py</code>.
          </p>
        </div>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className="loading-shell">
        <div className="loading-card">
          <p className="eyebrow">Error de carga</p>
          <h1>No hay payload visual disponible</h1>
          <p>{state.message}</p>
        </div>
      </main>
    )
  }

  return <PresentationDeck data={state.data} />
}

export default App
