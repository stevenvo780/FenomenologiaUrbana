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

export type FieldColormap = 'viridis' | 'magma' | 'plasma' | 'inferno' | 'turbo'

export type FieldRasterManifestEntry = {
  src: string
  cmap: FieldColormap
  min: number
  max: number
  clip_min: number
  clip_max: number
  units: string
  scale: 'linear' | 'log'
  size: number
  colors: number
  source: string
  bytes: number
}

export type FieldsManifest = Record<string, FieldRasterManifestEntry>

export type Temporal24h = {
  hours: number[]
  demand_multiplier: number[]
  environmental_intensity: number[]
  peak_am_hour: number
  peak_pm_hour: number
}

export type HpcConfidenceWindow = {
  mean_velocity: number
  std_dev: number
  confidence_interval_95: [number, number]
  relative_uncertainty: number
}

export type HpcUncertaintyReport = {
  generated_at: string
  iterations_per_sample: number
  results: Record<string, HpcConfidenceWindow>
  note: string
}

export type HpcMultipointCalibrationReport = {
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

export type DrlInventoryEntry = {
  file: string
  profile_id: string
  scenario_id: string
  bytes: number
}

export type AdvancedScenarioReport = {
  id: string
  label: string
  metrics: {
    m_mass_entropy: number
    systemic_pressure: number
  }
  node_loads: Record<string, number>
  edge_loads: Record<string, number>
  profile_stats: Array<{
    agent_id: string
    label: string
    total_trips: number
    path_entropy: number
    diversity_index: number
  }>
}

export type RawReports = {
  chaos: {
    generated_at: string
    engine: string
    informality_obstruction_ratio: number
    flaneur_ratio: number
    mean_turbulence_index: number
    conclusion: string
  }
  multipoint_calibration: HpcMultipointCalibrationReport
  uncertainty: HpcUncertaintyReport
  micro: {
    generated_at: string
    scenarios: Array<Record<string, unknown>>
  }
  advanced_scenarios: AdvancedScenarioReport[]
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
    hpc_uncertainty: HpcUncertaintyReport
    hpc_multipoint_calibration: HpcMultipointCalibrationReport
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
  fields_manifest?: FieldsManifest
  temporal_24h?: Temporal24h
  raw_reports?: RawReports
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
  field_calibration?: FieldCalibration
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

export type CollapseDecision =
  | 'colapso_fenomenologico'
  | 'friccion_acumulada'
  | 'flujo_ordinario'
  | 'inconcluyente'

export type CollapseMatrixCell = {
  key: string
  node: string
  window: string
  decision: CollapseDecision
  C1: boolean
  C2: boolean
  C3: boolean
  C4: boolean
  conditions_met: number
  coverage: number
}

export type FieldCalibration = {
  status: string
  captured_on?: string
  ingested_at_iso?: string | null
  collapse_matrix?: {
    rule: string
    decisions: Partial<Record<CollapseDecision, number>>
    cells: CollapseMatrixCell[]
  }
  photo_assignments?: {
    n_total?: number
    n_with_gps?: number
    by_node?: Record<string, {
      n_photos: number
      persons_mean?: number | null
      persons_max?: number | null
      saturation_mean?: number | null
      saturation_max?: number | null
    }>
    by_node_window?: Record<string, {
      n_photos: number
      persons_mean?: number | null
      persons_max?: number | null
      saturation_mean?: number | null
    }>
  }
  video_assignments?: {
    n_videos?: number
    n_with_node?: number
    by_confidence?: Record<string, number>
    assignments?: Array<{
      video: string
      ts: string
      window: string | null
      node: string | null
      confidence: string | null
      delta_seconds?: number | null
    }>
  }
  c1_hourly_projection?: {
    supuesto?: string
    weights?: Record<string, number>
    p75_per_window_cases_per_hour?: Record<string, number>
  }
  inter_rater_reliability?: InterRaterReliability
  collapse_matrix_sensitivity?: CollapseMatrixSensitivity
  cross_validation?: CrossValidationReport
  signage_ocr?: SignageOcrReport
  node_geometry_v2?: NodeGeometryV2
  audio_classification?: AudioClassification
  m1_visual_aggregate?: M1VisualAggregate
  m3_visual_aggregate?: M3VisualAggregate
}

export type AudioPerNode = {
  n_videos: number
  dominant_genre?: string
  genre_counts?: Record<string, number>
  noise_level_db_proxy?: number
  noise_level_db_max?: number
  spectral_centroid_mean_hz?: number
  voice_activity_ratio?: number
  music_activity_ratio?: number
  siren_events?: number
  traffic_intensity?: number
  mean_speech_score?: number
  mean_siren_score?: number
  mean_vehicle_score?: number
  mean_music_score?: number
  videos?: string[]
}

export type AudioPerVideo = {
  video: string
  node?: string | null
  window?: string | null
  detected_genre?: string
  duration_s?: number
  spectral?: {
    rms?: number
    rms_db?: number
    spectral_centroid_hz?: number
    tempo_bpm?: number
    sub_bass_ratio?: number
  }
  panns_top5?: Array<{ idx: number; label: string; score: number }>
}

export type AudioClassification = {
  schema?: string
  generated_at?: string
  method?: Record<string, unknown>
  n_videos_processed?: number
  n_videos_total?: number
  per_video?: AudioPerVideo[]
  per_node?: Record<string, AudioPerNode>
  per_node_window?: Record<string, AudioPerNode>
}

export type M1VisualBucket = {
  node: string
  window: string
  n_photos: number
  n_videos: number
  n_frames?: number
  human_density_p50: number
  human_density_p75: number
  human_density_max: number
  human_density_mean?: number
  obstacle_proxy_count: number
  vehicle_intensity: number
  vehicle_total?: number
  person_total?: number
  material_diversity?: number
  saturation_p75?: number
  saturation_max?: number
}

export type M1VisualAggregate = {
  _meta?: Record<string, unknown>
  by_node_window: Record<string, M1VisualBucket>
}

export type M3VisualBucket = {
  node: string
  window: string
  n_photos: number
  n_videos: number
  tourist_proxy_ratio: number
  tourist_proxy_hits?: number
  commerce_proxy: number
  commerce_proxy_hits?: number
  heterogeneity_index_visual: number
  heterogeneity_index_visual_norm?: number
  n_distinct_classes?: number
  class_distribution?: Record<string, number>
  police_proxy?: number | null
  police_proxy_note?: string
}

export type M3VisualAggregate = {
  _meta?: Record<string, unknown>
  by_node_window: Record<string, M3VisualBucket>
}

export type InterRaterObserverEntry = {
  perceived_safety_1_5: number
  binary: 'alto' | 'bajo' | string
  atmosphere_keywords?: string[]
  fear?: string[]
  blase?: string[]
}

export type InterRaterReliability = {
  schema?: string
  date?: string
  raters: string[]
  shared_nodes: string[]
  binarization_rule?: string
  scoring_per_observer_per_node: Record<string, Record<string, InterRaterObserverEntry>>
  cohens_kappa: {
    variable: string
    n_items: number
    stev_labels?: string[]
    jacob_labels?: string[]
    p_observed: number
    p_expected: number
    kappa: number
    interpretation: string
    defensive_reading?: string
  }
  qualitative_thematic_concordance?: Record<string, {
    stev?: string
    jacob?: string
    concordance: string
    notes?: string
  }>
  summary?: {
    kappa_quantitative?: number
    convergencias?: string[]
    divergencias?: string[]
    aportes_unicos_jacob?: string[]
  }
}

export type SensitivityCellShare = {
  colapso_fenomenologico: number
  friccion_acumulada: number
  flujo_ordinario: number
  inconcluyente: number
}

export type SensitivityRobustness = {
  baseline_decision: CollapseDecision | string
  v1_share_baseline: number
  v2_share_baseline: number
  robust: boolean
  fragile: boolean
  min_share: number
}

export type CollapseMatrixSensitivity = {
  meta?: {
    n_iter_bootstrap?: number
    seed?: number
    n_threshold_scenarios?: number
    n_interviews_loo?: number
    rule?: string
  }
  baseline_decisions?: Record<string, string>
  variant1_bootstrap?: Record<string, SensitivityCellShare & { _n_iter?: number }>
  variant2_thresholds?: {
    per_cell?: Record<string, SensitivityCellShare & { _n_scenarios?: number }>
    n_scenarios?: number
  }
  variant3_loo_c3?: {
    per_cell?: Record<string, SensitivityCellShare & { _n_loo?: number }>
    n_interviews?: number
    cells_with_c3?: string[]
  }
  robustness?: Record<string, SensitivityRobustness>
}

export type CrossValidationConvergence = 'alta' | 'media' | 'baja' | 'no_evaluable' | string

export type CrossValidationClaim = {
  claim_id: string
  node: string
  window: string
  field_observer: string
  field_value: string
  visual_metric: string
  visual_value: string
  convergence: CrossValidationConvergence
  note?: string
}

export type CrossValidationReport = {
  _meta?: {
    generator?: string
    date?: string
    purpose?: string
    convergence_levels?: string[]
    caveats?: string[]
  }
  claims: CrossValidationClaim[]
  summary?: {
    alta_convergencia?: string[]
    media_convergencia?: string[]
    baja_convergencia?: string[]
    no_evaluable?: string[]
    inter_rater_resolution?: Record<string, string>
  }
}

export type SignageOcrNode = {
  n_photos: number
  n_text_strings: number
  n_tags: number
  n_unique_tags: number
  tag_repetition_score: number
  tag_repetition_volume: number
  top_repeated_tags: Array<{ tag: string; count: number }>
  n_commerce: number
  commerce_density: number
  n_marcas: number
  n_direcciones: number
  language_diversity: Record<string, number>
}

export type SignageOcrReport = {
  engine?: string
  engine_gpu?: boolean
  languages?: string[]
  min_chars?: number
  min_confidence?: number
  n_photos_processed: number
  n_strings_total: number
  n_tags_total: number
  n_unique_tags_global: number
  global_top_repeated_tags?: Array<{ tag: string; count: number }>
  by_node: Record<string, SignageOcrNode>
  elapsed_seconds?: number
}

export type NodeGeometryV2Entry = {
  id: string
  lat: number
  lon: number
  kind: 'canonical' | 'subzone' | string
  parent_hint: string | null
  max_radius_m: number | null
  source: string
}

export type NodeGeometryV2 = {
  version?: string
  rationale?: string
  subzone_max_radius_m?: number
  global_max_radius_m?: number
  nodes: NodeGeometryV2Entry[]
}
