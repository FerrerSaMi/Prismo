import { useEffect, useRef } from 'react'
import type { EChartsOption } from 'echarts'
import type { DatasetSnapshot } from '../../domain/contracts'
import { countryName } from './countries'
import { indicatorInfo, isPercent } from './indicatorCatalog'

const seriesColors = ['#5c4635', '#a4482e', '#3f655e', '#6656a4']
function indicatorLabel(snapshot: DatasetSnapshot) { return indicatorInfo(snapshot.indicatorId).short }
const numberFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })

function ChartCanvas({ option, label }: { option: EChartsOption; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let disposed = false
    let chart: import('echarts/core').ECharts | undefined
    let resize: ResizeObserver | undefined
    void import('./echartsSvg').then(({ echarts }) => {
      if (disposed || !ref.current) return
      chart = echarts.init(ref.current, undefined, { renderer: 'svg' })
      chart.setOption(option)
      resize = new ResizeObserver(() => chart?.resize())
      resize.observe(ref.current)
    })
    return () => { disposed = true; resize?.disconnect(); chart?.dispose() }
  }, [option])
  return <div ref={ref} className="forest-chart" role="img" aria-label={label} />
}

export function TrendChart({ snapshot, countries = snapshot.query.geographies, colors = {}, showPoints, fontFamily, fontSize, textColor }: { snapshot: DatasetSnapshot; countries?: string[]; colors?: Record<string, string>; showPoints?: boolean; fontFamily?: string; fontSize?: number; textColor?: string }) {
  const years = [...new Set(snapshot.observations.map(item => item.period))].sort()
  const values = snapshot.observations.flatMap(item => countries.includes(item.geographyId) && item.value !== null ? [item.value] : [])
  const minimum = values.length ? Math.min(...values) : 0
  const maximum = values.length ? Math.max(...values) : 100
  const margin = Math.max(1, (maximum - minimum) * .1)
  const lower = Math.max(minimum < 0 ? Number.NEGATIVE_INFINITY : 0, minimum - margin)
  const upper = maximum + margin
  const option: EChartsOption = {
    animationDuration: 350, color: countries.map((code, index) => colors[code] ?? seriesColors[index]), textStyle: { fontFamily, fontSize, color: textColor },
    grid: { left: 55, right: 20, top: 60, bottom: 45 },
    legend: { top: 0, type: 'scroll' },
    tooltip: { trigger: 'axis', valueFormatter: value => value == null ? 'Sin dato' : `${numberFormat.format(Number(value))}${isPercent(snapshot) ? ' %' : ''}` },
    xAxis: { type: 'category', data: years, name: 'Año', boundaryGap: false },
    yAxis: { type: 'value', name: isPercent(snapshot) ? '%' : snapshot.unit, min: lower, max: upper },
    series: countries.map((code, index) => ({
      name: countryName(code), type: 'line' as const, connectNulls: false, showSymbol: showPoints ?? years.length <= 15,
      symbol: ['circle', 'diamond', 'triangle', 'rect'][index], symbolSize: 8,
      lineStyle: { type: (['solid', 'dashed', 'dotted', 'solid'] as const)[index], width: 3 },
      data: years.map(year => snapshot.observations.find(item => item.period === year && item.geographyId === code)?.value ?? null),
    })),
  }
  return <ChartCanvas option={option} label={`Tendencia de ${indicatorLabel(snapshot)} para ${countries.map(countryName).join(', ')}. Consulta la tabla para los valores exactos.`} />
}

export function ComparisonChart({ snapshot, year, countries = snapshot.query.geographies, colors = {}, showValues = true, fontFamily, fontSize, textColor }: { snapshot: DatasetSnapshot; year: string; countries?: string[]; colors?: Record<string, string>; showValues?: boolean; fontFamily?: string; fontSize?: number; textColor?: string }) {
  const values = countries.map(code => snapshot.observations.find(item => item.period === year && item.geographyId === code)?.value ?? null)
  const numeric = values.filter((value): value is number => value !== null)
  const option: EChartsOption = {
    animationDuration: 350, color: '#5c4635', textStyle: { fontFamily, fontSize, color: textColor },
    grid: { left: 125, right: 45, top: 12, bottom: 35 },
    tooltip: { trigger: 'item', valueFormatter: value => `${numberFormat.format(Number(value))}${isPercent(snapshot) ? ' %' : ''}` },
    xAxis: { type: 'value', name: isPercent(snapshot) ? '%' : snapshot.unit, min: Math.min(0, ...numeric), max: Math.max(1, ...numeric) * 1.12 },
    yAxis: { type: 'category', data: countries.map(countryName).reverse() },
    series: [{ type: 'bar', data: [...values].reverse().map((value, index) => ({ value, itemStyle: { color: colors[countries[values.length - index - 1]] ?? seriesColors[values.length - index - 1] } })), label: { show: showValues, position: 'right', formatter: params => params.value == null ? '' : `${numberFormat.format(Number(params.value))}${isPercent(snapshot) ? ' %' : ''}` } }],
  }
  return <ChartCanvas option={option} label={`Comparación de ${indicatorLabel(snapshot)} en ${year} para ${countries.map(countryName).join(', ')}. Consulta la tabla para los valores exactos.`} />
}
