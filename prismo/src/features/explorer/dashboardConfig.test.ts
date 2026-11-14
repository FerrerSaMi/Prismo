import { describe, expect, it } from 'vitest'
import type { DatasetSnapshot } from '../../domain/contracts'
import { buildChartSpec, initialDashboardDrafts } from './dashboardConfig'

const snapshot = {
  snapshotId: 'fixed-snapshot', query: { geographies: ['MEX', 'BRA'], from: '2020', to: '2024' },
  observations: [
    { period: '2024', geographyId: 'MEX', value: 34 }, { period: '2024', geographyId: 'BRA', value: 58 },
    { period: '2023', geographyId: 'MEX', value: 35 }, { period: '2023', geographyId: 'BRA', value: 59 },
  ],
} as DatasetSnapshot

describe('configuración de dashboards', () => {
  it('conserva países, periodos y color de tabla en el ChartSpec', () => {
    const drafts = initialDashboardDrafts(snapshot)
    const spec = buildChartSpec(snapshot, { ...drafts.table, selectedGeographies: ['BRA'], tableTheme: 'olive', tableRows: '5' })
    expect(spec.snapshotIds).toEqual(['fixed-snapshot'])
    expect(spec.selectedGeographies).toEqual(['BRA'])
    expect(spec.visiblePeriods).toEqual(['2024', '2023'])
    expect(spec.tableTheme).toBe('olive')
  })

  it('rechaza colores que no son hexadecimales válidos', () => {
    const drafts = initialDashboardDrafts(snapshot)
    expect(() => buildChartSpec(snapshot, { ...drafts.line, seriesColors: { MEX: 'rojo' } })).toThrow()
  })

  it('conserva el título y los controles visuales al crear una vista', () => {
    const drafts = initialDashboardDrafts(snapshot)
    const line = buildChartSpec(snapshot, { ...drafts.line, title: '  Bosques comparados  ', showPoints: false })
    const bar = buildChartSpec(snapshot, { ...drafts.bar, year: '2023', showValues: false })
    expect(line.title).toBe('Bosques comparados')
    expect(line.showPoints).toBe(false)
    expect(bar.visiblePeriods).toEqual(['2023'])
    expect(bar.showValues).toBe(false)
    expect(() => buildChartSpec(snapshot, { ...drafts.table, title: '  ' })).toThrow()
  })
})
