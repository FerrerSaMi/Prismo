import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import './CardNav.css'

type Props = {
  title: string
  children: ReactNode
  className?: string
  panelClassName?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/** React Bits CardNav style adapted to compact editing menus. */
export default function CardNav({ title, children, className = '', panelClassName = '', defaultOpen = false, open, onOpenChange }: Props) {
  const id = useId()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const expanded = open ?? internalOpen
  function toggle() {
    if (open === undefined) setInternalOpen(!expanded)
    onOpenChange?.(!expanded)
  }
  return <section className={`card-nav ${className}`} data-open={expanded || undefined}>
    <button type="button" className="card-nav-trigger" aria-expanded={expanded} aria-controls={id} onClick={toggle}><span>{title}</span><span className="card-nav-chevron" aria-hidden="true">⌄</span></button>
    <div className="card-nav-reveal"><div id={id} className={`card-nav-panel ${panelClassName}`} inert={!expanded} aria-hidden={!expanded}>{children}</div></div>
  </section>
}
