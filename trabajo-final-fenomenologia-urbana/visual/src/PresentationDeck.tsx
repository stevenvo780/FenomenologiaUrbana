import { AnimatePresence } from 'framer-motion'

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

  return (
    <main className="deck-shell">
      <DeckNav
        activeSlide={deck.activeSlide}
        progress={deck.progress}
        onGoToSlide={deck.goToSlide}
        onOpenData={() => deck.openModal('status')}
      />
      <AmbientField />

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

      <SimulationSlide
        data={data}
        scenario={deck.scenario}
        selectedNode={deck.selectedNode}
        onOpenModal={deck.openModal}
      />

      <ProfilesSlide
        data={data}
        agent={deck.agent}
        compareAgent={deck.compareAgent}
        profileComparison={deck.profileComparison}
        topRoutes={deck.topRoutes}
        compareTopRoutes={deck.compareTopRoutes}
        onOpenModal={deck.openModal}
      />

      <PressureSlide
        scenarios={data.scenarios}
        scenario={deck.scenario}
        onScenarioChange={deck.setScenarioId}
        onSelectNode={deck.setSelectedNodeId}
        onOpenModal={deck.openModal}
      />

      <EvidenceSlide data={data} onOpenModal={deck.openModal} />

      <ClosingSlide
        data={data}
        fieldworkBadge={deck.fieldworkBadge}
        onOpenModal={deck.openModal}
      />

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
