import { chartSpecSchema, type ChartSpec, type DatasetSnapshot } from '../../domain/contracts'
import { commonYears } from './forestAnalysis'
import { indicatorInfo } from './indicatorCatalog'

export const CHART_COLORS = [
  { value: '#5c4635', label: 'Café' },
  { value: '#a4482e', label: 'Terracota' },
  { value: '#3f655e', label: 'Verde petróleo' },
  { value: '#6656a4', label: 'Violeta' },
] as const

export type DashboardKind = 'line' | 'bar' | 'kpi' | 'delta' | 'table'
export type TableTheme = 'sand' | 'olive' | 'clay'
export type DashboardDraft = {
  kind: DashboardKind
  title: string
  selectedGeographies: string[]
  year: string
  baselineYear: string
  seriesColors: Record<string, string>
  tableTheme: TableTheme
  tableColor?: string
  tableRows: '5' | '10' | 'all'
  showPoints: boolean
  showValues: boolean
  fontFamily: 'sans' | 'serif' | 'mono' | 'arial' | 'verdana' | 'times'
  textColor: string
  titleColor: string
  subtitleColor: string
  titleFontFamily: DashboardDraft['fontFamily']
  subtitleFontFamily: DashboardDraft['fontFamily']
  fontSizePx: number
  heightPx: number
  alignment: 'left' | 'center' | 'right'
}

export function initialDashboardDrafts(snapshot: DatasetSnapshot): Record<DashboardKind, DashboardDraft> {
  const countries = snapshot.query.geographies
  const indicator = indicatorInfo(snapshot.indicatorId).short
  const periods = [...new Set(snapshot.observations.map(item => item.period))].sort((a, b) => b.localeCompare(a))
  const shared = commonYears(snapshot)
  const colors = Object.fromEntries(countries.map((code, index) => [code, CHART_COLORS[index % CHART_COLORS.length].value]))
  const base = { selectedGeographies: countries, year: shared[0] ?? periods[0] ?? '', baselineYear: shared[1] ?? periods[1] ?? periods[0] ?? '', seriesColors: colors, tableTheme: 'sand' as const, tableRows: '10' as const, showPoints: periods.length <= 15, showValues: true, fontFamily: 'sans' as const, textColor: '#29231f', titleColor: '#29231f', subtitleColor: '#51463d', titleFontFamily: 'sans' as const, subtitleFontFamily: 'sans' as const, fontSizePx: 14, heightPx: 360, alignment: 'left' as const }
  return {
    line: { ...base, kind: 'line', title: `Tendencia de ${indicator}` },
    bar: { ...base, kind: 'bar', title: snapshot.provider === 'world-bank' ? 'Comparación de países' : 'Comparación de territorios' },
    kpi: { ...base, kind: 'kpi', title: `Último valor de ${indicator}` },
    delta: { ...base, kind: 'delta', title: `Cambio de ${indicator}` },
    table: { ...base, kind: 'table', title: `Tabla de ${indicator}` },
  }
}

export function buildChartSpec(snapshot: DatasetSnapshot, draft: DashboardDraft): ChartSpec {
  const periods = [...new Set(snapshot.observations.map(item => item.period))].sort((a, b) => b.localeCompare(a))
  const tablePeriods = draft.tableRows === 'all' ? periods : periods.slice(0, Number(draft.tableRows))
  const visiblePeriods = draft.kind === 'bar' || draft.kind === 'kpi' ? [draft.year] : draft.kind === 'delta' ? [draft.baselineYear, draft.year] : draft.kind === 'table' ? tablePeriods : periods
  return chartSpecSchema.parse({
    id: crypto.randomUUID(), kind: draft.kind, title: draft.title.trim(), snapshotIds: [snapshot.snapshotId],
    selectedGeographies: draft.selectedGeographies, visiblePeriods,
    seriesColors: draft.seriesColors, tableTheme: draft.tableTheme, tableColor: draft.tableColor,
    showPoints: draft.showPoints, showValues: draft.showValues, fontFamily: draft.fontFamily, textColor: draft.textColor, titleColor: draft.titleColor, subtitleColor: draft.subtitleColor, titleFontFamily: draft.titleFontFamily, subtitleFontFamily: draft.subtitleFontFamily, fontSizePx: draft.fontSizePx, heightPx: draft.heightPx, alignment: draft.alignment,
  })
}
