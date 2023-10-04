import type { Options } from './options.js'

export interface BuildHooks {
  'build:before'?: (options?: Options) => void | Promise<void>
  'build:done'?: (options?: Options) => void | Promise<void>
}
