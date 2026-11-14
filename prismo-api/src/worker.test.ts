import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { handleRequest } from './worker.ts'

const endpoint = 'http://localhost:8787/api/v1/indicators/wb-forest-area-share/observations?geography=MEX&from=2020&to=2022'
const fixedNow = () => new Date('2026-11-13T12:00:00Z')

function upstream(rows: unknown[], metadata: object = { page: 1, pages: 1, total: rows.length }) {
  return (async (url: string | URL | Request) => {
    assert.match(String(url), /country\/MEX\/indicator\/AG\.LND\.FRST\.ZS/)
    assert.match(String(url), /date=2020%3A2022/)
    return Response.json([metadata, rows])
  }) as typeof fetch
}

function row(date: string, value: number | null) {
  return { indicator: { id: 'AG.LND.FRST.ZS' }, country: { id: 'MX' }, countryiso3code: 'MEX', date, value }
}

test('normaliza una respuesta del Banco Mundial sin convertir ausentes en cero', async () => {
  const response = await handleRequest(new Request(endpoint), {}, upstream([row('2022', 0), row('2021', null), row('2020', 12.5)]), fixedNow)
  assert.equal(response.status, 200)
  const body = await response.json() as { observations: Array<{ period: string; value: number | null; status: string }>; latestObservationPeriod: string; fetchedAt: string; sourcePublishedAt?: string }
  assert.deepEqual(body.observations.map(item => [item.period, item.value, item.status]), [
    ['2022', 0, 'unknown'], ['2021', null, 'missing'], ['2020', 12.5, 'unknown'],
  ])
  assert.equal(body.latestObservationPeriod, '2022')
  assert.equal(body.fetchedAt, '2026-11-13T12:00:00.000Z')
  assert.equal(body.sourcePublishedAt, undefined)
})

test('admite únicamente los nuevos indicadores curados del Banco Mundial', async () => {
  const indicators = [
    ['wb-inflation', 'FP.CPI.TOTL.ZG', 4.2],
    ['wb-unemployment', 'SL.UEM.TOTL.ZS', 3.1],
    ['wb-renewable-share', 'EG.FEC.RNEW.ZS', 16.8],
  ] as const
  for (const [id, providerId, value] of indicators) {
    const fetcher = (async (url: string | URL | Request) => {
      assert.match(String(url), new RegExp(`indicator/${providerId.replaceAll('.', '\\.')}`))
      return Response.json([{ page: 1, pages: 1, total: 1 }, [{ ...row('2022', value), indicator: { id: providerId } }]])
    }) as typeof fetch
    const response = await handleRequest(new Request(endpoint.replace('wb-forest-area-share', id)), {}, fetcher, fixedNow)
    assert.equal(response.status, 200)
    const body = await response.json() as { indicatorId: string; observations: Array<{ value: number }> }
    assert.equal(body.indicatorId, id)
    assert.equal(body.observations[0].value, value)
  }
})

test('acepta la muestra real publicada para México de 2020 a 2024', async () => {
  const payload = JSON.parse(await readFile(new URL('../tests/fixtures/wb-forest-mx-2020-2024.json', import.meta.url), 'utf8')) as unknown
  const fetcher = (async () => Response.json(payload)) as typeof fetch
  const response = await handleRequest(new Request(endpoint.replace('to=2022', 'to=2024')), {}, fetcher, fixedNow)
  assert.equal(response.status, 200)
  const body = await response.json() as { observations: Array<{ period: string; value: number | null }>; latestObservationPeriod: string }
  assert.equal(body.latestObservationPeriod, '2024')
  assert.equal(body.observations[0].period, '2024')
  assert.equal(body.observations[0].value, 34.1538414053859)
})

test('compara dos países con una respuesta real y conserva cada geografía', async () => {
  const payload = JSON.parse(await readFile(new URL('../tests/fixtures/wb-forest-mex-bra-2020-2024.json', import.meta.url), 'utf8')) as unknown
  const fetcher = (async (url: string | URL | Request) => {
    assert.match(String(url), /country\/MEX;BRA\/indicator\/AG\.LND\.FRST\.ZS/)
    return Response.json(payload)
  }) as typeof fetch
  const url = endpoint.replace('geography=MEX', 'geography=MEX%2CBRA').replace('to=2022', 'to=2024')
  const response = await handleRequest(new Request(url), {}, fetcher, fixedNow)
  assert.equal(response.status, 200)
  const body = await response.json() as { query: { geographies: string[] }; observations: Array<{ geographyId: string; period: string; value: number }> }
  assert.deepEqual(body.query.geographies, ['MEX', 'BRA'])
  assert.equal(body.observations.find(item => item.geographyId === 'MEX' && item.period === '2024')?.value, 34.1538414053859)
  assert.equal(body.observations.find(item => item.geographyId === 'BRA' && item.period === '2024')?.value, 58.5468405650061)
})

