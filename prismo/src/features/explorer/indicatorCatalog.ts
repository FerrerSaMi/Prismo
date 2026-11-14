import type { DatasetSnapshot } from '../../domain/contracts'

export const INDICATORS = {
  'wb-forest-area-share': { label: 'Superficie forestal', short: 'superficie forestal', providerId: 'AG.LND.FRST.ZS' },
  'wb-inflation': { label: 'Inflación al consumidor', short: 'inflación al consumidor', providerId: 'FP.CPI.TOTL.ZG' },
  'wb-unemployment': { label: 'Desempleo total (estimación modelada OIT)', short: 'desempleo total', providerId: 'SL.UEM.TOTL.ZS' },
  'wb-renewable-share': { label: 'Consumo de energía renovable', short: 'consumo de energía renovable', providerId: 'EG.FEC.RNEW.ZS' },
  'inegi-migration-share': { label: 'Población inmigrante (migración reciente)', short: 'población inmigrante', providerId: '3104003001' },
  'inegi-water-share': { label: 'Viviendas con agua entubada', short: 'viviendas con agua entubada', providerId: '3114005001' },
  'inegi-economic-units': { label: 'Unidades económicas del sector privado y paraestatal', short: 'unidades económicas', providerId: '5300000001' },
  'inegi-youth-literacy': { label: 'Tasa de alfabetización de 15 a 24 años', short: 'alfabetización juvenil', providerId: '1002000050' },
} as const

export function indicatorInfo(id: string) { return INDICATORS[id as keyof typeof INDICATORS] ?? { label: id, short: id, providerId: id } }
export function isPercent(snapshot: DatasetSnapshot) { return snapshot.unit.startsWith('%') }
