import Dexie, { type EntityTable } from 'dexie'
import { reportDocumentSchema, type ChartSpec, type DatasetSnapshot, type ReportDocument } from '../../domain/contracts'
import { countryName } from '../explorer/countries'
import { indicatorInfo } from '../explorer/indicatorCatalog'

class PrismoDb extends Dexie {
  reports!: EntityTable<ReportDocument, 'reportId'>

  constructor() {
    super('PrismoReports')
    this.version(1).stores({ reports: 'reportId, updatedAt' })
  }
}

export const reportDb = new PrismoDb()

export async function createReport(snapshot: DatasetSnapshot, specs: ChartSpec[]): Promise<string> {
  const now = new Date().toISOString()
  const reportId = crypto.randomUUID()
  const countries = snapshot.query.geographies.map(countryName).join(', ')
  const chartNodes = specs.map(spec => ({ type: 'evidenceChart', attrs: { snapshotId: snapshot.snapshotId, spec } }))
  const report: ReportDocument = reportDocumentSchema.parse({
    reportId, schemaVersion: 1, title: `Análisis de ${indicatorInfo(snapshot.indicatorId).short}`, createdAt: now, updatedAt: now,
    editorJson: { type: 'doc', content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: specs[0]?.title ?? 'Análisis de indicadores' }] },
      { type: 'paragraph', content: [{ type: 'text', text: `Países: ${countries}. Periodo consultado: ${snapshot.query.from}–${snapshot.query.to}. Escribe aquí tu pregunta y tu interpretación.` }] },
      ...chartNodes,
      { type: 'paragraph', content: [{ type: 'text', text: 'Análisis del autor: ' }] },
    ] },
    sources: [snapshot],
  })
  await reportDb.reports.add(report)
  return reportId
}

export async function saveReport(report: ReportDocument): Promise<void> {
  await reportDb.reports.put(reportDocumentSchema.parse(report))
}

export async function appendAnalysisToReport(reportId: string, snapshot: DatasetSnapshot, specs: ChartSpec[]): Promise<void> {
  await reportDb.transaction('rw', reportDb.reports, async () => {
    const report = await reportDb.reports.get(reportId)
    if (!report) throw new Error('Reporte no encontrado')
    const nodes: unknown[] = [
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: `${specs[0]?.title ?? 'Indicador'}: ${snapshot.query.geographies.map(countryName).join(' y ')}` }] },
      { type: 'paragraph', content: [{ type: 'text', text: `Periodo consultado: ${snapshot.query.from}–${snapshot.query.to}.` }] },
      ...specs.map(spec => ({ type: 'evidenceChart', attrs: { snapshotId: snapshot.snapshotId, spec } })),
    ]
    nodes.push({ type: 'paragraph', content: [{ type: 'text', text: 'Análisis del autor: ' }] })
    await reportDb.reports.put(reportDocumentSchema.parse({
      ...report,
      updatedAt: new Date().toISOString(),
      sources: [...report.sources, snapshot],
      editorJson: { ...report.editorJson, content: [...(report.editorJson.content ?? []), ...nodes] },
    }))
  })
}
