// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { expect, it } from 'vitest'
import AnimatedSelect from './AnimatedSelect'

it('abre opciones animadas y actualiza el selector al elegir una', () => {
  function Example() {
    const [value, setValue] = useState('MEX')
    return <label>País<AnimatedSelect value={value} onChange={event => setValue(event.target.value)}><option value="MEX">México</option><option value="BRA">Brasil</option></AnimatedSelect></label>
  }
  render(<Example />)
  const select = screen.getByLabelText('País')
  fireEvent.pointerDown(select, { button: 0 })
  expect(screen.getByRole('listbox')).toBeTruthy()
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Brasil' }))
  expect((select as HTMLSelectElement).value).toBe('BRA')
  expect(screen.queryByRole('listbox')).toBeNull()
})

it('abre la lista hacia arriba cuando el selector está junto al borde inferior', () => {
  const originalHeight = window.innerHeight
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 500 })
  try {
    render(<label>Territorio<AnimatedSelect defaultValue="MEX"><option value="MEX">México</option><option value="BRA">Brasil</option></AnimatedSelect></label>)
    const select = screen.getByLabelText('Territorio')
    select.getBoundingClientRect = () => ({ top: 440, bottom: 480, left: 20, right: 220, width: 200, height: 40, x: 20, y: 440, toJSON: () => ({}) })
    fireEvent.pointerDown(select, { button: 0 })
    const menu = screen.getByRole('listbox')
    expect(menu.classList.contains('opens-up')).toBe(true)
    expect(Number.parseInt(menu.style.maxHeight)).toBeLessThanOrEqual(432)
    expect(Number.parseInt(menu.style.bottom)).toBeGreaterThanOrEqual(0)
  } finally {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalHeight })
  }
})
