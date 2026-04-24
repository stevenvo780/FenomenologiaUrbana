import { SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { startTransition } from 'react'

import type { AgentProfile, ScenarioSummary } from '../../types'

export function ControlTheatre({
  scenarios,
  agents,
  scenarioId,
  agentId,
  compareAgentId,
  onScenarioChange,
  onAgentChange,
  onCompareAgentChange,
}: {
  scenarios: ScenarioSummary[]
  agents: AgentProfile[]
  scenarioId: string
  agentId: string
  compareAgentId: string
  onScenarioChange: (value: string) => void
  onAgentChange: (value: string) => void
  onCompareAgentChange: (value: string) => void
}) {
  return (
    <motion.div
      className="control-theatre deck-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.3, once: false }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <p className="control-title"><SlidersHorizontal size={14} aria-hidden="true" /> Escenario</p>
        <div className="chip-cloud">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className={scenario.id === scenarioId ? 'deck-chip active' : 'deck-chip'}
              onClick={() => startTransition(() => onScenarioChange(scenario.id))}
            >
              <span>{scenario.label}</span>
              <small>{scenario.time_window}</small>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="control-title">Perfil principal</p>
        <div className="chip-cloud">
          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              className={agent.id === agentId ? 'deck-chip subtle active' : 'deck-chip subtle'}
              onClick={() => startTransition(() => onAgentChange(agent.id))}
            >
              {agent.label}
            </button>
          ))}
        </div>
      </div>
      <label className="compare-select">
        <span>Comparar con</span>
        <select
          value={compareAgentId}
          onChange={(event) => startTransition(() => onCompareAgentChange(event.target.value))}
        >
          {agents
            .filter((agent) => agent.id !== agentId)
            .map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.label}
              </option>
            ))}
        </select>
      </label>
    </motion.div>
  )
}
