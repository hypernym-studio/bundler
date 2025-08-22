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
   *     { input: './src/index.ts' }, // outputs './dist/index.mjs'
   *     { dts: './src/types.ts' }, // outputs './dist/types.d.mts'
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
   * @default [/^node:/,/^@types/,/^@rollup/,/^@rolldown/,/^@hypernym/,/^rollup/,/^rolldown/,...pkg.dependencies]
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
  /**
   * Specifies the path to the project root (current working directory).
   *
   * @default undefined
   */
  cwd?: string
  /**
   * Specifies the path to the `tsconfig` file.
   *
   * By default, if the file `tsconfig.json` exists in the project root, it will be used as the default config file.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   tsconfigPath: './path/to/tsconfig.json',
   * })
   * ```
   *
   * @default undefined
   */
  tsconfigPath?: string
}
