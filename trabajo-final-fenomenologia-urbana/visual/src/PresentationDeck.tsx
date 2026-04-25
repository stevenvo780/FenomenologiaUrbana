import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'

import './presentation.css'
import { AmbientField } from './presentation/components/AmbientField'
import { DataModal } from './presentation/components/DataModal'
import { DeckNav } from './presentation/components/DeckNav'
import { useDeckController } from './presentation/hooks/useDeckController'
import { CalibrationSlide } from './presentation/slides/CalibrationSlide'
import { ClosingSlide } from './presentation/slides/ClosingSlide'
import { CrowdDynamicsSlide } from './presentation/slides/CrowdDynamicsSlide'
import { EconomySlide } from './presentation/slides/EconomySlide'
import { EnvironmentSlide } from './presentation/slides/EnvironmentSlide'
import { EvidenceSlide } from './presentation/slides/EvidenceSlide'
import { HistorySlide } from './presentation/slides/HistorySlide'
import { InequalitySlide } from './presentation/slides/InequalitySlide'
import { MapSlide } from './presentation/slides/MapSlide'
import { MethodSlide } from './presentation/slides/MethodSlide'
import { OpenSlide } from './presentation/slides/OpenSlide'
import { PressureSlide } from './presentation/slides/PressureSlide'
import { ProfilesSlide } from './presentation/slides/ProfilesSlide'
import { SimulationSlide } from './presentation/slides/SimulationSlide'
import { StressSlide } from './presentation/slides/StressSlide'
import { VisibilitySlide } from './presentation/slides/VisibilitySlide'
import type { Payload } from './types'

export function PresentationDeck({ data }: { data: Payload }) {
  const deck = useDeckController(data)
  const dirRef = useRef(1)
  const previousIndexRef = useRef(deck.activeIndex)

  if (previousIndexRef.current !== deck.activeIndex) {
    dirRef.current = deck.activeIndex > previousIndexRef.current ? 1 : -1
    previousIndexRef.current = deck.activeIndex
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
            onGoToSlide={deck.goToSlide}
            onOpenModal={deck.openModal}
            onSelectNode={deck.setSelectedNodeId}
          />
        )
      case 'metodo':
        return <MethodSlide data={data} />
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
      case 'simulacion':
        return <SimulationSlide scenario={deck.scenario} />
      case 'desigualdad':
        return (
          <InequalitySlide
            data={data}
            scenario={deck.scenario}
            onScenarioChange={deck.setScenarioId}
          />
        )
      case 'calibracion':
        return <CalibrationSlide data={data} onOpenModal={deck.openModal} />
      case 'multitudes':
        return <CrowdDynamicsSlide data={data} onOpenModal={deck.openModal} />
      case 'estres':
        return <StressSlide data={data} />
      case 'ambiente':
        return <EnvironmentSlide data={data} onOpenModal={deck.openModal} />
      case 'visibilidad':
        return <VisibilitySlide data={data} onOpenModal={deck.openModal} />
      case 'economia':
        return <EconomySlide data={data} onOpenModal={deck.openModal} />
      case 'historia':
        return <HistorySlide data={data} onOpenModal={deck.openModal} />
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
            initial={{ opacity: 0, x: dirRef.current * 60, filter: 'blur(10px)', scale: 0.97 }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, x: dirRef.current * -40, filter: 'blur(8px)', scale: 0.98 }}
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
