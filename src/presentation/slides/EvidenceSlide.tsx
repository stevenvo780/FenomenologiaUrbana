import { Bar, BarChart, Tooltip, XAxis } from 'recharts'
import type { CSSProperties } from 'react'

import type { Payload } from '../../types'
import { DECK_CHART_TEXT } from '../constants'
import type { ModalKind } from '../deckTypes'
import { MeasuredChart } from '../components/visuals/MeasuredChart'
import { CollapseMatrixPanel } from '../components/visuals/CollapseMatrixPanel'
import { InterRaterPanel } from '../components/visuals/InterRaterPanel'
import { SensitivityPanel } from '../components/visuals/SensitivityPanel'
import { CrossValidationPanel } from '../components/visuals/CrossValidationPanel'
import { SubZonesPanel } from '../components/visuals/SubZonesPanel'
import { AudioPanel } from '../components/visuals/AudioPanel'
import { VisualAggregatesPanel } from '../components/visuals/VisualAggregatesPanel'
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
        eyebrow="Capítulo 15 · evidencia y faltantes"
        title="Qué tenemos, qué falta y qué no se debe fingir"
        text="El deck distingue evidencia pública, salidas computacionales y trabajo de campo pendiente. Esa separación es parte del rigor."
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
          <KpiPill compact label="Empresas" value={compactNumber(barrio.highlights.business_density)} status="documented" tooltip="Densidad de empresas registradas en el barrio: cuántos negocios formales conviven por unidad de área." />
          <KpiPill compact label="Espacio público" value={`${barrio.highlights.public_space_per_capita.toFixed(1)} m²/hab`} status="documented" tooltip="Metros cuadrados de espacio público (parques, plazas, andenes amplios) disponibles por habitante." />
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
        <p className="deck-eyebrow">Campo pendiente</p>
        <h3>{data.field_calibration?.status ?? data.fieldwork.status}</h3>
        <p>
          DANE: {dane.status} · geovisor directo {dane.direct_geoportal_downloaded ? 'descargado' : 'bloqueado'} ·
          fuentes fallidas {data.source_summary.failed}.
        </p>
        <button type="button" className="ghost-action" onClick={onOpenSources}>
          Ver trazabilidad
        </button>
      </article>

      {data.field_calibration?.collapse_matrix && (
        <CollapseMatrixPanel
          field={data.field_calibration}
          sensitivity={data.field_calibration.collapse_matrix_sensitivity}
        />
      )}
      {data.field_calibration?.inter_rater_reliability && (
        <InterRaterPanel data={data.field_calibration.inter_rater_reliability} />
      )}
      {data.field_calibration?.collapse_matrix_sensitivity && (
        <SensitivityPanel data={data.field_calibration.collapse_matrix_sensitivity} />
      )}
      {data.field_calibration?.cross_validation && (
        <CrossValidationPanel data={data.field_calibration.cross_validation} />
      )}
      {(data.field_calibration?.node_geometry_v2 || data.field_calibration?.signage_ocr) && (
        <SubZonesPanel
          geometry={data.field_calibration?.node_geometry_v2}
          signage={data.field_calibration?.signage_ocr}
        />
      )}
      {data.field_calibration?.audio_classification && (
        <AudioPanel data={data.field_calibration.audio_classification} />
      )}
      {(data.field_calibration?.m1_visual_aggregate || data.field_calibration?.m3_visual_aggregate) && (
        <VisualAggregatesPanel
          m1={data.field_calibration?.m1_visual_aggregate}
          m3={data.field_calibration?.m3_visual_aggregate}
        />
      )}
    </div>
  )
}
