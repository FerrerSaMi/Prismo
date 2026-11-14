import AnimatedSelect from '../../components/AnimatedSelect'
import { useState, type CSSProperties } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router'
import type { DatasetSnapshot } from '../../domain/contracts'
import { appendAnalysisToReport, createReport, reportDb } from '../reports/reportDb'
import { countryName } from './countries'
import { buildChartSpec, initialDashboardDrafts, type DashboardDraft, type DashboardKind } from './dashboardConfig'
import { commonYears } from './forestAnalysis'
import { ComparisonChart, TrendChart } from './ForestCharts'
import ForestTable from './ForestTable'
import MetricCards from './MetricCards'
import { indicatorInfo } from './indicatorCatalog'
import DashboardInspector from './DashboardInspector'
import AnimatedList from '../../components/AnimatedList'
import Stepper from '../../components/Stepper'
import HoloCard from '../../components/HoloCard'
import WarmTooltip, { WarmTooltipGroup } from '../../components/WarmTooltip'

const templateNames: Record<DashboardKind, string> = {
  line: 'Tendencia en el tiempo', bar: 'Comparación de territorios', kpi: 'Tarjetas de valor', delta: 'Cambio entre periodos', table: 'Tabla de valores',
}
const templateDescriptions: Record<DashboardKind, string> = {
  line: 'Cambios entre periodos', bar: 'Un periodo entre territorios', kpi: 'Última observación', delta: 'Diferencia en puntos', table: 'Valores exactos y faltantes',
}
const dashboardKinds: DashboardKind[] = ['line', 'bar', 'kpi', 'delta', 'table']

function DashboardCardArtwork({ kind }: { kind: DashboardKind }) {
  return <div className={`studio-page-art art-${kind}`} aria-hidden="true"><svg viewBox="0 0 120 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'line' && <><path d="M8 34 30 24 48 30 72 12 94 19 112 7" /><path d="M8 39h104" opacity=".3" /></>}
    {kind === 'bar' && <><rect x="12" y="26" width="17" height="13" rx="2" /><rect x="39" y="17" width="17" height="22" rx="2" /><rect x="66" y="10" width="17" height="29" rx="2" /><rect x="93" y="4" width="17" height="35" rx="2" /></>}
    {kind === 'kpi' && <><circle cx="31" cy="22" r="15" /><path d="M24 22h14M31 15v14M67 14h43M67 23h31M67 32h37" /></>}
    {kind === 'delta' && <><path d="M9 33h34l19-21 17 13h30M98 14l11 11-11 11" /><path d="M9 39h100" opacity=".3" /></>}
    {kind === 'table' && <><rect x="10" y="5" width="100" height="34" rx="3" /><path d="M10 16h100M10 27h100M45 5v34M78 5v34" /></>}
  </svg></div>
}

