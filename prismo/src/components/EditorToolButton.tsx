import type { ReactNode } from 'react'
import WarmTooltip from './WarmTooltip'

type Props = { label: string; children: ReactNode; onClick: () => void; pressed?: boolean; disabled?: boolean; shortcut?: string }

export default function EditorToolButton({ label, children, onClick, pressed, disabled, shortcut }: Props) {
  const hint = shortcut ?? ({ Negrita: 'Ctrl+B', Cursiva: 'Ctrl+I', Deshacer: 'Ctrl+Z', Rehacer: 'Ctrl+Y' } as Record<string, string>)[label]
  return <WarmTooltip content={label} shortcut={hint}><button type="button" aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick}>{children}</button></WarmTooltip>
}
