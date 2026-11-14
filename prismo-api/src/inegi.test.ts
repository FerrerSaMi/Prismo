import test from 'node:test'
import assert from 'node:assert/strict'
import { handleRequest } from './worker.ts'

const root = 'http://localhost:8787/api/v1/indicators/'
const now = () => new Date('2026-11-13T12:00:00Z')
const fakeToken = 'test-secret'

test('normaliza migración nacional y estatal sin exponer el token', async () => {
  const fetcher = (async (url: string | URL | Request) => {
    const path = String(url)
    assert.match(path, /INDICATOR\/3104003001\/es\/(00|09)\/false\/BISE\/2\.0/)
    return Response.json({ Series: [{ INDICADOR: '3104003001', UNIT: '3', OBSERVATIONS: [
      { TIME_PERIOD: '2025', OBS_VALUE: '3.48' }, { TIME_PERIOD: '2020', OBS_VALUE: '3.15' }, { TIME_PERIOD: '2010', OBS_VALUE: '' },
    ] }] })
  }) as typeof fetch
  const response = await handleRequest(new Request(root + 'inegi-migration-share/observations?geography=00%2C09&from=2010&to=2025'), { INEGI_TOKEN: fakeToken }, fetcher, now)
  assert.equal(response.status, 200)
  const text = await response.text()
  assert.equal(text.includes(fakeToken), false)
  const body = JSON.parse(text) as { observations: Array<{ value: number | null; status: string }>; query: { geographies: string[] }; sourceUrl: string }
  assert.deepEqual(body.query.geographies, ['00', '09'])
  assert.equal(body.observations.length, 6)
  assert.equal(body.observations.filter(item => item.value === null && item.status === 'missing').length, 2)
  assert.match(body.sourceUrl, /^https:\/\/www\.inegi\.org\.mx/)
})

test('vivienda conserva su ID y rechaza respuestas incompatibles', async () => {
  const valid = (async () => Response.json({ Series: [{ INDICADOR: '3114005001', UNIT: '3', OBSERVATIONS: [{ TIME_PERIOD: '2025', OBS_VALUE: '97.56' }] }] })) as typeof fetch
  const url = root + 'inegi-water-share/observations?geography=00&from=2020&to=2025'
  const response = await handleRequest(new Request(url), { INEGI_TOKEN: fakeToken }, valid, now)
  assert.equal(response.status, 200)
  const body = await response.json() as { observations: Array<{ value: number }> }
  assert.equal(body.observations[0].value, 97.56)
  const invalid = await handleRequest(new Request(url), { INEGI_TOKEN: fakeToken }, (async () => Response.json({ Series: [{ INDICADOR: 'other', UNIT: '3', OBSERVATIONS: [] }] })) as typeof fetch, now)
  assert.equal(invalid.status, 502)
})

test('INEGI valida filtros y no consulta sin token del servidor', async () => {
  const noFetch = (() => { throw new Error('No debe consultar') }) as typeof fetch
  const invalid = await handleRequest(new Request(root + 'inegi-water-share/observations?geography=99'), { INEGI_TOKEN: fakeToken }, noFetch, now)
  assert.equal(invalid.status, 400)
  const missingToken = await handleRequest(new Request(root + 'inegi-water-share/observations?geography=00'), {}, noFetch, now)
  assert.equal(missingToken.status, 503)
})

test('empresas conserva conteos altos y educación valida la unidad de tasa', async () => {
  for (const [id, providerId, unit, value] of [
    ['inegi-economic-units', '5300000001', '104', '4800157'],
    ['inegi-youth-literacy', '1002000050', '128', '98.91'],
  ]) {
    const fetcher = (async () => Response.json({ Series: [{ INDICADOR: providerId, UNIT: unit, OBSERVATIONS: [{ TIME_PERIOD: '2018', OBS_VALUE: value }] }] })) as typeof fetch
    const response = await handleRequest(new Request(root + id + '/observations?geography=00&from=2010&to=2025'), { INEGI_TOKEN: fakeToken }, fetcher, now)
    assert.equal(response.status, 200)
    const body = await response.json() as { unit: string; observations: Array<{ value: number }> }
    assert.equal(body.observations[0].value, Number(value))
    assert.equal(body.unit, id === 'inegi-economic-units' ? 'unidades económicas' : '% de personas de 15 a 24 años')
  }
})
