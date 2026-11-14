import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ChartBlock from './ChartNode'

export const EvidenceChartNode = Node.create({
  name: 'evidenceChart', group: 'block', atom: true, selectable: true, draggable: true,
  addAttributes() {
    return { snapshotId: { default: null }, spec: { default: null }, kind: { default: 'line' }, year: { default: '' } }
  },
  parseHTML() { return [{ tag: 'div[data-evidence-chart]' }] },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-evidence-chart': '' })] },
  addNodeView() { return ReactNodeViewRenderer(ChartBlock) },
})
