import type { Options } from './types/index.js'

export const externals = [
  /^node:/,
  /^@types/,
  /^@rollup/,
  /^@hypernym/,
  /^rollup/,
]

export function defineConfig(options: Options): Options {
  return options
}
