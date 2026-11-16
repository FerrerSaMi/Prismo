import AnimatedSelect from '../../components/AnimatedSelect'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { JSONContent } from '@tiptap/react'
import type { ReportDocument } from '../../domain/contracts'
import { EvidenceChartNode } from './evidenceChart'
import { ReportSources } from './reportContext'
import { reportDb, saveReport } from './reportDb'
import { countryName } from '../explorer/countries'
import { buildChartSpec, initialDashboardDrafts, type DashboardKind } from '../explorer/dashboardConfig'
import { commonYears } from '../explorer/forestAnalysis'
import { indicatorInfo } from '../explorer/indicatorCatalog'
import { TextAlignment, type Alignment } from './textAlignment'
import { PrismoTextStyle } from './textStyle'
import { PageBreaks, setPageBreaks, type PageBreak } from './pageBreaks'
import { createReportPdfBlob, downloadReportPdf, savePdfBlob } from './pdfExport'
import ColorMenu from '../../components/ColorMenu'
import AnimatedList from '../../components/AnimatedList'
import Stepper from '../../components/Stepper'
import CardNav from '../../components/CardNav'
import EditorToolButton from '../../components/EditorToolButton'
import { WarmTooltipGroup } from '../../components/WarmTooltip'
import HoldButton from '../../components/HoldButton'

function usedSnapshotIds(node: JSONContent): string[] {
  const own = node.type === 'evidenceChart' && typeof node.attrs?.snapshotId === 'string' ? [node.attrs.snapshotId] : []
  return [...own, ...(node.content ?? []).flatMap(usedSnapshotIds)]
}

const PAGE_HEIGHT = 1122
const PAGE_TOP = 76
const PAGE_CONTENT_BOTTOM = 1000
const STAMP_TOP = 1030

