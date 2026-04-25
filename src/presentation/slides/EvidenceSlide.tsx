import { Bar, BarChart, Tooltip, XAxis } from 'recharts'
import type { CSSProperties } from 'react'

import type { Payload } from '../../types'
import { DECK_CHART_TEXT } from '../constants'
import type { ModalKind } from '../deckTypes'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { KpiPill, SlideHeader, SlideShell } from '../components/ui'
import { compactNumber, findPeakPeriod } from '../utils'

export function EvidenceSlide({
  data,
  onOpenModal,
}: {
  data: Payload
  onOpenModal: (kind: ModalKind) => void
}) {
  return (
    <SlideShell id="evidencia" className="evidence-slide">
      <SlideHeader
        eyebrow="Capítulo 15 · el miembro fantasma"
        title="El dato que la ciudad no se deja capturar"
        text="La simulación es Simulacro de Denuncia: muestra tanto lo medido como lo que resiste captura."
        action={<button type="button" className="ghost-action" onClick={() => onOpenModal('evidence')}>Data room empírico</button>}
      />
      <EvidenceGallery
        data={data}
        onOpenEvidence={() => onOpenModal('evidence')}
        onOpenSources={() => onOpenModal('sources')}
      />
      <p className="slide-citation">Merleau-Ponty, 1945/1993</p>
    </SlideShell>
  )
}

function EvidenceGallery({
  data,
  onOpenEvidence,
  onOpenSources,
}: {
  data: Payload
  onOpenEvidence: () => void
  onOpenSources: () => void
}) {
  const center = data.empirical.center_perception
  const crime = data.empirical.crime_comuna_10
  const barrio = data.empirical.barrio_la_candelaria
  const environment = data.empirical.environmental_context
  const peak = findPeakPeriod(crime.monthly_2023)
  const dane = data.empirical.dane_cnpv_fallback

  return (
    <div className="evidence-gallery">
      <article className="deck-panel evidence-hero-card">
        <div className="donut" style={{ '--pct': `${center.image_favorable_pct}%` } as CSSProperties}>
          <strong>{center.image_favorable_pct.toFixed(1)}%</strong>
          <span>imagen favorable</span>
        </div>
        <div>
          <p className="deck-eyebrow">Percepción del centro</p>
          <h3>Ambivalencia intensa</h3>
          <p>
            Favorabilidad y rechazo conviven: el centro atrae por comercio y servicios,
            pero aparece asociado con congestión, inseguridad e informalidad.
          </p>
          <button type="button" className="ghost-action" onClick={onOpenEvidence}>
            Ver detalle
          </button>
        </div>
      </article>

      <article className="deck-panel word-card">
        <p className="deck-eyebrow">Nube semántica</p>
        <div className="word-cloud">
          {center.word_associations.map((entry, index) => (
            <span
              key={`${entry.dimension}-${entry.label}`}
              style={{ '--size': `${0.86 + entry.pct / 120}rem`, '--delay': `${index * 0.13}s` } as CSSProperties}
            >
              {entry.label} · {entry.pct.toFixed(0)}%
            </span>
          ))}
        </div>
      </article>

      <article className="deck-panel crime-card">
        <p className="deck-eyebrow">Criminalidad comuna 10</p>
        <h3>{compactNumber(crime.yearly_totals.at(-1)?.cases ?? 0)} casos en 2023</h3>
        <div className="crime-chart">
          <MeasuredChart minHeight={190}>
            {({ width, height }) => (
              <BarChart width={width} height={height} data={crime.monthly_2023} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                <XAxis dataKey="period" tickFormatter={(value) => String(value).slice(5)} tick={{ fill: 'rgba(255,248,236,0.62)', fontSize: DECK_CHART_TEXT.axis }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(20,16,15,0.95)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16, fontSize: DECK_CHART_TEXT.tooltip }}
                  labelFormatter={(value) => `Periodo ${value}`}
                />
                <Bar dataKey="cases" fill="#e07a46" radius={[999, 999, 6, 6]} />
              </BarChart>
            )}
          </MeasuredChart>
        </div>
        <p>Pico mensual: {peak.period} · {peak.cases} casos.</p>
      </article>

      <article className="deck-panel barrio-card">
        <p className="deck-eyebrow">La Candelaria 2021</p>
        <h3>{barrio.highlights.population_density.toFixed(0)} hab/ha</h3>
        <div className="barrio-kpis">
          <KpiPill compact label="Empresas" value={compactNumber(barrio.highlights.business_density)} status="documented" />
          <KpiPill compact label="Espacio público" value={`${barrio.highlights.public_space_per_capita.toFixed(1)} m²/hab`} status="documented" />
        </div>
      </article>

      <article className="deck-panel source-card">
        <p className="deck-eyebrow">Trazabilidad</p>
        <h3>{data.source_summary.downloaded} fuentes descargadas · {data.source_summary.failed} fallidas</h3>
        <p>
          Aire PM2.5: {environment.air.pm25.nearest_station?.short_name ?? 'sin estación cercana'} ·
          ruido: {environment.noise.valid_samples ?? 0} muestras.
        </p>
        <button type="button" className="ghost-action" onClick={onOpenSources}>
          Ver fuentes
        </button>
      </article>

      <article className="deck-panel ghost-member-card panel-alert-pulse">
        <p className="deck-eyebrow">Miembro fantasma</p>
        <h3>{data.fieldwork.status}</h3>
        <p>
          DANE: {dane.status} · geovisor directo {dane.direct_geoportal_downloaded ? 'descargado' : 'bloqueado'} ·
          fuentes fallidas {data.source_summary.failed}.
        </p>
        <button type="button" className="ghost-action" onClick={onOpenSources}>
          Ver trazabilidad
        </button>
      </article>
    </div>
  )
}
