import { expect, test } from '@playwright/test'

for (const topic of ['poblacion', 'vivienda'] as const) {
  test(`consulta viva INEGI ${topic} hasta el reporte`, async ({ page }) => {
    test.skip(process.env.PRISMO_LIVE_INEGI !== '1', 'Requiere el BFF local con INEGI_TOKEN configurado')
    await page.goto(`/explorar/inegi/${topic}`)
    await page.getByRole('button', { name: 'Consultar INEGI' }).click()
    await expect(page.locator('.results-section table')).toContainText('Ciudad de México')
    await expect(page.locator('.studio-page')).toHaveCount(5)
    await page.locator('.studio-page-open').filter({ hasText: 'Cambio entre periodos' }).click()
    await expect(page.locator('.studio-canvas .metric-card').first()).toContainText('pp')
    await page.locator('.studio-page').filter({ hasText: 'Cambio entre periodos' }).getByRole('checkbox', { name: 'Al reporte' }).check()
    await page.getByRole('button', { name: 'Continuar al editor' }).click()
    await expect(page.locator('.report-chart-block')).toHaveCount(3)
    await expect(page.locator('.report-references')).toContainText('INEGI')
  })
}
