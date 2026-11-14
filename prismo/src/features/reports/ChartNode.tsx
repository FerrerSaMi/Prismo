import AnimatedSelect from '../../components/AnimatedSelect'
import { useContext, useState, type CSSProperties } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { chartSpecSchema, type ChartSpec } from '../../domain/contracts'
import { countryName } from '../explorer/countries'
import { ComparisonChart, TrendChart } from '../explorer/ForestCharts'
import ForestTable from '../explorer/ForestTable'
import MetricCards from '../explorer/MetricCards'
import { ReportSources } from './reportContext'
import ColorMenu from '../../components/ColorMenu'
import CardNav from '../../components/CardNav'
import HoldButton from '../../components/HoldButton'

export default function ChartBlock({ node, editor, getPos, updateAttributes, deleteNode }: NodeViewProps) {
  const [open, setOpen] = useState(false)
  const [width, setWidth] = useState<number | null>(null)
  const sources = useContext(ReportSources)
  const snapshot = sources.find(item => item.snapshotId === node.attrs.snapshotId)
  const parsedSpec = chartSpecSchema.safeParse(node.attrs.spec)
  const spec = parsedSpec.success ? parsedSpec.data : null
  const kind = spec?.kind ?? node.attrs.kind as string
  const year = spec?.kind === 'bar' ? spec.visiblePeriods[0] : node.attrs.year as string
  if (!snapshot) return <NodeViewWrapper className="report-chart-block"><p>La instantánea de este gráfico no está disponible.</p></NodeViewWrapper>
  if (node.attrs.spec != null && !spec) return <NodeViewWrapper className="report-chart-block"><p>La configuración guardada de esta vista no es válida.</p></NodeViewWrapper>
  if (spec && (!spec.snapshotIds.includes(snapshot.snapshotId) || spec.selectedGeographies.some(code => !snapshot.query.geographies.includes(code)) || spec.visiblePeriods.some(period => !snapshot.observations.some(item => item.period === period)))) {
    return <NodeViewWrapper className="report-chart-block"><p>Esta vista no coincide con los datos guardados del reporte.</p></NodeViewWrapper>
  }
  const selected = spec?.selectedGeographies ?? snapshot.query.geographies
  const countries = selected.map(countryName).join(' · ')
  const chartFont = ({ serif: 'Georgia', mono: 'Courier New', verdana: 'Verdana', times: 'Times New Roman' } as Record<string, string>)[spec?.fontFamily ?? 'sans'] ?? 'Arial'
  const scale = (width ?? spec?.widthPercent ?? 100) / 100
  const chartFontSize = Math.max(10, Math.round((spec?.fontSizePx ?? (spec?.fontSize === 'small' ? 11 : spec?.fontSize === 'large' ? 16 : 13)) * scale))
  function updateSpec(changes: Partial<ChartSpec>) { if (spec) updateAttributes({ spec: { ...spec, ...changes } }) }
  function nodePosition() {
    let found: number | undefined
    editor.state.doc.forEach((block, offset) => {
      if (block.type.name === 'evidenceChart' && block.attrs.spec?.id === spec?.id) found = offset
    })
    return found ?? getPos()
  }
  function move(direction: -1 | 1) {
    const position = nodePosition()
    if (position === undefined) return
    const blocks: { pos: number; size: number; type: string }[] = []
    editor.state.doc.forEach((block, offset) => blocks.push({ pos: offset, size: block.nodeSize, type: block.type.name }))
    const index = blocks.findIndex(block => block.pos === position)
    const neighbor = direction < 0
      ? blocks.slice(0, index).reverse().find(block => block.type === 'evidenceChart') ?? blocks[index - 1]
      : blocks.slice(index + 1).find(block => block.type === 'evidenceChart') ?? blocks[index + 1]
    if (!neighbor) return
    editor.chain().focus().command(({ tr, dispatch }) => {
      const current = tr.doc.nodeAt(position)
      if (!current) return false
      tr.delete(position, position + current.nodeSize)
      tr.insert(tr.mapping.map(direction < 0 ? neighbor.pos : neighbor.pos + neighbor.size), current)
      if (dispatch) dispatch(tr)
      return true
    }).run()
  }
  return <NodeViewWrapper className={`report-chart-block chart-font-${spec?.fontFamily ?? 'sans'} chart-align-${spec?.alignment ?? 'left'}`} style={{ width: `${width ?? spec?.widthPercent ?? 100}%`, fontSize: `${Math.max(10, Math.round((spec?.fontSizePx ?? 14) * scale))}px`, color: spec?.textColor ?? '#29231f', '--dashboard-height': `${Math.max(180, Math.round((spec?.heightPx ?? 360) * scale))}px` } as CSSProperties}>
    <div contentEditable={false}>
      {spec && <div className="chart-block-head"><span className="chart-drag-handle" title="Arrastra para mover" onPointerDown={event => { event.preventDefault(); const handle = event.currentTarget; const from = nodePosition(); if (from === undefined) return; handle.setPointerCapture(event.pointerId); const end = (up: PointerEvent) => { const hit = editor.view.posAtCoords({ left: up.clientX, top: up.clientY }); if (hit) { const resolved = editor.state.doc.resolve(hit.pos); const target = resolved.depth ? resolved.before(1) : hit.pos; const block = editor.state.doc.nodeAt(from); if (block && target !== from) { const tr = editor.state.tr.delete(from, from + block.nodeSize); tr.insert(tr.mapping.map(target), block); editor.view.dispatch(tr) } } handle.removeEventListener('pointerup', end) }; handle.addEventListener('pointerup', end) }}>⋮⋮ Mover</span><button type="button" aria-expanded={open} aria-label={`Opciones de ${spec.title}`} onClick={() => setOpen(value => !value)}>Editar dashboard {open ? '▴' : '▾'}</button></div>}
      {spec && open && <div className="chart-edit-controls" aria-label={`Editar ${spec.title}`}>
        <CardNav className="chart-settings-group" title="Contenido y tamaño" panelClassName="chart-settings-body" defaultOpen>
        <label>Título<input aria-label="Título del dashboard" value={spec.title} onChange={event => { if (event.target.value.trim()) updateSpec({ title: event.target.value }) }} /></label>
        <label>Alineación<AnimatedSelect aria-label="Alineación del dashboard" value={spec.alignment ?? 'left'} onChange={event => updateSpec({ alignment: event.target.value as ChartSpec['alignment'] })}><option value="left">Izquierda</option><option value="center">Centro</option><option value="right">Derecha</option></AnimatedSelect></label>
        <label>Alto del dashboard · {spec.heightPx ?? 360} px<input type="range" aria-label="Alto del dashboard en el reporte" min="180" max="620" step="20" value={spec.heightPx ?? 360} onChange={event => updateSpec({ heightPx: Number(event.target.value) })} /></label>
        </CardNav>
        <CardNav className="chart-settings-group" title="Tipografía y colores" panelClassName="chart-settings-body">
        <label>Fuente<AnimatedSelect aria-label="Fuente del dashboard" value={spec.fontFamily ?? 'sans'} onChange={event => updateSpec({ fontFamily: event.target.value as ChartSpec['fontFamily'] })}><option value="sans">Sans</option><option value="serif">Serif</option><option value="mono">Mono</option><option value="arial">Arial</option><option value="verdana">Verdana</option><option value="times">Times New Roman</option></AnimatedSelect></label>
        <ColorMenu label="Color del texto" hexLabel="Color hexadecimal del dashboard" value={spec.textColor ?? '#29231f'} onChange={value => updateSpec({ textColor: value })} />
        <label>Fuente del título<AnimatedSelect aria-label="Fuente del título del dashboard" value={spec.titleFontFamily ?? spec.fontFamily ?? 'sans'} onChange={event => updateSpec({ titleFontFamily: event.target.value as ChartSpec['fontFamily'] })}><option value="sans">Sans</option><option value="serif">Serif</option><option value="mono">Mono</option><option value="arial">Arial</option><option value="verdana">Verdana</option><option value="times">Times New Roman</option></AnimatedSelect></label><ColorMenu label="Color del título" hexLabel="Hexadecimal del título" value={spec.titleColor ?? spec.textColor ?? '#29231f'} onChange={value => updateSpec({ titleColor: value })} /><label>Fuente del subtítulo<AnimatedSelect aria-label="Fuente del subtítulo del dashboard" value={spec.subtitleFontFamily ?? spec.fontFamily ?? 'sans'} onChange={event => updateSpec({ subtitleFontFamily: event.target.value as ChartSpec['fontFamily'] })}><option value="sans">Sans</option><option value="serif">Serif</option><option value="mono">Mono</option><option value="arial">Arial</option><option value="verdana">Verdana</option><option value="times">Times New Roman</option></AnimatedSelect></label><ColorMenu label="Color del subtítulo" hexLabel="Hexadecimal del subtítulo" value={spec.subtitleColor ?? spec.textColor ?? '#29231f'} onChange={value => updateSpec({ subtitleColor: value })} /><label>Letra (px)<input type="number" aria-label="Tamaño de letra del dashboard" min="10" max="28" value={spec.fontSizePx ?? 14} onChange={event => updateSpec({ fontSizePx: Math.max(10, Math.min(28, Number(event.target.value) || 10)) })} /></label>
        </CardNav>
        <CardNav className="chart-settings-group" title="Series y acciones" panelClassName="chart-settings-body">
        {kind === 'table' ? <ColorMenu label="Color de tabla" hexLabel="Hexadecimal de la tabla" value={spec.tableColor ?? '#5c4635'} onChange={value => updateSpec({ tableColor: value })} /> : selected.map(code => <ColorMenu key={code} label={`Color de ${countryName(code)}`} hexLabel={`Hexadecimal de ${countryName(code)}`} value={spec.seriesColors?.[code] ?? '#5c4635'} onChange={value => updateSpec({ seriesColors: { ...spec.seriesColors, [code]: value } })} />)}
        <div className="chart-block-actions"><button type="button" onClick={() => move(-1)}>↑ Subir</button><button type="button" onClick={() => move(1)}>↓ Bajar</button><HoldButton label="Eliminar dashboard" onHold={deleteNode} holdTime={1200}>Mantener para eliminar</HoldButton></div>
        </CardNav>
      </div>}
      <p className="eyebrow">Evidencia guardada · {kind === 'bar' ? 'comparación' : kind === 'table' ? 'tabla' : kind === 'kpi' ? 'valor' : kind === 'delta' ? 'cambio' : 'tendencia'}</p>
      <h3 className={`chart-font-${spec?.titleFontFamily ?? spec?.fontFamily ?? 'sans'}`} style={{ color: spec?.titleColor ?? spec?.textColor }}>{spec?.title ?? `Superficie forestal ${kind === 'bar' ? `en ${year}` : 'en el tiempo'}`}</h3>
      <p className={`chart-font-${spec?.subtitleFontFamily ?? spec?.fontFamily ?? 'sans'}`} style={{ color: spec?.subtitleColor ?? spec?.textColor }}>{countries} · {snapshot.query.from}–{snapshot.query.to} · {snapshot.unit}{kind === 'line' ? ' · escala vertical ajustada al rango observado' : ''}</p>
      {kind === 'bar' ? <ComparisonChart snapshot={snapshot} year={year} countries={selected} colors={spec?.seriesColors} showValues={spec?.showValues} fontFamily={chartFont} fontSize={chartFontSize} textColor={spec?.textColor} /> : kind === 'table' ? <ForestTable snapshot={snapshot} countries={selected} periods={spec?.visiblePeriods} theme={spec?.tableTheme} headerColor={spec?.tableColor} /> : (kind === 'kpi' || kind === 'delta') && spec ? <MetricCards snapshot={snapshot} kind={kind} countries={selected} periods={spec.visiblePeriods} colors={spec.seriesColors} /> : <TrendChart snapshot={snapshot} countries={selected} colors={spec?.seriesColors} showPoints={spec?.showPoints} fontFamily={chartFont} fontSize={chartFontSize} textColor={spec?.textColor} />}
      <p className="chart-source">Fuente: {snapshot.attribution}. Indicador {snapshot.methodologyKey ?? snapshot.indicatorId}. Consulta: {new Date(snapshot.fetchedAt).toLocaleString('es-MX')}</p>
      <a href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer">{snapshot.provider === 'inegi-indicators' ? 'Ver documentación oficial de la fuente ↗' : 'Abrir datos originales ↗'}</a>
      {spec && <div className="chart-resize" role="slider" aria-label="Anchura del dashboard" aria-valuemin={35} aria-valuemax={100} aria-valuenow={width ?? spec.widthPercent ?? 100} tabIndex={0} onKeyDown={event => { const next = Math.max(35, Math.min(100, (spec.widthPercent ?? 100) + (event.key === 'ArrowLeft' ? -5 : event.key === 'ArrowRight' ? 5 : 0))); if (next !== (spec.widthPercent ?? 100)) updateSpec({ widthPercent: next }) }} onPointerDown={event => { event.preventDefault(); const handle = event.currentTarget; const block = handle.closest('.report-chart-block') as HTMLElement; const parentWidth = block.parentElement?.clientWidth ?? block.clientWidth; const startX = event.clientX; const startWidth = block.getBoundingClientRect().width; handle.setPointerCapture(event.pointerId); const move = (moveEvent: PointerEvent) => setWidth(Math.max(35, Math.min(100, Math.round((startWidth + moveEvent.clientX - startX) / parentWidth * 100)))); const end = (endEvent: PointerEvent) => { const next = Math.max(35, Math.min(100, Math.round((startWidth + endEvent.clientX - startX) / parentWidth * 100))); updateSpec({ widthPercent: next }); setWidth(null); handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', end) }; handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', end) }}>◢</div>}
    </div>
  </NodeViewWrapper>
}
