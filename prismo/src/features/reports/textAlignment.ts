import { Extension } from '@tiptap/core'

export type Alignment = 'left' | 'center' | 'right'

export const TextAlignment = Extension.create({
  name: 'prismoTextAlignment',
  addGlobalAttributes() {
    return [{
      types: ['paragraph', 'heading'],
      attributes: {
        textAlign: {
          default: 'left',
          parseHTML: element => ['left', 'center', 'right'].includes(element.style.textAlign) ? element.style.textAlign : 'left',
          renderHTML: attributes => ({ style: `text-align: ${attributes.textAlign ?? 'left'}` }),
        },
      },
    }]
  },
})
