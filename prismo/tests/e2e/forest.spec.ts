import { expect, test } from '@playwright/test'

const snapshot = {
  snapshotId: 'e2e-snapshot', indicatorId: 'wb-forest-area-share', provider: 'world-bank',
  query: { geographies: ['MEX', 'BRA'], from: '2000', to: '2024' },
  observations: [
    { period: '2024', geographyId: 'MEX', value: 34.1538414053859, status: 'unknown' },
    { period: '2024', geographyId: 'BRA', value: 58.5468405650061, status: 'unknown' },
    { period: '2023', geographyId: 'MEX', value: null, status: 'missing' },
    { period: '2023', geographyId: 'BRA', value: 58.9364069039284, status: 'unknown' },
  ],
  unit: '% de superficie terrestre', frequency: 'annual', fetchedAt: '2026-11-13T12:00:00Z',
  latestObservationPeriod: '2024', sourceUrl: 'https://api.worldbank.org/v2/country/MX/indicator/AG.LND.FRST.ZS?format=json',
  attribution: 'FAOSTAT / FAO, vía World Development Indicators (Banco Mundial)',
  methodologyKey: 'WDI:AG.LND.FRST.ZS', catalogVersion: '1.0.0', cacheState: 'fresh',
}

test('abre el primer indicador y muestra tabla con procedencia', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar')
  await page.locator('a[href="/explorar/bosques"]').click()
  await expect(page.getByRole('heading', { name: 'Superficie forestal: compara países' })).toBeVisible()
  await expect(page.locator('#country-0')).toHaveValue('MEX')
  await expect(page.locator('#country-1')).toHaveValue('BRA')
  await expect(page.getByRole('heading', { name: 'Diseña las vistas para tu reporte' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.locator('.results-section table')).toContainText('34.154 %')
  await expect(page.locator('.results-section table')).toContainText('58.547 %')
  await expect(page.locator('.results-section table')).toContainText('Sin dato')
  await expect(page.getByRole('heading', { name: 'Diseña las vistas para tu reporte' })).toBeVisible()
  await expect(page.locator('.studio-page')).toHaveCount(5)
  await page.locator('.studio-page-open').first().focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('.studio-page-open').nth(1)).toBeFocused()
  await expect(page.locator('.studio-canvas .forest-chart svg')).toHaveCount(1)
  await page.getByRole('slider', { name: /Alto del dashboard/ }).press('Home')
  await expect(page.locator('.studio-canvas .forest-chart')).toHaveCSS('height', '180px')
  await page.locator('.studio-page-open').filter({ hasText: 'Comparación de territorios' }).click()
  await expect(page.locator('.studio-canvas .forest-chart svg')).toHaveCount(1)
  await page.locator('.studio-page-open').filter({ hasText: 'Tabla de valores' }).click()
  await expect(page.locator('.studio-canvas table')).toContainText('58.547 %')
  await expect(page.getByRole('heading', { name: 'De dónde vienen estos datos' })).toBeVisible()
  await expect(page.getByText('FAOSTAT / FAO, vía World Development Indicators (Banco Mundial)', { exact: true })).toBeVisible()
})

test('mantiene visible la carga de la API al menos dos segundos', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  const started = Date.now()
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.getByRole('status', { name: 'Consultando la fuente oficial' })).toBeVisible()
  await page.waitForTimeout(1100)
  await expect(page.getByRole('status', { name: 'Consultando la fuente oficial' })).toBeVisible()
  await expect(page.locator('.results-section table')).toBeVisible()
  expect(Date.now() - started).toBeGreaterThanOrEqual(1900)
})

