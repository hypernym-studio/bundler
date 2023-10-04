import type { EntriesOptions } from './entries.js'
import type { BuildHooks } from './hooks.js'

export interface Options {
  entries: (string | EntriesOptions)[]
  /**
   * Specifies the output directory for production bundle.
   *
   * @default 'dist'
   */
  outDir?: string
  /**
   * Specifies the module IDs, or regular expressions to match module IDs,
   * that should remain external to the bundle.
   *
   * @default [/^node:/, /^@types/, /^@rollup/, /^rollup/, ...packageDependencies]
   */
  externals?: (string | RegExp)[]
  /**
   * Provides a powerful hooking system to further expand build mode.
   *
   * @default undefined
   */
  hooks?: BuildHooks
}
