import AnimatedSelect from '../../components/AnimatedSelect'
import type { DatasetSnapshot } from '../../domain/contracts'
import ColorMenu from '../../components/ColorMenu'
import CardNav from '../../components/CardNav'
import { countryName } from './countries'
import { type DashboardDraft, type DashboardKind } from './dashboardConfig'

type Props = {
  active: DashboardKind
  draft: DashboardDraft
  snapshot: DatasetSnapshot
  year?: string
  baselineYear?: string
  available: string[]
  updateDraft: (kind: DashboardKind, changes: Partial<DashboardDraft>) => void
  toggleCountry: (code: string) => void
}

const fontOptions = <><option value="sans">Sans</option><option value="serif">Serif</option><option value="mono">Mono</option><option value="arial">Arial</option><option value="verdana">Verdana</option><option value="times">Times New Roman</option></>

export default function DashboardInspector({ active, draft, snapshot, year, baselineYear, available, updateDraft, toggleCountry }: Props) {
  const set = (changes: Partial<DashboardDraft>) => updateDraft(active, changes)
  return <aside className="studio-inspector" aria-label="Personalizar dashboard">
    <div className="inspector-heading"><p className="eyebrow">Personalizar</p><h3>{draft.title || 'Vista sin título'}</h3></div>
    <CardNav className="inspector-section" title="Contenido y tamaño" panelClassName="inspector-section-body" defaultOpen>
      <label className="inspector-field">Título de la vista<input id="dashboard-title" maxLength={80} value={draft.title} onChange={event => set({ title: event.target.value })} /></label>
      <label className="inspector-field">Alto del dashboard <output>{draft.heightPx} px</output><input type="range" aria-label="Alto del dashboard" min="180" max="620" step="20" value={draft.heightPx} onChange={event => set({ heightPx: Number(event.target.value) })} /></label>
      <label className="inspector-field">Tamaño de letra (px)<input type="number" min="10" max="28" value={draft.fontSizePx} onChange={event => set({ fontSizePx: Math.max(10, Math.min(28, Number(event.target.value) || 10)) })} /></label>
      <label className="inspector-field">Alineación<AnimatedSelect value={draft.alignment} onChange={event => set({ alignment: event.target.value as DashboardDraft['alignment'] })}><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></AnimatedSelect></label>
    </CardNav>
    <CardNav className="inspector-section" title="Tipografía y colores" panelClassName="inspector-section-body">
      <label className="inspector-field">Fuente general<AnimatedSelect aria-label="Fuente general" value={draft.fontFamily} onChange={event => set({ fontFamily: event.target.value as DashboardDraft['fontFamily'] })}>{fontOptions}</AnimatedSelect></label>
      <ColorMenu label="Color del texto" hexLabel="Color hexadecimal del texto de la vista" value={draft.textColor} onChange={value => set({ textColor: value })} />
      <label className="inspector-field">Fuente del título<AnimatedSelect value={draft.titleFontFamily} onChange={event => set({ titleFontFamily: event.target.value as DashboardDraft['fontFamily'] })}>{fontOptions}</AnimatedSelect></label>
      <ColorMenu label="Color del título" hexLabel="Hexadecimal del título" value={draft.titleColor} onChange={value => set({ titleColor: value })} />
      <label className="inspector-field">Fuente del subtítulo<AnimatedSelect value={draft.subtitleFontFamily} onChange={event => set({ subtitleFontFamily: event.target.value as DashboardDraft['fontFamily'] })}>{fontOptions}</AnimatedSelect></label>
      <ColorMenu label="Color del subtítulo" hexLabel="Hexadecimal del subtítulo" value={draft.subtitleColor} onChange={value => set({ subtitleColor: value })} />
    </CardNav>
    <CardNav className="inspector-section" title="Datos y series" panelClassName="inspector-section-body">
      <fieldset className="inspector-territories"><legend>Territorios visibles</legend>{snapshot.query.geographies.map(code => <label key={code}><input type="checkbox" checked={draft.selectedGeographies.includes(code)} disabled={draft.selectedGeographies.includes(code) && draft.selectedGeographies.length <= (active === 'bar' ? 2 : 1)} onChange={() => toggleCountry(code)} /> {countryName(code)}</label>)}</fieldset>
      {['bar', 'kpi', 'delta'].includes(active) && <label className="inspector-field">{active === 'delta' ? 'Periodo final' : 'Periodo a mostrar'}<AnimatedSelect value={year ?? ''} onChange={event => set({ year: event.target.value })} disabled={available.length === 0}>{available.length ? available.map(item => <option value={item} key={item}>{item}</option>) : <option value="">Sin periodo común</option>}</AnimatedSelect></label>}
      {active === 'delta' && <label className="inspector-field">Periodo inicial<AnimatedSelect value={baselineYear ?? ''} onChange={event => set({ baselineYear: event.target.value })} disabled={available.length < 2}>{available.filter(item => item !== year).map(item => <option value={item} key={item}>{item}</option>)}</AnimatedSelect></label>}
      {active !== 'table' && draft.selectedGeographies.map(code => <ColorMenu key={code} label={`Color de ${countryName(code)}`} hexLabel={`Hexadecimal de ${countryName(code)}`} value={draft.seriesColors[code] ?? '#5c4635'} onChange={value => set({ seriesColors: { ...draft.seriesColors, [code]: value } })} />)}
      {active === 'line' && <label className="inspector-toggle"><input type="checkbox" checked={draft.showPoints} onChange={event => set({ showPoints: event.target.checked })} /> Mostrar puntos por año</label>}
      {active === 'bar' && <label className="inspector-toggle"><input type="checkbox" checked={draft.showValues} onChange={event => set({ showValues: event.target.checked })} /> Mostrar valores en barras</label>}
      {active === 'table' && <><ColorMenu label="Color de cabecera" hexLabel="Hexadecimal de cabecera" value={draft.tableColor ?? '#5c4635'} onChange={value => set({ tableColor: value })} /><label className="inspector-field">Filas a mostrar<AnimatedSelect value={draft.tableRows} onChange={event => set({ tableRows: event.target.value as DashboardDraft['tableRows'] })}><option value="5">Últimos 5 años</option><option value="10">Últimos 10 años</option><option value="all">Todos los años consultados</option></AnimatedSelect></label></>}
    </CardNav>
  </aside>
}
