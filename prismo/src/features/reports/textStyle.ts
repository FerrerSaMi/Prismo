import { Mark } from '@tiptap/core'

const fontFamily = /^(Arial|Verdana|Georgia|Times New Roman|Courier New|inherit)$/i
const color = /^#[0-9a-fA-F]{6}$/

export const PrismoTextStyle = Mark.create({
  name: 'prismoTextStyle',
  addAttributes() {
    return {
      fontFamily: { default: null, parseHTML: element => element.style.fontFamily || null },
      color: { default: null, parseHTML: element => element.style.color || null },
      fontSize: { default: null, parseHTML: element => element.style.fontSize || null },
    }
  },
  parseHTML() { return [{ tag: 'span[style]' }] },
  renderHTML({ HTMLAttributes }) {
    const family = typeof HTMLAttributes.fontFamily === 'string' && fontFamily.test(HTMLAttributes.fontFamily) ? HTMLAttributes.fontFamily : null
    const ink = typeof HTMLAttributes.color === 'string' && color.test(HTMLAttributes.color) ? HTMLAttributes.color : null
    const size = Number.parseInt(HTMLAttributes.fontSize, 10)
    const styles = [family && `font-family: ${family}`, ink && `color: ${ink}`, Number.isFinite(size) && size >= 10 && size <= 72 && `font-size: ${size}px`].filter(Boolean).join('; ')
    return ['span', { style: styles }, 0]
  },
})
