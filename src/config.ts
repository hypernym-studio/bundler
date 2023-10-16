import type { Options } from './types/options.js'

/**
 * List of global defaults for externals.
 *
 * @example
 *
 * ```ts
 * import { externals } from '@hypernym/bundler'
 *
 * export default defineConfig({
 *   entries: [
 *     {
 *       input: './src/index.ts',
 *       externals: [...externals, 'id', /regexp/]
 *     },
 *   ]
 * })
 * ```
 */
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
