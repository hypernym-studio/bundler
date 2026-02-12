import type { EntryOptions } from './entries'
import type { HooksOptions } from './hooks'
import type { OutputOptions } from 'rolldown'

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
   *     { input: './src/index.ts' }, // outputs './dist/index.js'
   *     { dts: './src/types.ts' }, // outputs './dist/types.d.ts'
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
   *   outDir: './output',
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
   * Controls code minification for all `chunk` entries.
   *
   * - `true`: Enable full minification including code compression and dead code elimination.
   * - `false`: Disable minification (default).
   * - `'dce-only'`: Only perform dead code elimination without code compression.
   * - `MinifyOptions`: Fine-grained control over minification settings.
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
  minify?: OutputOptions['minify']
  /**
   * Specifies the path to the project root (current working directory).
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   cwd: './dir',
   * })
   * ```
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
   *   tsconfig: './path/to/tsconfig.json',
   * })
   * ```
   *
   * @default undefined
   */
  tsconfig?: string
  /**
   * Specifies which comments are preserved in the output.
   *
   * - `true`: Preserve legal, annotation, and JSDoc comments (default)-
   * - `false`: Strip all comments-
   * - Object: Granular control over comment categories:
   *   - `legal`: `@license`, `@preserve`, `//!`, `/*!`.
   *   - `annotation`: `@__PURE__`, `@__NO_SIDE_EFFECTS__`, `@vite-ignore`.
   *   - `jsdoc`: JSDoc comments.
   *
   * @default { legal: true, annotation: true, jsdoc: false }
   */
  comments?: OutputOptions['comments']
}
