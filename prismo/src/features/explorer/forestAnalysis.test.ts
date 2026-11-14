import { describe, expect, it } from 'vitest'
import type { DatasetSnapshot } from '../../domain/contracts'
import { commonYears } from './forestAnalysis'

describe('comparación de años comunes', () => {
  it('solo ofrece años con valores publicados para todos los países', () => {
    const snapshot = {
      query: { geographies: ['MEX', 'BRA'] },
      observations: [
        { period: '2024', geographyId: 'MEX', value: 34 },
        { period: '2024', geographyId: 'BRA', value: 58 },
        { period: '2023', geographyId: 'MEX', value: null },
        { period: '2023', geographyId: 'BRA', value: 59 },
      ],
    } as DatasetSnapshot
    expect(commonYears(snapshot)).toEqual(['2024'])
  })
})
