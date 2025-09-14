import type {
  InputOptions,
  OutputOptions,
  RolldownPluginOption,
  LogLevel,
  RollupLog,
  LogOrStringHandler,
} from 'rolldown'
import type { Options as DtsOptions } from 'rolldown-plugin-dts'
import type { BuildLogs } from './build'

export interface EntryBase {
  /**
   * Specifies the format of the generated module.
   *
   * - `'es'`, `'esm'` and `'module'` are the same format, all stand for ES module.
   * - `'cjs'` and `'commonjs'` are the same format, all stand for CommonJS module.
   * - `'iife'` stands for [Immediately Invoked Function Expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).
   * - `'umd'` stands for [Universal Module Definition](https://github.com/umdjs/umd).
   *
   * @default 'esm'
   */
  format?: OutputOptions['format']
  /**
   * Specifies the module IDs or regular expressions that match module IDs to be treated as external and excluded from the bundle.
   *
   * The IDs and regular expressions provided in this option are applied globally across all entries.
   *
   * Alternatively, externals can be defined individually for each entry using the `entry.externals` property.
   *
   * @default undefined
   */
  externals?: (string | RegExp)[]
  /**
   * Maps external module IDs to paths.
   *
   * @default undefined
   */
  paths?: {
    find: string | RegExp
    replacement:
      | string
      | ((path: string, match: RegExpExecArray | null) => string)
  }[]
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
   * Intercepts log messages. If not supplied, logs are printed to the console.
   *
   * @default undefined
   */
  onLog?: (
    level: LogLevel,
    log: RollupLog,
    defaultHandler: LogOrStringHandler,
    buildLogs: BuildLogs[],
  ) => void
  /**
   * Specifies Rolldown `resolve` options.
   *
   * @default undefined
   */
  resolve?: InputOptions['resolve']
  /**
   * Specifies Rolldown `define` options.
   *
   * @default undefined
   */
  define?: InputOptions['define']
  /**
   * Specifies Rolldown `inject` options.
   *
   * @default undefined
   */
  inject?: InputOptions['inject']
  /**
   * Specifies Rolldown plugins.
   *
   * @default undefined
   */
  plugins?: RolldownPluginOption
  /**
   * Specifies the path to the `tsconfig` file.
   *
   * By default, if the file `tsconfig.json` exists in the project root, it will be used as the default config file.
   *
   * @default undefined
   */
  tsconfig?: InputOptions['tsconfig']
}

export interface EntryChunk extends EntryBase {
  /**
   * Specifies the path to the build source.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     { input: './src/index.ts' }, // outputs './dist/index.js'
   *   ]
   * })
   * ```
   */
  input: string
  /**
   * Specifies the path to the processed file.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       input: './src/index.ts',
   *       output: './out/index.js', // outputs './out/index.js'
   *     },
   *   ]
   * })
   * ```
   *
   * @default undefined
   */
  output?: string
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
   * Controls code minification.
   *
   * - `true`: Enable full minification including code compression and dead code elimination.
   * - `false`: Disable minification (default).
   * - `'dce-only'`: Only perform dead code elimination without code compression.
   * - `MinifyOptions`: Fine-grained control over minification settings.
   *
   * @default undefined
   */
  minify?: OutputOptions['minify']

  // Mutually exclusive props
  // dts
  dts?: never
  dtsPlugin?: never
  // copy
  copy?: never
  recursive?: never
  filter?: never
  // template
  template?: never
}

export interface EntryDts extends EntryBase {
  /**
   * Specifies the path to the TypeScript `declaration` build source.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     { dts: './src/types.ts' }, // outputs './dist/types.d.ts'
   *   ]
   * })
   * ```
   */
  dts: string
  /**
   * Specifies the path to the processed file.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       dts: './src/types.ts',
   *       output: './out/types.d.ts', // outputs './out/types.d.ts'
   *     },
   *   ]
   * })
   * ```
   *
   * @default undefined
   */
  output?: string
  /**
   * Specifies options for the `rolldown-plugin-dts` plugin.
   */
  dtsPlugin?: DtsOptions

  // Mutually exclusive props
  // chunk
  input?: never
  name?: never
  globals?: never
  extend?: never
  minify?: never
  // copy
  copy?: never
  recursive?: never
  filter?: never
  // template
  template?: never
}

export interface EntryCopy {
  /**
   * Copies either a single `file` or an entire `directory` structure from the source to the destination, including all subdirectories and files.
   *
   * This is especially useful for transferring assets that don't require any transformation, just a straightforward copy-paste operation.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       // copies a single file
   *       copy: './src/path/file.ts', // outputs './dist/path/file.ts'
   *     },
   *     {
   *       // copies a single file
   *       copy: './src/path/file.ts',
   *       output: './dist/subdir/custom-file-name.ts',
   *     },
   *     {
   *       // copies the entire directory
   *       input: './src/path/srcdir',
   *       output: './dist/outdir',
   *     },
   *   ]
   * })
   * ```
   *
   * @default undefined
   */
  copy: string
  /**
   * Specifies the path to the destination file or directory.
   */
  output?: string
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

  // Mutually exclusive props
  // chunk
  input?: never
  name?: never
  globals?: never
  extend?: never
  minify?: never
  // dts
  dts?: never
  dtsPlugin?: never
  // template
  template?: never
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
   * import { name, version } from './package.json'
   *
   * export default defineConfig({
   *   entries: [
   *     {
   *       template: `// Package ${name} v${version} ...`,
   *       output: './dist/template.ts',
   *     },
   *   ]
   * })
   * ```
   */
  template: string
  /**
   * Specifies the path to the destination file.
   */
  output: string

  // Mutually exclusive props
  // chunk
  input?: never
  name?: never
  globals?: never
  extend?: never
  minify?: never
  // dts
  dts?: never
  dtsPlugin?: never
  // copy
  copy?: never
  recursive?: never
  filter?: never
}

export type EntryOptions = EntryChunk | EntryDts | EntryCopy | EntryTemplate
