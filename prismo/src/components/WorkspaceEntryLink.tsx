import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router'
import './WorkspaceEntryLink.css'

export default function WorkspaceEntryLink({ children, className }: { children: ReactNode; className: string }) {
  const navigate = useNavigate()
  const [entering, setEntering] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current) }, [])
  function enter(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (entering) return
    setEntering(true)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    timer.current = window.setTimeout(() => navigate('/explorar'), reduced ? 80 : 520)
  }
  return <><NavLink className={className} to="/explorar" onClick={enter}>{children}</NavLink>{entering && <div className="workspace-entry-overlay" role="status" aria-live="polite"><div className="workspace-entry-mark"><img src="/PrismoLogo-transparent.png" alt="" /><span>Prismo</span></div><p>Abriendo tu espacio de trabajo</p><div className="workspace-entry-progress" aria-hidden="true"><span /></div></div>}</>
}
