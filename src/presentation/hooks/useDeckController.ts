import { useDeferredValue, useEffect, useMemo, useState, useCallback } from 'react'

import type { Payload } from '../../types'
import { SLIDES } from '../constants'
import type { DeckController, ModalKind, SlideId } from '../deckTypes'
import { compareProfiles } from '../utils'

export function useDeckController(data: Payload): DeckController {
  const [scenarioId, setScenarioId] = useState(data.scenarios[0]?.id ?? 'peak_pm')
  const [agentId, setAgentId] = useState(data.agents[0]?.id ?? 'commuter_fast')
  const [compareAgentId, setCompareAgentId] = useState(
    data.agents.find((agent) => agent.id !== data.agents[0]?.id)?.id ?? data.agents[0]?.id ?? 'reduced_mobility',
  )
  const [selectedNodeId, setSelectedNodeId] = useState(data.nodes[0]?.id ?? 'parque_berrio')
  const [activeSlide, setActiveSlide] = useState<SlideId>('apertura')
  const [modal, setModal] = useState<ModalKind | null>(null)
  const [isHeatlinePaused, setIsHeatlinePaused] = useState(false)
  const [isHistoryPaused, setIsHistoryPaused] = useState(false)
  const [historyYearIndex, setHistoryYearIndex] = useState(0)
  const deferredScenarioId = useDeferredValue(scenarioId)

  const scenario = useMemo(() => data.scenarios.find((entry) => entry.id === deferredScenarioId) ?? data.scenarios[0], [data.scenarios, deferredScenarioId])
  const agent = useMemo(() => data.agents.find((entry) => entry.id === agentId) ?? data.agents[0], [data.agents, agentId])
  const compareAgent = useMemo(() => 
    data.agents.find((entry) => entry.id === compareAgentId && entry.id !== agent.id) ??
    data.agents.find((entry) => entry.id !== agent.id) ??
    data.agents[0], [data.agents, compareAgentId, agent.id])

  const selectedNode = useMemo(() => 
    data.nodes.find((entry) => entry.id === selectedNodeId) ??
    data.nodes.find((entry) => entry.id === scenario.top_bottlenecks[0]?.node_id) ??
    data.nodes[0], [data.nodes, selectedNodeId, scenario.top_bottlenecks])

  const selectedProfile = useMemo(() => 
    scenario.profile_stats.find((entry) => entry.agent_id === agent.id) ?? scenario.profile_stats[0], [scenario.profile_stats, agent.id])
  const compareProfile = useMemo(() => 
    scenario.profile_stats.find((entry) => entry.agent_id === compareAgent.id) ?? scenario.profile_stats[0], [scenario.profile_stats, compareAgent.id])

  const topRoutes = useMemo(() => scenario.top_routes.filter((entry) => entry.agent_id === agent.id).slice(0, 4), [scenario.top_routes, agent.id])
  const compareTopRoutes = useMemo(() => scenario.top_routes
    .filter((entry) => entry.agent_id === compareAgent.id)
    .slice(0, 4), [scenario.top_routes, compareAgent.id])

  const leadRoute = topRoutes[0]
  const compareLeadRoute = compareTopRoutes[0]
  const downloadedRatio = useMemo(() => `${data.source_summary.downloaded}/${data.source_summary.total}`, [data.source_summary])
  const profileComparison = useMemo(() => compareProfiles(selectedProfile, compareProfile), [selectedProfile, compareProfile])
  const fieldworkBadge = useMemo(() => data.fieldwork.summary.external_dependency ? 'pending' : 'documented', [data.fieldwork.summary.external_dependency])
  
  const activeIndex = useMemo(() => Math.max(0, SLIDES.findIndex((slide) => slide.id === activeSlide)), [activeSlide])
  const progress = useMemo(() => ((activeIndex + 1) / SLIDES.length) * 100, [activeIndex])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement

      if (modal || isTyping) {
        return
      }

      if (event.key.toLowerCase() === 'd') {
        event.preventDefault()
        setModal(getTechnicalModal(activeSlide))
        return
      }

      if (activeSlide === 'multitudes' && event.key === ' ') {
        event.preventDefault()
        setIsHeatlinePaused((value) => !value)
        return
      }

      if (activeSlide === 'historia' && event.key === 'ArrowRight') {
        event.preventDefault()
        setIsHistoryPaused(true)
        setHistoryYearIndex((value) => Math.min(value + 1, 2))
        return
      }

      if (activeSlide === 'historia' && event.key === 'ArrowLeft') {
        event.preventDefault()
        setIsHistoryPaused(true)
        setHistoryYearIndex((value) => Math.max(value - 1, 0))
        return
      }

      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault()
        setActiveSlide(SLIDES[Math.min(activeIndex + 1, SLIDES.length - 1)].id)
      }

      if (['ArrowLeft', 'PageUp', 'Backspace'].includes(event.key)) {
        event.preventDefault()
        setActiveSlide(SLIDES[Math.max(activeIndex - 1, 0)].id)
      }

      if (event.key === 'Home') {
        event.preventDefault()
        setActiveSlide(SLIDES[0].id)
      }

      if (event.key === 'End') {
        event.preventDefault()
        setActiveSlide(SLIDES.at(-1)?.id ?? 'cierre')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, activeSlide, modal])

  const goToSlide = useCallback((id: SlideId) => {
    setActiveSlide(id)
  }, [])

  const goToNextSlide = useCallback(() => {
    setActiveSlide((curr) => {
      const idx = SLIDES.findIndex((s) => s.id === curr)
      return SLIDES[Math.min(idx + 1, SLIDES.length - 1)].id
    })
  }, [])

  const goToPreviousSlide = useCallback(() => {
    setActiveSlide((curr) => {
      const idx = SLIDES.findIndex((s) => s.id === curr)
      return SLIDES[Math.max(idx - 1, 0)].id
    })
  }, [])

  const toggleHeatlinePaused = useCallback(() => setIsHeatlinePaused((value) => !value), [])
  const pauseHistory = useCallback(() => setIsHistoryPaused(true), [])
  const openModal = useCallback((kind: ModalKind) => setModal(kind), [])
  const closeModal = useCallback(() => setModal(null), [])

  return useMemo(() => ({
    data,
    scenario,
    agent,
    compareAgent,
    selectedNode,
    selectedProfile,
    compareProfile,
    topRoutes,
    compareTopRoutes,
    leadRoute,
    compareLeadRoute,
    downloadedRatio,
    profileComparison,
    fieldworkBadge,
    activeSlide,
    activeIndex,
    progress,
    modal,
    isHeatlinePaused,
    isHistoryPaused,
    historyYearIndex,
    setScenarioId,
    setAgentId,
    setCompareAgentId,
    setSelectedNodeId,
    setHistoryYearIndex,
    pauseHistory,
    toggleHeatlinePaused,
    goToSlide,
    goToNextSlide,
    goToPreviousSlide,
    openModal,
    closeModal,
  }), [
    data, scenario, agent, compareAgent, selectedNode, selectedProfile, 
    compareProfile, topRoutes, compareTopRoutes, leadRoute, compareLeadRoute, 
    downloadedRatio, profileComparison, fieldworkBadge, activeSlide, 
    activeIndex, progress, modal, isHeatlinePaused, isHistoryPaused, 
    historyYearIndex, pauseHistory, toggleHeatlinePaused, goToSlide, 
    goToNextSlide, goToPreviousSlide, openModal, closeModal
  ])
}

function getTechnicalModal(slide: SlideId): ModalKind {
  if (slide === 'asfixia') {
    return 'calibration-detail'
  }

  if (slide === 'estres') {
    return 'stress-detail'
  }

  if (slide === 'evidencia') {
    return 'evidence'
  }

  if (slide === 'mapa') {
    return 'model'
  }

  if (slide === 'heterotopias') {
    return 'fieldwork'
  }

  return 'status'
}
