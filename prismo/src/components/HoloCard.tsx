import { useRef } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import './HoloCard.css'

type Props = { children: ReactNode; className?: string; active?: boolean; style?: CSSProperties; as?: 'div' | 'section'; labelledBy?: string; disabled?: boolean }

/** React Bits HoloCard treatment for interactive dashboard and catalog cards. */
export default function HoloCard({ children, className = '', active = false, style, as: Tag = 'div', labelledBy, disabled = false }: Props) {
  const card = useRef<HTMLElement>(null)
  function track(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    const node = card.current
    node?.style.setProperty('--holo-x', `${x * 100}%`)
    node?.style.setProperty('--holo-y', `${y * 100}%`)
    node?.style.setProperty('--holo-rx', `${(0.5 - y) * 5}deg`)
    node?.style.setProperty('--holo-ry', `${(x - 0.5) * 5}deg`)
  }
  function reset() {
    const node = card.current
    node?.style.setProperty('--holo-rx', '0deg')
    node?.style.setProperty('--holo-ry', '0deg')
  }
  return <Tag ref={node => { card.current = node }} className={`holo-card ${className}`} aria-labelledby={labelledBy} data-active={active || undefined} data-static={disabled || undefined} style={style} onPointerMove={disabled ? undefined : track} onPointerLeave={disabled ? undefined : reset}>{children}</Tag>
}
