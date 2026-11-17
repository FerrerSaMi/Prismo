import { z } from 'zod'
import { COUNTRIES, type CountryCode } from './countries.ts'

export const FOREST_INDICATOR = {
  id: 'wb-forest-area-share',
  providerIndicatorId: 'AG.LND.FRST.ZS',
  categoryId: 'CAT-10',
  label: 'Superficie forestal',
  unit: '% de superficie terrestre',
  frequency: 'annual',
  sourcePage: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
  attribution: 'FAOSTAT / FAO, vía World Development Indicators (Banco Mundial)',
} as const

export const WORLD_BANK_INDICATORS = {
  [FOREST_INDICATOR.id]: FOREST_INDICATOR,
  'wb-inflation': { id: 'wb-inflation', providerIndicatorId: 'FP.CPI.TOTL.ZG', categoryId: 'CAT-01', label: 'Inflación al consumidor', unit: '% anual', frequency: 'annual', sourcePage: 'https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG', attribution: 'World Development Indicators (Banco Mundial)' },
  'wb-unemployment': { id: 'wb-unemployment', providerIndicatorId: 'SL.UEM.TOTL.ZS', categoryId: 'CAT-03', label: 'Desempleo total (estimación modelada OIT)', unit: '% de la fuerza laboral', frequency: 'annual', sourcePage: 'https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS', attribution: 'OIT, vía World Development Indicators (Banco Mundial)' },
  'wb-renewable-share': { id: 'wb-renewable-share', providerIndicatorId: 'EG.FEC.RNEW.ZS', categoryId: 'CAT-10', label: 'Consumo de energía renovable', unit: '% del consumo final de energía', frequency: 'annual', sourcePage: 'https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS', attribution: 'Agencia Internacional de Energía, vía World Development Indicators (Banco Mundial)' },
} as const
export type WorldBankIndicator = typeof WORLD_BANK_INDICATORS[keyof typeof WORLD_BANK_INDICATORS]

const providerMetadataSchema = z.object({
  page: z.coerce.number().int().positive(),
  pages: z.coerce.number().int().positive(),
  total: z.coerce.number().int().nonnegative(),
}).passthrough()

const providerRowSchema = z.object({
  indicator: z.object({ id: z.string() }).passthrough(),
  country: z.object({ id: z.string() }).passthrough(),
  countryiso3code: z.string().optional(),
  date: z.string().regex(/^\d{4}$/),
  value: z.number().finite().nullable(),
}).passthrough()

const providerResponseSchema = z.tuple([providerMetadataSchema, z.array(providerRowSchema).max(500)])

