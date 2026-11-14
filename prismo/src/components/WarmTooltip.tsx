import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './WarmTooltip.css'

const WarmContext = createContext<{ delay: number; warmWindow: number; lastClosed: number; markClosed: () => void } | null>(null)

export function WarmTooltipGroup({ children, delay = 380, warmWindow = 320 }: { children: ReactNode; delay?: number; warmWindow?: number }) {
  const [lastClosed, setLastClosed] = useState(0)
  return <WarmContext.Provider value={{ delay, warmWindow, lastClosed, markClosed: () => setLastClosed(Date.now()) }}>{children}</WarmContext.Provider>
}

export default function WarmTooltip({ children, content, shortcut, side = 'top' }: { children: ReactNode; content: string; shortcut?: string; side?: 'top' | 'bottom' }) {
  const context = useContext(WarmContext)
  const trigger = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  function locate() {
    const rect = trigger.current?.getBoundingClientRect()
    if (rect) setPosition({ left: Math.max(65, Math.min(window.innerWidth - 65, rect.left + rect.width / 2)), top: side === 'top' ? rect.top - 8 : rect.bottom + 8 })
  }
  function show(immediate = false) {
    if (timer.current !== null) window.clearTimeout(timer.current)
    const warm = context && Date.now() - context.lastClosed < context.warmWindow
    timer.current = window.setTimeout(() => { locate(); setVisible(true); timer.current = null }, immediate ? 0 : warm ? 55 : context?.delay ?? 380)
  }
  function hide() {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setVisible(false)
    context?.markClosed()
  }
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (!visible) return
    const update = () => {
      const rect = trigger.current?.getBoundingClientRect()
      if (rect) setPosition({ left: Math.max(65, Math.min(window.innerWidth - 65, rect.left + rect.width / 2)), top: side === 'top' ? rect.top - 8 : rect.bottom + 8 })
    }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [visible, side])
  return <span ref={trigger} className="warm-tooltip-trigger" onPointerEnter={() => show()} onPointerLeave={hide} onFocusCapture={() => show(true)} onBlurCapture={hide}>{children}{visible && createPortal(<span className={`warm-tooltip-label warm-tooltip-${side}`} role="tooltip" style={position}>{content}{shortcut && <kbd>{shortcut}</kbd>}</span>, document.body)}</span>
}
