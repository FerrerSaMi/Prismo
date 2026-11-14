import type { DatasetSnapshot } from '../../domain/contracts'

export function commonYears(snapshot: DatasetSnapshot, countries = snapshot.query.geographies): string[] {
  const years = [...new Set(snapshot.observations.map(item => item.period))].sort((a, b) => b.localeCompare(a))
  return years.filter(year => countries.every(code => snapshot.observations.some(item => item.period === year && item.geographyId === code && item.value !== null)))
}
