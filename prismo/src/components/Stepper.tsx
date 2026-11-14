import './Stepper.css'

type Props = { step: 1 | 2 | 3; className?: string; label?: string }
const steps = ['Consulta', 'Dashboards', 'Reporte'] as const

/** Controlled progress indicator inspired by React Bits Stepper. */
export default function Stepper({ step, className = '', label = 'Progreso del reporte' }: Props) {
  return <nav className={`prismo-stepper ${className}`} aria-label={label}><ol>{steps.map((title, index) => {
    const number = index + 1
    return <li key={title} data-state={number < step ? 'complete' : number === step ? 'current' : 'upcoming'} aria-current={number === step ? 'step' : undefined}><span className="stepper-number" aria-hidden="true">{number < step ? '✓' : number}</span><span className="stepper-label">{title}</span></li>
  })}</ol></nav>
}
