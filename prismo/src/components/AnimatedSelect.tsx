import { useEffect, useRef, useState, type SelectHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import AnimatedList from './AnimatedList'
import './AnimatedSelect.css'

type Props = SelectHTMLAttributes<HTMLSelectElement>

function menuPosition(box: DOMRect, optionCount: number) {
  const gap = 4
  const edge = 8
  const desiredHeight = Math.min(330, optionCount * 38 + 10)
  const below = window.innerHeight - box.bottom - gap - edge
  const above = box.top - gap - edge
  const opensUp = below < desiredHeight && above > below
  const maxHeight = Math.max(40, Math.min(desiredHeight, opensUp ? above : below))
  return {
    left: Math.max(edge, Math.min(box.left, window.innerWidth - box.width - edge)),
    top: opensUp ? undefined : box.bottom + gap,
    bottom: opensUp ? window.innerHeight - box.top + gap : undefined,
    width: Math.min(box.width, window.innerWidth - edge * 2),
    maxHeight,
    opensUp,
  }
}

export default function AnimatedSelect({ children, onChange, onKeyDown, onPointerDown, ...props }: Props) {
  const select = useRef<HTMLSelectElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const [rect, setRect] = useState({ left: 0, top: undefined as number | undefined, bottom: undefined as number | undefined, width: 0, maxHeight: 330, opensUp: false })
  const [options, setOptions] = useState<{ value: string; label: string; disabled: boolean }[]>([])

  function show() {
    if (!select.current || props.disabled) return
    const box = select.current.getBoundingClientRect()
    const nextOptions = Array.from(select.current.options).map(option => ({ value: option.value, label: option.text, disabled: option.disabled }))
    setRect(menuPosition(box, nextOptions.length))
    setOptions(nextOptions)
    setSelected(select.current.value)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!popup.current?.contains(event.target as Node) && event.target !== select.current) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    const resize = () => setOpen(false)
    const reposition = () => {
      const box = select.current?.getBoundingClientRect()
      if (box) setRect(menuPosition(box, options.length))
    }
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', reposition, true)
    return () => { document.removeEventListener('pointerdown', close); window.removeEventListener('resize', resize); window.removeEventListener('scroll', reposition, true) }
  }, [open, options.length])

  function choose(value: string) {
    const element = select.current
    if (!element) return
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
    setter?.call(element, value)
    element.dispatchEvent(new Event('change', { bubbles: true }))
    setOpen(false)
    element.focus()
  }

  return <>
    <select {...props} ref={select} aria-expanded={open} onChange={onChange} onClick={() => { if (!open) show() }} onPointerDown={event => {
      onPointerDown?.(event)
      if (!event.defaultPrevented && event.button === 0 && !props.disabled) { event.preventDefault(); select.current?.focus(); if (open) setOpen(false); else show() }
    }} onKeyDown={event => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false) }
      else if ((event.key === 'Enter' || event.key === ' ') && !props.disabled) { event.preventDefault(); if (open) setOpen(false); else show() }
    }}>{children}</select>
    {open && createPortal(<div ref={popup} className={`animated-select-menu${rect.opensUp ? ' opens-up' : ''}`} style={{ left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width, maxHeight: rect.maxHeight }} role="listbox" aria-label={props['aria-label'] ?? 'Opciones'}><AnimatedList animation="slide">{options.map((option, index) => <button type="button" className={option.value === selected ? 'is-selected' : ''} role="option" aria-selected={option.value === selected} disabled={option.disabled} key={`${option.value}-${index}`} onClick={() => choose(option.value)}>{option.label}</button>)}</AnimatedList></div>, document.body)}
  </>
}
