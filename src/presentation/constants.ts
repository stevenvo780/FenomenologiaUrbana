import type { ModalKind, SlideId } from './deckTypes'

export const SLIDES: Array<{ id: SlideId; label: string; shortLabel: string }> = [
  { id: 'apertura', label: 'Apertura', shortLabel: 'Calle' },
  { id: 'symploke', label: 'Symploké', shortLabel: 'M1/M2/M3' },
  { id: 'mapa', label: 'Campo', shortLabel: 'Campo' },
  { id: 'heterotopias', label: 'Heterotopías', shortLabel: 'Hetero' },
  { id: 'perfiles', label: 'Dividuales', shortLabel: 'Divid' },
  { id: 'presion', label: 'Régimen horario', shortLabel: 'Horas' },
  { id: 'simulacion', label: 'Simulación', shortLabel: '100k' },
  { id: 'multitudes', label: 'Pulso 24h', shortLabel: 'Pulso' },
  { id: 'estres', label: 'Acontecimiento', shortLabel: 'Evento' },
  { id: 'asfixia', label: 'Asfixia', shortLabel: 'Asfixia' },
  { id: 'ambiente', label: 'Ambiente', shortLabel: 'M1' },
  { id: 'visibilidad', label: 'Visibilidad', shortLabel: 'M3' },
  { id: 'economia', label: 'Economía', shortLabel: 'Gravedad' },
  { id: 'historia', label: 'Historia', shortLabel: 'Hist' },
  { id: 'evidencia', label: 'Evidencia', shortLabel: 'Fantasma' },
  { id: 'cierre', label: 'Cierre', shortLabel: 'Tesis' },
]

export const MODAL_TITLES: Record<ModalKind, string> = {
  status: 'Estado general del proyecto',
  evidence: 'Evidencia empírica documentada',
  sources: 'Trazabilidad completa de fuentes',
  fieldwork: 'Campo pendiente y protocolo mínimo',
  model: 'Modelo, nodos, rutas y escenarios',
  'calibration-detail': 'Calibración, incertidumbre y desigualdad',
  'stress-detail': 'Stress test, caos y presión sistémica',
}

export const DECK_CHART_TEXT = {
  axis: 14,
  axisCompact: 13,
  legend: 14,
  tooltip: 14,
  annotation: 14,
  sparkline: 12,
} as const
