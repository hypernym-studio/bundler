import type { Options } from './options.js'

export interface BuildHooks {
  /**
   * Called just before bundling started.
   */
  'build:before'?: (options?: Options) => void | Promise<void>
  /**
   * Called right after bundling is complete.
   */
  'build:done'?: (options?: Options) => void | Promise<void>
}
