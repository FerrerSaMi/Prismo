import { useLiveQuery } from 'dexie-react-hooks'
import { NavLink } from 'react-router'
import { reportDb } from './reportDb'
import AnimatedList from '../../components/AnimatedList'
import HoldButton from '../../components/HoldButton'

export default function ReportsList() {
  const reports = useLiveQuery(() => reportDb.reports.orderBy('updatedAt').reverse().toArray())
  return <section className="shell page narrow" aria-labelledby="reports-title">
    <h1 id="reports-title">Mi espacio de trabajo</h1>
    {reports === undefined && <div role="status">Cargando reportes…</div>}
    {reports?.length === 0 && <div className="empty-state"><h2>Aún no hay reportes</h2><p>Explora un indicador, compara países y crea un documento con sus dashboards y fuentes.</p><NavLink className="button button-secondary" to="/explorar/bosques">Explorar superficie forestal</NavLink></div>}
    {reports && reports.length > 0 && <AnimatedList as="ul" className="report-list" label="Reportes guardados" animation="slide">{reports.map(report => <li key={report.reportId} className="report-list-card"><NavLink to={`/reportes/${report.reportId}`}><strong>{report.title}</strong><span>Fuente: {[...new Set(report.sources.map(source => source.provider === 'world-bank' ? 'Banco Mundial' : 'INEGI'))].join(' · ')} · Editado {new Date(report.updatedAt).toLocaleString('es-MX')}</span></NavLink><HoldButton className="report-delete-x" label={`Eliminar ${report.title}`} title="Mantén presionado para eliminar el reporte" onHold={() => { void reportDb.reports.delete(report.reportId) }}>×</HoldButton></li>)}</AnimatedList>}
  </section>
}
