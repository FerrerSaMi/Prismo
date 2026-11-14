import AnimatedSelect from '../../components/AnimatedSelect'
import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { NavLink, useParams } from 'react-router'
import { datasetSnapshotSchema } from '../../domain/contracts'
import { INEGI_AREAS, countryName } from './countries'
import DashboardBuilder from './DashboardBuilder'
import ForestTable from './ForestTable'
import { indicatorInfo } from './indicatorCatalog'
import Stepper from '../../components/Stepper'
import LatticeLoader from '../../components/LatticeLoader'
import { withMinimumDuration } from './minimumDuration'

const settings = {
  poblacion: { id: 'inegi-migration-share', category: 'Población', title: 'Población inmigrante (migración reciente)', description: 'Porcentaje de población inmigrante. Compara estados o el valor nacional en periodos publicados por INEGI.', years: ['2010', '2015', '2020', '2025'] },
  vivienda: { id: 'inegi-water-share', category: 'Vivienda', title: 'Viviendas con agua entubada', description: 'Porcentaje de viviendas con agua entubada. Compara estados o el valor nacional sin convertir periodos ausentes en cero.', years: ['2010', '2015', '2020', '2025'] },
  empresas: { id: 'inegi-economic-units', category: 'Empresas', title: 'Unidades económicas del sector privado y paraestatal', description: 'Conteo de unidades económicas por territorio. No representa nuevas empresas ni equivale a empleo.', years: ['2013', '2018'] },
  educacion: { id: 'inegi-youth-literacy', category: 'Educación', title: 'Tasa de alfabetización de 15 a 24 años', description: 'Tasa de alfabetización juvenil por territorio y periodo publicado por INEGI.', years: ['2010', '2015', '2020', '2025'] },
} as const
const areas = Object.entries(INEGI_AREAS)

export default function InegiExplorer() {
  const { topic } = useParams()
  const config = settings[topic as keyof typeof settings]
  const [slots, setSlots] = useState(['00', '09', '', ''])
  const [from, setFrom] = useState<string>(config?.years[0] ?? '2010')
  const [to, setTo] = useState<string>(config?.years.at(-1) ?? '2025')
  const [selection, setSelection] = useState<{ areas: string[]; from: string; to: string } | null>(null)
  const query = useQuery({ queryKey: ['inegi', config?.id, selection], enabled: !!config && !!selection, retry: false, queryFn: ({ signal }) => withMinimumDuration(async () => {
    const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
    const params = new URLSearchParams({ geography: selection!.areas.join(','), from: selection!.from, to: selection!.to })
    let response: Response
    try { response = await fetch(`${base}/api/v1/indicators/${config.id}/observations?${params}`, { signal }) } catch { throw new Error('No se pudo conectar con Prismo. Revisa tu conexión.') }
    const payload: unknown = await response.json().catch(() => null)
    if (!response.ok) throw new Error(typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : 'No se pudo consultar INEGI.')
    const parsed = datasetSnapshotSchema.safeParse(payload)
    if (!parsed.success) throw new Error('La respuesta de INEGI no tiene el formato esperado.')
    return parsed.data
  }) })
  if (!config) return <section className="shell page" role="alert">Indicador no disponible.</section>
  const years = config.years
  function submit(event: FormEvent) { event.preventDefault(); setSelection({ areas: slots.filter(Boolean), from, to }) }
  const snapshot = query.data
  return <section className="shell page forest-page" aria-labelledby="inegi-title"><NavLink className="back-link" to="/explorar">← Volver a las categorías</NavLink><h1 id="inegi-title">{config.title}</h1><p className="source-banner"><strong>Fuente oficial</strong> INEGI · Banco de Indicadores · {indicatorInfo(config.id).providerId}</p><p className="page-intro">{config.description}</p><Stepper step={snapshot ? 2 : 1} />
    <form className="forest-filters" onSubmit={submit}><div className="country-select-grid">{slots.map((code, index) => <div key={index}><label htmlFor={`inegi-area-${index}`}>{['Territorio principal', 'Comparar con', 'Tercer territorio', 'Cuarto territorio'][index]}</label><AnimatedSelect id={`inegi-area-${index}`} value={code} onChange={event => setSlots(current => current.map((item, i) => i === index ? event.target.value : item))}>{index > 0 && <option value="">Ninguno</option>}{areas.map(([value, label]) => <option key={value} value={value} disabled={slots.some((item, i) => i !== index && item === value)}>{label}</option>)}</AnimatedSelect></div>)}</div><div className="year-filters"><div><label htmlFor="inegi-from">Desde</label><AnimatedSelect id="inegi-from" value={from} onChange={event => { const value = event.target.value; setFrom(value); if (value > to) setTo(value) }}>{years.map(year => <option key={year}>{year}</option>)}</AnimatedSelect></div><div><label htmlFor="inegi-to">Hasta</label><AnimatedSelect id="inegi-to" value={to} onChange={event => setTo(event.target.value)}>{years.filter(year => year >= from).map(year => <option key={year}>{year}</option>)}</AnimatedSelect></div><button className="button button-primary" type="submit">Consultar INEGI →</button></div><p className="filter-note">Se ofrecen extremos de periodo verificados; algunos territorios no tienen observación en todos ellos.</p></form>
    {selection && query.isPending && <div className="result-state"><LatticeLoader label="Consultando INEGI" /></div>}
    {query.isError && <div className="result-state error-state" role="alert"><h2>No pudimos consultar INEGI</h2><p>{query.error.message}</p><button className="button button-secondary" type="button" onClick={() => void query.refetch()}>Reintentar consulta</button></div>}
    {snapshot && <><div className="result-intro"><div><p className="eyebrow">Datos oficiales</p><h2>Consulta verificada</h2><p>{snapshot.query.geographies.map(countryName).join(' · ')} · {snapshot.query.from}–{snapshot.query.to} · {snapshot.unit}</p></div><a className="button button-secondary" href="#dashboard-editor">Ir a los dashboards ↓</a></div><section className="results-section"><h2>Valores observados</h2><ForestTable snapshot={snapshot} /></section><section className="provenance"><h2>Procedencia</h2><p>{snapshot.attribution} · Indicador {indicatorInfo(config.id).providerId} · Consulta {new Date(snapshot.fetchedAt).toLocaleString('es-MX')}.</p><a href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer">Documentación oficial de la API ↗</a></section>{snapshot.observations.some(item => item.value !== null) && <DashboardBuilder key={snapshot.snapshotId} snapshot={snapshot} />}</>}
  </section>
}
