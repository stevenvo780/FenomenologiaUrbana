import { motion } from 'framer-motion'

import type { AgentProfile, Payload, ScenarioSummary } from '../../../types'
import { resolveNodeLabel } from '../../utils'

export function RouteMarquee({
  data,
  agent,
  compareAgent,
  route,
  compareRoute,
}: {
  data: Payload
  agent: AgentProfile
  compareAgent: AgentProfile
  route?: ScenarioSummary['top_routes'][number]
  compareRoute?: ScenarioSummary['top_routes'][number]
}) {
  return (
    <div className="route-marquee">
      <div>
        <span className="route-swatch primary" />
        <p>
          {route
            ? `${agent.label}: ${route.path.map((nodeId) => resolveNodeLabel(data, nodeId)).join(' → ')} · ${Math.round(route.share * 100)}%`
            : `${agent.label}: sin ruta dominante`}
        </p>
      </div>
      <div>
        <span className="route-swatch secondary" />
        <p>
          {compareRoute
            ? `${compareAgent.label}: ${compareRoute.path.map((nodeId) => resolveNodeLabel(data, nodeId)).join(' → ')} · ${Math.round(compareRoute.share * 100)}%`
            : `${compareAgent.label}: sin ruta dominante`}
        </p>
      </div>
    </div>
  )
}

export function RouteStack({ data, routes }: { data: Payload; routes: ScenarioSummary['top_routes'] }) {
  return (
    <div className="route-stack">
      {routes.map((route, index) => (
        <motion.div
          key={`${route.agent_id}-${route.path.join('-')}-${index}`}
          className="route-card-mini"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04 }}
        >
          <span>#{index + 1}</span>
          <div>
            <strong>{route.label}</strong>
            <p>{route.path.map((nodeId) => resolveNodeLabel(data, nodeId)).join(' → ')}</p>
          </div>
          <em>{Math.round(route.share * 100)}%</em>
        </motion.div>
      ))}
    </div>
  )
}

export function RouteDuel({
  data,
  primaryTitle,
  secondaryTitle,
  primaryRoutes,
  secondaryRoutes,
}: {
  data: Payload
  primaryTitle: string
  secondaryTitle: string
  primaryRoutes: ScenarioSummary['top_routes']
  secondaryRoutes: ScenarioSummary['top_routes']
}) {
  return (
    <div className="route-duel">
      <RouteColumn title={primaryTitle} routes={primaryRoutes} data={data} accent="primary" />
      <RouteColumn title={secondaryTitle} routes={secondaryRoutes} data={data} accent="secondary" />
    </div>
  )
}

function RouteColumn({
  title,
  routes,
  data,
  accent,
}: {
  title: string
  routes: ScenarioSummary['top_routes']
  data: Payload
  accent: 'primary' | 'secondary'
}) {
  const visibleRoutes = routes.slice(0, 2)

  return (
    <div className={`route-column ${accent}`}>
      <h3>{title}</h3>
      {visibleRoutes.length ? (
        visibleRoutes.map((route) => (
          <div key={`${title}-${route.path.join('-')}`} className="route-rail">
            <p>{route.path.map((nodeId) => resolveNodeLabel(data, nodeId)).join(' → ')}</p>
            <div className="rail-track">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(8, route.share * 100)}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="empty-note">Sin rutas dominantes para este perfil.</p>
      )}
    </div>
  )
}
