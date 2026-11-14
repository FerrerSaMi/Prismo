// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { expect, it } from 'vitest'
import ColorMenu from './ColorMenu'

it('reúne la paleta y el valor hexadecimal en un menú', () => {
  function Example() {
    const [color, setColor] = useState('#17191F')
    return <ColorMenu label="Color del título" hexLabel="Hexadecimal del título" value={color} onChange={setColor} />
  }
  render(<Example />)
  fireEvent.click(screen.getByRole('button', { name: 'Color del título' }))
  fireEvent.change(screen.getByLabelText('Hexadecimal del título'), { target: { value: '#334455' } })
  expect(screen.getByRole('button', { name: 'Color del título' }).textContent).toContain('#334455')
  fireEvent.click(screen.getByRole('button', { name: 'Elegir #C9A86A para Color del título' }))
  expect(screen.getByRole('button', { name: 'Color del título' }).textContent).toContain('#C9A86A')
})
