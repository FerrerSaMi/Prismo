import type { JSONContent } from '@tiptap/react'
import { chartSpecSchema, type ChartSpec, type DatasetSnapshot, type ReportDocument } from '../../domain/contracts'
import { countryName } from '../explorer/countries'
import { indicatorInfo } from '../explorer/indicatorCatalog'

type PdfNode = string | Record<string, unknown>
const number = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 3 })
const date = (value: string) => new Date(value).toLocaleDateString('es-MX')
const valueText = (value: number | null | undefined, unit: string) => value == null ? 'Sin dato' : `${number.format(value)}${unit.startsWith('%') ? ' %' : ''}`
const safeColor = (value: unknown, fallback = '#29231f') => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
const pdfFont = (family: unknown) => family === 'serif' || family === 'times' || family === 'Georgia' || family === 'Times New Roman' ? 'Times' : family === 'mono' || family === 'Courier New' ? 'Courier' : family === 'arial' || family === 'verdana' || family === 'Arial' || family === 'Verdana' ? 'Arial' : 'Roboto'

function inline(node: JSONContent): PdfNode[] {
  if (node.type === 'hardBreak') return ['\n']
  if (node.type !== 'text') return (node.content ?? []).flatMap(inline)
  const style: Record<string, unknown> = { text: node.text ?? '' }
  for (const mark of node.marks ?? []) {
    if (mark.type === 'bold') style.bold = true
    if (mark.type === 'italic') style.italics = true
    if (mark.type === 'strike') style.decoration = 'lineThrough'
    if (mark.type === 'prismoTextStyle') {
      if (mark.attrs?.color) style.color = safeColor(mark.attrs.color)
      if (mark.attrs?.fontFamily) style.font = pdfFont(mark.attrs.fontFamily)
      const size = Number.parseInt(String(mark.attrs?.fontSize ?? ''), 10)
      if (size >= 10 && size <= 72) style.fontSize = size
    }
  }
  return [style]
}

