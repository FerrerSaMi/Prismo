import { useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import './AnimatedList.css'

type Props = {
  as?: 'div' | 'ul' | 'ol' | 'nav'
  children: ReactNode
  className?: string
  label?: string
  animation?: 'pop' | 'slide' | 'fade'
}

/** Motion for collections with links, buttons and other native controls inside each item. */
export default function AnimatedList({ as: Tag = 'div', children, className = '', label, animation = 'pop' }: Props) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const items = Array.from(element.children) as HTMLElement[]
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('al-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('al-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px 64px 0px', threshold: 0.08 })
    items.forEach((item, index) => {
      item.classList.add('al-item')
      item.style.setProperty('--al-delay', `${Math.min(index, 8) * 45}ms`)
      if (!item.classList.contains('al-visible')) observer.observe(item)
    })
    return () => observer.disconnect()
  }, [children])

  function moveFocus(event: KeyboardEvent<HTMLElement>) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    if ((event.target as HTMLElement).closest('input, select, textarea, [contenteditable="true"]')) return
    const element = root.current
    if (!element) return
    const choices = Array.from(element.children).map(item => item.querySelector<HTMLElement>('a, button')).filter((item): item is HTMLElement => Boolean(item))
    if (!choices.length) return
    const current = choices.findIndex(item => item === document.activeElement || item.contains(document.activeElement))
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : Math.max(0, Math.min(choices.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1)))
    if (current === -1 && event.key === 'ArrowUp') return
    event.preventDefault()
    choices[next].focus()
  }

  return <Tag ref={(node: HTMLElement | null) => { root.current = node }} className={`animated-list animated-list--${animation} ${className}`.trim()} aria-label={label} onKeyDown={moveFocus}>{children}</Tag>
}
