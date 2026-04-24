import { AnimatePresence, motion } from 'framer-motion'

import './presentation.css'
import { AmbientField } from './presentation/components/AmbientField'
import { DataModal } from './presentation/components/DataModal'
import { DeckNav } from './presentation/components/DeckNav'
import { useDeckController } from './presentation/hooks/useDeckController'
import { ClosingSlide } from './presentation/slides/ClosingSlide'
import { EvidenceSlide } from './presentation/slides/EvidenceSlide'
import { MapSlide } from './presentation/slides/MapSlide'
import { OpenSlide } from './presentation/slides/OpenSlide'
import { PressureSlide } from './presentation/slides/PressureSlide'
import { ProfilesSlide } from './presentation/slides/ProfilesSlide'
import { SimulationSlide } from './presentation/slides/SimulationSlide'
import type { Payload } from './types'

export function PresentationDeck({ data }: { data: Payload }) {
  const deck = useDeckController(data)
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
            onGoToSlide={deck.goToSlide}
            onOpenModal={deck.openModal}
            onSelectNode={deck.setSelectedNodeId}
          />
        )
      case 'mapa':
        return (
          <MapSlide
            data={data}
            scenario={deck.scenario}
            agent={deck.agent}
            compareAgent={deck.compareAgent}
            selectedNode={deck.selectedNode}
            leadRoute={deck.leadRoute}
            compareLeadRoute={deck.compareLeadRoute}
            onScenarioChange={deck.setScenarioId}
            onAgentChange={deck.setAgentId}
            onCompareAgentChange={deck.setCompareAgentId}
            onSelectNode={deck.setSelectedNodeId}
            onOpenModal={deck.openModal}
          />
        )
      case 'simulacion':
        return (
          <SimulationSlide
            data={data}
            scenario={deck.scenario}
            selectedNode={deck.selectedNode}
            onOpenModal={deck.openModal}
          />
        )
      case 'perfiles':
        return (
          <ProfilesSlide
            data={data}
            agent={deck.agent}
            compareAgent={deck.compareAgent}
            profileComparison={deck.profileComparison}
            topRoutes={deck.topRoutes}
            compareTopRoutes={deck.compareTopRoutes}
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
        onGoToSlide={deck.goToSlide}
        onNext={deck.goToNextSlide}
        onPrevious={deck.goToPreviousSlide}
        onOpenData={() => deck.openModal('status')}
      />
      <AmbientField />

      <div className="deck-stage" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={deck.activeSlide}
            className="deck-stage-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
