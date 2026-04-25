import { Routes, Route } from 'react-router-dom'
import { PresentationDeck } from './PresentationDeck.tsx'
import { ThesisView } from './ThesisView.tsx'
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

  return (
    <Routes>
      <Route path="/" element={<PresentationDeck data={state.data} />} />
      <Route path="/tesis" element={<ThesisView />} />
    </Routes>
  )
}

export default App
