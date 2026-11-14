import { expect, test } from '@playwright/test'

function snapshot(id: 'inegi-migration-share' | 'inegi-water-share') {
  return {
    snapshotId: `sample-${id}`, indicatorId: id, provider: 'inegi-indicators',
    query: { geographies: ['00', '09'], from: '2010', to: '2025' },
    observations: ['00', '09'].flatMap((code, index) => [
      { geographyId: code, period: '2025', value: id === 'inegi-migration-share' ? 2.9 + index : 97.5 + index, status: 'unknown' },
      { geographyId: code, period: '2020', value: id === 'inegi-migration-share' ? 3.3 + index : 96.2 + index, status: 'unknown' },
      { geographyId: code, period: '2010', value: null, status: 'missing' },
    ]), unit: id === 'inegi-migration-share' ? '% de población' : '% de viviendas', frequency: 'irregular',
    fetchedAt: '2026-11-13T12:00:00Z', latestObservationPeriod: '2025',
    sourceUrl: 'https://www.inegi.org.mx/servicios/api-indicadores/', attribution: 'INEGI · Banco de Indicadores',
    methodologyKey: `INEGI:${id}`, catalogVersion: '1.1.0', cacheState: 'fresh',
  }
}

for (const [topic, id] of [['poblacion', 'inegi-migration-share'], ['vivienda', 'inegi-water-share']] as const) {
  test(`${topic}: consulta estados, edita cinco dashboards y redacta con fuente`, async ({ page }) => {
    await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot(id)) }))
    await page.goto(`/explorar/inegi/${topic}`)
    await expect(page.locator('#inegi-area-0')).toHaveValue('00')
    await expect(page.locator('#inegi-area-1')).toHaveValue('09')
    await page.getByRole('button', { name: 'Consultar INEGI' }).click()
    await expect(page.locator('.results-section table')).toContainText('Ciudad de México')
    await expect(page.locator('.studio-page')).toHaveCount(5)
    await page.locator('.studio-page-open').filter({ hasText: 'Tarjetas de valor' }).click()
    await expect(page.locator('.studio-canvas .metric-card')).toHaveCount(2)
    await page.getByText('Tipografía y colores').click()
    await page.getByLabel('Fuente general').selectOption('serif')
    await page.locator('.studio-inspector').getByLabel('Tamaño de letra (px)').fill('18')
    await page.locator('.studio-inspector').getByLabel('Alineación').selectOption('center')
    await page.getByText('Datos y series').click()
    await page.getByRole('button', { name: /Color de M.*xico \(nacional\)/ }).click()
    await page.getByLabel(/Hexadecimal de M.*xico \(nacional\)/).fill('#273026')
    await page.locator('.studio-page').filter({ hasText: 'Tarjetas de valor' }).getByRole('checkbox', { name: 'Al reporte' }).check()
    await page.locator('.studio-page-open').filter({ hasText: 'Cambio entre periodos' }).click()
    await expect(page.locator('.studio-canvas .metric-card').first()).toContainText('pp')
    await page.locator('.studio-page').filter({ hasText: 'Cambio entre periodos' }).getByRole('checkbox', { name: 'Al reporte' }).check()
    await page.getByRole('button', { name: 'Continuar al editor' }).click()
    await expect(page.locator('.report-chart-block')).toHaveCount(4)
    await expect(page.locator('.report-chart-block').filter({ hasText: 'Evidencia guardada · valor' })).toHaveClass(/chart-font-serif chart-align-center/)
    await expect(page.locator('.report-references')).toContainText('INEGI')
    await expect(page.locator('.report-references')).toContainText(id === 'inegi-migration-share' ? 'Población inmigrante' : 'Viviendas con agua entubada')
  })
}

test('los cinco dashboards de INEGI caben en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 })
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot('inegi-migration-share')) }))
  await page.goto('/explorar/inegi/poblacion')
  await page.getByRole('button', { name: 'Consultar INEGI' }).click()
  await expect(page.locator('.studio-page')).toHaveCount(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