function DocumentEditor({ initial }: { initial: ReportDocument }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(initial.title)
  const [json, setJson] = useState<JSONContent>(initial.editorJson as JSONContent)
  const [sources, setSources] = useState(initial.sources)
  const [dirty, setDirty] = useState(false)
  const changeVersion = useRef(0)
  const paperRef = useRef<HTMLDivElement>(null)
  const formatPanelRef = useRef<HTMLDivElement>(null)
  const formatToggleRef = useRef<HTMLButtonElement>(null)
  const previewCloseRef = useRef<HTMLButtonElement>(null)
  const styledSelection = useRef<{ from: number; to: number } | null>(null)
  const [insertMenu, setInsertMenu] = useState(false)
  const [caret, setCaret] = useState<{ top: number; left: number } | null>(null)
  const [saveState, setSaveState] = useState('Guardado localmente')
  const [fontFamily, setFontFamily] = useState(initial.typography?.fontFamily ?? 'sans')
  const [fontSize, setFontSize] = useState(initial.typography?.fontSize ?? 'normal')
  const [fontSizePx, setFontSizePx] = useState(initial.typography?.fontSizePx ?? 14)
  const [titleColor, setTitleColor] = useState(initial.typography?.titleColor ?? '#29231f')
  const [titleFontFamily, setTitleFontFamily] = useState(initial.typography?.titleFontFamily ?? 'sans')
  const [exporting, setExporting] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [toolbarOpen, setToolbarOpen] = useState(false)
  const [toolbarGroup, setToolbarGroup] = useState<'text' | 'title' | null>(null)
  const [exportError, setExportError] = useState('')
  const [selectionColor, setSelectionColor] = useState('#29231f')
  const [pageCount, setPageCount] = useState(1)
  useEffect(() => {
    if (!toolbarOpen) return
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (formatPanelRef.current?.contains(target) || formatToggleRef.current?.contains(target) || target.closest('.animated-select-menu')) return
      setToolbarOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setToolbarOpen(false) }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeOnEscape) }
  }, [toolbarOpen])
  const editor = useEditor({
    extensions: [StarterKit, TextAlignment, PrismoTextStyle, PageBreaks, EvidenceChartNode], content: initial.editorJson as JSONContent,
    onUpdate: ({ editor: current }) => { changeVersion.current += 1; setJson(current.getJSON()); setDirty(true); setSaveState('Guardando…') },
    onSelectionUpdate: ({ editor: current }) => { const ink = current.getAttributes('prismoTextStyle').color; if (typeof ink === 'string' && /^#[0-9a-fA-F]{6}$/.test(ink)) setSelectionColor(ink); if (!current.state.selection.empty) { styledSelection.current = { from: current.state.selection.from, to: current.state.selection.to }; setToolbarOpen(true); setToolbarGroup('text'); return } if (!paperRef.current) return; const box = paperRef.current.getBoundingClientRect(); const point = current.view.coordsAtPos(current.state.selection.from); setCaret({ top: point.top - box.top - 5, left: Math.min(point.left - box.left + 16, box.width - 150) }) },
  })

  useEffect(() => {
    if (!dirty) return
    const version = changeVersion.current
    const timer = window.setTimeout(() => {
      void saveReport({ ...initial, title: title.trim() || 'Reporte sin título', editorJson: json as ReportDocument['editorJson'], sources, typography: { fontFamily, fontSize, fontSizePx, titleColor, titleFontFamily }, updatedAt: new Date().toISOString() })
        .then(() => { if (changeVersion.current === version) { setDirty(false); setSaveState('Guardado localmente') } })
        .catch(() => setSaveState('No se pudo guardar. Copia tu texto y vuelve a intentar.'))
    }, 600)
    return () => window.clearTimeout(timer)
  }, [title, json, sources, dirty, initial, fontFamily, fontSize, fontSizePx, titleColor, titleFontFamily])

  useEffect(() => {
    const paper = paperRef.current
    if (!paper || !editor) return
    let frame = 0
    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
      setPageBreaks(editor, [])
      const tiptap = paper.querySelector('.report-editor-content .tiptap')
      const blocks = tiptap ? Array.from(tiptap.children) as HTMLElement[] : []
      blocks.forEach(block => { block.style.marginTop = '' })
      const referencesBlock = paper.querySelector<HTMLElement>('.report-references')
      if (referencesBlock) referencesBlock.style.marginTop = ''
      const paperTop = paper.getBoundingClientRect().top
      const breaks: PageBreak[] = []
      for (const block of blocks) {
        let rect = block.getBoundingClientRect()
        const top = rect.top - paperTop
        let page = Math.floor(top / PAGE_HEIGHT)
        if (rect.height <= 860 && rect.bottom - paperTop > page * PAGE_HEIGHT + PAGE_CONTENT_BOTTOM) block.style.marginTop = `${(page + 1) * PAGE_HEIGHT + PAGE_TOP - top}px`
        else if (block.tagName === 'P' && rect.height > 860) {
          let lastPosition = -1
          while (rect.bottom - paperTop > page * PAGE_HEIGHT + PAGE_CONTENT_BOTTOM && breaks.length < 30) {
            const hit = editor.view.posAtCoords({ left: rect.left + Math.min(140, rect.width / 2), top: paperTop + page * PAGE_HEIGHT + PAGE_CONTENT_BOTTOM - 20 })
            if (!hit || hit.pos <= lastPosition || editor.state.doc.resolve(hit.pos).parent.type.name !== 'paragraph') break
            const caret = editor.view.coordsAtPos(hit.pos)
            const height = Math.max(0, Math.round(paperTop + (page + 1) * PAGE_HEIGHT + PAGE_TOP - caret.bottom))
            if (height < 20 || height > 1200) break
            breaks.push({ position: hit.pos, height })
            setPageBreaks(editor, breaks)
            lastPosition = hit.pos
            rect = block.getBoundingClientRect()
            page += 1
          }
        }
      }
      if (referencesBlock) {
        const rect = referencesBlock.getBoundingClientRect()
        const top = rect.top - paperTop
        const page = Math.floor(top / PAGE_HEIGHT)
        const offset = top - page * PAGE_HEIGHT
        const target = top > 0 && offset < PAGE_TOP ? page * PAGE_HEIGHT + PAGE_TOP
          : rect.height <= 860 && rect.bottom - paperTop > page * PAGE_HEIGHT + PAGE_CONTENT_BOTTOM ? (page + 1) * PAGE_HEIGHT + PAGE_TOP
          : null
        if (target !== null) {
          const currentMargin = parseFloat(getComputedStyle(referencesBlock).marginTop) || 0
          referencesBlock.style.marginTop = `${currentMargin + target - top}px`
        }
      }
      const end = referencesBlock?.getBoundingClientRect().bottom ?? tiptap?.getBoundingClientRect().bottom ?? paperTop
      setPageCount(Math.max(1, Math.ceil((end - paperTop + PAGE_HEIGHT - PAGE_CONTENT_BOTTOM) / PAGE_HEIGHT)))
      })
    }
    let lastWidth = paper.clientWidth
    const observer = new ResizeObserver(() => {
      const width = paper.clientWidth
      if (width === lastWidth) return
      lastWidth = width
      measure()
    })
    observer.observe(paper)
    measure()
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame) }
  }, [editor, json, title, fontFamily, fontSizePx])

  function styleSelection(changes: { fontFamily?: string; color?: string; fontSize?: string }) {
    if (!editor) return
    const selection = styledSelection.current
    const chain = editor.chain().focus()
    if (selection && selection.to <= editor.state.doc.content.size) chain.setTextSelection(selection)
    chain.setMark('prismoTextStyle', { ...editor.getAttributes('prismoTextStyle'), ...changes }).run()
  }

  const currentReport = (): ReportDocument => ({ ...initial, title: title.trim() || 'Reporte sin título', editorJson: json as ReportDocument['editorJson'], sources, typography: { fontFamily, fontSize, fontSizePx, titleColor, titleFontFamily } })

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])
  useEffect(() => { if (!previewUrl) return; previewCloseRef.current?.focus(); const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setPreviewUrl(null) }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [previewUrl])

  async function previewPdf() {
    setPreviewing(true); setExportError('')
    try { setPreviewUrl(URL.createObjectURL(await createReportPdfBlob(currentReport()))) }
    catch { setExportError('No se pudo preparar la vista previa. Revisa los dashboards y vuelve a intentar.') }
    finally { setPreviewing(false) }
  }

  async function exportPdf() {
    setExporting(true); setExportError('')
    try { await downloadReportPdf(currentReport()) }
    catch { setExportError('No se pudo generar el PDF. Revisa los dashboards y vuelve a intentar.') }
    finally { setExporting(false) }
  }

  function changeTypography(family: typeof fontFamily, size: typeof fontSize) {
    changeVersion.current += 1; setFontFamily(family); setFontSize(size); setDirty(true); setSaveState('Guardando…')
  }
  function insertDashboard(snapshotId: string, kind: DashboardKind) {
    const snapshot = sources.find(source => source.snapshotId === snapshotId)
    if (!snapshot || !editor) return
    const draft = initialDashboardDrafts(snapshot)[kind]
    const spec = buildChartSpec(snapshot, draft)
    editor.chain().focus().insertContentAt(editor.state.selection.to, { type: 'evidenceChart', attrs: { snapshotId, spec } }).run()
  }
  function removeConsultation(snapshotId: string) {
    if (!editor) return
    const content = (editor.getJSON().content ?? []).filter(node => !(node.type === 'evidenceChart' && node.attrs?.snapshotId === snapshotId))
    editor.commands.setContent({ type: 'doc', content })
    setSources(current => current.filter(source => source.snapshotId !== snapshotId))
    setInsertMenu(false)
    changeVersion.current += 1
    setJson(editor.getJSON())
    setDirty(true)
    setSaveState('Guardando…')
  }
  async function addConsultation() {
    try {
      await saveReport({ ...currentReport(), editorJson: (editor?.getJSON() ?? json) as ReportDocument['editorJson'], updatedAt: new Date().toISOString() })
      navigate('/explorar')
    } catch {
      setSaveState('No se pudo guardar. Copia tu texto y vuelve a intentar.')
    }
  }
  function alignText(alignment: Alignment) {
    if (!editor) return
    const { state, view } = editor
    const { from, to } = state.selection
    const tr = state.tr
    state.doc.nodesBetween(from, Math.min(state.doc.content.size, Math.max(to, from + 1)), (node, pos) => {
      if (node.type.name === 'paragraph' || node.type.name === 'heading') tr.setNodeMarkup(pos, undefined, { ...node.attrs, textAlign: alignment })
    })
    if (tr.docChanged) view.dispatch(tr)
    editor.commands.focus()
  }

  const used = new Set(usedSnapshotIds(json))
  const references = [...new Map(sources.filter(source => used.has(source.snapshotId)).map(source => [source.snapshotId, source])).values()]

  return <section className="report-workspace" aria-label="Editor de reporte">
    <div className="report-topline"><button type="button" className="back-link report-back" onClick={() => navigate('/reportes')}>← Mis reportes</button><span role="status">{saveState} · {pageCount} {pageCount === 1 ? 'página' : 'páginas'}</span><div className="report-pdf-actions"><button type="button" className="button button-secondary" disabled={previewing} onClick={() => void previewPdf()} title="Revisar el PDF antes de descargarlo">{previewing ? 'Preparando…' : 'Vista previa'}</button><button type="button" className="button button-primary" disabled={exporting} onClick={() => void exportPdf()}>{exporting ? 'Generando…' : 'Descargar PDF'}</button></div></div>
    <Stepper step={3} className="report-stepper" />
    <div className="report-source-manager"><CardNav title={`Consultas guardadas (${sources.length})`} panelClassName="report-source-manager-body"><p>Quita una consulta para retirar sus dashboards y referencias. El texto que escribiste permanece.</p><ul>{sources.map(source => <li key={source.snapshotId}><span><strong>{indicatorInfo(source.indicatorId).label}</strong><small>{source.query.geographies.map(countryName).join(', ')} · {source.query.from}–{source.query.to}</small></span><HoldButton label={`Quitar consulta de ${indicatorInfo(source.indicatorId).label}`} title="Mantén presionado para quitar esta consulta y sus dashboards" onHold={() => removeConsultation(source.snapshotId)}>×</HoldButton></li>)}</ul>{sources.length === 0 && <p>No hay consultas guardadas en este reporte.</p>}</CardNav><button type="button" className="button button-secondary" onClick={() => void addConsultation()}>＋ Consultar otro indicador</button></div>
    {exportError && <p role="alert" className="form-error">{exportError}</p>}
    <div className="report-editor-layout">
    <aside className="format-rail" aria-label="Herramientas de formato">
    <button ref={formatToggleRef} type="button" className="format-toggle" aria-expanded={toolbarOpen} aria-controls="report-format-controls" onClick={() => setToolbarOpen(value => !value)} title="Mostrar u ocultar herramientas de edición">✎ Formato <span aria-hidden="true">⌄</span></button>
    {toolbarOpen && <div ref={formatPanelRef} id="report-format-controls" className="report-toolbar" role="toolbar" aria-label="Formato de texto">
      <div className="report-toolbar-head"><strong>Formato</strong><button type="button" aria-label="Cerrar formato" onClick={() => setToolbarOpen(false)}>×</button></div>
      <div className="format-groups"><CardNav className="format-section" title="Documento y título" panelClassName="format-section-body" open={toolbarGroup === 'title'} onOpenChange={expanded => setToolbarGroup(expanded ? 'title' : null)}>
      <label>Fuente del documento <AnimatedSelect aria-label="Fuente del documento" value={fontFamily} onChange={event => changeTypography(event.target.value as typeof fontFamily, fontSize)}><option value="sans">Sans</option><option value="serif">Serif</option><option value="mono">Mono</option><option value="arial">Arial</option><option value="verdana">Verdana</option><option value="times">Times New Roman</option></AnimatedSelect></label>
      <label>Fuente del título <AnimatedSelect aria-label="Fuente del título del reporte" value={titleFontFamily} onChange={event => { changeVersion.current += 1; setTitleFontFamily(event.target.value as typeof titleFontFamily); setDirty(true); setSaveState('Guardando…') }}><option value="sans">Sans</option><option value="serif">Serif</option><option value="mono">Mono</option><option value="arial">Arial</option><option value="verdana">Verdana</option><option value="times">Times New Roman</option></AnimatedSelect></label>
      <ColorMenu label="Color del título" hexLabel="Color hexadecimal del título del reporte" value={titleColor} onChange={value => { changeVersion.current += 1; setTitleColor(value); setDirty(true); setSaveState('Guardando…') }} />
      <label>Letra (px) <input type="number" min="10" max="28" aria-label="Tamaño de letra del documento" value={fontSizePx} onChange={event => { changeVersion.current += 1; setFontSizePx(Math.max(10, Math.min(28, Number(event.target.value) || 10))); setDirty(true); setSaveState('Guardando…') }} /></label>
      </CardNav><CardNav className="format-section" title="Texto seleccionado" panelClassName="format-section-body" open={toolbarGroup === 'text'} onOpenChange={expanded => setToolbarGroup(expanded ? 'text' : null)}>
      <label>Fuente seleccionada <AnimatedSelect aria-label="Fuente del texto seleccionado" defaultValue="" onChange={event => { styleSelection({ fontFamily: event.target.value }); event.target.value = '' }}><option value="" disabled>Elegir</option><option>Arial</option><option>Verdana</option><option>Georgia</option><option>Times New Roman</option><option>Courier New</option></AnimatedSelect></label>
      <ColorMenu label="Color de texto" hexLabel="Color hexadecimal del texto" value={selectionColor} onChange={value => { setSelectionColor(value); styleSelection({ color: value }) }} />
      <label>Letra <AnimatedSelect aria-label="Tamaño del texto seleccionado" defaultValue="14" title="Tamaño de la selección" onChange={event => styleSelection({ fontSize: `${event.target.value}px` })}>{[10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => <option key={size} value={size}>{size}</option>)}</AnimatedSelect></label>
      <button type="button" onClick={() => editor?.chain().focus().unsetMark('prismoTextStyle').run()} title="Quitar fuente, tamaño y color">Quitar estilo</button>
      </CardNav></div>
<WarmTooltipGroup>
      <EditorToolButton onClick={() => editor?.chain().focus().setParagraph().run()} pressed={editor?.isActive('paragraph')} label="Párrafo">P</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} pressed={editor?.isActive('heading', { level: 1 })} label="Título">H1</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} pressed={editor?.isActive('heading', { level: 2 })} label="Subtítulo">H2</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleBold().run()} pressed={editor?.isActive('bold')} label="Negrita"><strong>B</strong></EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleItalic().run()} pressed={editor?.isActive('italic')} label="Cursiva"><em>I</em></EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleStrike().run()} pressed={editor?.isActive('strike')} label="Tachado"><s>S</s></EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} pressed={editor?.isActive('blockquote')} label="Cita">❝</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} label="Separador">—</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleBulletList().run()} pressed={editor?.isActive('bulletList')} label="Viñetas">•≡</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} pressed={editor?.isActive('orderedList')} label="Numeración">1≡</EditorToolButton>
      <span className="toolbar-divider" aria-hidden="true" />
      <EditorToolButton label="Alinear texto a la izquierda" onClick={() => alignText('left')}>≡</EditorToolButton>
      <EditorToolButton label="Centrar texto" onClick={() => alignText('center')}>☰</EditorToolButton>
      <EditorToolButton label="Alinear texto a la derecha" onClick={() => alignText('right')}>≣</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} label="Deshacer">↶</EditorToolButton>
      <EditorToolButton onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} label="Rehacer">↷</EditorToolButton>
      </WarmTooltipGroup>
    </div>}
    </aside>
    <div ref={paperRef} className={`report-paper paper-font-${fontFamily} paper-text-${fontSize}`} style={{ fontSize: `${fontSizePx}px`, minHeight: `${pageCount * PAGE_HEIGHT}px` }}><div className="paper-pages" aria-hidden="true">{Array.from({ length: pageCount }, (_, index) => <div className="paper-page-bg" style={{ top: `${index * PAGE_HEIGHT}px` }} key={index} />)}</div><label htmlFor="report-title" className="eyebrow">Título del documento</label><input id="report-title" className={`report-title-input paper-font-${titleFontFamily}`} style={{ color: titleColor }} value={title} onFocus={() => { setToolbarOpen(true); setToolbarGroup('title') }} onChange={event => { changeVersion.current += 1; setTitle(event.target.value); setDirty(true); setSaveState('Guardando…') }} />
      {caret && <div className="caret-dashboard-menu" style={{ top: caret.top, left: caret.left }}><button type="button" onMouseDown={event => event.preventDefault()} onClick={() => setInsertMenu(value => !value)}>＋ Dashboard</button>{insertMenu && <AnimatedList className="caret-dashboard-options" label="Vistas disponibles para insertar" animation="slide">{sources.flatMap(source => (['line', 'bar', 'kpi', 'delta', 'table'] as const).filter(kind => kind === 'bar' ? source.query.geographies.length > 1 && commonYears(source).length > 0 : kind === 'delta' ? commonYears(source).length > 1 : true).map(kind => <button type="button" key={`${source.snapshotId}-${kind}`} onMouseDown={event => event.preventDefault()} onClick={() => { insertDashboard(source.snapshotId, kind); setInsertMenu(false) }}>{kind === 'line' ? 'Tendencia' : kind === 'bar' ? 'Comparación' : kind === 'kpi' ? 'Último valor' : kind === 'delta' ? 'Cambio' : 'Tabla'} · {source.query.geographies.map(countryName).join(', ')}</button>))}{sources.length === 0 && <span>No hay consultas. Usa «Consultar otro indicador».</span>}</AnimatedList>}</div>}
      <ReportSources.Provider value={sources}><EditorContent editor={editor} className="report-editor-content" /></ReportSources.Provider>
      <section className="report-references" aria-labelledby="references-title"><h2 id="references-title">Fuentes de este reporte</h2>{references.map(source => <p key={source.snapshotId}>{source.attribution}. <em>{indicatorInfo(source.indicatorId).label} ({source.unit})</em>, {source.query.geographies.map(countryName).join(', ')}, {source.query.from}–{source.query.to}. Consulta: {new Date(source.fetchedAt).toLocaleString('es-MX')}. <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer">{source.provider === 'inegi-indicators' ? 'Documentación oficial ↗' : 'Datos originales ↗'}</a></p>)}</section>
      <div className="report-stamp" style={{ top: `${(pageCount - 1) * PAGE_HEIGHT + STAMP_TOP}px` }}><img src="/PrismoLogo-transparent.png" alt="" /><span>Creado con <strong>Prismo</strong><small>Datos con procedencia · análisis de tu reporte</small></span></div>
    </div>
    </div>
    {previewUrl && <div className="pdf-preview-backdrop"><section className="pdf-preview-dialog" role="dialog" aria-modal="true" aria-label="Vista previa del PDF"><div className="pdf-preview-head"><h2>Vista previa del PDF</h2><div><button type="button" onClick={() => { void fetch(previewUrl).then(response => response.blob()).then(blob => savePdfBlob(blob, title)) }}>Descargar</button><button ref={previewCloseRef} type="button" onClick={() => setPreviewUrl(null)} aria-label="Cerrar vista previa">×</button></div></div><iframe title="Documento PDF antes de descargar" src={previewUrl} /></section></div>}
  </section>
}

export default function ReportEditor() {
  const { reportId } = useParams()
  const report = useLiveQuery(() => reportId ? reportDb.reports.get(reportId) : undefined, [reportId])
  if (report === undefined) return <div className="shell page" role="status">Cargando reporte…</div>
  if (!report) return <div className="shell page" role="alert">No encontramos este reporte en este navegador.</div>
  return <DocumentEditor key={report.reportId} initial={report} />
}
