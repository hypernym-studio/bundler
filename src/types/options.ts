import type { EntryOptions } from './entries'
import type { HooksOptions } from './hooks'
import type { Alias } from '@rollup/plugin-alias'

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
   *     { declaration: './src/types.ts' }, // => './dist/types.d.ts'
   *     // ...
   *   ]
   * })
   * ```
   */
  entries: EntryOptions[]
  /**
   * Specifies the output directory for production bundle.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   outDir: 'output',
   * })
   * ```
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
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   externals: ['id-1', 'id-2', /regexp/],
   * })
   * ```
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
   * Specifies prefixes that will resolve imports with custom paths.
   *
   * Enables these `alias` by default:
   *
   * ```ts
   * // Imports module from './src/utils/index.js'
   * import { module } from '@/utils' // @
   * import { module } from '~/utils' // ~
   * ```
   *
   * Also, it is possible to completely override the default aliases by setting custom ones.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   alias: [
   *     { find: /^#/, replacement: resolve('./src') },
   *   ]
   * })
   * ```
   *
   * Now imports can be used like this:
   *
   * ```ts
   * // Imports module from './src/utils/index.js'
   * import { module } from '#/utils' // #
   * ```
   *
   * @default undefined
   */
  alias?: Alias[]
  /**
   * Specifies the minification for all `chunk` entries.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   minify: true,
   * })
   * ```
   *
   * It can also be set per entry.
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       input: './src/index.ts',
   *       minify: true,
   *     },
   *   ],
   * })
   * ```
   *
   * @default undefined
   */
  minify?: boolean
}
