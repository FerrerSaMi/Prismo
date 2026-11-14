import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import './HoldButton.css'

type Props = { children: ReactNode; onHold: () => void; holdTime?: number; className?: string; label: string; title?: string }

/** Press and hold confirmation adapted from React Bits HoldButton. */
export default function HoldButton({ children, onHold, holdTime = 1200, className = '', label, title }: Props) {
  const [holding, setHolding] = useState(false)
  const timer = useRef<number | null>(null)
  const completed = useRef(false)
  const key = useRef<string | null>(null)
  function stop() {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setHolding(false)
  }
  function start() {
    if (timer.current !== null || completed.current) return
    setHolding(true)
    timer.current = window.setTimeout(() => { completed.current = true; timer.current = null; setHolding(false); onHold() }, holdTime)
  }
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current) }, [])
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) { event.preventDefault(); key.current = event.key; start() }
  }
  function onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === key.current) { event.preventDefault(); key.current = null; stop() }
  }
  function onPointerDown(event: PointerEvent<HTMLButtonElement>) { if (event.button === 0) start() }
  return <button type="button" className={`hold-button ${className}`} aria-label={label} title={title ?? 'Mantén presionado para eliminar'} data-holding={holding || undefined} style={{ '--hold-time': `${holdTime}ms` } as CSSProperties} onPointerDown={onPointerDown} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onBlur={stop}><span className="hold-button-content">{children}</span></button>
}
