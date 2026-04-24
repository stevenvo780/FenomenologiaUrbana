import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { AgentProfile } from '../../../types'
import { normalizeAgentWeight } from '../../utils'

const dimensions = [
  { key: 'time', label: 'tiempo' },
  { key: 'crowding', label: 'densidad' },
  { key: 'risk', label: 'riesgo' },
  { key: 'noise', label: 'ruido' },
  { key: 'lighting', label: 'luz' },
  { key: 'obstacle', label: 'obstáculo' },
  { key: 'attraction', label: 'atracción' },
]

export function ProfileRadar({ primary, secondary }: { primary: AgentProfile; secondary: AgentProfile }) {
  const chartData = dimensions.map((dimension) => ({
    dimension: dimension.label,
    primary: normalizeAgentWeight(primary, dimension.key),
    secondary: normalizeAgentWeight(secondary, dimension.key),
  }))

  return (
    <div className="radar-wrap recharts-radar-wrap">
      <ResponsiveContainer width="100%" height={520} minWidth={0} minHeight={320}>
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: 'rgba(255, 248, 236, 0.78)', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: 'rgba(20,16,15,0.95)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16 }}
            formatter={(value) => [`${Math.round(Number(value) * 100)}%`, 'peso']}
          />
          <Legend wrapperStyle={{ color: '#fff8ec' }} />
          <Radar name={secondary.label} dataKey="secondary" stroke="#1f7f79" fill="#1f7f79" fillOpacity={0.24} />
          <Radar name={primary.label} dataKey="primary" stroke="#e07a46" fill="#e07a46" fillOpacity={0.34} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
