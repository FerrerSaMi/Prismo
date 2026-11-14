import { expect, test } from '@playwright/test'

test('Inicio acredita INEGI y Banco Mundial con LogoLoop', async ({ page }) => {
  await page.goto('/')
  const credits = page.getByRole('region', { name: 'Fuentes de datos' })
  await expect(credits.getByRole('link', { name: 'INEGI' })).toHaveAttribute('href', 'https://www.inegi.org.mx/servicios/api-indicadores/')
  await expect(credits.getByRole('link', { name: 'Banco Mundial' })).toHaveAttribute('href', 'https://data.worldbank.org/')
  const track = credits.locator('.logo-loop-track')
  await expect(track).toHaveCSS('animation-name', 'logo-loop-slide')
  await credits.locator('.logo-loop').hover()
  await expect(track).toHaveCSS('animation-play-state', 'paused')
})

test('los créditos respetan movimiento reducido y el ancho móvil', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 760 })
  await page.goto('/')
  await expect(page.locator('.logo-loop-track')).toHaveCSS('animation-name', 'none')
  await expect(page.getByRole('region', { name: 'Fuentes de datos' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
