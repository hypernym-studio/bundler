import type { LogLevel, RollupLog } from 'rollup'

export interface BuildLogs {
  level: LogLevel
  log: RollupLog
}

export interface BuildStats {
  cwd: string
  size: number
  buildTime: number
  files: {
    path: string
    size: number
    buildTime: number
    format: string
    logs: BuildLogs[]
  }[]
}

// Auto-generated
export * from '../bin/build.js'
