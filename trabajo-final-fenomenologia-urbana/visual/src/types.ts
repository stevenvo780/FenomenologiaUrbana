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
  advanced_stats?: Array<{
    agent_id: string
    label: string
    total_trips: number
    path_entropy: number
    diversity_index: number
  }>
}

export type MicroSimulationResult = {
  scenario_id: string
  heatmap_file: string
  max_density: number
  turbulence_index: number
  agents_simulated: number
}

export type PdeFieldSummary = {
  max_concentration?: number
  mean_concentration?: number
  max_intensity?: number
  mean_intensity?: number
}

export type HistoricalEvolutionEntry = {
  year: string
  empirical_data: {
    densidad: number
    comercio: number
    casos_crimen: number
  }
  agents_simulated: number
  max_density: number
  entropy_spatial: number
  turbulence: number
}

export type UrbanInequalityScenario = {
  scenario_id: string
  label: string
  entropy_gini: number
  most_restricted_profile: string
  most_free_profile: string
  inequity_ratio: number
}

export type Hpc24hMetric = {
  hour: number
  agents: number
  max_load: number
  mean_energy: number
}

export type StressCurvePoint = {
  agents: number
  mean_velocity: number
  system_entropy: number
  pressure_index: number
}

export type HpcConfidenceWindow = {
  mean_velocity: number
  std_dev: number
  confidence_interval_95: [number, number]
  relative_uncertainty: number
}

export type DrlInventoryEntry = {
  file: string
  profile_id: string
  scenario_id: string
  bytes: number
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
  advanced_models?: {
    micro_simulation: {
      generated_at: string
      engine: string
      resolution: string
      results: MicroSimulationResult[]
    }
    environmental_pde: {
      generated_at: string
      engine: string
      resolution: string
      fields: {
        pm25: PdeFieldSummary
        noise: PdeFieldSummary
      }
    }
    historical_evolution?: {
      generated_at: string
      engine: string
      years_analyzed: string[]
      evolution: HistoricalEvolutionEntry[]
    }
    perceptual_visibility?: {
      generated_at: string
      resolution: string
      points_sampled: number
      ray_count: number
      max_panoptic_exposure: number
      mean_openness: number
    }
    economic_gravity?: {
      generated_at: string
      engine: string
      hubs_analyzed: number
      total_commercial_pull: number
      spatial_concentration_gini: number
      strongest_interactions?: Array<{
        source: string
        target: string
        weight: number
      }>
    }
  }
  advanced_reports?: {
    urban_inequality: {
      generated_at: string
      key_findings: string
      scenarios: UrbanInequalityScenario[]
      conclusion: string
    }
    hpc_24h: {
      generated_at: string
      total_simulated_agents_day: number
      hourly_metrics: Hpc24hMetric[]
    }
    hpc_environmental: {
      generated_at: string
      resolution: string
      pm25: {
        peak: number
        ambient_avg: number
      }
      noise: {
        peak_db: number
        spatial_variance: number
      }
    }
    hpc_stress: {
      generated_at: string
      engine: string
      tipping_point_detected: StressCurvePoint
      full_curve: StressCurvePoint[]
      conclusion: string
    }
    hpc_uncertainty: {
      generated_at: string
      iterations_per_sample: number
      results: Record<string, HpcConfidenceWindow>
      note: string
    }
    hpc_multipoint_calibration: {
      generated_at: string
      method: string
      optimized_parameters: {
        time_weight: number
        risk_weight: number
        visibility_comfort_weight: number
      }
      spatial_accuracy_score: number
      residual_error: number
      validation_nodes: Record<string, number>
    }
    hpc_chaos: {
      generated_at: string
      engine: string
      informality_obstruction_ratio: number
      flaneur_ratio: number
      mean_turbulence_index: number
      conclusion: string
    }
    drl_inventory: {
      trained_models: number
      total_bytes: number
      profiles: DrlInventoryEntry[]
    }
  }
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
    summary: {
      sessions_count: number
      node_coverage_ratio: number
      variables_observed: string[]
      node_changes?: number
      edge_changes?: number
      scenario_changes?: number
      external_dependency?: boolean
    }
  }
  closure: {
    status: string
    case_status: string
    gates: Array<{
      id: string
      label: string
      status: string
      evidence: string
    }>
    failed_sources: Array<{
      id: string
      label: string
      note: string | null
      url: string
    }>
    remaining_external_activities: Array<{
      task: string
      variable: string
      method: string
    }>
    non_fabrication_note: string
  }
  calibration?: {
    generated_at: string
    ground_truth_target: number
    optimized_weights: {
      time: number
      risk: number
      crowding: number
    }
    status: string
  }
  baseline_metrics: {
    centrality: Array<{
      node_id: string
      betweenness: number
      closeness: number
    }>
  }
  empirical: {
    generated_at: string
    center_perception: {
      source: string
      image_favorable_pct: number
      image_unfavorable_pct: number
      visited_monthly_pct: number
      visited_several_week_pct: number
      visited_weekly_pct: number
      main_motives: Array<{
        label: string
        pct: number
      }>
      word_associations: Array<{
        dimension: string
        label: string
        pct: number
      }>
    }
    crime_comuna_10: {
      source: string
      latest_month: string
      yearly_totals: Array<{
        year: string
        cases: number
      }>
      monthly_2023: Array<{
        period: string
        cases: number
      }>
      top_conducts_2023: Array<{
        label: string
        cases: number
      }>
      latest_month_top_conducts: Array<{
        label: string
        cases: number
      }>
    }
    barrio_la_candelaria: {
      source: string
      year: number
      target_barrio: string
      la_candelaria_metrics: Array<{
        label: string
        value: number
        unit: string
        theme: string
      }>
      comparison_barrios: string[]
      metric_comparisons: Array<{
        metric: string
        ranked_values: Array<{
          barrio: string
          value: number
          unit: string
        }>
      }>
      highlights: {
        population_density: number
        business_density: number
        public_space_per_capita: number
      }
      comparison_means: {
        mean_population_density: number
        mean_business_density: number
      }
    }
    mobility_sitva: {
      source: string
      status: string
      latest_period?: string
      line_b_passengers_latest?: number
      network_passengers_latest?: number
      records?: number
      note: string
    }
    environmental_context: {
      source: string
      air: {
        pm25: EnvironmentalAirComponent
        pm10: EnvironmentalAirComponent
      }
      noise: {
        source: string
        status: string
        station_count?: number
        valid_samples?: number
        latest_at?: string | null
        latest_frequency_mean?: number | null
        note: string
      }
    }
    dane_cnpv_fallback: {
      source: string
      direct_geoportal_downloaded: boolean
      microdata_catalog_downloaded: boolean
      municipal_ficha_downloaded: boolean
      status: string
      note: string
    }
    source_evidence: {
      metro_operational: {
        station: string
        high_flow_day: boolean
        afternoon_rush_pressure: boolean
        line_b_running_time_rush_minutes_before: number | null
        line_b_running_time_rush_minutes_after: number | null
        waiting_time_increase_mentioned: boolean
      }
      freshness: {
        medata_criminalidad_last_updated: string | null
        medata_barrio_last_updated: string | null
      }
    }
  }
  docs: Record<string, string>
}

export type EnvironmentalAirComponent = {
  variable: string
  status: string
  station_count?: number
  stations_with_valid_latest?: number
  nearest_station?: {
    name: string
    short_name: string
    distance_km: number
    latest_at: string
    latest_value: number
  } | null
  network_latest_mean?: number | null
  note?: string
}
