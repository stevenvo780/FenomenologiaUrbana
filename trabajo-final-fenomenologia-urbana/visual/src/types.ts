export type SourceEntry = {
  id: string
  label: string
  url: string
  kind: string
  status: 'downloaded' | 'failed'
  http_status: number | null
  content_type: string | null
  bytes: number
  local_path: string | null
  resolved_url: string
  note: string
}

export type AgentProfile = {
  id: string
  label: string
  speed_multiplier: number
  weights: Record<string, number>
  origins: string[]
  targets: string[]
}

export type CaseNode = {
  id: string
  label: string
  kind: string
  lat: number
  lon: number
  security: number
  commerce: number
  comfort: number
  control: number
  memory: number
  base_dwell: number
  proxy: boolean
  description: string
  phenomenology: string
  heterotopia: string
  centrality: {
    betweenness: number
    closeness: number
  }
}

export type CaseEdge = {
  source: string
  target: string
  distance: number
  travel_time_min: number
  crowding: number
  risk: number
  noise: number
  lighting: number
  obstacle: number
  attraction: number
}

export type ScenarioMetrics = {
  avg_path_cost: number
  avg_travel_minutes: number
  route_entropy: number
  decision_restriction: number
  mean_pressure: number
  concentration_index: number
}

export type ScenarioSummary = {
  id: string
  label: string
  time_window: string
  metrics: ScenarioMetrics
  top_bottlenecks: Array<{
    node_id: string
    label: string
    kind: string
    load: number
    phenomenology: string
  }>
  profile_stats: Array<{
    agent_id: string
    label: string
    trip_count: number
    avg_cost: number
    avg_travel_minutes: number
    route_entropy: number
  }>
  top_routes: Array<{
    agent_id: string
    label: string
    path: string[]
    count: number
    share: number
  }>
  node_loads: Record<string, number>
  edge_loads: Record<string, number>
  epistemic_status: string
  note: string
}

export type Payload = {
  meta: {
    generated_at: string
    pipeline_version: string
    status: string
  }
  case_study: {
    title: string
    area: string
    focus: string
    status: string
    epistemic_note: string
  }
  nodes: CaseNode[]
  edges: CaseEdge[]
  agents: AgentProfile[]
  scenarios: ScenarioSummary[]
  sources: SourceEntry[]
  source_summary: {
    downloaded: number
    failed: number
    total: number
  }
  fieldwork: {
    status: string
    pending: Array<{
      task: string
      variable: string
      method: string
    }>
  }
  baseline_metrics: {
    centrality: Array<{
      node_id: string
      betweenness: number
      closeness: number
    }>
  }
  docs: Record<string, string>
}
