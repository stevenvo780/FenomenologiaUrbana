import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { ThesisView } from './ThesisView.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThesisView />
  </StrictMode>,
)