export type ForestSnapshot = {
  snapshotId: string
  indicatorId: string
  provider: 'world-bank'
  query: { geographies: CountryCode[]; from: string; to: string }
  observations: Array<{ period: string; geographyId: CountryCode; value: number | null; status: 'unknown' | 'missing' }>
  unit: string
  frequency: 'annual'
  methodologyKey: string
  fetchedAt: string
  latestObservationPeriod?: string
  sourceUrl: string
  attribution: string
  catalogVersion: string
  cacheState: 'fresh'
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function parseFilters(url: URL, currentYear: number): { geographies: CountryCode[]; from: string; to: string } {
  const allowed = new Set(['geography', 'from', 'to'])
  for (const key of url.searchParams.keys()) {
    if (!allowed.has(key) || url.searchParams.getAll(key).length !== 1) throw new ApiError(400, 'INVALID_FILTER', 'Filtro no admitido')
  }
  const geographies = (url.searchParams.get('geography') ?? 'MEX').split(',') as CountryCode[]
  if (geographies.length < 1 || geographies.length > 4 || new Set(geographies).size !== geographies.length || geographies.some(code => !(code in COUNTRIES))) {
    throw new ApiError(400, 'INVALID_FILTER', 'Elige entre uno y cuatro países del catálogo')
  }
  const from = url.searchParams.get('from') ?? '1990'
  const to = url.searchParams.get('to') ?? String(currentYear)
  if (!/^\d{4}$/.test(from) || !/^\d{4}$/.test(to)) throw new ApiError(400, 'INVALID_FILTER', 'Periodo inválido')
  const start = Number(from)
  const end = Number(to)
  if (start < 1960 || end > currentYear || start > end || end - start > 100) {
    throw new ApiError(400, 'INVALID_FILTER', 'El rango de años no está permitido')
  }
  return { geographies, from, to }
}

export async function getForestSnapshot(
  filters: { geographies: CountryCode[]; from: string; to: string },
  fetcher: typeof fetch = fetch,
  now: () => Date = () => new Date(),
  indicator: WorldBankIndicator = FOREST_INDICATOR,
): Promise<ForestSnapshot> {
  const countryPath = filters.geographies.join(';')
  const sourceUrl = new URL(`https://api.worldbank.org/v2/country/${countryPath}/indicator/${indicator.providerIndicatorId}`)
  sourceUrl.searchParams.set('format', 'json')
  sourceUrl.searchParams.set('date', `${filters.from}:${filters.to}`)
  sourceUrl.searchParams.set('per_page', '500')

  let response: Response | undefined
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetcher(sourceUrl, { signal: AbortSignal.timeout(18000) })
    } catch (error) {
      if (attempt === 0) { await new Promise(resolve => setTimeout(resolve, 200)); continue }
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        throw new ApiError(504, 'UPSTREAM_TIMEOUT', 'El Banco Mundial no respondió a tiempo. Inténtalo de nuevo más tarde.')
      }
      throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'No se pudo conectar con el Banco Mundial. Inténtalo de nuevo más tarde.')
    }
    if (response.ok) break
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) { await new Promise(resolve => setTimeout(resolve, 200)); continue }
    throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'El Banco Mundial no está disponible por ahora. Inténtalo de nuevo más tarde.')
  }
  if (!response?.ok) throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'El Banco Mundial no está disponible por ahora. Inténtalo de nuevo más tarde.')

  let payload: unknown
  try { payload = await response.json() } catch { throw new ApiError(502, 'UPSTREAM_INVALID', 'La fuente devolvió una respuesta inválida') }
  const result = providerResponseSchema.safeParse(payload)
  if (!result.success) throw new ApiError(502, 'UPSTREAM_INVALID', 'La fuente devolvió una estructura inesperada')
  const [metadata, rows] = result.data
  if (metadata.page !== 1 || metadata.pages !== 1 || metadata.total > 500 || metadata.total !== rows.length) {
    throw new ApiError(502, 'UPSTREAM_INVALID', 'La respuesta está incompleta')
  }
  if (rows.some(row => row.indicator.id !== indicator.providerIndicatorId || !filters.geographies.some(code => COUNTRIES[code].wbCode === row.country.id.toUpperCase() && (!row.countryiso3code || row.countryiso3code === code)))) {
    throw new ApiError(502, 'UPSTREAM_INVALID', 'La respuesta no corresponde al indicador y país solicitados')
  }

  const observations = rows.map(row => ({
    period: row.date,
    geographyId: filters.geographies.find(code => COUNTRIES[code].wbCode === row.country.id.toUpperCase())!,
    value: row.value,
    status: row.value === null ? 'missing' as const : 'unknown' as const,
  })).sort((a, b) => b.period.localeCompare(a.period) || filters.geographies.indexOf(a.geographyId) - filters.geographies.indexOf(b.geographyId))
  const latestObservationPeriod = observations.find(row => row.value !== null)?.period

  return {
    snapshotId: crypto.randomUUID(),
    indicatorId: indicator.id,
    provider: 'world-bank',
    query: { geographies: filters.geographies, from: filters.from, to: filters.to },
    observations,
    unit: indicator.unit,
    frequency: indicator.frequency,
    methodologyKey: `WDI:${indicator.providerIndicatorId}`,
    fetchedAt: now().toISOString(),
    ...(latestObservationPeriod ? { latestObservationPeriod } : {}),
    sourceUrl: sourceUrl.toString(),
    attribution: indicator.attribution,
    catalogVersion: '1.0.0',
    cacheState: 'fresh',
  }
}
