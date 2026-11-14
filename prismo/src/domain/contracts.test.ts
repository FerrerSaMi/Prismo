import { describe, expect, it } from 'vitest'
import {
  chartSpecSchema,
  datasetSnapshotSchema,
  indicatorDefinitionSchema,
  observationSchema,
  reportDocumentSchema,
} from './contracts'

const indicator = {
  id: 'wb-forest-area-share', provider: 'world-bank', providerIndicatorId: 'AG.LND.FRST.ZS',
  categoryId: 'CAT-10', label: 'Superficie forestal', description: 'Porcentaje de la superficie terrestre con bosque',
  unit: '% de superficie terrestre', frequency: 'annual', supportedGeographies: ['MEX'],
  sourcePage: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
  verifiedAt: '2026-11-13T12:00:00Z', isEnabled: false,
}

const snapshot = {
  snapshotId: 'sample-for-test', indicatorId: indicator.id, provider: 'world-bank',
  query: { geographies: ['MEX'], from: '2020', to: '2022' },
  observations: [
    { period: '2022', geographyId: 'MEX', value: 0, status: 'official' },
    { period: '2021', geographyId: 'MEX', value: null, status: 'missing' },
  ],
  unit: '% de superficie terrestre', frequency: 'annual', fetchedAt: '2026-11-13T12:00:00Z',
  latestObservationPeriod: '2022', sourceUrl: 'https://api.worldbank.org/v2/country/MX/indicator/AG.LND.FRST.ZS?format=json',
  catalogVersion: 'test-only', cacheState: 'fresh',
}

describe('contratos de dominio', () => {
  it('acepta un indicador curado y rechaza una categoría fuera de la línea base', () => {
    expect(indicatorDefinitionSchema.safeParse(indicator).success).toBe(true)
    expect(indicatorDefinitionSchema.safeParse({ ...indicator, categoryId: 'CAT-11' }).success).toBe(false)
  })

  it('distingue el cero real de un dato ausente', () => {
    expect(observationSchema.safeParse(snapshot.observations[0]).success).toBe(true)
    expect(observationSchema.safeParse(snapshot.observations[1]).success).toBe(true)
    expect(observationSchema.safeParse({ ...snapshot.observations[1], value: 0 }).success).toBe(false)
    expect(observationSchema.safeParse({ ...snapshot.observations[0], value: null }).success).toBe(false)
  })

  it('permite omitir la fecha de publicación si el proveedor no la informa', () => {
    expect(datasetSnapshotSchema.safeParse(snapshot).success).toBe(true)
    expect(datasetSnapshotSchema.safeParse({ ...snapshot, sourcePublishedAt: 'hoy' }).success).toBe(false)
  })

  it('exige procedencia segura y una selección reproducible para la gráfica', () => {
    expect(datasetSnapshotSchema.safeParse({ ...snapshot, sourceUrl: 'http://example.com' }).success).toBe(false)
    expect(chartSpecSchema.safeParse({ id: 'c1', kind: 'line', title: 'Bosques', snapshotIds: ['s1'], selectedGeographies: ['MEX'], visiblePeriods: [] }).success).toBe(false)
  })

  it('versiona el documento y exige JSON estructurado', () => {
    const report = { reportId: 'r1', schemaVersion: 1, title: 'Informe', createdAt: '2026-11-13T12:00:00Z', updatedAt: '2026-11-13T12:00:00Z', editorJson: { type: 'doc', content: [] }, sources: [snapshot] }
    expect(reportDocumentSchema.safeParse(report).success).toBe(true)
    expect(reportDocumentSchema.safeParse({ ...report, schemaVersion: 2 }).success).toBe(false)
    expect(reportDocumentSchema.safeParse({ ...report, editorJson: '<p>texto</p>' }).success).toBe(false)
  })
})