function chartContent(spec: ChartSpec, snapshot: DatasetSnapshot): PdfNode[] {
  const chosen = spec.selectedGeographies
  const periods = spec.visiblePeriods
  const common = { margin: [0, 0, 0, 12], unbreakable: true }
  const rows = (codes: string[], dates: string[]) => [
    ['Periodo', ...codes.map(countryName)],
    ...dates.map(period => [period, ...codes.map(code => valueText(snapshot.observations.find(item => item.period === period && item.geographyId === code)?.value, snapshot.unit))]),
  ]
  const content: PdfNode[] = [{ text: spec.title, fontSize: Math.max(12, spec.fontSizePx ?? 14), bold: true, font: pdfFont(spec.titleFontFamily ?? spec.fontFamily), color: safeColor(spec.titleColor ?? spec.textColor), alignment: spec.alignment ?? 'left', margin: [0, 10, 0, 5] }]
  content.push({ text: `${chosen.map(countryName).join(' · ')} · ${snapshot.query.from}–${snapshot.query.to} · ${snapshot.unit}`, fontSize: 9, font: pdfFont(spec.subtitleFontFamily ?? spec.fontFamily), color: safeColor(spec.subtitleColor, '#51463d'), alignment: spec.alignment ?? 'left', margin: [0, 0, 0, 6] })
  if (spec.kind === 'line') {
    const dates = [...new Set(snapshot.observations.map(item => item.period))].sort()
    const values = snapshot.observations.filter(item => chosen.includes(item.geographyId) && item.value != null).map(item => item.value as number)
    const low = Math.min(0, ...values), high = Math.max(1, ...values), span = Math.max(1, high - low)
    const w = Math.round(460 * (spec.widthPercent ?? 100) / 100), h = Math.max(100, Math.min(260, Math.round((spec.heightPx ?? 360) * .42)))
    const lines: Record<string, unknown>[] = [{ type: 'line', x1: 0, y1: h, x2: w, y2: h, lineColor: '#b9b3ad' }]
    chosen.forEach((code, index) => {
      const points = dates.map((period, i) => ({ x: dates.length === 1 ? w / 2 : i * w / (dates.length - 1), value: snapshot.observations.find(item => item.period === period && item.geographyId === code)?.value }))
      for (let i = 1; i < points.length; i++) if (points[i - 1].value != null && points[i].value != null) lines.push({ type: 'line', x1: points[i - 1].x, y1: h - ((points[i - 1].value as number) - low) / span * h, x2: points[i].x, y2: h - ((points[i].value as number) - low) / span * h, lineWidth: 2, lineColor: safeColor(spec.seriesColors?.[code], ['#5c4635', '#a4482e', '#3f655e', '#6656a4'][index % 4]) })
    })
    content.push({ canvas: lines, ...common }, { text: `${dates[0] ?? ''} — ${dates.at(-1) ?? ''} · escala ${number.format(low)}–${number.format(high)} ${snapshot.unit}`, fontSize: 8, color: '#615950' })
    content.push({ text: chosen.map(code => countryName(code)).join(' · '), fontSize: 9, color: '#4e473f', margin: [0, 5, 0, 5] })
  } else if (spec.kind === 'bar' || spec.kind === 'table') {
    const selectedPeriods = spec.kind === 'bar' ? periods.slice(0, 1) : periods
    if (spec.kind === 'bar') {
      const values = chosen.map(code => snapshot.observations.find(item => item.period === selectedPeriods[0] && item.geographyId === code)?.value ?? null)
      const maximum = Math.max(1, ...values.filter((value): value is number => value != null).map(Math.abs))
      const bars = values.map((value, index) => ({ type: 'rect', x: 0, y: index * 29, w: Math.max(1, Math.round(Math.abs(value ?? 0) / maximum * 420)), h: 18, color: safeColor(spec.seriesColors?.[chosen[index]], ['#5c4635', '#a4482e', '#3f655e', '#6656a4'][index % 4]) }))
      content.push({ canvas: bars, margin: [0, 6, 0, 4] })
    }
    content.push({ table: { headerRows: 1, widths: ['auto', ...chosen.map(() => '*')], body: rows(chosen, selectedPeriods) }, layout: 'lightHorizontalLines', fontSize: 9, margin: [0, 3, 0, 9] })
  } else {
    const selectedPeriods = spec.kind === 'kpi' ? periods.slice(0, 1) : periods.slice(0, 2)
    content.push({ table: { headerRows: 1, widths: ['auto', ...chosen.map(() => '*')], body: rows(chosen, selectedPeriods) }, layout: 'lightHorizontalLines', fontSize: 10, margin: [0, 3, 0, 9] })
  }
  content.push({ text: `Fuente: ${snapshot.attribution}. ${indicatorInfo(snapshot.indicatorId).label} (${snapshot.unit}). Consulta: ${date(snapshot.fetchedAt)}.`, fontSize: 8, color: '#4a5d4f', margin: [0, 4, 0, 4] })
  content.push({ text: 'Abrir fuente oficial', link: snapshot.sourceUrl, color: '#a4482e', decoration: 'underline', fontSize: 8, margin: [0, 0, 0, 12] })
  return [{ stack: content, font: pdfFont(spec.fontFamily), color: safeColor(spec.textColor) }]
}

function blocks(nodes: JSONContent[], sources: DatasetSnapshot[]): PdfNode[] {
  return nodes.flatMap(node => {
    const text = inline(node)
    if (node.type === 'paragraph') return [{ text: text.length ? text : ' ', alignment: node.attrs?.textAlign ?? 'left', margin: [0, 0, 0, 9] }]
    if (node.type === 'heading') return [{ text, fontSize: node.attrs?.level === 1 ? 19 : 15, bold: true, alignment: node.attrs?.textAlign ?? 'left', margin: [0, 13, 0, 8] }]
    if (node.type === 'blockquote') return [{ text: inline(node), italics: true, margin: [16, 4, 0, 12] }]
    if (node.type === 'bulletList' || node.type === 'orderedList') return [{ [node.type === 'bulletList' ? 'ul' : 'ol']: (node.content ?? []).map(item => ({ text: inline(item) })), margin: [0, 0, 0, 8] }]
    if (node.type === 'horizontalRule') return [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 460, y2: 0, lineColor: '#d6c9bb' }], margin: [0, 9, 0, 9] }]
    if (node.type === 'evidenceChart') {
      const snapshot = sources.find(source => source.snapshotId === node.attrs?.snapshotId)
      const result = chartSpecSchema.safeParse(node.attrs?.spec)
      if (!snapshot || !result.success) throw new Error('Dashboard sin datos o configuración válida')
      return chartContent(result.data, snapshot)
    }
    return []
  })
}

