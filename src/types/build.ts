import type { Plugin, LogLevel, RollupLog } from 'rollup'
import type { EntryBase, EntryInput, EntryTypes } from './entries.js'
import type { PluginsInput, PluginsTypes } from './plugins.js'

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

export interface BuildEntryOptions
  extends EntryBase,
    Partial<Omit<EntryInput, 'plugins'>>,
    Partial<Omit<EntryTypes, 'plugins'>> {
  /**
   * Specifies list of plugins.
   */
  plugins: Plugin[]
  /**
   * Specifies options for default plugins.
   *
   * @default undefined
   */
  pluginsOptions?: PluginsInput & PluginsTypes
}

// Auto-generated
export * from '../bin/build.js'