test('las listas restringen países y años y la consulta usa la selección aplicada', async ({ page }) => {
  let requestedUrl = ''
  await page.route('**/api/v1/indicators/**', route => {
    requestedUrl = route.request().url()
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      ...snapshot,
      query: { geographies: ['MEX', 'USA'], from: '2020', to: '2024' },
      observations: snapshot.observations.map(item => item.geographyId === 'BRA' ? { ...item, geographyId: 'USA' } : item),
    }) })
  })
  await page.goto('/explorar/bosques')
  await expect(page.locator('.forest-filters input[type="number"]')).toHaveCount(0)
  await expect(page.locator('#country-0 option[value="BRA"]')).toBeDisabled()
  await page.locator('#country-1').selectOption('USA')
  await page.getByLabel('Desde').selectOption('2020')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.locator('.results-section table')).toContainText('Estados Unidos')
  expect(requestedUrl).toContain('geography=MEX%2CUSA')
  expect(requestedUrl).toContain('from=2020')
  expect(requestedUrl).toContain('to=2024')
})

test('con un solo país no ofrece una comparación entre países', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
    ...snapshot,
    query: { ...snapshot.query, geographies: ['MEX'] },
    observations: snapshot.observations.filter(item => item.geographyId === 'MEX'),
  }) }))
  await page.goto('/explorar/bosques')
  await page.locator('#country-1').selectOption('')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  const comparisonPage = page.locator('.studio-page').filter({ hasText: 'Comparación de territorios' })
  await expect(comparisonPage.getByRole('checkbox', { name: 'Al reporte' })).toBeDisabled()
  await comparisonPage.locator('.studio-page-open').click()
  await expect(page.locator('.studio-canvas')).toContainText('Consulta dos países')
})

test('crea un reporte editable y conserva gráficos, texto y fuente tras recargar', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(route.request().url().includes('from=2010') ? { ...snapshot, snapshotId: 'e2e-snapshot-2', query: { ...snapshot.query, from: '2010' } } : snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.locator('.results-section table')).toBeVisible()
  const tablePage = page.locator('.studio-page').filter({ hasText: 'Tabla de valores' })
  await tablePage.locator('.studio-page-open').click()
  await tablePage.getByRole('checkbox', { name: 'Al reporte' }).check()
  await page.getByText('Datos y series').click()
  await page.getByRole('button', { name: 'Color de cabecera' }).click()
  await page.getByLabel('Hexadecimal de cabecera').fill('#273026')
  await page.getByLabel('Título de la vista').fill('Tabla de bosques elegidos')
  for (let index = 0; index < 4; index += 1) await tablePage.getByRole('button', { name: 'Subir Tabla de valores' }).click()
  await page.locator('.studio-page-open').filter({ hasText: 'Tendencia en el tiempo' }).click()
  await page.getByRole('button', { name: /Color de M/ }).click()
  await page.getByLabel(/Hexadecimal de M/).fill('#6656a4')
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await expect(page).toHaveURL(/\/reportes\/[a-f0-9-]+$/)
  await expect(page.getByText('Evidencia guardada · tendencia')).toBeVisible()
  await expect(page.getByText('Evidencia guardada · comparación')).toBeVisible()
  await expect(page.getByText('Evidencia guardada · tabla')).toBeVisible()
  await expect(page.locator('.report-chart-block').first()).toContainText('Tabla de bosques elegidos')
  await expect(page.locator('.report-chart-block table thead')).toBeVisible()
  await expect.poll(() => page.locator('.report-chart-block').filter({ hasText: 'Evidencia guardada · tendencia' }).first().locator('svg').evaluate(svg => svg.outerHTML.toLowerCase().includes('#6656a4'))).toBe(true)
  await page.getByLabel('Título del documento').fill('Bosques de México y Brasil')
  await page.getByRole('button', { name: 'Negrita' }).focus()
  await expect(page.getByRole('tooltip', { name: 'Negrita' })).toBeVisible()
  await page.getByText('Análisis del autor:').click()
  await page.keyboard.type('Comentario propio de prueba.')
  await expect(page.getByRole('status').filter({ hasText: 'Guardado localmente' })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Título del documento')).toHaveValue('Bosques de México y Brasil')
  await expect(page.locator('.report-editor-content')).toContainText('Comentario propio de prueba.')
  await expect(page.getByText('Evidencia guardada · tendencia')).toBeVisible()
  await expect(page.getByText('Evidencia guardada · comparación')).toBeVisible()
  await expect(page.locator('.report-chart-block table thead')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Fuentes de este reporte' })).toBeVisible()
  await page.getByRole('button', { name: 'Mis reportes' }).click()
  await expect(page.getByRole('link', { name: /Bosques de México y Brasil/ })).toBeVisible()
  await page.getByRole('link', { name: 'Explorar datos' }).click()
  await page.locator('a[href="/explorar/bosques"]').click()
  await page.getByLabel('Desde').selectOption('2010')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.locator('.results-section table')).toBeVisible()
  await page.getByLabel('Enviar a').selectOption({ label: 'Bosques de México y Brasil' })
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await expect(page.getByText('Evidencia guardada · tendencia')).toHaveCount(2)
  await expect(page.locator('.report-references p')).toHaveCount(2)
})

