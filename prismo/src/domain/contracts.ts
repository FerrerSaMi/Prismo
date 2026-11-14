import { z } from 'zod'

export const providerIdSchema = z.enum(['world-bank', 'inegi-indicators', 'inegi-denue', 'banxico', 'official-curated'])
export const categoryIdSchema = z.enum(['CAT-01', 'CAT-02', 'CAT-03', 'CAT-04', 'CAT-05', 'CAT-06', 'CAT-07', 'CAT-08', 'CAT-09', 'CAT-10'])
export const frequencySchema = z.enum(['daily', 'monthly', 'quarterly', 'annual', 'census', 'irregular'])
export const valueStatusSchema = z.enum(['official', 'preliminary', 'estimated', 'revised', 'missing', 'unknown'])

const nonEmpty = z.string().trim().min(1)
const isoDateTime = z.iso.datetime({ offset: true })
const url = z.url().startsWith('https://')

export const indicatorDefinitionSchema = z.strictObject({
  id: nonEmpty,
  provider: providerIdSchema,
  providerIndicatorId: nonEmpty,
  categoryId: categoryIdSchema,
  label: nonEmpty,
  description: nonEmpty,
  unit: nonEmpty,
  frequency: frequencySchema,
  supportedGeographies: z.array(nonEmpty).min(1),
  sourcePage: url,
  methodologyUrl: url.optional(),
  attribution: nonEmpty.optional(),
  verifiedAt: isoDateTime,
  isEnabled: z.boolean(),
})

export const observationSchema = z.strictObject({
  period: nonEmpty,
  geographyId: nonEmpty,
  value: z.number().finite().nullable(),
  status: valueStatusSchema,
  note: nonEmpty.optional(),
}).superRefine((observation, context) => {
  if (observation.value === null && observation.status !== 'missing') {
    context.addIssue({ code: 'custom', message: 'Un valor ausente requiere estado missing', path: ['status'] })
  }
  if (observation.value !== null && observation.status === 'missing') {
    context.addIssue({ code: 'custom', message: 'Un valor numérico no puede tener estado missing', path: ['status'] })
  }
})

export const datasetSnapshotSchema = z.strictObject({
  snapshotId: nonEmpty,
  indicatorId: nonEmpty,
  provider: providerIdSchema,
  query: z.strictObject({
    geographies: z.array(nonEmpty).min(1),
    from: nonEmpty.optional(),
    to: nonEmpty.optional(),
  }),
  observations: z.array(observationSchema),
  unit: nonEmpty,
  frequency: frequencySchema,
  methodologyKey: nonEmpty.optional(),
  fetchedAt: isoDateTime,
  sourcePublishedAt: isoDateTime.optional(),
  latestObservationPeriod: nonEmpty.optional(),
  sourceUrl: url,
  attribution: nonEmpty.optional(),
  catalogVersion: nonEmpty,
  cacheState: z.enum(['fresh', 'cached', 'stale']),
})

export const chartSpecSchema = z.strictObject({
  id: nonEmpty,
  kind: z.enum(['line', 'bar', 'kpi', 'delta', 'table']),
  title: nonEmpty,
  snapshotIds: z.array(nonEmpty).min(1),
  selectedGeographies: z.array(nonEmpty).min(1),
  visiblePeriods: z.array(nonEmpty).min(1),
  annotation: nonEmpty.optional(),
  seriesColors: z.record(z.string(), z.string().regex(/^#[0-9a-fA-F]{6}$/)).optional(),
  tableTheme: z.enum(['sand', 'olive', 'clay']).optional(),
  tableColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  widthPercent: z.number().min(35).max(100).optional(),
  heightPx: z.number().int().min(180).max(620).optional(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
  fontSizePx: z.number().int().min(10).max(28).optional(),
  showPoints: z.boolean().optional(),
  showValues: z.boolean().optional(),
  displaySize: z.enum(['small', 'medium', 'large']).optional(),
  fontFamily: z.enum(['sans', 'serif', 'mono', 'arial', 'verdana', 'times']).optional(),
  textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  titleColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  subtitleColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  titleFontFamily: z.enum(['sans', 'serif', 'mono', 'arial', 'verdana', 'times']).optional(),
  subtitleFontFamily: z.enum(['sans', 'serif', 'mono', 'arial', 'verdana', 'times']).optional(),
  fontSize: z.enum(['small', 'normal', 'large']).optional(),
})

export const reportDocumentSchema = z.strictObject({
  reportId: nonEmpty,
  schemaVersion: z.literal(1),
  title: nonEmpty,
  author: nonEmpty.optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
  editorJson: z.object({ type: z.literal('doc'), content: z.array(z.unknown()).optional() }).passthrough(),
  sources: z.array(datasetSnapshotSchema),
  typography: z.object({ fontFamily: z.enum(['sans', 'serif', 'mono', 'arial', 'verdana', 'times']), fontSize: z.enum(['small', 'normal', 'large']).optional(), fontSizePx: z.number().int().min(10).max(28).optional(), titleColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), titleFontFamily: z.enum(['sans', 'serif', 'mono', 'arial', 'verdana', 'times']).optional() }).optional(),
})

export type IndicatorDefinition = z.infer<typeof indicatorDefinitionSchema>
export type Observation = z.infer<typeof observationSchema>
export type DatasetSnapshot = z.infer<typeof datasetSnapshotSchema>
export type ChartSpec = z.infer<typeof chartSpecSchema>
export type ReportDocument = z.infer<typeof reportDocumentSchema>
