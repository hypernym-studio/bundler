import type { OutputOptions } from 'rollup'
import type { BuildPlugins } from './plugins.js'

export interface EntriesOptions {
  input: string
  output: string
  format?: OutputOptions['format']
  externals?: (string | RegExp)[]
  banner?: OutputOptions['banner']
  footer?: OutputOptions['footer']
  minify?: boolean
  tsconfig?: string
  plugins?: BuildPlugins
}
