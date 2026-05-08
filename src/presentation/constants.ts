import type { ModalKind, SlideId } from './deckTypes'

export const SLIDES: Array<{ id: SlideId; label: string; shortLabel: string }> = [
  { id: 'apertura', label: 'Apertura', shortLabel: 'Calle' },
  { id: 'symploke', label: 'Método en 3 capas', shortLabel: 'Método' },
  { id: 'mapa', label: 'Mapa del caso', shortLabel: 'Mapa' },
  { id: 'heterotopias', label: 'Lugares y tensiones', shortLabel: 'Lugares' },
  { id: 'perfiles', label: 'Perfiles de caminante', shortLabel: 'Perfiles' },
  { id: 'presion', label: 'Horas y presión', shortLabel: 'Horas' },
  { id: 'simulacion', label: 'Simulación', shortLabel: '100k' },
  { id: 'multitudes', label: 'Pulso de 24 horas', shortLabel: '24h' },
  { id: 'estres', label: 'Prueba de estrés', shortLabel: 'Estrés' },
  { id: 'asfixia', label: 'Límites del modelo', shortLabel: 'Límites' },
  { id: 'ambiente', label: 'Ambiente urbano', shortLabel: 'Aire' },
  { id: 'visibilidad', label: 'Visibilidad', shortLabel: 'M3' },
  { id: 'economia', label: 'Comercio y atracción', shortLabel: 'Comercio' },
  { id: 'historia', label: 'Historia', shortLabel: 'Hist' },
  { id: 'evidencia', label: 'Evidencia pública', shortLabel: 'Evidencia' },
  { id: 'triangulacion', label: 'Triangulación de campo', shortLabel: 'Triang' },
  { id: 'cierre', label: 'Cierre crítico', shortLabel: 'Cierre' },
]

export const MODAL_TITLES: Record<ModalKind, string> = {
  status: 'Estado general del proyecto',
  evidence: 'Evidencia empírica documentada',
  sources: 'Trazabilidad completa de fuentes',
  fieldwork: 'Campo pendiente, ética e instrumentos',
  model: 'Modelo, nodos, rutas y escenarios',
  'calibration-detail': 'Incertidumbre, sensibilidad y desigualdad simulada',
  'stress-detail': 'Prueba de estrés y presión sistémica',
}

export const DECK_CHART_TEXT = {
  axis: 14,
  axisCompact: 13,
  legend: 14,
  tooltip: 14,
  annotation: 14,
  sparkline: 12,
} as const
