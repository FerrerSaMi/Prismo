import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import AnimatedList from './components/AnimatedList'
import WorkspaceEntryLink from './components/WorkspaceEntryLink'
import HoloCard from './components/HoloCard'
import LogoLoop from './components/LogoLoop'
import './App.css'
import './Theme.css'

const ForestExplorer = lazy(() => import('./features/explorer/ForestExplorer'))
const InegiExplorer = lazy(() => import('./features/explorer/InegiExplorer'))
const ReportsList = lazy(() => import('./features/reports/ReportsList'))
const ReportEditor = lazy(() => import('./features/reports/ReportEditor'))
type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  try { return localStorage.getItem('prismo-theme') === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === 'dark'
  return <button type="button" className="theme-toggle" aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'} title={dark ? 'Activar modo claro' : 'Activar modo oscuro'} aria-pressed={dark} onClick={onToggle}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" />}</svg>
  </button>
}

function MenuGlyph() {
  return <span className="menu-glyph" aria-hidden="true"><span /><span /><span /></span>
}

const categories = [
  ['CAT-01', 'Inflación', 'Economía y finanzas'],
  ['CAT-02', 'Actividad económica', 'Economía y finanzas'],
  ['CAT-03', 'Empleo', 'Economía y finanzas'],
  ['CAT-04', 'Ingresos y gasto', 'Economía y finanzas'],
  ['CAT-05', 'Tasas y tipo de cambio', 'Economía y finanzas'],
  ['CAT-06', 'Empresas', 'Economía y finanzas'],
  ['CAT-07', 'Población', 'Sociedad y territorio'],
  ['CAT-08', 'Vivienda', 'Sociedad y territorio'],
  ['CAT-09', 'Educación', 'Sociedad y territorio'],
  ['CAT-10', 'Medio ambiente', 'Desarrollo sostenible'],
] as const

const groups = ['Sociedad y territorio', 'Desarrollo sostenible', 'Economía y finanzas'] as const
const searchKey = (value: string) => value.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const categoryLinks: Record<string, Array<{ title: string; description: string; source: string; href: string }>> = {
  'CAT-01': [{ title: 'Inflación al consumidor', description: 'Variación anual del índice de precios al consumidor entre países.', source: 'Banco Mundial · FP.CPI.TOTL.ZG', href: '/explorar/inflacion' }],
  'CAT-03': [{ title: 'Desempleo total', description: 'Porcentaje de la fuerza laboral sin empleo; estimación modelada de la OIT.', source: 'Banco Mundial / OIT · SL.UEM.TOTL.ZS', href: '/explorar/desempleo' }],
  'CAT-06': [{ title: 'Unidades económicas', description: 'Establecimientos del sector privado y paraestatal en México y entidades.', source: 'INEGI · 5300000001', href: '/explorar/inegi/empresas' }],
  'CAT-07': [{ title: 'Población inmigrante', description: 'Porcentaje de población inmigrante por entidad y a nivel nacional.', source: 'INEGI · 3104003001', href: '/explorar/inegi/poblacion' }],
  'CAT-08': [{ title: 'Viviendas con agua entubada', description: 'Porcentaje de viviendas con agua entubada en México y entidades.', source: 'INEGI · 3114005001', href: '/explorar/inegi/vivienda' }],
  'CAT-09': [{ title: 'Alfabetización juvenil', description: 'Tasa de alfabetización de personas de 15 a 24 años.', source: 'INEGI · 1002000050', href: '/explorar/inegi/educacion' }],
  'CAT-10': [
    { title: 'Superficie forestal', description: 'Proporción del territorio terrestre cubierto por bosque.', source: 'Banco Mundial / FAO · AG.LND.FRST.ZS', href: '/explorar/bosques' },
    { title: 'Consumo de energía renovable', description: 'Participación renovable en el consumo final de energía.', source: 'Banco Mundial / AIE · EG.FEC.RNEW.ZS', href: '/explorar/energia-renovable' },
  ],
}

function Brand() {
  return <NavLink className="brand" to="/" aria-label="Prismo, ir al inicio"><img src="/PrismoLogo-transparent.png" width="44" height="44" alt="" /><span>Prismo</span></NavLink>
}