export default function DashboardBuilder({ snapshot }: { snapshot: DatasetSnapshot }) {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState(() => initialDashboardDrafts(snapshot))
  const [order, setOrder] = useState<DashboardKind[]>(dashboardKinds)
  const [active, setActive] = useState<DashboardKind>('line')
  const [selected, setSelected] = useState<DashboardKind[]>(() => snapshot.query.geographies.length > 1 && commonYears(snapshot).length > 0 ? ['line', 'bar'] : ['line'])
  const [reportTarget, setReportTarget] = useState('new')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const savedReports = useLiveQuery(() => reportDb.reports.orderBy('updatedAt').reverse().toArray())
  const draft = drafts[active]
  const available = commonYears(snapshot, draft.selectedGeographies)
  const year = available.includes(draft.year) ? draft.year : available[0]
  const baselineYear = available.includes(draft.baselineYear) && draft.baselineYear !== year ? draft.baselineYear : available.find(item => item !== year)
  const periods = [...new Set(snapshot.observations.map(item => item.period))].sort((a, b) => b.localeCompare(a))
  const tablePeriods = draft.tableRows === 'all' ? periods : periods.slice(0, Number(draft.tableRows))

  function updateDraft(kind: DashboardKind, changes: Partial<DashboardDraft>) {
    setDrafts(current => ({ ...current, [kind]: { ...current[kind], ...changes } }))
    setError('')
  }

  function toggleCountry(code: string) {
    const countries = draft.selectedGeographies.includes(code)
      ? draft.selectedGeographies.filter(item => item !== code)
      : snapshot.query.geographies.filter(item => draft.selectedGeographies.includes(item) || item === code)
    if (countries.length < (active === 'bar' ? 2 : 1)) return
    const shared = commonYears(snapshot, countries)
    updateDraft(active, { selectedGeographies: countries, year: shared.includes(draft.year) ? draft.year : shared[0] ?? '', baselineYear: shared.includes(draft.baselineYear) ? draft.baselineYear : shared[1] ?? '' })
  }

  function toggleSelected(kind: DashboardKind) {
    if (kind === 'bar' && !selected.includes('bar') && (drafts.bar.selectedGeographies.length < 2 || commonYears(snapshot, drafts.bar.selectedGeographies).length === 0)) {
      setError('La comparación necesita al menos dos países y un año con datos para ambos.')
      return
    }
    if (kind === 'delta' && !selected.includes('delta') && commonYears(snapshot, drafts.delta.selectedGeographies).length < 2) { setError('El cambio necesita dos periodos con datos para todos los territorios.'); return }
    setSelected(current => current.includes(kind) ? current.filter(item => item !== kind) : [...current, kind])
    setError('')
  }

  function moveView(kind: DashboardKind, direction: -1 | 1) {
    setOrder(current => {
      const index = current.indexOf(kind)
      const next = index + direction
      if (next < 0 || next >= current.length) return current
      const reordered = [...current]
      ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
      return reordered
    })
  }

  async function continueToReport() {
    const orderedSelected = order.filter(kind => selected.includes(kind))
    if (orderedSelected.length === 0) { setError('Selecciona al menos una vista para continuar.'); return }
    if (orderedSelected.some(kind => !drafts[kind].title.trim())) { setError('Cada vista seleccionada necesita un título.'); return }
    if (orderedSelected.includes('delta') && commonYears(snapshot, drafts.delta.selectedGeographies).length < 2) { setError('El cambio necesita dos periodos en común.'); return }
    if (orderedSelected.includes('bar') && (drafts.bar.selectedGeographies.length < 2 || commonYears(snapshot, drafts.bar.selectedGeographies).length === 0)) {
      setError('La comparación necesita un año con datos para todos los países elegidos.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const specs = orderedSelected.map(kind => {
        const choice = drafts[kind]
        const shared = commonYears(snapshot, choice.selectedGeographies)
        const chosenYear = shared.includes(choice.year) ? choice.year : shared[0] ?? ''
        return buildChartSpec(snapshot, { ...choice, year: chosenYear, baselineYear: shared.includes(choice.baselineYear) && choice.baselineYear !== chosenYear ? choice.baselineYear : shared.find(item => item !== chosenYear) ?? '' })
      })
      const reportId = reportTarget === 'new' ? await createReport(snapshot, specs) : reportTarget
      if (reportTarget !== 'new') await appendAnalysisToReport(reportId, snapshot, specs)
      navigate(`/reportes/${reportId}`)
    } catch {
      setError('No se pudo guardar esta selección. Revisa las opciones y el almacenamiento local e inténtalo de nuevo.')
      setSaving(false)
    }
  }

  return <section id="dashboard-editor" className="dashboard-builder" aria-labelledby="builder-title">
    <div className="builder-heading"><p className="eyebrow">Paso 2 · editor de dashboards</p><h2 id="builder-title">Diseña las vistas para tu reporte</h2></div>
    <Stepper step={2} className="builder-stepper" label="Progreso en el editor de dashboards" />
    <div className="studio-layout">
      <AnimatedList as="nav" className="studio-pages" label="Vistas del dashboard" animation="slide"><p className="eyebrow">Vistas disponibles</p>{order.map((kind, index) => {
        const choice = drafts[kind]
        const canInclude = kind === 'bar' ? choice.selectedGeographies.length > 1 && commonYears(snapshot, choice.selectedGeographies).length > 0 : kind === 'delta' ? commonYears(snapshot, choice.selectedGeographies).length > 1 : true
        return <HoloCard className={`studio-page ${active === kind ? 'is-active' : ''}`} active={active === kind} key={kind}>
          <DashboardCardArtwork kind={kind} />
          <button type="button" className="studio-page-open" aria-pressed={active === kind} onClick={() => setActive(kind)}><span className="studio-page-index">0{index + 1}</span><span><strong>{templateNames[kind]}</strong><small>{templateDescriptions[kind]}</small></span></button>
          <div className="studio-page-actions"><label><input type="checkbox" checked={selected.includes(kind)} disabled={!selected.includes(kind) && !canInclude} onChange={() => toggleSelected(kind)} /> Al reporte</label><WarmTooltipGroup><WarmTooltip content="Subir vista en el reporte"><button type="button" aria-label={`Subir ${templateNames[kind]}`} disabled={index === 0} onClick={() => moveView(kind, -1)}>↑</button></WarmTooltip><WarmTooltip content="Bajar vista en el reporte"><button type="button" aria-label={`Bajar ${templateNames[kind]}`} disabled={index === order.length - 1} onClick={() => moveView(kind, 1)}>↓</button></WarmTooltip></WarmTooltipGroup></div>
        </HoloCard>
      })}<p className="studio-help">Las flechas cambian el orden de las vistas seleccionadas en el reporte.</p></AnimatedList>

      <div id="studio-preview" className="studio-canvas" aria-label="Lienzo de vista previa"><div className="studio-canvas-top"><span>Vista previa · {templateNames[active]}</span><span>{selected.includes(active) ? 'Seleccionada para el reporte' : 'Solo vista previa'}</span></div><article className={`studio-artboard chart-font-${draft.fontFamily} chart-align-${draft.alignment}`} style={{ fontSize: `${draft.fontSizePx}px`, color: draft.textColor, '--dashboard-height': `${draft.heightPx}px` } as CSSProperties}><p className="eyebrow">{indicatorInfo(snapshot.indicatorId).label} · {snapshot.provider === 'world-bank' ? 'Banco Mundial' : 'INEGI'}</p><h3 className={`chart-font-${draft.titleFontFamily}`} style={{ color: draft.titleColor }}>{draft.title.trim() || 'Vista sin título'}</h3><p className={`chart-font-${draft.subtitleFontFamily}`} style={{ color: draft.subtitleColor }}>{draft.selectedGeographies.map(countryName).join(' · ')} · {snapshot.query.from}–{snapshot.query.to} · {snapshot.unit}</p><div className="studio-visual">{active === 'line' ? <TrendChart snapshot={snapshot} countries={draft.selectedGeographies} colors={draft.seriesColors} showPoints={draft.showPoints} fontFamily={draft.fontFamily} fontSize={draft.fontSizePx} textColor={draft.textColor} /> : active === 'bar' ? draft.selectedGeographies.length > 1 && year ? <ComparisonChart snapshot={snapshot} year={year} countries={draft.selectedGeographies} colors={draft.seriesColors} showValues={draft.showValues} fontFamily={draft.fontFamily} fontSize={draft.fontSizePx} textColor={draft.textColor} /> : <p>Consulta dos países con un año de datos en común para crear esta comparación.</p> : active === 'kpi' || active === 'delta' ? year && (active === 'kpi' || baselineYear) ? <MetricCards snapshot={snapshot} kind={active} countries={draft.selectedGeographies} periods={active === 'kpi' ? [year] : [baselineYear!, year]} colors={draft.seriesColors} /> : <p>No hay suficientes periodos en común para esta vista.</p> : <ForestTable snapshot={snapshot} countries={draft.selectedGeographies} periods={tablePeriods} theme={draft.tableTheme} headerColor={draft.tableColor} />}</div><p className="chart-source">Fuente: {snapshot.attribution}. Indicador {snapshot.methodologyKey ?? snapshot.indicatorId}. Consulta: {new Date(snapshot.fetchedAt).toLocaleString('es-MX')}</p><a className="studio-source-link" href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer">Ver datos originales ↗</a></article></div>

      <DashboardInspector active={active} draft={draft} snapshot={snapshot} year={year} baselineYear={baselineYear} available={available} updateDraft={updateDraft} toggleCountry={toggleCountry} />
    </div>
    <div className="builder-footer"><div><p className="eyebrow">Paso 3 · redacta</p><strong>{selected.length} {selected.length === 1 ? 'vista seleccionada' : 'vistas seleccionadas'}</strong><p>El reporte conservará el orden, título, países y estilo de cada vista.</p></div><div className="report-action"><label htmlFor="report-target">Enviar a</label><AnimatedSelect id="report-target" value={reportTarget} onChange={event => setReportTarget(event.target.value)}><option value="new">Nuevo reporte</option>{savedReports?.map(report => <option value={report.reportId} key={report.reportId}>{report.title}</option>)}</AnimatedSelect><button type="button" className="button button-primary" disabled={saving} onClick={() => void continueToReport()}>{saving ? 'Guardando…' : 'Continuar al editor del reporte →'}</button></div></div>
    {error && <p className="form-error" role="alert">{error}</p>}
  </section>
}
