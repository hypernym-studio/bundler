import type { LogLevel, RollupLog } from 'rolldown'
import type { EntryBase, EntryChunk, EntryDts } from './entries'

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

type PickEntryChunkOptions = 'input' | 'name' | 'globals' | 'extend' | 'minify'

type PickEntryDtsOptions = 'dts' | 'dtsPlugin'

export interface BuildEntryOptions
  extends
    EntryBase,
    Partial<Pick<EntryChunk, PickEntryChunkOptions>>,
    Partial<Pick<EntryDts, PickEntryDtsOptions>> {
  /**
   * Specifies the path to the processed file.
   *
   * @default undefined
   */
  output?: string
}

export * from '@/bin/build'
