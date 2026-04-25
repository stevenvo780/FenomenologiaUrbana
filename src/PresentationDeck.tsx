import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import './presentation.css'
import { AmbientField } from './presentation/components/AmbientField'
import { SLIDES } from './presentation/constants'
import { DataModal } from './presentation/components/DataModal'
import { DeckNav } from './presentation/components/DeckNav'
import { useDeckController } from './presentation/hooks/useDeckController'
import { AsphyxiaSlide } from './presentation/slides/AsphyxiaSlide'
import { ClosingSlide } from './presentation/slides/ClosingSlide'
import { CrowdDynamicsSlide } from './presentation/slides/CrowdDynamicsSlide'
import { EconomySlide } from './presentation/slides/EconomySlide'
import { EnvironmentSlide } from './presentation/slides/EnvironmentSlide'
import { EvidenceSlide } from './presentation/slides/EvidenceSlide'
import { HeterotopiasSlide } from './presentation/slides/HeterotopiasSlide'
import { HistorySlide } from './presentation/slides/HistorySlide'
import { MapSlide } from './presentation/slides/MapSlide'
import { OpenSlide } from './presentation/slides/OpenSlide'
import { PressureSlide } from './presentation/slides/PressureSlide'
import { ProfilesSlide } from './presentation/slides/ProfilesSlide'
import { SimulationSlide } from './presentation/slides/SimulationSlide'
import { StressSlide } from './presentation/slides/StressSlide'
import { SymplokeSlide } from './presentation/slides/SymplokeSlide'
import { VisibilitySlide } from './presentation/slides/VisibilitySlide'
import type { SlideId } from './presentation/deckTypes'
import type { Payload } from './types'

export function PresentationDeck({ data }: { data: Payload }) {
  const deck = useDeckController(data)
  const [direction, setDirection] = useState(1)

  function handleGoToSlide(id: SlideId) {
    const nextIndex = SLIDES.findIndex((slide) => slide.id === id)

    if (nextIndex !== -1 && nextIndex !== deck.activeIndex) {
      setDirection(nextIndex > deck.activeIndex ? 1 : -1)
    }

    deck.goToSlide(id)
  }

  function handleGoToNextSlide() {
    setDirection(1)
    deck.goToNextSlide()
  }

  function handleGoToPreviousSlide() {
    setDirection(-1)
    deck.goToPreviousSlide()
  }

  const activeSlide = (() => {
    switch (deck.activeSlide) {
      case 'apertura':
        return (
          <OpenSlide
            data={data}
            scenario={deck.scenario}
            selectedNode={deck.selectedNode}
            downloadedRatio={deck.downloadedRatio}
            fieldworkBadge={deck.fieldworkBadge}
            onGoToSlide={handleGoToSlide}
            onOpenModal={deck.openModal}
            onSelectNode={deck.setSelectedNodeId}
          />
        )
      case 'symploke':
        return <SymplokeSlide data={data} />
      case 'mapa':
        return (
          <MapSlide
            data={data}
            scenario={deck.scenario}
            agent={deck.agent}
            compareAgent={deck.compareAgent}
            selectedNode={deck.selectedNode}
            leadRoute={deck.leadRoute}
            onScenarioChange={deck.setScenarioId}
            onSelectNode={deck.setSelectedNodeId}
            onOpenModal={deck.openModal}
          />
        )
      case 'heterotopias':
        return <HeterotopiasSlide data={data} onOpenModal={deck.openModal} />
      case 'perfiles':
        return (
          <ProfilesSlide
            data={data}
            scenario={deck.scenario}
            agent={deck.agent}
            compareAgent={deck.compareAgent}
            profileComparison={deck.profileComparison}
            topRoutes={deck.topRoutes}
            compareTopRoutes={deck.compareTopRoutes}
            onAgentChange={deck.setAgentId}
            onCompareAgentChange={deck.setCompareAgentId}
            onOpenModal={deck.openModal}
          />
        )
      case 'presion':
        return (
          <PressureSlide
            scenarios={data.scenarios}
            scenario={deck.scenario}
            onScenarioChange={deck.setScenarioId}
            onSelectNode={deck.setSelectedNodeId}
            onOpenModal={deck.openModal}
          />
        )
      case 'simulacion':
        return <SimulationSlide data={data} scenario={deck.scenario} />
      case 'multitudes':
        return (
          <CrowdDynamicsSlide
            data={data}
            paused={deck.isHeatlinePaused}
            onTogglePaused={deck.toggleHeatlinePaused}
            onOpenModal={deck.openModal}
          />
        )
      case 'estres':
        return <StressSlide data={data} scenario={deck.scenario} selectedNodeId={deck.selectedNode.id} />
      case 'asfixia':
        return <AsphyxiaSlide data={data} onOpenModal={deck.openModal} />
      case 'ambiente':
        return <EnvironmentSlide data={data} onOpenModal={deck.openModal} />
      case 'visibilidad':
        return (
          <VisibilitySlide
            data={data}
            scenario={deck.scenario}
            selectedNode={deck.selectedNode}
            onSelectNode={deck.setSelectedNodeId}
            onOpenModal={deck.openModal}
          />
        )
      case 'economia':
        return <EconomySlide data={data} onOpenModal={deck.openModal} />
      case 'historia':
        return (
          <HistorySlide
            data={data}
            activeYearIndex={deck.historyYearIndex}
            paused={deck.isHistoryPaused}
            onYearIndexChange={deck.setHistoryYearIndex}
            onPause={deck.pauseHistory}
            onOpenModal={deck.openModal}
          />
        )
      case 'evidencia':
        return <EvidenceSlide data={data} onOpenModal={deck.openModal} />
      case 'cierre':
        return (
          <ClosingSlide
            data={data}
            fieldworkBadge={deck.fieldworkBadge}
            onOpenModal={deck.openModal}
          />
        )
    }
  })()

  return (
    <main className="deck-shell">
      <DeckNav
        activeSlide={deck.activeSlide}
        activeIndex={deck.activeIndex}
        progress={deck.progress}
        onGoToSlide={handleGoToSlide}
        onNext={handleGoToNextSlide}
        onPrevious={handleGoToPreviousSlide}
        onOpenData={() => deck.openModal('status')}
      />
      <AmbientField />

      <div className="deck-stage" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={deck.activeSlide}
            className="deck-stage-slide"
            initial={{ opacity: 0, x: direction * 60, filter: 'blur(10px)', scale: 0.97 }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, x: direction * -40, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeSlide}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {deck.modal ? (
          <DataModal
            key={deck.modal}
            kind={deck.modal}
            data={data}
            scenario={deck.scenario}
            selectedNode={deck.selectedNode}
            agent={deck.agent}
            compareAgent={deck.compareAgent}
            onClose={deck.closeModal}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}