test('un fallo de la API deja un error recuperable', async ({ page }) => {
  let recovered = false
  await page.route('**/api/v1/indicators/**', route => {
    return route.fulfill(recovered
      ? { status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }
      : { status: 503, contentType: 'application/json', body: JSON.stringify({ code: 'UPSTREAM_UNAVAILABLE', message: 'La fuente oficial no está disponible' }) })
  })
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.getByRole('alert')).toContainText('La fuente oficial no está disponible')
  recovered = true
  await page.getByRole('button', { name: 'Reintentar consulta' }).click()
  await expect(page.locator('.results-section table')).toBeVisible()
})

test('edita, mueve, borra y vuelve a insertar dashboards dentro del reporte', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await expect(page.locator('.report-chart-block')).toHaveCount(2)
  const first = page.locator('.report-chart-block').first()
  await first.getByRole('button', { name: /Opciones de/ }).click()
  await first.getByLabel('Título del dashboard', { exact: true }).fill('Mi tendencia editada')
  await first.getByRole('slider', { name: 'Anchura del dashboard' }).press('ArrowLeft')
  const corner = await first.locator('.chart-resize').boundingBox()
  if (!corner) throw new Error('Falta la esquina para redimensionar')
  await page.mouse.move(corner.x + corner.width / 2, corner.y + corner.height / 2)
  await page.mouse.down()
  await page.mouse.move(corner.x - 80, corner.y + corner.height / 2, { steps: 5 })
  await page.mouse.up()
  await expect(first.getByRole('slider', { name: 'Anchura del dashboard' })).toHaveAttribute('aria-valuenow', /^(3[5-9]|[4-9][0-9])$/)
  await first.getByText('Tipografía y colores').click()
  await first.getByLabel('Fuente del dashboard').selectOption('serif')
  await first.getByLabel('Tamaño de letra del dashboard').fill('20')
  await first.getByText('Series y acciones').click()
  await first.getByRole('button', { name: /Color de M/ }).click()
  await first.getByLabel(/Hexadecimal de M/).fill('#6656a4')
  await first.getByRole('button', { name: '↓ Bajar' }).click()
  await expect(page.locator('.report-chart-block').last()).toContainText('Mi tendencia editada')
  await page.locator('#report-title').focus()
  await page.getByLabel('Fuente del documento').selectOption('serif')
  await page.getByLabel('Tamaño de letra del documento').fill('18')
  await page.locator('.report-chart-block').first().getByRole('button', { name: /Opciones de/ }).click()
  await page.locator('.report-chart-block').first().getByText('Series y acciones').click()
  const deleteDashboard = page.locator('.report-chart-block').first().getByRole('button', { name: 'Eliminar dashboard' })
  await deleteDashboard.hover()
  await page.mouse.down()
  await page.waitForTimeout(1300)
  await page.mouse.up()
  await expect(page.locator('.report-chart-block')).toHaveCount(1)
  await page.locator('.report-editor-content .tiptap p').last().click()
  await page.getByRole('button', { name: '＋ Dashboard' }).click()
  await page.getByRole('button', { name: /Tabla ·/ }).click()
  await expect(page.locator('.report-chart-block')).toHaveCount(2)
  await expect(page.locator('.report-stamp')).toContainText('Creado con Prismo')
  await expect(page.getByRole('status').filter({ hasText: 'Guardado localmente' })).toBeVisible()
  await page.reload()
  await expect(page.locator('.report-chart-block.chart-font-serif')).toContainText('Mi tendencia editada')
  await expect(page.locator('.report-paper.paper-font-serif')).toBeVisible()
  await expect(page.locator('.report-chart-block')).toHaveCount(2)
})

