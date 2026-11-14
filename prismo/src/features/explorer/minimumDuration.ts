/** Keep the API loading state visible long enough to be readable. */
export async function withMinimumDuration<T>(work: () => Promise<T>, minimumMs = 2000): Promise<T> {
  const started = performance.now()
  try { return await work() }
  finally {
    const remaining = minimumMs - (performance.now() - started)
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining))
  }
}
