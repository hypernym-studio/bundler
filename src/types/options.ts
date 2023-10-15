import type { EntriesOptions } from './entries.js'
import type { HooksOptions } from './hooks.js'

export interface Options {
  /**
   * Specifies the bundle's entry points.
   *
   * It allows you to manually set all build entries and adjust options for each one individually.
   */
  entries: EntriesOptions[]
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
   * IDs and regexps from this option are applied globally to all entries.
   *
   * Also, it is possible to define externals individually per entry (`entry.externals`).
   *
   * @default [/^node:/, /^@types/, /^@rollup/, /^@hypernym/, /^rollup/, ...pkg.dependencies]
   */
  externals?: (string | RegExp)[]
  /**
   * Provides a powerful hooking system to further expand bundling mode.
   *
   * @default undefined
   */
  hooks?: HooksOptions
}
