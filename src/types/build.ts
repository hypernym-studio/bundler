import type { LogLevel, RollupLog } from 'rollup'

export interface BuildLogs {
  level: LogLevel
  log: RollupLog
}

export interface BuildStats {
  /**
   * The root path of the project.
   */
  cwd: string
  /**
   * Final bundle size.
   */
  size: number
  /**
   * Total bundle build time.
   */
  buildTime: number
  /**
   * List of generated bundle modules.
   */
  files: {
    /**
     * Module output path.
     */
    path: string
    /**
     * Module size.
     */
    size: number
    /**
     * Build time of individual module.
     */
    buildTime: number
    /**
     * Module format.
     */
    format: string
    /**
     * List of warnings from build plugins.
     */
    logs: BuildLogs[]
  }[]
}

// Auto-generated
export * from '../bin/build.js'
