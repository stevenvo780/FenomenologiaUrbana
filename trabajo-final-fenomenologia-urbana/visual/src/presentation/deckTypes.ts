import type { AgentProfile, CaseNode, Payload, ScenarioSummary } from '../types'

export type EpistemicStatus = 'documented' | 'proxy' | 'pending'

export type ModalKind = 'status' | 'evidence' | 'sources' | 'fieldwork' | 'model'

export type SlideId =
  | 'apertura'
  | 'metodo'
  | 'mapa'
  | 'perfiles'
  | 'presion'
  | 'simulacion'
  | 'desigualdad'
  | 'calibracion'
  | 'multitudes'
  | 'estres'
  | 'ambiente'
  | 'visibilidad'
  | 'economia'
  | 'historia'
  | 'evidencia'
  | 'cierre'

export type DeckRoute = ScenarioSummary['top_routes'][number]
export type ProfileStats = ScenarioSummary['profile_stats'][number]

export type ProfileComparison = {
  deltaCost: number
  deltaTravelMinutes: number
  deltaEntropy: number
  deltaTrips: number
}

export type DeckController = {
  data: Payload
  scenario: ScenarioSummary
  agent: AgentProfile
  compareAgent: AgentProfile
  selectedNode: CaseNode
  selectedProfile: ProfileStats
  compareProfile: ProfileStats
  topRoutes: DeckRoute[]
  compareTopRoutes: DeckRoute[]
  leadRoute?: DeckRoute
  compareLeadRoute?: DeckRoute
  downloadedRatio: string
  profileComparison: ProfileComparison
  fieldworkBadge: EpistemicStatus
  activeSlide: SlideId
  activeIndex: number
  progress: number
  modal: ModalKind | null
  setScenarioId: (value: string) => void
  setAgentId: (value: string) => void
  setCompareAgentId: (value: string) => void
  setSelectedNodeId: (value: string) => void
  goToSlide: (id: SlideId) => void
  goToNextSlide: () => void
  goToPreviousSlide: () => void
  openModal: (kind: ModalKind) => void
  closeModal: () => void
}
