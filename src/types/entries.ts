import type { OutputOptions } from 'rollup'
import type { PluginsInput, PluginsTypes } from './plugins'

export interface EntryBase {
  /**
   * Specifies the path of the transformed module.
   *
   * If not specified, matches the `input` path with the appropriate extension.
   *
   * @default undefined
   */
  output?: string
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
}

export interface EntryInput extends EntryBase {
  /**
   * Specifies the path of the module's build source.
   */
  input: string
  /**
   * Specifies plugin options.
   *
   * @default undefined
   */
  plugins?: PluginsInput
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
}

export interface EntryTypes extends EntryBase {
  /**
   * Specifies the path of the module's build source that contains only TS definitions.
   */
  types: string
  /**
   * Specifies plugin options.
   *
   * @default undefined
   */
  plugins?: PluginsTypes
}

export interface EntryTemplate extends Pick<EntryBase, 'logFilter'> {
  /**
   * Specifies the build entry as a module template.
   *
   * Provides the ability to dynamically inject template content during the build phase.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       template: true,
   *       output: './dist/template.ts',
   *       content: '// TypeScript code...',
   *     },
   *   ]
   * })
   * ```
   */
  template: true
  /**
   * Specifies the path of the transformed module template.
   */
  output: string
  /**
   * Specifies the content of the module template.
   */
  content: OutputOptions['intro']
  /**
   * Specifies the format of the generated module template.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   entries: [
   *     {
   *       template: true,
   *       output: './dist/template.json',
   *       content: '{}',
   *       format: 'json',
   *     },
   *   ]
   * })
   * ```
   *
   * @default 'esm'
   */
  format?: string
  /**
   * Specifies plugin options.
   *
   * @default undefined
   */
  plugins?: Pick<PluginsInput, 'esbuild'>
}

export type EntryOptions = EntryInput | EntryTypes | EntryTemplate
