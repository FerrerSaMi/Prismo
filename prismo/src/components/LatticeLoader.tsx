import { useEffect, useState } from 'react'
import './LatticeLoader.css'

const cells = [2, 1, 2, 1, 0, 1, 2, 1, 2]

/** Compact ripple lattice adapted from React Bits LatticeLoader. */
export default function LatticeLoader({ label }: { label: string }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const started = performance.now()
    const timer = window.setInterval(() => setElapsed((performance.now() - started) / 1000), 100)
    return () => window.clearInterval(timer)
  }, [])
  return <div className="lattice-loader" role="status" aria-label={label}><span className="lattice-grid" aria-hidden="true">{cells.map((delay, index) => <span key={index} style={{ animationDelay: `${delay * 110}ms` }} />)}</span><span className="lattice-label">{label}<small>{elapsed.toFixed(1)} s</small></span></div>
}
