import type { DatasetSnapshot } from '../../domain/contracts'
import { countryName } from './countries'
import type { TableTheme } from './dashboardConfig'
import { indicatorInfo, isPercent } from './indicatorCatalog'

const numberFormat = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 3 })

export default function ForestTable({ snapshot, countries = snapshot.query.geographies, periods, theme = 'sand', headerColor }: { snapshot: DatasetSnapshot; countries?: string[]; periods?: string[]; theme?: TableTheme; headerColor?: string }) {
  const years = periods ?? [...new Set(snapshot.observations.map(item => item.period))].sort((a, b) => b.localeCompare(a))
  return <div className={`table-scroll table-theme-${theme}`} style={headerColor ? { '--table-color': headerColor } as React.CSSProperties : undefined} tabIndex={0} role="region" aria-label="Tabla comparativa de superficie forestal, desplazable"><table>
    <caption>{indicatorInfo(snapshot.indicatorId).label}, {snapshot.query.from} a {snapshot.query.to}, {snapshot.unit}</caption>
    <thead><tr><th scope="col">Año</th>{countries.map(code => <th scope="col" key={code}>{countryName(code)}</th>)}</tr></thead>
    <tbody>{years.map(year => <tr key={year}><th scope="row">{year}</th>{countries.map(code => { const item = snapshot.observations.find(observation => observation.period === year && observation.geographyId === code); return <td key={code}>{item?.value == null ? 'Sin dato' : `${numberFormat.format(item.value)}${isPercent(snapshot) ? ' %' : ''}`}</td> })}</tr>)}</tbody>
  </table></div>
}
