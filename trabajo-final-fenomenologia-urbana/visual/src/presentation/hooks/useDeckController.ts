import { useDeferredValue, useEffect, useState } from 'react'

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
  const deferredScenarioId = useDeferredValue(scenarioId)

  const scenario = data.scenarios.find((entry) => entry.id === deferredScenarioId) ?? data.scenarios[0]
  const agent = data.agents.find((entry) => entry.id === agentId) ?? data.agents[0]
  const compareAgent =
    data.agents.find((entry) => entry.id === compareAgentId && entry.id !== agent.id) ??
    data.agents.find((entry) => entry.id !== agent.id) ??
    data.agents[0]
  const selectedNode =
    data.nodes.find((entry) => entry.id === selectedNodeId) ??
    data.nodes.find((entry) => entry.id === scenario.top_bottlenecks[0]?.node_id) ??
    data.nodes[0]
  const selectedProfile =
    scenario.profile_stats.find((entry) => entry.agent_id === agent.id) ?? scenario.profile_stats[0]
  const compareProfile =
    scenario.profile_stats.find((entry) => entry.agent_id === compareAgent.id) ?? scenario.profile_stats[0]
  const topRoutes = scenario.top_routes.filter((entry) => entry.agent_id === agent.id).slice(0, 4)
  const compareTopRoutes = scenario.top_routes
    .filter((entry) => entry.agent_id === compareAgent.id)
    .slice(0, 4)
  const leadRoute = topRoutes[0]
  const compareLeadRoute = compareTopRoutes[0]
  const downloadedRatio = `${data.source_summary.downloaded}/${data.source_summary.total}`
  const profileComparison = compareProfiles(selectedProfile, compareProfile)
  const fieldworkBadge = data.fieldwork.summary.external_dependency ? 'pending' : 'documented'
  const activeIndex = Math.max(0, SLIDES.findIndex((slide) => slide.id === activeSlide))
  const progress = ((activeIndex + 1) / SLIDES.length) * 100

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visible?.target instanceof HTMLElement) {
          setActiveSlide(visible.target.dataset.slideId as SlideId)
        }
      },
      { threshold: [0.48, 0.62, 0.76] },
    )

    const slideNodes = document.querySelectorAll<HTMLElement>('[data-slide-id]')
    slideNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  function goToSlide(id: SlideId) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return {
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
    setScenarioId,
    setAgentId,
    setCompareAgentId,
    setSelectedNodeId,
    goToSlide,
    openModal: setModal,
    closeModal: () => setModal(null),
  }
}
