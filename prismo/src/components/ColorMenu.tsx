import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import HexColorField from './HexColorField'
import WarmTooltip from './WarmTooltip'
import './ColorMenu.css'

const colors = ['#17191F', '#F6F0E4', '#FFFFFF', '#C9A86A', '#5C4635', '#AD482F', '#2D746B', '#5776A3', '#8D5AA4', '#D45558', '#EAA63C', '#272B34']

export default function ColorMenu({ label, hexLabel, value, onChange }: { label: string; hexLabel: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const popover = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ left: 8, top: 8, width: 280, maxHeight: 280 })

  const locate = useCallback(() => {
    const box = root.current?.getBoundingClientRect()
    if (!box) return
    const width = Math.min(280, window.innerWidth - 16)
    const above = box.top - 13
    const below = window.innerHeight - box.bottom - 13
    const opensUp = below < 280 && above > below
    const maxHeight = Math.min(280, Math.max(40, opensUp ? above : below))
    setPosition({
      left: Math.max(8, Math.min(box.right - width, window.innerWidth - width - 8)),
      top: opensUp ? Math.max(8, box.top - maxHeight - 5) : box.bottom + 5,
      width,
      maxHeight,
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node) && !popover.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    window.addEventListener('scroll', locate, true)
    window.addEventListener('resize', locate)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); window.removeEventListener('scroll', locate, true); window.removeEventListener('resize', locate) }
  }, [open, locate])
  return <div className="color-menu-field" ref={root}>
    <span>{label}</span>
    <WarmTooltip content={`${label}: paleta y valor hexadecimal`}><button type="button" className="color-menu-trigger" aria-label={label} aria-expanded={open} onClick={() => { if (!open) locate(); setOpen(current => !current) }}><span className="color-menu-swatch" style={{ backgroundColor: value }} /><span>{value.toUpperCase()}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.4a2.3 2.3 0 0 0 1.6-4 1.2 1.2 0 0 1 .8-2.1H18A3 3 0 0 0 21 12 9 9 0 0 0 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/></svg></button></WarmTooltip>
    {open && createPortal(<div ref={popover} className="color-menu-popover" style={position}><strong>{label}</strong><div className="color-menu-grid">{colors.map(color => <WarmTooltip key={color} content={color}><button type="button" aria-label={`Elegir ${color} para ${label}`} className={color.toLowerCase() === value.toLowerCase() ? 'is-selected' : ''} style={{ backgroundColor: color }} onClick={() => onChange(color)} /></WarmTooltip>)}</div><div className="color-menu-custom"><input type="color" aria-label={`${label}: selector visual`} value={value} onChange={event => onChange(event.target.value)} /><HexColorField label={hexLabel} value={value} onChange={onChange} /></div></div>, document.body)}
  </div>
}
