import type { CSSProperties, ReactNode } from 'react'
import './LogoLoop.css'

type LogoItem = { name: string; mark: ReactNode }

/** A lightweight, decorative LogoLoop for a small set of source credits. */
export default function LogoLoop({ logos, durationSeconds = 32 }: { logos: LogoItem[]; durationSeconds?: number }) {
  const sequence = Array.from({ length: 3 }, () => logos).flat()
  return <div className="logo-loop" aria-hidden="true" style={{ '--logo-loop-duration': `${durationSeconds}s` } as CSSProperties}>
    <div className="logo-loop-track">
      {[0, 1].map(copy => <div className="logo-loop-sequence" key={copy}>{sequence.map((logo, index) => <div className="logo-loop-item" key={`${copy}-${logo.name}-${index}`}>{logo.mark}</div>)}</div>)}
    </div>
  </div>
}