function LandingLayout({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return <div className="landing-layout"><a className="skip-link" href="#main-content">Saltar al contenido</a><header className="site-header"><div className="shell header-inner"><Brand /><div className="header-actions"><ThemeToggle theme={theme} onToggle={onToggleTheme} /><WorkspaceEntryLink className="button button-secondary landing-entry">Entrar al espacio <span aria-hidden="true">→</span></WorkspaceEntryLink></div></div></header><main id="main-content"><Outlet /></main><footer className="site-footer"><div className="shell footer-inner"><span>Prismo · Del dato al reporte, con evidencia.</span><span>Datos oficiales</span></div></footer></div>
}

type IconName = 'search' | 'document' | 'help'

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    document: <><path d="M6 2h9l4 4v16H6zM15 2v5h4M9 12h7M9 16h7" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01" /></>,
  }
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const workspaceLinks: { to: string; label: string; description: string; icon: IconName }[] = [
  { to: '/explorar', label: 'Explorar datos', description: 'Consulta indicadores oficiales y revisa su procedencia', icon: 'search' },
  { to: '/reportes', label: 'Mis reportes', description: 'Tu espacio para escribir y conservar evidencia', icon: 'document' },
  { to: '/ayuda', label: 'Ayuda y fuentes', description: 'Entiende la procedencia y los límites de cada dato', icon: 'help' },
]

