import type { OutputOptions } from 'rollup'
import type { BuildPlugins } from './plugins.js'

export interface Entries {
  output?: string
  format?: OutputOptions['format']
  externals?: (string | RegExp)[]
  logFilter?: string[]
}

export interface EntriesInput extends Entries {
  input: string
  banner?: OutputOptions['banner']
  footer?: OutputOptions['footer']
  plugins?: BuildPlugins
}

export interface EntriesTypes extends Entries {
  types: string
  plugins?: Pick<BuildPlugins, 'dts'>
}

export type EntriesOptions = EntriesInput | EntriesTypes