test('rechaza filtros y rutas fuera del catálogo antes de consultar al proveedor', async () => {
  const neverFetch = (() => { throw new Error('No debe consultar la fuente') }) as typeof fetch
  const invalid = await handleRequest(new Request(endpoint.replace('geography=MEX', 'geography=JPN')), {}, neverFetch, fixedNow)
  assert.equal(invalid.status, 400)
  assert.equal((await invalid.json() as { code: string }).code, 'INVALID_FILTER')
  const unknown = await handleRequest(new Request(endpoint.replace('wb-forest-area-share', 'other')), {}, neverFetch, fixedNow)
  assert.equal(unknown.status, 404)
  const duplicate = await handleRequest(new Request(endpoint.replace('geography=MEX', 'geography=MEX%2CMEX')), {}, neverFetch, fixedNow)
  assert.equal(duplicate.status, 400)
  const outside = await handleRequest(new Request(endpoint.replace('geography=MEX', 'geography=MEX%2CJPN')), {}, neverFetch, fixedNow)
  assert.equal(outside.status, 400)
})

test('rechaza una respuesta de otro indicador y una paginación incompleta', async () => {
  const wrong = { ...row('2022', 5), indicator: { id: 'SP.POP.TOTL' } }
  const response = await handleRequest(new Request(endpoint), {}, upstream([wrong]), fixedNow)
  assert.equal(response.status, 502)
  assert.equal((await response.json() as { code: string }).code, 'UPSTREAM_INVALID')
  const paged = await handleRequest(new Request(endpoint), {}, upstream([row('2022', 5)], { page: 1, pages: 2, total: 201 }), fixedNow)
  assert.equal(paged.status, 502)
})

test('expone errores de red sin filtrar detalles internos', async () => {
  const failing = (async () => { throw new Error('private upstream detail') }) as typeof fetch
  const response = await handleRequest(new Request(endpoint), {}, failing, fixedNow)
  assert.equal(response.status, 503)
  const body = await response.json() as { code: string; message: string }
  assert.equal(body.code, 'UPSTREAM_UNAVAILABLE')
  assert.doesNotMatch(body.message, /private upstream detail/)
})

test('reintenta una vez cuando falla temporalmente la fuente', async () => {
  let attempts = 0
  const fetcher = (async () => {
    attempts += 1
    if (attempts === 1) throw new Error('fallo temporal')
    return Response.json([{ page: 1, pages: 1, total: 1 }, [row('2022', 4)]])
  }) as typeof fetch
  const response = await handleRequest(new Request(endpoint), {}, fetcher, fixedNow)
  assert.equal(response.status, 200)
  assert.equal(attempts, 2)
})

test('reutiliza una consulta válida del Banco Mundial sin repetir la petición', async () => {
  const originalFetch = globalThis.fetch
  let calls = 0
  globalThis.fetch = (async () => {
    calls += 1
    return Response.json([{ page: 1, pages: 1, total: 1 }, [row('2022', 4)]])
  }) as typeof fetch
  try {
    const url = endpoint.replace('from=2020', 'from=2021')
    const first = await handleRequest(new Request(url))
    const second = await handleRequest(new Request(url))
    assert.equal(first.status, 200)
    assert.equal(second.status, 200)
    assert.equal((await first.json() as { cacheState: string }).cacheState, 'fresh')
    assert.equal((await second.json() as { cacheState: string }).cacheState, 'cached')
    assert.equal(calls, 1)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('admite solo el origen configurado para llamadas entre dominios', async () => {
  const request = new Request(endpoint, { headers: { Origin: 'https://prismo.example' } })
  const response = await handleRequest(request, { FRONTEND_ORIGIN: 'https://prismo.example' }, upstream([row('2022', 5)]), fixedNow)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://prismo.example')
  const blocked = await handleRequest(request, { FRONTEND_ORIGIN: 'https://other.example' }, upstream([row('2022', 5)]), fixedNow)
  assert.equal(blocked.status, 403)
})
