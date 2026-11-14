import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const snapshot = {
  snapshotId: 'pdf-snapshot', indicatorId: 'wb-forest-area-share', provider: 'world-bank',
  query: { geographies: ['MEX', 'BRA'], from: '2020', to: '2024' },
  observations: [
    { period: '2024', geographyId: 'MEX', value: 34.153, status: 'unknown' },
    { period: '2024', geographyId: 'BRA', value: 58.546, status: 'unknown' },
    { period: '2020', geographyId: 'MEX', value: 35.2, status: 'unknown' },
    { period: '2020', geographyId: 'BRA', value: 60.1, status: 'unknown' },
  ],
  unit: '% de superficie terrestre', frequency: 'annual', fetchedAt: '2026-11-13T12:00:00Z',
  latestObservationPeriod: '2024', sourceUrl: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
  attribution: 'FAOSTAT / FAO, vía Banco Mundial', methodologyKey: 'WDI:AG.LND.FRST.ZS', catalogVersion: '1.0.0', cacheState: 'fresh',
}

test('descarga un PDF con la consulta y los dashboards', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  page.on('pageerror', error => process.stderr.write(`PDF page error: ${error.message}\n`))
  page.on('console', message => { if (message.type() === 'error') process.stderr.write(`PDF console: ${message.text()}\n`) })
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await page.locator('.report-editor-content .tiptap h1').first().selectText()
  await page.getByRole('button', { name: 'Color de texto' }).click()
  await page.getByLabel('Color hexadecimal del texto').fill('#225588')
  await expect(page.locator('.report-editor-content .tiptap h1 span[style*="color"]')).toBeVisible()
  const hex = page.getByLabel('Color hexadecimal del texto')
  await hex.fill('')
  await hex.pressSequentially('#117744')
  await expect(page.locator('.report-editor-content .tiptap h1 span[style*="17, 119, 68"], .report-editor-content .tiptap h1 span[style*="#117744"]')).toBeVisible()
  await page.locator('#report-title').focus()
  await page.getByLabel('Fuente del título del reporte').selectOption('verdana')
  await page.getByRole('button', { name: /Color del t/ }).click()
  await page.getByLabel(/Color hexadecimal del t.*del reporte/).fill('#334455')
  await expect(page.locator('#report-title')).toHaveCSS('color', 'rgb(51, 68, 85)')
  await page.getByRole('button', { name: 'Vista previa' }).click()
  await expect(page.getByRole('dialog', { name: 'Vista previa del PDF' })).toBeVisible()
  await expect(page.getByTitle('Documento PDF antes de descargar')).toHaveAttribute('src', /^blob:/)
  await page.getByRole('button', { name: 'Cerrar vista previa' }).click()
  await page.locator('.report-editor-content .tiptap p').last().fill('Análisis de árboles, educación y territorio. '.repeat(600))
  await expect(page.getByText(/páginas/).first()).toBeVisible()
  await expect.poll(() => page.locator('.page-break-spacer').count()).toBeGreaterThan(0)
  const textInPageGap = await page.evaluate(() => {
    const paper = document.querySelector('.report-paper') as HTMLElement
    const paragraph = document.querySelector('.report-editor-content .tiptap p:last-child') as HTMLElement
    const top = paper.getBoundingClientRect().top
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      for (let index = 0; index < node.textContent!.length; index += 30) {
        const range = document.createRange()
        range.setStart(node, index)
        range.setEnd(node, Math.min(index + 1, node.textContent!.length))
        const rect = range.getBoundingClientRect()
        if (rect.height > 0 && (rect.top - top) % 1122 > 1040) return true
      }
    }
    return false
  })
  expect(textInPageGap).toBe(false)
  await expect.poll(async () => page.locator('.paper-page-bg').count()).toBeGreaterThan(1)
  const layout = await page.evaluate(() => {
    const paper = document.querySelector('.report-paper') as HTMLElement
    const references = document.querySelector('.report-references') as HTMLElement
    const stamp = document.querySelector('.report-stamp') as HTMLElement
    const top = paper.getBoundingClientRect().top
    const referenceBox = references.getBoundingClientRect()
    const stampBox = stamp.getBoundingClientRect()
    return {
      pages: document.querySelectorAll('.paper-page-bg').length,
      referenceHeight: referenceBox.height,
      referenceTop: (referenceBox.top - top) % 1122,
      referenceBottom: (referenceBox.bottom - top) % 1122,
      stampPage: Math.floor((stampBox.top - top) / 1122) + 1,
      stampTop: (stampBox.top - top) % 1122,
      stampBottom: (stampBox.bottom - top) % 1122,
    }
  })
  expect(layout.stampPage).toBe(layout.pages)
  expect(layout.stampTop).toBeGreaterThanOrEqual(1000)
  expect(layout.stampBottom).toBeLessThan(1100)
  if (layout.referenceHeight <= 860) {
    expect(layout.referenceTop).toBeGreaterThanOrEqual(76)
    expect(layout.referenceBottom).toBeLessThanOrEqual(1000)
  }
  await expect(page.getByRole('status').filter({ hasText: 'Guardado localmente' })).toBeVisible()
  await page.reload()
  await expect(page.locator('#report-title')).toHaveCSS('color', 'rgb(51, 68, 85)')
  await expect(page.locator('.report-editor-content .tiptap h1 span[style*="color"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Descargar PDF' })).toBeVisible()
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Descargar PDF' }).click()])
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  const bytes = await readFile(await download.path())
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-')
  expect(bytes.length).toBeGreaterThan(3000)
  await download.saveAs(testInfo.outputPath('reporte.pdf'))
})
