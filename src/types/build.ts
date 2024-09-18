import type { Plugin, LogLevel, RollupLog } from 'rollup'
import type { EntryBase } from './entries'
import type { TransformersChunk, TransformersDeclaration } from './transformers'

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

export interface BuildEntryOptions extends EntryBase {
  /**
   * Specifies options for default plugins.
   *
   * @default undefined
   */
  transformers?: TransformersChunk & TransformersDeclaration
  /**
   * Specifies list of default plugins.
   */
  defaultPlugins: Plugin[]
}

export * from '@/bin/build'
