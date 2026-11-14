import { expect, test } from '@playwright/test'

const cases = [
  { path: '/explorar/inflacion', id: 'wb-inflation', provider: 'world-bank', geographies: ['MEX', 'BRA'], unit: '% anual', year: '2024', values: [4.2, 6.5] },
  { path: '/explorar/desempleo', id: 'wb-unemployment', provider: 'world-bank', geographies: ['MEX', 'BRA'], unit: '% de la fuerza laboral', year: '2024', values: [3.1, 6.8] },
  { path: '/explorar/energia-renovable', id: 'wb-renewable-share', provider: 'world-bank', geographies: ['MEX', 'BRA'], unit: '% del consumo final de energía', year: '2021', values: [12, 46.5] },
  { path: '/explorar/inegi/empresas', id: 'inegi-economic-units', provider: 'inegi-indicators', geographies: ['00', '09'], unit: 'unidades económicas', year: '2018', values: [4800157, 427959] },
  { path: '/explorar/inegi/educacion', id: 'inegi-youth-literacy', provider: 'inegi-indicators', geographies: ['00', '09'], unit: '% de personas de 15 a 24 años', year: '2025', values: [98.9, 99.2] },
] as const

for (const item of cases) {
  test(`${item.id}: consulta, dashboards y reporte`, async ({ page }) => {
    const previous = item.id === 'inegi-economic-units' ? null : item.values.map(value => value * .95)
    const observations = item.geographies.flatMap((geographyId, index) => [
      { geographyId, period: item.year, value: item.values[index], status: 'unknown' },
      ...(previous ? [{ geographyId, period: String(Number(item.year) - 1), value: previous[index], status: 'unknown' }] : []),
    ])
    const snapshot = { snapshotId: `sample-${item.id}`, indicatorId: item.id, provider: item.provider,
      query: { geographies: item.geographies, from: '2010', to: '2025' }, observations, unit: item.unit,
      frequency: item.provider === 'world-bank' ? 'annual' : 'irregular', fetchedAt: '2026-11-13T12:00:00Z', latestObservationPeriod: item.year,
      sourceUrl: item.provider === 'world-bank' ? 'https://api.worldbank.org/v2/country/MEX/indicator/TEST' : 'https://www.inegi.org.mx/servicios/api-indicadores/',
      attribution: item.provider === 'world-bank' ? 'World Development Indicators (Banco Mundial)' : 'INEGI · Banco de Indicadores',
      methodologyKey: item.id, catalogVersion: '1.1.0', cacheState: 'fresh' }
    await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
    await page.goto(item.path)
    await page.getByRole('button', { name: item.provider === 'world-bank' ? 'Consultar datos oficiales' : 'Consultar INEGI' }).click()
    await expect(page.locator('.results-section table')).toBeVisible()
    await expect(page.locator('.studio-page')).toHaveCount(5)
    await page.locator('.studio-page-open').filter({ hasText: 'Tarjetas de valor' }).click()
    await expect(page.locator('.studio-canvas .metric-card')).toHaveCount(2)
    if (item.id === 'inegi-economic-units') {
      await expect(page.locator('.results-section table')).toContainText('4,800,157')
      await expect(page.locator('.studio-page').filter({ hasText: 'Cambio entre periodos' }).getByRole('checkbox', { name: 'Al reporte' })).toBeDisabled()
    }
    await page.locator('.studio-page').filter({ hasText: 'Tarjetas de valor' }).getByRole('checkbox', { name: 'Al reporte' }).check()
    await page.getByRole('button', { name: 'Continuar al editor' }).click()
    await expect(page.locator('.report-chart-block').filter({ hasText: 'Evidencia guardada · valor' })).toHaveCount(1)
    await expect(page.locator('.report-references')).toContainText(item.provider === 'world-bank' ? 'Banco Mundial' : 'INEGI')
  })
}
