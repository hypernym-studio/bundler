import type { EntryOptions } from './entries'
import type { HooksOptions } from './hooks'

export interface Options {
  /**
   * Specifies the bundle's entry points.
   *
   * It allows you to manually set all build entries and adjust options for each one individually.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     { input: './src/index.ts' }, // => './dist/index.mjs'
   *     { types: './src/types.ts' }, // => './dist/types.d.ts'
   *     // ...
   *   ]
   * })
   * ```
   */
  entries: EntryOptions[]
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
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:end': async (options, buildStats) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  hooks?: HooksOptions
  /**
   * Specifies global path alias support.
   *
   * If true, it enables import prefixes:
   *
   * - `@/*`
   * - `~/*`
   *
   * @example
   *
   * ```ts
   * // Imports module from './src/utils/index.js'
   * import { module } from '@/utils/index.js'
   * ```
   *
   * @default undefined
   */
  alias?: true
}
