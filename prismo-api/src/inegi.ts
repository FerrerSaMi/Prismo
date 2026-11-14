import { z } from 'zod'
import { ApiError } from './world-bank.ts'

export const INEGI_INDICATORS = {
  'inegi-migration-share': { providerId: '3104003001', categoryId: 'CAT-07', label: 'Población inmigrante (migración reciente)', unit: '% de población', methodologyKey: 'INEGI:3104003001' },
  'inegi-water-share': { providerId: '3114005001', categoryId: 'CAT-08', label: 'Viviendas con agua entubada', unit: '% de viviendas', methodologyKey: 'INEGI:3114005001' },
  'inegi-economic-units': { providerId: '5300000001', categoryId: 'CAT-06', label: 'Unidades económicas del sector privado y paraestatal', unit: 'unidades económicas', methodologyKey: 'INEGI:5300000001', providerUnit: '104' },
  'inegi-youth-literacy': { providerId: '1002000050', categoryId: 'CAT-09', label: 'Tasa de alfabetización de 15 a 24 años', unit: '% de personas de 15 a 24 años', methodologyKey: 'INEGI:1002000050', providerUnit: '128' },
} as const

export const INEGI_GEOGRAPHIES = {
  '00': 'Estados Unidos Mexicanos', '01': 'Aguascalientes', '05': 'Coahuila', '07': 'Chiapas', '09': 'Ciudad de México',
  '11': 'Guanajuato', '14': 'Jalisco', '15': 'Estado de México', '19': 'Nuevo León', '21': 'Puebla', '30': 'Veracruz',
} as const

type IndicatorId = keyof typeof INEGI_INDICATORS
type Geography = keyof typeof INEGI_GEOGRAPHIES
const observationSchema = z.object({ TIME_PERIOD: z.string(), OBS_VALUE: z.union([z.string(), z.number(), z.null()]) }).passthrough()
const responseSchema = z.object({ Series: z.array(z.object({ INDICADOR: z.coerce.string(), UNIT: z.coerce.string(), OBSERVATIONS: z.array(observationSchema) }).passthrough()).min(1) }).passthrough()

export function parseInegiFilters(url: URL): { geographies: Geography[]; from: string; to: string } {
  for (const key of url.searchParams.keys()) if (!['geography', 'from', 'to'].includes(key) || url.searchParams.getAll(key).length !== 1) throw new ApiError(400, 'INVALID_FILTER', 'Filtro no admitido')
  const geographies = (url.searchParams.get('geography') ?? '00,09').split(',') as Geography[]
  const from = url.searchParams.get('from') ?? '2010'
  const to = url.searchParams.get('to') ?? '2025'
  if (geographies.length < 1 || geographies.length > 4 || new Set(geographies).size !== geographies.length || geographies.some(code => !(code in INEGI_GEOGRAPHIES)) || !/^20\d{2}$/.test(from) || !/^20\d{2}$/.test(to) || Number(from) < 2010 || Number(to) > 2025 || Number(from) > Number(to)) throw new ApiError(400, 'INVALID_FILTER', 'Elige hasta cuatro territorios y años entre 2010 y 2025')
  return { geographies, from, to }
}

export async function getInegiSnapshot(id: IndicatorId, filters: ReturnType<typeof parseInegiFilters>, token: string | undefined, fetcher: typeof fetch = fetch, now: () => Date = () => new Date()) {
  if (!token) throw new ApiError(503, 'PROVIDER_NOT_CONFIGURED', 'La consulta INEGI aún no está configurada en el servidor')
  const indicator = INEGI_INDICATORS[id]
  const results = await Promise.all(filters.geographies.map(async geography => {
    const url = `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/${indicator.providerId}/es/${geography}/false/BISE/2.0/${encodeURIComponent(token)}?type=json`
    let response: Response
    try { response = await fetcher(url, { signal: AbortSignal.timeout(12000) }) } catch { throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'No se pudo consultar INEGI') }
    if (!response.ok) throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'INEGI no está disponible en este momento')
    let data: unknown
    try { data = await response.json() } catch { throw new ApiError(502, 'UPSTREAM_INVALID', 'INEGI devolvió una respuesta inválida') }
    const parsed = responseSchema.safeParse(data)
    if (!parsed.success || parsed.data.Series.length !== 1 || parsed.data.Series[0].INDICADOR !== indicator.providerId || parsed.data.Series[0].UNIT !== ('providerUnit' in indicator ? indicator.providerUnit : '3')) throw new ApiError(502, 'UPSTREAM_INVALID', 'INEGI devolvió datos incompatibles con este indicador')
    return parsed.data.Series[0].OBSERVATIONS.filter(item => item.TIME_PERIOD >= filters.from && item.TIME_PERIOD <= filters.to).map(item => {
      const value = item.OBS_VALUE == null || item.OBS_VALUE === '' ? null : Number(item.OBS_VALUE)
      if (!/^20\d{2}$/.test(item.TIME_PERIOD) || (value !== null && (!Number.isFinite(value) || value < 0 || (id !== 'inegi-economic-units' && value > 100)))) throw new ApiError(502, 'UPSTREAM_INVALID', 'INEGI devolvió un periodo o valor inesperado')
      return { period: item.TIME_PERIOD, geographyId: geography, value, status: value === null ? 'missing' as const : 'unknown' as const }
    })
  }))
  const observations = results.flat().sort((a, b) => b.period.localeCompare(a.period))
  const latestObservationPeriod = observations.find(item => item.value !== null)?.period
  return { snapshotId: crypto.randomUUID(), indicatorId: id, provider: 'inegi-indicators' as const, query: filters, observations,
    unit: indicator.unit, frequency: 'irregular' as const, methodologyKey: indicator.methodologyKey, fetchedAt: now().toISOString(), latestObservationPeriod,
    sourceUrl: 'https://www.inegi.org.mx/servicios/api-indicadores/', attribution: 'INEGI · Banco de Indicadores', catalogVersion: '1.1.0', cacheState: 'fresh' as const }
}
