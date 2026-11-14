import { useState } from 'react'

export default function HexColorField({ label, value, onChange, className = '' }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  const [editing, setEditing] = useState({ base: value, draft: value })
  const draft = editing.base === value ? editing.draft : value
  return <label className={className}>{label}<input aria-label={label} inputMode="text" maxLength={7} spellCheck={false} value={draft} onChange={event => { const next = event.target.value; setEditing({ base: value, draft: next }); if (/^#[0-9a-fA-F]{6}$/.test(next)) onChange(next) }} onBlur={() => { if (!/^#[0-9a-fA-F]{6}$/.test(draft)) setEditing({ base: value, draft: value }) }} /></label>
}
