import type { ModalKind, SlideId } from './deckTypes'

export const SLIDES: Array<{ id: SlideId; label: string; shortLabel: string }> = [
  { id: 'apertura', label: 'Apertura', shortLabel: '01' },
  { id: 'mapa', label: 'Mapa vivo', shortLabel: '02' },
  { id: 'simulacion', label: 'Simulación', shortLabel: '03' },
  { id: 'perfiles', label: 'Cuerpos', shortLabel: '04' },
  { id: 'presion', label: 'Presión', shortLabel: '05' },
  { id: 'evidencia', label: 'Datos', shortLabel: '06' },
  { id: 'cierre', label: 'Cierre', shortLabel: '07' },
]

export const MODAL_TITLES: Record<ModalKind, string> = {
  status: 'Estado general del proyecto',
  evidence: 'Evidencia empírica documentada',
  sources: 'Trazabilidad completa de fuentes',
  fieldwork: 'Campo pendiente y protocolo mínimo',
  model: 'Modelo, nodos, rutas y escenarios',
}
