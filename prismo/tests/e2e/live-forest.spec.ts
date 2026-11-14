import { expect, test } from '@playwright/test'

test('consulta viva de México y Brasil hasta el dashboard', async ({ page }) => {
  test.skip(process.env.PRISMO_LIVE_WB !== '1', 'Requiere el backend local y acceso al Banco Mundial')
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  const table = page.locator('.results-section table')
  await expect(table).toBeVisible({ timeout: 25_000 })
  await expect(table).toContainText('México')
  await expect(table).toContainText('Brasil')
  await expect(table.getByRole('row', { name: /^2024 / })).toContainText('%')
  await expect(page.locator('.studio-canvas .forest-chart svg')).toHaveCount(1)
  await page.locator('.studio-page-open').filter({ hasText: 'Comparación de países' }).click()
  await expect(page.locator('.studio-canvas .forest-chart svg')).toHaveCount(1)
})
