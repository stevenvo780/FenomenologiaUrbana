import * as L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'

import type { CaseNode, Payload, ScenarioSummary } from '../../../types'
import { formatRatio, getNodeColor, getPathCoordinates } from '../../utils'

export function CorridorMap({
  nodes,
  edges,
  scenario,
  selectedNodeId,
  onSelectNode,
  primaryHighlightedPath,
  secondaryHighlightedPath,
}: {
  nodes: CaseNode[]
  edges: Payload['edges']
  scenario: ScenarioSummary
  selectedNodeId: string
  onSelectNode: (value: string) => void
  primaryHighlightedPath: string[]
  secondaryHighlightedPath: string[]
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)
  const primaryHighlightedNodes = useMemo(
    () => new Set(primaryHighlightedPath),
    [primaryHighlightedPath],
  )
  const secondaryHighlightedNodes = useMemo(
    () => new Set(secondaryHighlightedPath),
    [secondaryHighlightedPath],
  )

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const mapInstance = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance)

    layerGroupRef.current = L.layerGroup().addTo(mapInstance)
    mapRef.current = mapInstance

    return () => {
      layerGroupRef.current?.clearLayers()
      layerGroupRef.current?.remove()
      mapInstance.remove()
      mapRef.current = null
      layerGroupRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) {
      return
    }

    const mapInstance = mapRef.current
    const layerGroup = layerGroupRef.current
    const bounds = L.latLngBounds(nodes.map((node) => [node.lat, node.lon] as [number, number]))

    layerGroup.clearLayers()
    mapInstance.fitBounds(bounds.pad(0.16))
    mapInstance.invalidateSize()

    for (const edge of edges) {
      const source = nodes.find((node) => node.id === edge.source)
      const target = nodes.find((node) => node.id === edge.target)

      if (!source || !target) {
        continue
      }

      const edgeKey = `${edge.source}__${edge.target}`
      const reverseKey = `${edge.target}__${edge.source}`
      const load = scenario.edge_loads[edgeKey] ?? scenario.edge_loads[reverseKey] ?? 0

      L.polyline(
        [
          [source.lat, source.lon],
          [target.lat, target.lon],
        ],
        {
          color: '#12201f',
          opacity: 0.34,
          weight: 2 + load / 42,
        },
      ).addTo(layerGroup)
    }

    const primaryCoordinates = getPathCoordinates(primaryHighlightedPath, nodes)
    if (primaryCoordinates.length > 1) {
      L.polyline(primaryCoordinates, {
        color: '#e07a46',
        opacity: 0.96,
        weight: 7,
      }).addTo(layerGroup)
    }

    const secondaryCoordinates = getPathCoordinates(secondaryHighlightedPath, nodes)
    if (secondaryCoordinates.length > 1) {
      L.polyline(secondaryCoordinates, {
        color: '#1f7f79',
        opacity: 0.94,
        weight: 6,
        dashArray: '10 8',
      }).addTo(layerGroup)
    }

    for (const node of nodes) {
      const load = scenario.node_loads[node.id] ?? 0
      const active = node.id === selectedNodeId
      const highlightedPrimary = primaryHighlightedNodes.has(node.id)
      const highlightedSecondary = secondaryHighlightedNodes.has(node.id)

      const marker = L.circleMarker([node.lat, node.lon], {
        radius: active ? 13 : highlightedPrimary || highlightedSecondary ? 10 : 7 + load / 48,
        color: active ? '#fff7d6' : highlightedPrimary ? '#e07a46' : highlightedSecondary ? '#1f7f79' : '#171311',
        fillColor: active ? '#e07a46' : highlightedPrimary ? '#e07a46' : highlightedSecondary ? '#1f7f79' : getNodeColor(node),
        fillOpacity: 0.94,
        weight: active ? 4 : 2,
      })

      marker.bindTooltip(
        `<div class="map-tooltip"><strong>${node.label}</strong><span>${node.phenomenology}</span><small>Carga: ${load} · Seguridad: ${formatRatio(node.security)}</small></div>`,
        { direction: 'top', offset: [0, -8], opacity: 1, className: 'corridor-tooltip' },
      )
      marker.on('click', () => onSelectNode(node.id))
      marker.addTo(layerGroup)
    }
  }, [
    edges,
    nodes,
    onSelectNode,
    primaryHighlightedNodes,
    primaryHighlightedPath,
    scenario,
    secondaryHighlightedNodes,
    secondaryHighlightedPath,
    selectedNodeId,
  ])

  return <div ref={containerRef} className="corridor-map" role="img" aria-label="Mapa del corredor" />
}
