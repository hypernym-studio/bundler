import type { Options } from './options.js'
import type { BuildStats } from './build.js'

export interface HooksOptions {
  /**
   * Called just before bundling started.
   */
  'bundle:start'?: (options?: Options) => void | Promise<void>
  /**
   * Called just before building started.
   */
  'build:start'?: (
    options?: Options,
    buildStats?: BuildStats,
  ) => void | Promise<void>
  /**
   * Called right after building is complete.
   */
  'build:end'?: (
    options?: Options,
    buildStats?: BuildStats,
  ) => void | Promise<void>
  /**
   * Called right after bundling is complete.
   */
  'bundle:end'?: (options?: Options) => void | Promise<void>
}
