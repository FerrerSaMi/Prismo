import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchForestSnapshot, ForestApiError } from './forestApi'

afterEach(() => vi.unstubAllGlobals())

const snapshot = {
  snapshotId: 'test-snapshot', indicatorId: 'wb-forest-area-share', provider: 'world-bank',
  query: { geographies: ['MEX'], from: '2020', to: '2024' },
  observations: [{ period: '2024', geographyId: 'MEX', value: 34.1538414053859, status: 'unknown' }],
  unit: '% de superficie terrestre', frequency: 'annual', methodologyKey: 'WDI:AG.LND.FRST.ZS',
  fetchedAt: '2026-11-13T12:00:00.000Z', latestObservationPeriod: '2024',
  sourceUrl: 'https://api.worldbank.org/v2/country/MX/indicator/AG.LND.FRST.ZS?format=json',
  attribution: 'FAOSTAT / FAO, vía World Development Indicators (Banco Mundial)',
  catalogVersion: '1.0.0', cacheState: 'fresh',
}

describe('cliente del primer indicador', () => {
  it('consulta el endpoint propio y valida el snapshot', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toContain('/api/v1/indicators/wb-forest-area-share/observations?')
      return Response.json(snapshot)
    })
    vi.stubGlobal('fetch', fetchMock)
    const result = await fetchForestSnapshot(['MEX'], '2020', '2024')
    expect(result.observations[0].value).toBe(34.1538414053859)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('conserva el mensaje de error del BFF', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'INVALID_FILTER', message: 'Periodo inválido' }, { status: 400 })))
    await expect(fetchForestSnapshot(['MEX'], '2030', '2024')).rejects.toMatchObject({ code: 'INVALID_FILTER', message: 'Periodo inválido' })
  })

  it('rechaza un snapshot inválido y distingue un fallo de conexión', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ...snapshot, observations: [{ ...snapshot.observations[0], value: null }] })))
    await expect(fetchForestSnapshot(['MEX'], '2020', '2024')).rejects.toBeInstanceOf(ForestApiError)
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
    await expect(fetchForestSnapshot(['MEX'], '2020', '2024')).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
  })
})
