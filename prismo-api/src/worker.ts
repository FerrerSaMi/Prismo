import { ApiError, WORLD_BANK_INDICATORS, getForestSnapshot, parseFilters, type ForestSnapshot } from './world-bank.ts'
import { INEGI_INDICATORS, getInegiSnapshot, parseInegiFilters } from './inegi.ts'

type Env = { FRONTEND_ORIGIN?: string; INEGI_TOKEN?: string }
const worldBankCache = new Map<string, { snapshot: ForestSnapshot; storedAt: number }>()
const CACHE_FRESH_MS = 30 * 60 * 1000
const CACHE_STALE_MS = 24 * 60 * 60 * 1000

function json(body: unknown, status = 200, origin?: string): Response {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  if (origin) { headers.set('Access-Control-Allow-Origin', origin); headers.set('Vary', 'Origin') }
  return new Response(JSON.stringify(body), { status, headers })
}

export async function handleRequest(request: Request, env: Env = {}, fetcher: typeof fetch = fetch, now: () => Date = () => new Date()): Promise<Response> {
  const origin = request.headers.get('Origin')
  if (origin && env.FRONTEND_ORIGIN && origin !== env.FRONTEND_ORIGIN) return json({ code: 'ORIGIN_NOT_ALLOWED', message: 'Origen no admitido' }, 403)
  const allowedOrigin = origin && env.FRONTEND_ORIGIN === origin ? origin : undefined
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' } : {} })
  }
  if (request.method !== 'GET') return json({ code: 'METHOD_NOT_ALLOWED', message: 'Método no admitido' }, 405, allowedOrigin)

  const url = new URL(request.url)
  if (url.pathname === '/api/v1/health') return json({ status: 'ok', version: '1' }, 200, allowedOrigin)
  const match = /^\/api\/v1\/indicators\/([^/]+)\/observations$/.exec(url.pathname)
  if (!match || (!(match[1] in WORLD_BANK_INDICATORS) && !(match[1] in INEGI_INDICATORS))) {
    return json({ code: 'INDICATOR_NOT_AVAILABLE', message: 'Indicador no disponible' }, 404, allowedOrigin)
  }

  try {
    const cacheKey = `${url.pathname}?${url.searchParams.toString()}`
    const cached = fetcher === fetch && match[1] in WORLD_BANK_INDICATORS ? worldBankCache.get(cacheKey) : undefined
    if (cached && Date.now() - cached.storedAt < CACHE_FRESH_MS) return json({ ...cached.snapshot, cacheState: 'cached' }, 200, allowedOrigin)
    const snapshot = match[1] in WORLD_BANK_INDICATORS
      ? await getForestSnapshot(parseFilters(url, now().getUTCFullYear()), fetcher, now, WORLD_BANK_INDICATORS[match[1] as keyof typeof WORLD_BANK_INDICATORS])
      : await getInegiSnapshot(match[1] as keyof typeof INEGI_INDICATORS, parseInegiFilters(url), env.INEGI_TOKEN, fetcher, now)
    if (fetcher === fetch && snapshot.provider === 'world-bank') {
      if (worldBankCache.size >= 128) worldBankCache.delete(worldBankCache.keys().next().value!)
      worldBankCache.set(cacheKey, { snapshot, storedAt: Date.now() })
    }
    return json(snapshot, 200, allowedOrigin)
  } catch (error) {
    const cacheKey = `${url.pathname}?${url.searchParams.toString()}`
    const cached = fetcher === fetch && worldBankCache.get(cacheKey)
    if (cached && Date.now() - cached.storedAt < CACHE_STALE_MS && error instanceof ApiError && error.status >= 500) return json({ ...cached.snapshot, cacheState: 'stale' }, 200, allowedOrigin)
    if (error instanceof ApiError) return json({ code: error.code, message: error.message }, error.status, allowedOrigin)
    return json({ code: 'INTERNAL_ERROR', message: 'No se pudo completar la consulta' }, 500, allowedOrigin)
  }
}

export default { fetch: (request: Request, env: Env) => handleRequest(request, env) }
