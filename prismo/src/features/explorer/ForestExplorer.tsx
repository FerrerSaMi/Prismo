import AnimatedSelect from '../../components/AnimatedSelect'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router'
import { COUNTRY_CODES, countryName, type CountryCode } from './countries'
import DashboardBuilder from './DashboardBuilder'
import { commonYears } from './forestAnalysis'
import { fetchForestSnapshot, ForestApiError } from './forestApi'
import ForestTable from './ForestTable'
import { indicatorInfo, isPercent } from './indicatorCatalog'
import AnimatedList from '../../components/AnimatedList'
import Stepper from '../../components/Stepper'
import LatticeLoader from '../../components/LatticeLoader'
import { withMinimumDuration } from './minimumDuration'

const numberFormat = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 3 })
const dateFormat = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
// Rango de consulta. La disponibilidad real depende del indicador y el país.
const yearOptions = Array.from({ length: 2024 - 1990 + 1 }, (_, index) => String(2024 - index))
type CountrySlot = CountryCode | ''

export default function ForestExplorer({ indicatorId = 'wb-forest-area-share' }: { indicatorId?: 'wb-forest-area-share' | 'wb-inflation' | 'wb-unemployment' | 'wb-renewable-share' }) {
  const info = indicatorInfo(indicatorId)
  const [slots, setSlots] = useState<CountrySlot[]>(['MEX', 'BRA', '', ''])
  const [from, setFrom] = useState('2000')
  const [to, setTo] = useState('2024')
  const [formError, setFormError] = useState('')
  const [selection, setSelection] = useState<{ countries: CountryCode[]; from: string; to: string } | null>(null)
  const query = useQuery({
    queryKey: [indicatorId, selection?.countries.join(','), selection?.from, selection?.to],
    queryFn: ({ signal }) => withMinimumDuration(() => fetchForestSnapshot(selection!.countries, selection!.from, selection!.to, signal, indicatorId)),
    enabled: selection !== null,
    staleTime: 60 * 60 * 1000,
    retry: false,
  })

  function changeSlot(index: number, value: CountrySlot) {
    setSlots(current => current.map((item, position) => position === index ? value : item))
    setFormError('')
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const countries = slots.filter((code): code is CountryCode => code !== '')
    if (countries.length === 0 || new Set(countries).size !== countries.length) { setFormError('Elige países distintos de las listas disponibles.'); return }
    if (Number(from) > Number(to)) { setFormError('El año inicial debe ser anterior o igual al final.'); return }
    setFormError('')
    setSelection({ countries, from, to })
  }

  const snapshot = selection ? query.data : undefined
  const hasValues = snapshot?.observations.some(item => item.value !== null)
  const sharedYear = snapshot ? commonYears(snapshot)[0] : undefined
  const comparisonValues = snapshot && sharedYear ? snapshot.query.geographies.map(code => ({ code, value: snapshot.observations.find(item => item.geographyId === code && item.period === sharedYear)?.value })).filter((item): item is { code: string; value: number } => item.value != null).sort((a, b) => b.value - a.value) : []
  const bankUnavailable = query.error instanceof ForestApiError && (query.error.code === 'UPSTREAM_TIMEOUT' || query.error.code === 'UPSTREAM_UNAVAILABLE')

  return <section className="shell page forest-page" aria-labelledby="forest-title">
    <NavLink className="back-link" to="/explorar">← Volver a las categorías</NavLink>
    <h1 id="forest-title">{info.label}: compara países</h1>
    <p className="source-banner"><strong>Fuente oficial</strong> Banco Mundial · Indicador {info.providerId}</p>
    <p className="page-intro">Selecciona países y un periodo del catálogo verificado. Primero revisarás los datos oficiales de {info.short}; después podrás configurar dashboards y elegir cuáles llevar al reporte.</p>
    <Stepper step={snapshot ? 2 : 1} />

    <form className="forest-filters" onSubmit={applyFilters} aria-label={`Seleccionar países y años de ${info.short}`}>
      <div className="query-step"><span className="step-number">01</span><div><strong>Elige qué consultar</strong><p>Las opciones disponibles evitan códigos o años escritos incorrectamente.</p></div></div>
      <div className="country-select-grid">{slots.map((code, index) => <div key={index}><label htmlFor={`country-${index}`}>{['País principal', 'Comparar con', 'Tercer país', 'Cuarto país'][index]}</label><AnimatedSelect id={`country-${index}`} value={code} onChange={event => changeSlot(index, event.target.value as CountrySlot)}>{index > 0 && <option value="">Ninguno</option>}{COUNTRY_CODES.map(option => <option key={option} value={option} disabled={slots.some((selected, position) => position !== index && selected === option)}>{countryName(option)}</option>)}</AnimatedSelect></div>)}</div>
      <div className="year-filters"><div><label htmlFor="forest-from">Desde</label><AnimatedSelect id="forest-from" value={from} onChange={event => { const value = event.target.value; setFrom(value); if (Number(value) > Number(to)) setTo(value) }}>{yearOptions.map(year => <option value={year} key={year}>{year}</option>)}</AnimatedSelect></div>
      <div><label htmlFor="forest-to">Hasta</label><AnimatedSelect id="forest-to" value={to} onChange={event => { const value = event.target.value; setTo(value); if (Number(value) < Number(from)) setFrom(value) }}>{yearOptions.map(year => <option value={year} key={year}>{year}</option>)}</AnimatedSelect></div>
      <button className="button button-primary" type="submit">Consultar datos oficiales →</button></div>
      <p className="filter-note">Rango consultable: 1990–2024. La disponibilidad varía por indicador y país; los periodos sin observación se muestran como «Sin dato».</p>
    </form>
    {formError && <p className="form-error" role="alert">{formError}</p>}

    {selection && query.isPending && <div className="result-state"><LatticeLoader label="Consultando la fuente oficial" /></div>}
    {selection && query.isError && <div className="result-state error-state" role="alert"><h2>{bankUnavailable ? 'El Banco Mundial no responde por ahora' : 'No pudimos consultar este indicador'}</h2><p>{bankUnavailable ? 'No recibimos respuesta de la fuente oficial. Intenta de nuevo más tarde.' : query.error.message}</p><button type="button" className="button button-secondary" onClick={() => query.refetch()}>Reintentar consulta</button></div>}

    {snapshot && <>
      <div className="result-intro"><div><p className="eyebrow">Paso 1 · revisa la consulta</p><h2>Datos encontrados</h2><p>{snapshot.query.geographies.map(countryName).join(' · ')} · {snapshot.query.from}–{snapshot.query.to} · {snapshot.unit}</p></div>{hasValues && <a className="button button-secondary" href="#dashboard-editor">Ir al editor de dashboards ↓</a>}</div>
      {hasValues ? <>
        <AnimatedList className="country-kpis" label="Último valor disponible por país" animation="pop">{snapshot.query.geographies.map(code => { const latest = snapshot.observations.find(item => item.geographyId === code && item.value !== null); return <div className="country-kpi" key={code}><span>{countryName(code)}</span><strong>{latest?.value == null ? 'Sin dato' : `${numberFormat.format(latest.value)}${isPercent(snapshot) ? ' %' : ''}`}</strong><small>{latest ? `Última observación: ${latest.period}` : 'Sin observaciones publicadas'}</small></div> })}</AnimatedList>
        {comparisonValues.length > 1 && <div className="comparison-fact"><span>Lectura directa · {sharedYear}</span><strong>{countryName(comparisonValues[0].code)}: {numberFormat.format(comparisonValues[0].value)} % · {countryName(comparisonValues[comparisonValues.length - 1].code)}: {numberFormat.format(comparisonValues[comparisonValues.length - 1].value)} %</strong><p>Diferencia entre el mayor y el menor valor: {numberFormat.format(comparisonValues[0].value - comparisonValues[comparisonValues.length - 1].value)} puntos porcentuales. Es una diferencia descriptiva, no explica sus causas.</p></div>}
        <section className="results-section" aria-labelledby="table-title"><div className="section-heading"><div><p className="eyebrow">Valores observados</p><h2 id="table-title">Tabla de la consulta</h2></div></div><p>«Sin dato» indica que la fuente no publicó observación para ese país y año; no representa cero.</p><ForestTable snapshot={snapshot} /></section>
      </> : <div className="result-state" role="status">La fuente no publicó valores para esta selección. Prueba otro periodo o país.</div>}
      <section className="provenance" aria-labelledby="source-title"><p className="eyebrow">Procedencia</p><h2 id="source-title">De dónde vienen estos datos</h2><dl><div><dt>Organismo y fuente</dt><dd>{snapshot.attribution}</dd></div><div><dt>Indicador</dt><dd>{info.providerId} · {info.label}</dd></div><div><dt>Frecuencia y cobertura</dt><dd>Anual · {snapshot.query.geographies.map(countryName).join(', ')} · datos nacionales</dd></div><div><dt>Periodo solicitado</dt><dd>{snapshot.query.from}–{snapshot.query.to}</dd></div><div><dt>Última observación disponible</dt><dd>{snapshot.latestObservationPeriod ?? 'No informada'}</dd></div><div><dt>Actualización publicada por la fuente</dt><dd>{snapshot.sourcePublishedAt ? dateFormat.format(new Date(snapshot.sourcePublishedAt)) : 'No informada'}</dd></div><div><dt>Consulta realizada</dt><dd>{dateFormat.format(new Date(snapshot.fetchedAt))}</dd></div></dl><a href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer">Ver respuesta original del Banco Mundial ↗</a></section>
      {hasValues && <DashboardBuilder key={snapshot.snapshotId} snapshot={snapshot} />}
    </>}
  </section>
}
