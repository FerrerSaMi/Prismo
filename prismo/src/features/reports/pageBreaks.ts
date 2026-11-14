import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export type PageBreak = { position: number; height: number }
const pageBreakKey = new PluginKey<DecorationSet>('prismoPageBreaks')

export const PageBreaks = Extension.create({
  name: 'prismoPageBreaks',
  addProseMirrorPlugins() {
    return [new Plugin({
      key: pageBreakKey,
      state: {
        init: () => DecorationSet.empty,
        apply(transaction, previous) {
          const breaks = transaction.getMeta(pageBreakKey) as PageBreak[] | undefined
          if (breaks) return DecorationSet.create(transaction.doc, breaks.map((item, index) => Decoration.widget(item.position, () => {
            const spacer = document.createElement('span')
            spacer.className = 'page-break-spacer'
            spacer.setAttribute('aria-hidden', 'true')
            spacer.style.height = `${item.height}px`
            return spacer
          }, { key: `page-${index}-${item.position}`, side: -1 })))
          return transaction.docChanged ? previous.map(transaction.mapping, transaction.doc) : previous
        },
      },
      props: { decorations: state => pageBreakKey.getState(state) },
    })]
  },
})

export function setPageBreaks(editor: Editor, breaks: PageBreak[]): void {
  editor.view.dispatch(editor.state.tr.setMeta(pageBreakKey, breaks))
}
