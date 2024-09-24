import type { Plugin, LogLevel, RollupLog } from 'rollup'
import type { EntryBase, EntryChunk, EntryDeclaration } from './entries'
import type { TransformersChunk, TransformersDeclaration } from './transformers'

export interface BuildLogs {
  level: LogLevel
  log: RollupLog
}

export interface BuildEntryStats {
  /**
   * The root path of the project.
   */
  cwd: string
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
  files: BuildEntryStats[]
}

type PickEntryChunkOptions =
  | 'input'
  | 'name'
  | 'globals'
  | 'extend'
  | 'minify'
  | 'transformers'
type PickEntryDtsOptions = 'declaration' | 'dts' | 'transformers'

export interface BuildEntryOptions
  extends EntryBase,
    Pick<EntryChunk, PickEntryChunkOptions>,
    Pick<EntryDeclaration, PickEntryDtsOptions> {
  /**
   * Specifies the path of the transformed file.
   *
   * @default undefined
   */
  output?: string
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
