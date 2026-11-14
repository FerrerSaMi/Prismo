import { createContext } from 'react'
import type { DatasetSnapshot } from '../../domain/contracts'

export const ReportSources = createContext<DatasetSnapshot[]>([])