test('la cabecera de Inicio permanece al borde superior al desplazarse', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 })
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(async () => page.locator('.site-header').evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(0)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(async () => page.locator('.site-header').evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(0)
})

test('el dashboard mantiene los controles dentro del ancho móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 })
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await expect(page.locator('.results-section table')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continuar al editor' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('borra un reporte desde Mis reportes y ofrece inserción junto al cursor', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await page.locator('.report-editor-content .tiptap p').last().click()
  await expect(page.getByRole('button', { name: '＋ Dashboard' })).toBeVisible()
  await page.getByRole('button', { name: '＋ Dashboard' }).click()
  await expect(page.locator('.caret-dashboard-options')).toContainText('Tabla')
  await page.getByRole('button', { name: '← Mis reportes' }).click()
  const deleteReport = page.getByRole('button', { name: /Eliminar Análisis de superficie forestal/ })
  const positions = await page.locator('.report-list-card').first().evaluate(card => {
    const link = card.querySelector('a')!.getBoundingClientRect()
    const button = card.querySelector('button')!.getBoundingClientRect()
    return { linkRight: link.right, buttonRight: button.right, buttonLeft: button.left, cardTop: card.getBoundingClientRect().top, buttonTop: button.top }
  })
  expect(positions.buttonRight).toBeLessThanOrEqual(positions.linkRight - 8)
  expect(positions.buttonLeft).toBeGreaterThan(positions.linkRight - 70)
  expect(positions.buttonTop).toBeGreaterThanOrEqual(positions.cardTop)
  await deleteReport.click()
  await expect(page.getByRole('heading', { name: 'Aún no hay reportes' })).not.toBeVisible()
  await deleteReport.hover()
  await page.mouse.down()
  await page.waitForTimeout(1300)
  await page.mouse.up()
  await expect(page.getByRole('heading', { name: 'Aún no hay reportes' })).toBeVisible()
})

test('arrastra un dashboard entre bloques del documento', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await page.locator('.report-chart-block').first().locator('.chart-drag-handle').dragTo(page.locator('.report-editor-content .tiptap p').last())
  await expect(page.locator('.report-chart-block')).toHaveCount(2)
  await expect(page.locator('.report-chart-block').last()).toContainText('Tendencia de superficie forestal')
})

test('alinea texto y dashboards y conserva ambas posiciones al recargar', async ({ page }) => {
  await page.route('**/api/v1/indicators/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(snapshot) }))
  await page.goto('/explorar/bosques')
  await page.getByRole('button', { name: 'Consultar datos oficiales' }).click()
  await page.getByRole('button', { name: 'Continuar al editor' }).click()
  await page.locator('.report-editor-content .tiptap p').last().click()
  await page.getByRole('button', { name: /Formato/ }).click()
  await page.getByRole('button', { name: 'Centrar texto' }).click()
  await expect(page.locator('.report-editor-content .tiptap p').last()).toHaveAttribute('style', /text-align: center/)
  const chart = page.locator('.report-chart-block').first()
  await chart.getByRole('button', { name: /Opciones de/ }).click()
  await chart.getByLabel('Alineación del dashboard').selectOption('right')
  await chart.getByRole('slider', { name: 'Anchura del dashboard' }).press('ArrowLeft')
  await expect(chart).toHaveClass(/chart-align-right/)
  await expect(page.getByRole('status').filter({ hasText: 'Guardado localmente' })).toBeVisible()
  await page.reload()
  await expect(page.locator('.report-editor-content .tiptap p').last()).toHaveAttribute('style', /text-align: center/)
  await expect(page.locator('.report-chart-block').first()).toHaveClass(/chart-align-right/)
})
