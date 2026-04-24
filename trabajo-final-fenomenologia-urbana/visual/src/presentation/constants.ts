import type { ModalKind, SlideId } from './deckTypes'

export const SLIDES: Array<{ id: SlideId; label: string; shortLabel: string }> = [
  { id: 'apertura', label: 'Apertura', shortLabel: '01' },
  { id: 'metodo', label: 'Stack', shortLabel: '02' },
  { id: 'mapa', label: 'Mapa', shortLabel: '03' },
  { id: 'perfiles', label: 'Perfiles', shortLabel: '04' },
  { id: 'presion', label: 'Horas', shortLabel: '05' },
  { id: 'simulacion', label: 'Clip', shortLabel: '06' },
  { id: 'desigualdad', label: 'Ineq', shortLabel: '07' },
  { id: 'calibracion', label: 'Calib', shortLabel: '08' },
  { id: 'multitudes', label: '24h', shortLabel: '09' },
  { id: 'estres', label: 'Estrés', shortLabel: '10' },
  { id: 'ambiente', label: 'PDE', shortLabel: '11' },
  { id: 'visibilidad', label: 'Vista', shortLabel: '12' },
  { id: 'economia', label: 'Gravedad', shortLabel: '13' },
  { id: 'historia', label: 'Historia', shortLabel: '14' },
  { id: 'evidencia', label: 'Empiria', shortLabel: '15' },
  { id: 'cierre', label: 'Cierre', shortLabel: '16' },
]

export const MODAL_TITLES: Record<ModalKind, string> = {
  status: 'Estado general del proyecto',
  evidence: 'Evidencia empírica documentada',
  sources: 'Trazabilidad completa de fuentes',
  fieldwork: 'Campo pendiente y protocolo mínimo',
  model: 'Modelo, nodos, rutas y escenarios',
}
