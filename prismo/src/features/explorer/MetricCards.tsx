import type { DatasetSnapshot } from '../../domain/contracts'
import { countryName } from './countries'
import { isPercent } from './indicatorCatalog'

const format = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })

export default function MetricCards({ snapshot, kind, countries, periods, colors = {} }: { snapshot: DatasetSnapshot; kind: 'kpi' | 'delta'; countries: string[]; periods: string[]; colors?: Record<string, string> }) {
  const current = kind === 'delta' ? periods[1] : periods[0]
  const baseline = kind === 'delta' ? periods[0] : undefined
  return <div className="metric-grid">{countries.map(code => {
    const latest = snapshot.observations.find(item => item.geographyId === code && item.period === current)?.value
    const previous = baseline ? snapshot.observations.find(item => item.geographyId === code && item.period === baseline)?.value : undefined
    const change = latest != null && previous != null ? latest - previous : null
    return <article className="metric-card" key={code} style={{ borderTopColor: colors[code] ?? '#5c4635' }}><small>{countryName(code)}</small><strong>{kind === 'kpi' ? latest == null ? 'Sin dato' : `${format.format(latest)}${isPercent(snapshot) ? ' %' : ''}` : change == null ? 'Sin comparación' : `${change >= 0 ? '+' : ''}${format.format(change)}${isPercent(snapshot) ? ' pp' : ''}`}</strong><span>{kind === 'kpi' ? `Periodo ${current} · ${snapshot.unit}` : `${baseline} → ${current} · ${isPercent(snapshot) ? 'puntos porcentuales' : snapshot.unit}`}</span></article>
  })}</div>
}
