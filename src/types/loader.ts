import type { Options } from './options'

export interface ConfigLoader {
  options: Options
  path: string
}