export function buildPdfDefinition(report: ReportDocument, logo?: string): Record<string, unknown> {
  const content: PdfNode[] = [{ text: report.title, fontSize: 23, bold: true, font: pdfFont(report.typography?.titleFontFamily), color: safeColor(report.typography?.titleColor), margin: [0, 0, 0, 16] }, ...blocks((report.editorJson.content ?? []) as JSONContent[], report.sources)]
  const used = new Set((report.editorJson.content ?? []).filter((node): node is Record<string, unknown> => !!node && typeof node === 'object').map(node => (node.attrs as Record<string, unknown> | undefined)?.snapshotId).filter((id): id is string => typeof id === 'string'))
  const refs = report.sources.filter(source => used.has(source.snapshotId))
  if (refs.length) content.push({ text: 'Fuentes de este reporte', bold: true, fontSize: 14, margin: [0, 22, 0, 8] }, ...refs.map(source => ({ text: `${source.attribution}. ${indicatorInfo(source.indicatorId).label} (${source.unit}), ${source.query.geographies.map(countryName).join(', ')}, ${source.query.from}–${source.query.to}. Consulta: ${date(source.fetchedAt)}.`, link: source.sourceUrl, fontSize: 9, margin: [0, 0, 0, 8] })))
  return { pageSize: 'A4', pageMargins: [55, 60, 55, 65], content, defaultStyle: { font: pdfFont(report.typography?.fontFamily), fontSize: report.typography?.fontSizePx ?? 11, color: '#29231f' }, footer: (page: number, total: number) => ({ columns: [...(logo ? [{ image: logo, width: 18, height: 18 }] : []), { text: 'Creado con Prismo · Datos con procedencia', alignment: 'left', margin: [5, 3, 0, 0] }, { text: `${page} / ${total}`, alignment: 'right', margin: [0, 3, 0, 0] }], margin: [55, 18, 55, 0], fontSize: 8, color: '#66594b' }) }
}

export async function createReportPdfBlob(report: ReportDocument): Promise<Blob> {
  const [pdfModule, fontsModule, helvetica, times, courier] = await Promise.all([import('pdfmake/build/pdfmake.js'), import('pdfmake/build/vfs_fonts.js'), import('pdfmake/build/standard-fonts/Helvetica.js'), import('pdfmake/build/standard-fonts/Times.js'), import('pdfmake/build/standard-fonts/Courier.js')])
  const pdfMake = pdfModule.default
  pdfMake.addVirtualFileSystem(fontsModule.default)
  for (const container of [helvetica.default, times.default, courier.default]) pdfMake.addFontContainer(container)
  pdfMake.addFonts({ Arial: { normal: 'Helvetica', bold: 'Helvetica-Bold', italics: 'Helvetica-Oblique', bolditalics: 'Helvetica-BoldOblique' }, Times: { normal: 'Times-Roman', bold: 'Times-Bold', italics: 'Times-Italic', bolditalics: 'Times-BoldItalic' }, Courier: { normal: 'Courier', bold: 'Courier-Bold', italics: 'Courier-Oblique', bolditalics: 'Courier-BoldOblique' } })
  const response = await fetch(`${import.meta.env.BASE_URL}PrismoLogo-transparent.png`)
  if (!response.ok) throw new Error('Logo no disponible')
  const blob = await response.blob()
  const logo = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(blob) })
  return pdfMake.createPdf(buildPdfDefinition(report, logo)).getBlob()
}

export function savePdfBlob(blob: Blob, title: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${title.replace(/[\\/:*?"<>|]/g, '').slice(0, 80) || 'reporte'}.pdf`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export async function downloadReportPdf(report: ReportDocument): Promise<void> {
  savePdfBlob(await createReportPdfBlob(report), report.title)
}
