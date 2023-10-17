import type { OutputOptions } from 'rollup'
import type { PluginsOptions } from './plugins.js'

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
  plugins?: PluginsOptions
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
  plugins?: Pick<PluginsOptions, 'dts'>
}

export type EntryOptions = EntryInput | EntryTypes
