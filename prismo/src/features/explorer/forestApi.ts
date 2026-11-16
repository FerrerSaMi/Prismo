import { z } from 'zod'
import { datasetSnapshotSchema } from '../../domain/contracts'

const errorSchema = z.object({ code: z.string(), message: z.string() })

export class ForestApiError extends Error {
  code: string
  constructor(code: string, message: string) { super(message); this.code = code }
}

export async function fetchForestSnapshot(geographies: string[], from: string, to: string, signal?: AbortSignal, indicatorId = 'wb-forest-area-share') {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  const params = new URLSearchParams({ geography: geographies.join(','), from, to })
  let response: Response
  try {
    response = await fetch(`${base}/api/v1/indicators/${indicatorId}/observations?${params}`, { signal })
  } catch {
    throw new ForestApiError('NETWORK_ERROR', import.meta.env.DEV ? 'No se pudo conectar con la API de Prismo. Inicia frontend y backend con npm run dev desde la raíz del proyecto.' : 'No se pudo conectar con la API de Prismo. Revisa la conexión e inténtalo de nuevo.')
  }
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = errorSchema.safeParse(payload)
    throw new ForestApiError(error.success ? error.data.code : 'API_ERROR', error.success ? error.data.message : import.meta.env.DEV ? 'La API de Prismo no respondió correctamente. Inicia ambos servicios con npm run dev desde la raíz.' : 'La API de Prismo no respondió correctamente. Inténtalo de nuevo.')
  }
  const parsed = datasetSnapshotSchema.safeParse(payload)
  if (!parsed.success) throw new ForestApiError('INVALID_RESPONSE', 'Los datos llegaron en un formato inesperado. Inténtalo de nuevo.')
  return parsed.data
}
