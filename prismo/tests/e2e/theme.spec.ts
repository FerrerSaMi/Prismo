import { expect, test } from '@playwright/test'

test('la paleta cambia entre marfil y grafito y conserva la elección', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(246, 240, 228)')
  await expect(page.locator('.hero-panel')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(23, 25, 31)')
  await expect(page.locator('.hero-panel')).toHaveCSS('background-color', 'rgb(39, 43, 52)')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('link', { name: /Entrar al espacio/ }).first().click()
  await expect(page).toHaveURL(/\/explorar$/)
  await expect(page.locator('.catalog-section').first()).toHaveCSS('background-color', 'rgb(39, 43, 52)')
  await page.getByRole('button', { name: 'Activar modo claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('el menú usa tres líneas sin borde y abre la barra lateral', async ({ page }) => {
  await page.goto('/explorar')
  const collapse = page.getByRole('button', { name: 'Contraer barra lateral' })
  await expect(collapse.locator('.menu-glyph > span')).toHaveCount(3)
  await expect(collapse).toHaveCSS('border-top-width', '0px')
  await collapse.click()
  const open = page.getByRole('button', { name: 'Desplegar menú' })
  await expect(open).toBeVisible()
  await expect(open.locator('.menu-glyph > span')).toHaveCount(3)
  await expect(open).toHaveCSS('border-top-width', '0px')
  await open.click()
  await expect(page.locator('.workspace')).toHaveClass(/sidebar-open/)
})

test('el editor conserva hojas blancas legibles dentro del modo oscuro', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('prismo-theme', 'dark'))
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
    snapshotId: 'theme-snapshot', indicatorId: 'wb-forest-area-share', provider: 'world-bank',
    query: { geographies: ['MEX', 'BRA'], from: '2000', to: '2024' },
    observations: [
      { period: '2024', geographyId: 'MEX', value: 34.1, status: 'unknown' },
      { period: '2024', geographyId: 'BRA', value: 58.5, status: 'unknown' },
    ],
    unit: '% de superficie terrestre', frequency: 'annual', fetchedAt: '2026-11-14T12:00:00Z',
    sourceUrl: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
    attribution: 'Banco Mundial', methodologyKey: 'WDI:AG.LND.FRST.ZS', catalogVersion: '1.0.0', cacheState: 'fresh',
  }) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.locator('.studio-pages')).toHaveCSS('background-color', 'rgb(39, 43, 52)')
  await expect(page.locator('.studio-artboard')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(page.locator('.builder-footer')).toHaveCSS('background-color', 'rgb(39, 43, 52)')
  await expect(page.locator('.builder-footer strong')).toHaveCSS('color', 'rgb(246, 240, 228)')
  await expect(page.locator('.studio-artboard .chart-source')).toHaveCSS('color', 'rgb(81, 70, 61)')
  await page.getByLabel('Enviar a').click()
  await expect(page.getByLabel('Enviar a')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('listbox', { name: 'Opciones' })).toHaveCSS('background-color', 'rgb(39, 43, 52)')
  await page.getByRole('option', { name: 'Nuevo reporte' }).last().click()
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await expect(page.locator('.paper-page-bg').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(page.locator('.report-references h2')).toHaveCSS('color', 'rgb(23, 25, 31)')
})

test('el menú y el tema siguen accesibles en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 })
  await page.goto('/explorar')
  await page.getByRole('button', { name: 'Desplegar menú' }).click()
  await expect(page.getByRole('complementary', { name: 'Menú del espacio de trabajo' })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar menú' }).last().click()
  await expect(page.getByRole('button', { name: 'Desplegar menú' })).toBeFocused()
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
