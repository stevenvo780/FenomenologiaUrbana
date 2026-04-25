import type { AgentProfile, CaseNode, Payload, ScenarioSummary } from '../types'
import type { EpistemicStatus, ProfileComparison, ProfileStats } from './deckTypes'

export function getBounds(nodes: CaseNode[]) {
  const lats = nodes.map((node) => node.lat)
  const lons = nodes.map((node) => node.lon)

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
  }
}

export function projectNode(
  node: CaseNode,
  bounds: ReturnType<typeof getBounds>,
  width = 760,
  height = 430,
  paddingX = 60,
  paddingY = 65,
) {
  const xRatio = (node.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1)
  const yRatio = (node.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)

  return {
    x: paddingX + xRatio * width,
    y: paddingY + (1 - yRatio) * height,
  }
}

export function buildSvgPath(
  path: string[],
  nodes: CaseNode[],
  bounds: ReturnType<typeof getBounds>,
) {
  const points = path
    .map((nodeId) => nodes.find((node) => node.id === nodeId))
    .filter((node): node is CaseNode => Boolean(node))
    .map((node) => projectNode(node, bounds, 880, 520, 70, 70))

  if (!points.length) {
    return ''
  }

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

export function getPathCoordinates(path: string[], nodes: CaseNode[]) {
  return path
    .map((nodeId) => nodes.find((node) => node.id === nodeId))
    .filter((node): node is CaseNode => Boolean(node))
    .map((node) => [node.lat, node.lon] as [number, number])
}

export function getNodeColor(node: CaseNode) {
  if (node.security >= 0.55) {
    return '#1f7f79'
  }

  if (node.security >= 0.45) {
    return '#b79862'
  }

  return '#cf5d2d'
}

export function resolveNodeLabel(data: Payload, nodeId: string) {
  return data.nodes.find((node) => node.id === nodeId)?.label ?? nodeId
}

export function maxObjectValue(values: Record<string, number>) {
  return Math.max(...Object.values(values), 1)
}

export function normalizePressure(value: number, scenarios: ScenarioSummary[]) {
  const all = scenarios.map((scenario) => scenario.metrics.mean_pressure)
  const min = Math.min(...all)
  const max = Math.max(...all)

  if (max === min) {
    return 1
  }

  return (value - min) / (max - min)
}

export function compareProfiles(primary: ProfileStats, secondary: ProfileStats): ProfileComparison {
  return {
    deltaCost: primary.avg_cost - secondary.avg_cost,
    deltaTravelMinutes: primary.avg_travel_minutes - secondary.avg_travel_minutes,
    deltaEntropy: primary.route_entropy - secondary.route_entropy,
    deltaTrips: primary.trip_count - secondary.trip_count,
  }
}

export function normalizeAgentWeight(agent: AgentProfile, key: string) {
  return Math.min(1, Math.max(0.08, (agent.weights[key] ?? 0) / 1.6))
}

export function formatRatio(value: number) {
  return `${Math.round(value * 100)}%`
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat('es-CO', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function findPeakPeriod(entries: Array<{ period: string; cases: number }>) {
  if (!entries.length) {
    return { period: 's/d', cases: 1 }
  }

  return entries.reduce((peak, current) => (current.cases > peak.cases ? current : peak), entries[0])
}

export function mapScenarioStatus(value: string): EpistemicStatus {
  if (value.includes('proxy')) {
    return 'proxy'
  }

  if (value.includes('pending')) {
    return 'pending'
  }

  return 'documented'
}

export function mapGateStatus(value: string): EpistemicStatus {
  if (value.includes('external') || value.includes('pending')) {
    return 'pending'
  }

  if (value.includes('partial') || value.includes('limit') || value.includes('baseline')) {
    return 'proxy'
  }

  return 'documented'
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatSignedNumber(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

export function formatSignedMinutes(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)} min`
}

export function formatSignedPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${Math.round(value * 100)}%`
}

export function formatSignedInteger(value: number) {
  return `${value >= 0 ? '+' : ''}${value}`
}