function WorkspaceLayout({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 800px)').matches)
  const [sidebarOpen, setSidebarOpen] = useState(() => !window.matchMedia('(max-width: 800px)').matches)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const sidebarToggleRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
    if (isMobile) window.requestAnimationFrame(() => menuToggleRef.current?.focus())
  }, [isMobile])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 800px)')
    const update = () => { setIsMobile(query.matches); setSidebarOpen(!query.matches) }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isMobile || !sidebarOpen) return
    window.requestAnimationFrame(() => sidebarToggleRef.current?.focus())
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeSidebar() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMobile, sidebarOpen, closeSidebar])

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  const current = workspaceLinks.find(link => location.pathname === link.to || location.pathname.startsWith(`${link.to}/`))

  return <div className={`workspace ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <a className="skip-link" href="#main-content">Saltar al contenido</a>
    {isMobile && sidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Cerrar menú" onClick={closeSidebar} />}
    <aside id="workspace-sidebar" className="sidebar" inert={isMobile && !sidebarOpen} aria-label="Menú del espacio de trabajo">
      <div className="sidebar-brand"><Brand /></div>
      <p className="sidebar-caption">ESPACIO DE TRABAJO</p>
      <AnimatedList as="nav" label="Navegación del espacio de trabajo" className="side-nav" animation="slide">{workspaceLinks.map(link => <NavLink key={link.to} to={link.to} title={!sidebarOpen ? link.label : undefined} onClick={() => { if (isMobile) closeSidebar() }}><NavIcon name={link.icon} /><span className="nav-label">{link.label}</span></NavLink>)}</AnimatedList>
      <div className="sidebar-foot"><div className="sidebar-status"><span className="status-dot" aria-hidden="true" /><span className="nav-label">Datos oficiales</span></div><button ref={sidebarToggleRef} type="button" className="sidebar-toggle" aria-controls="workspace-sidebar" aria-expanded={sidebarOpen} aria-label={isMobile ? 'Cerrar menú' : sidebarOpen ? 'Contraer barra lateral' : 'Expandir barra lateral'} title={isMobile ? 'Cerrar menú' : sidebarOpen ? 'Contraer barra lateral' : 'Expandir barra lateral'} onClick={() => { if (sidebarOpen) closeSidebar(); else setSidebarOpen(true) }}><MenuGlyph /></button></div>
    </aside>
    <div className="workspace-content" inert={isMobile && sidebarOpen}><header className="workspace-topbar"><button ref={menuToggleRef} type="button" className="menu-toggle" aria-controls="workspace-sidebar" aria-expanded={sidebarOpen} aria-label="Desplegar menú" title="Desplegar menú" onClick={() => setSidebarOpen(true)}><MenuGlyph /></button><div className="topbar-context"><span className="topbar-title">{current?.label ?? 'Prismo'}</span></div><ThemeToggle theme={theme} onToggle={onToggleTheme} /></header><main id="main-content"><div className="route-stage" key={location.pathname}><Suspense fallback={<div className="shell page" role="status">Abriendo sección…</div>}><Outlet /></Suspense></div></main></div>
  </div>
}

function Home() {
  return <>
    <section className="shell hero" aria-labelledby="hero-title"><div className="hero-copy">
      <p className="eyebrow">Investigación con evidencia oficial</p>
      <h1 id="hero-title">Convierte datos oficiales en reportes claros.</h1>
      <p className="lead">Menos tiempo buscando datos. Más tiempo contando lo que significan.</p>
      <p>Prismo reúne indicadores, visualizaciones y escritura para estudiar cambios e impactos sociales y ambientales. Tú eliges la evidencia y redactas las conclusiones.</p>
      <div className="actions"><WorkspaceEntryLink className="button button-primary">Entrar al espacio <span aria-hidden="true">→</span></WorkspaceEntryLink><a className="button button-secondary" href="#como-funciona">Conoce cómo funcionará</a></div>
    </div><div className="hero-panel" aria-label="Flujo de trabajo de Prismo">
      <p className="eyebrow">Del dato al reporte</p><AnimatedList as="ol" className="workflow" animation="slide">
        <li><span>01</span><div><strong>Busca</strong><p>Encuentra un indicador en un catálogo curado.</p></div></li>
        <li><span>02</span><div><strong>Analiza</strong><p>Revisa cobertura, periodo, unidad y fuente.</p></div></li>
        <li><span>03</span><div><strong>Redacta</strong><p>Construye un informe con referencias verificables.</p></div></li>
      </AnimatedList>
    </div></section>
    <section className="source-credits" aria-labelledby="source-credits-title"><div className="shell source-credits-heading"><div><p className="eyebrow">Procedencia visible</p><h2 id="source-credits-title">Fuentes de datos</h2></div><div className="source-credits-status"><p>Conectadas: <a href="https://www.inegi.org.mx/servicios/api-indicadores/" target="_blank" rel="noopener noreferrer">INEGI</a> y <a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer">Banco Mundial</a>.</p><p>Futuras: <a href="https://sdmx.oecd.org/public/" target="_blank" rel="noopener noreferrer">OCDE</a>, <a href="https://unstats.un.org/SDGAPI/swagger/" target="_blank" rel="noopener noreferrer">ONU · ODS</a> y <a href="https://www.fao.org/faostat/en/docs/redoc-static.html" target="_blank" rel="noopener noreferrer">FAOSTAT</a> <span>· Próximamente</span></p></div></div>
      <LogoLoop logos={[
        { name: 'INEGI', mark: <span className="source-mark source-mark-inegi"><span className="source-mark-symbol" aria-hidden="true">▥</span><strong>INEGI</strong></span> },
        { name: 'Banco Mundial', mark: <span className="source-mark source-mark-world-bank"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="18" cy="18" r="14" /><path d="M4 18h28M18 4c-5 5-7 10-7 14s2 9 7 14M18 4c5 5 7 10 7 14s-2 9-7 14M7 10h22M7 26h22" /></svg><strong>Banco Mundial</strong></span> },
      ]} />
    </section>
    <section className="section-band" id="como-funciona" aria-labelledby="topics-title"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Áreas de investigación</p><h2 id="topics-title">Diez temas, una ruta de trabajo</h2></div><NavLink className="text-link" to="/explorar">Ver las categorías →</NavLink></div>
      <p className="section-note">Ya puedes consultar indicadores oficiales en las tres áreas temáticas y convertir las vistas en un reporte. Las categorías restantes se activarán tras verificar sus datos.</p>
      <AnimatedList className="topic-preview" animation="pop"><div><span>01</span><h3>Sociedad y territorio</h3><p>Población, vivienda y educación.</p></div><div><span>02</span><h3>Desarrollo sostenible</h3><p>Indicadores de medio ambiente.</p></div><div><span>03</span><h3>Economía y finanzas</h3><p>Contexto económico para tus estudios.</p></div></AnimatedList>
    </div></section>
  </>
}

function Explore() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'available' | 'soon'>('all')
  const query = searchKey(search.trim())
  const visible = categories.filter(category => {
    const links = categoryLinks[category[0]]
    if (filter === 'available' && !links) return false
    if (filter === 'soon' && links) return false
    return !query || [category[1], category[2], ...(links ?? []).flatMap(link => [link.title, link.description, link.source])].some(value => searchKey(value).includes(query))
  })
  return <section className="shell page" aria-labelledby="explore-title">
    <h1 id="explore-title">Explorar indicadores</h1>
    <div className="catalog-tools"><label htmlFor="catalog-search">Buscar en el catálogo</label><div className="catalog-search-row"><input id="catalog-search" type="search" value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setSearch('') }} placeholder="Indicador, tema o fuente" autoComplete="off" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Borrar búsqueda" title="Borrar búsqueda">×</button>}</div><div className="catalog-filters" role="group" aria-label="Filtrar indicadores"><button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Todos</button><button type="button" aria-pressed={filter === 'available'} onClick={() => setFilter('available')}>Disponibles</button><button type="button" aria-pressed={filter === 'soon'} onClick={() => setFilter('soon')}>Próximamente</button></div><span role="status">{visible.length} {visible.length === 1 ? 'categoría' : 'categorías'}</span></div>
    {groups.map((group, index) => {
      const groupCategories = visible.filter(category => category[2] === group)
      if (!groupCategories.length) return null
      return <section className="category-group" key={group} aria-labelledby={`group-${index}`}><h2 id={`group-${index}`} className="topic-title">{group}</h2><AnimatedList className="section-grid" label={`Categorías de ${group}`} animation="pop">{groupCategories.map(category => {
        const links = categoryLinks[category[0]]
        return <HoloCard as="section" className={`catalog-section ${links ? '' : 'is-coming'}`} key={category[0]} labelledBy={`section-${category[0]}`} disabled={!links}>{!links && <div className="catalog-section-head"><span aria-label="Próximamente">🔒 Próximamente</span></div>}<h3 id={`section-${category[0]}`}>{category[1]}</h3>{links ? <AnimatedList className="indicator-grid" label={`Indicadores de ${category[1]}`} animation="slide">{links.map(link => <NavLink className="indicator-card" key={link.href} to={link.href}><span className="indicator-kind">Indicador</span><strong>{link.title}</strong><span>{link.description}</span><span className="indicator-source">Fuente: {link.source}</span><span className="indicator-open">Consultar →</span></NavLink>)}</AnimatedList> : <p className="coming-message">Indicadores en preparación</p>}</HoloCard>
      })}</AnimatedList></section>
    })}
    {visible.length === 0 && <div className="catalog-empty"><strong>No hay coincidencias</strong><p>Prueba con otro indicador o muestra todas las categorías.</p><button type="button" className="button button-secondary" onClick={() => { setSearch(''); setFilter('all') }}>Mostrar todo</button></div>}
    <div className="notice voice-notice" role="status"><strong>Consultas por voz: próximamente.</strong> Planeamos agregarlas después de validar la consulta manual. Podrás revisar el texto reconocido antes de buscar.</div>
  </section>
}

function Help() {
  return <section className="shell page narrow" aria-labelledby="help-title"><p className="eyebrow">Ayuda y fuentes</p><h1 id="help-title">Cómo leer los datos en Prismo</h1><p className="page-intro">Cada indicador muestra su organismo de origen, definición, unidad, cobertura, periodo y fecha de consulta. La fecha de consulta no significa que el dato corresponda al día de hoy.</p><AnimatedList className="help-list" animation="fade"><section><h2>Fuentes conectadas</h2><p>El Banco Mundial aporta las series comparables entre países de inflación, desempleo, superficie forestal y energía renovable. INEGI aporta indicadores de población, vivienda, empresas y educación para México y entidades. Cada consulta enlaza su fuente y conserva los valores usados en el reporte.</p></section><section><h2>Futuras fuentes · Próximamente</h2><p><a href="https://sdmx.oecd.org/public/" target="_blank" rel="noopener noreferrer">OCDE</a>, <a href="https://unstats.un.org/SDGAPI/swagger/" target="_blank" rel="noopener noreferrer">ONU · ODS</a> y <a href="https://www.fao.org/faostat/en/docs/redoc-static.html" target="_blank" rel="noopener noreferrer">FAOSTAT</a> están en evaluación para ampliar el catálogo. Aún no se pueden consultar desde Prismo; cada indicador se habilitará después de verificar datos, unidad, cobertura y procedencia.</p></section><section><h2>Comparaciones responsables</h2><p>Las barras utilizan un año con datos para todos los territorios seleccionados. Los años sin observación quedan como «Sin dato» y las líneas no los interpolan. Compara un mismo indicador y unidad: la tasa de desempleo es una estimación modelada y las unidades económicas son un conteo, no nuevas empresas.</p></section><section><h2>Tu interpretación</h2><p>Los datos y referencias se distinguen del texto que escribas. Prismo no genera conclusiones por ti.</p></section></AnimatedList></section>
}

function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#17191F' : '#F6F0E4')
    try { localStorage.setItem('prismo-theme', theme) } catch { /* Theme remains usable without storage. */ }
  }, [theme])
  const toggleTheme = () => setTheme(current => current === 'light' ? 'dark' : 'light')
  return <BrowserRouter><Routes><Route element={<LandingLayout theme={theme} onToggleTheme={toggleTheme} />}><Route path="/" element={<Home />} /></Route><Route element={<WorkspaceLayout theme={theme} onToggleTheme={toggleTheme} />}><Route path="/explorar" element={<Explore />} /><Route path="/explorar/bosques" element={<ForestExplorer />} /><Route path="/explorar/inflacion" element={<ForestExplorer indicatorId="wb-inflation" />} /><Route path="/explorar/desempleo" element={<ForestExplorer indicatorId="wb-unemployment" />} /><Route path="/explorar/energia-renovable" element={<ForestExplorer indicatorId="wb-renewable-share" />} /><Route path="/explorar/inegi/:topic" element={<InegiExplorer />} /><Route path="/reportes" element={<ReportsList />} /><Route path="/reportes/:reportId" element={<ReportEditor />} /><Route path="/ayuda" element={<Help />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>
}

export default App
