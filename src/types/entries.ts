import type { OutputOptions, Plugin } from 'rollup'
import type { TransformersChunk, TransformersDeclaration } from './transformers'

export interface EntryBase {
  /**
   * Specifies the format of the generated module.
   *
   * @default 'esm'
   */
  format?: OutputOptions['format']
  /**
   * Specifies the module IDs, or regular expressions to match module IDs,
   * that should remain external to the bundle.
   *
   * If not specified, infers the IDs from the global `options.externals` option.
   *
   * @default undefined
   */
  externals?: (string | RegExp)[]
  /**
   * Specifies the string to be inserted at the beginning of the module.
   *
   * @default undefined
   */
  banner?: OutputOptions['banner']
  /**
   * Specifies the string to be inserted at the end of the module.
   *
   * @default undefined
   */
  footer?: OutputOptions['footer']
  /**
   * Specifies the code at the beginning that goes inside any _format-specific_ wrapper.
   *
   * @default undefined
   */
  intro?: OutputOptions['intro']
  /**
   * Specifies the code at the end that goes inside any _format-specific_ wrapper.
   *
   * @default undefined
   */
  outro?: OutputOptions['outro']
  /**
   * Maps external module IDs to paths.
   *
   * @default undefined
   */
  paths?: OutputOptions['paths']
  /**
   * Specifies custom filters that will display only certain log messages.
   *
   * @default undefined
   */
  logFilter?: string[]
  /**
   * Specifies `rollup` plugins.
   *
   * Adding custom plugins disables all built-in `transformers` for full customization.
   *
   * @default undefined
   */
  plugins?: Plugin[]
}

export interface EntryChunk extends EntryBase {
  /**
   * Specifies the path of the build source.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     { input: './src/index.ts' }, // => './dist/index.mjs'
   *   ]
   * })
   * ```
   */
  input?: string
  /**
   * Specifies the path of the transformed file.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       input: './src/index.ts',
   *       output: './out/index.js', // => './out/index.js'
   *     },
   *   ]
   * })
   * ```
   *
   * @default undefined
   */
  output?: string
  /**
   * Specifies the built-in `transformers` options.
   *
   * Available transformers:
   *
   * - `esbuild`
   * - `resolve`
   * - `replace`
   * - `json`
   * - `alias`
   *
   * @default undefined
   */
  transformers?: TransformersChunk
  /**
   * Specifies the global variable name that representing exported bundle.
   *
   * Intended for `umd/iife` formats.
   *
   * @default undefined
   */
  name?: OutputOptions['name']
  /**
   * Specifies global _module ID_ and _variable name_ pairs necessary for external imports.
   *
   * Intended for `umd/iife` formats.
   *
   * @default undefined
   */
  globals?: OutputOptions['globals']
  /**
   * Specifies whether to extend the global variable defined by the `name` option.
   *
   * Intended for `umd/iife` formats.
   */
  extend?: OutputOptions['extend']
  /**
   * Minifies the generated code if enabled.
   *
   * @default undefined
   */
  minify?: boolean
  declaration?: never
  dts?: never
  copy?: never
  template?: never
}

export interface EntryDeclaration extends EntryBase {
  /**
   * Specifies the path of the TypeScript `declaration` build source.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     { dts: './src/types.ts' }, // => './dist/types.d.mts'
   *   ]
   * })
   * ```
   */
  dts?: string
  /**
   * Specifies the path of the TypeScript `declaration` build source.
   *
   * Also, it is possible to use `dts` alias.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     { declaration: './src/types.ts' }, // => './dist/types.d.mts'
   *   ]
   * })
   * ```
   */
  declaration?: string
  /**
   * Specifies the path of the TypeScript  transformed `declaration` file.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       dts: './src/types.ts',
   *       output: './out/types.d.ts', // => './out/types.d.ts'
   *     },
   *   ]
   * })
   * ```
   *
   * @default undefined
   */
  output?: string
  /**
   * Specifies the built-in `transformers` options.
   *
   * Available transformers:
   *
   * - `dts`
   * - `alias`
   *
   * @default undefined
   */
  transformers?: TransformersDeclaration
  input?: never
  copy?: never
  template?: never
  name?: never
  globals?: never
  extend?: never
  minify?: never
}

export interface CopyOptions {
  /**
   * Specifies the path of the source.
   */
  input: string | string[]
  /**
   * Specifies the path of the destination directory.
   */
  output: string
  /**
   * Copy directories recursively.
   *
   * @default true
   */
  recursive?: boolean
  /**
   * Filters copied `files/directories`.
   *
   * Returns `true` to copy the item, `false` to ignore it.
   *
   * @default undefined
   */
  filter?(source: string, destination: string): boolean
}

export interface EntryCopy {
  /**
   * Copies the single `file` or entire `directory` structure from source to destination, including subdirectories and files.
   *
   * This can be very useful for copying some assets that don't need a transformation process, but a simple copy paste feature.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       copy: {
   *         input: './src/path/file.ts', // or ['path-dir', 'path-file.ts', ...]
   *         output: './dist/out', // path to output dir
   *       }
   *     }
   *   ]
   * })
   * ```
   *
   * @default undefined
   */
  copy?: CopyOptions
  input?: never
  declaration?: never
  dts?: never
  template?: never
  name?: never
  globals?: never
  extend?: never
  minify?: never
}

export interface EntryTemplate {
  /**
   * Specifies the content of the `template` file.
   *
   * Provides the ability to dynamically inject template content during the build phase.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       template: `// TypeScript code...`,
   *       output: './dist/template.ts',
   *     },
   *   ]
   * })
   * ```
   */
  template: string
  /**
   * Specifies the path of the transformed `template` file.
   */
  output: string
  input?: never
  declaration?: never
  dts?: never
  copy?: never
  name?: never
  globals?: never
  extend?: never
  minify?: never
}

export type EntryOptions =
  | EntryChunk
  | EntryDeclaration
  | EntryCopy
  | EntryTemplate
