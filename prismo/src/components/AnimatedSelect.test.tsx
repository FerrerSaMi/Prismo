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
