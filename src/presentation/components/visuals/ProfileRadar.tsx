import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from 'recharts'

import type { AgentProfile } from '../../../types'
import { MeasuredChart } from './MeasuredChart'

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
  const localMax = Math.max(
    ...dimensions.flatMap((dimension) => [primary.weights[dimension.key] ?? 0, secondary.weights[dimension.key] ?? 0]),
    1,
  )

  const chartData = dimensions.map((dimension) => ({
    dimension: dimension.label,
    primaryRaw: primary.weights[dimension.key] ?? 0,
    secondaryRaw: secondary.weights[dimension.key] ?? 0,
    primaryScaled: Math.round(((primary.weights[dimension.key] ?? 0) / localMax) * 100),
    secondaryScaled: Math.round(((secondary.weights[dimension.key] ?? 0) / localMax) * 100),
  }))

  return (
    <div className="radar-wrap recharts-radar-wrap">
      <MeasuredChart minHeight={340}>
        {({ width, height }) => (
          <RadarChart width={width} height={height} data={chartData} outerRadius="84%" cx="50%" cy="44%">
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarRadiusAxis axisLine={false} tick={false} domain={[0, 100]} />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: 'rgba(255, 248, 236, 0.78)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'rgba(20,16,15,0.95)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16 }}
              formatter={(_value, _name, entry) => {
                const rawValue = entry.dataKey === 'primaryScaled' ? entry.payload.primaryRaw : entry.payload.secondaryRaw
                return [`${Number(rawValue).toFixed(2)}`, 'peso bruto']
              }}
            />
            <Legend wrapperStyle={{ color: '#fff8ec', paddingTop: 12, fontSize: 12 }} iconSize={10} />
            <Radar name={secondary.label} dataKey="secondaryScaled" stroke="#1f7f79" fill="#1f7f79" fillOpacity={0.24} />
            <Radar name={primary.label} dataKey="primaryScaled" stroke="#e07a46" fill="#e07a46" fillOpacity={0.34} />
          </RadarChart>
        )}
      </MeasuredChart>
    </div>
  )
}
