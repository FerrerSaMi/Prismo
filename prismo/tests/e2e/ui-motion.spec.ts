import { expect, test } from '@playwright/test'

const snapshot = {
  snapshotId: 'motion-snapshot', indicatorId: 'wb-forest-area-share', provider: 'world-bank',
  query: { geographies: ['MEX', 'BRA'], from: '2000', to: '2024' },
  observations: [
    { period: '2024', geographyId: 'MEX', value: 34.15, status: 'unknown' },
    { period: '2024', geographyId: 'BRA', value: 58.55, status: 'unknown' },
    { period: '2023', geographyId: 'MEX', value: 34.3, status: 'unknown' },
    { period: '2023', geographyId: 'BRA', value: 58.7, status: 'unknown' },
  ],
  unit: '% de superficie terrestre', frequency: 'annual', fetchedAt: '2026-11-13T12:00:00Z',
  sourceUrl: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
  attribution: 'FAOSTAT / FAO, vía Banco Mundial', methodologyKey: 'WDI:AG.LND.FRST.ZS', catalogVersion: '1.0.0', cacheState: 'fresh',
}

test('la entrada desde Inicio muestra transición de carga', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Entrar al espacio/ }).first().click()
  await expect(page.getByRole('status').filter({ hasText: 'Abriendo tu espacio de trabajo' })).toBeVisible()
  await expect(page).toHaveURL(/\/explorar$/)
  await expect(page.getByRole('status').filter({ hasText: 'Abriendo tu espacio de trabajo' })).toHaveCount(0)
})

test('HoloCard y Stepper acompañan el recorrido hasta el reporte', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  const initialSteps = page.getByRole('navigation', { name: 'Progreso del reporte' })
  await expect(initialSteps.locator('[aria-current="step"]').first()).toContainText('Consulta')
  await expect(initialSteps.locator('.stepper-label').first()).toHaveCSS('text-decoration-line', 'none')
  await expect(initialSteps.locator('li').first()).toHaveAttribute('data-state', 'current')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  const dashboardSteps = page.getByRole('navigation', { name: 'Progreso del reporte' }).first()
  await expect(dashboardSteps.locator('[aria-current="step"]')).toContainText('Dashboards')
  await expect(dashboardSteps.locator('li').first()).toHaveAttribute('data-state', 'complete')
  await expect(dashboardSteps.locator('.stepper-label').first()).toHaveCSS('text-decoration-line', 'underline')
  await expect(dashboardSteps.locator('.stepper-label').nth(1)).toHaveCSS('text-decoration-line', 'none')
  const cards = page.locator('.studio-page.holo-card')
  await expect(cards).toHaveCount(5)
  const box = await cards.first().boundingBox()
  if (!box) throw new Error('No encontramos la tarjeta de dashboard')
  await page.mouse.move(box.x + 20, box.y + 20)
  await expect.poll(() => cards.first().evaluate(card => card.style.getPropertyValue('--holo-x'))).not.toBe('50%')
  await page.locator('.studio-page-open').filter({ hasText: 'Tabla de valores' }).click()
  await expect(page.locator('.studio-page.is-active')).toContainText('Tabla de valores')
  const menu = page.getByRole('button', { name: 'Tipografía y colores' }).first()
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await expect(page).toHaveURL(/\/reportes\/[a-f0-9-]+$/)
  const report = page.getByRole('region', { name: 'Editor de reporte' })
  await expect(report).toBeVisible()
  await expect(report.getByRole('navigation', { name: 'Progreso del reporte' }).locator('[aria-current="step"]')).toContainText('Reporte')
})
