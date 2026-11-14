import { expect, test } from '@playwright/test'

const paths = [
  ['/explorar/inflacion', 'Consultar datos oficiales'],
  ['/explorar/desempleo', 'Consultar datos oficiales'],
  ['/explorar/energia-renovable', 'Consultar datos oficiales'],
  ['/explorar/inegi/empresas', 'Consultar INEGI'],
  ['/explorar/inegi/educacion', 'Consultar INEGI'],
] as const

for (const [path, action] of paths) {
  test(`consulta viva ampliada ${path}`, async ({ page }) => {
    test.skip(process.env.PRISMO_LIVE_MORE !== '1', 'Requiere el BFF local y el secreto INEGI configurado')
    test.setTimeout(60_000)
    await page.goto(path)
    await page.getByRole('button', { name: action }).click()
    await expect(page.locator('.results-section table')).toBeVisible({ timeout: 35_000 })
    await expect(page.locator('.studio-page')).toHaveCount(5)
    await page.locator('.studio-page').filter({ hasText: 'Tarjetas de valor' }).getByRole('checkbox', { name: 'Al reporte' }).check()
    await page.getByRole('button', { name: 'Continuar al editor' }).click()
    await expect(page.locator('.report-chart-block').filter({ hasText: 'Evidencia guardada · valor' })).toHaveCount(1)
    await expect(page.locator('.report-references')).toContainText(path.includes('/inegi/') ? 'INEGI' : 'Banco Mundial')
  })
}
