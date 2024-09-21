import type { Options } from '@/types/options'

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
export const externals: RegExp[] = [
  /^node:/,
  /^@types/,
  /^@rollup/,
  /^@hypernym/,
  /^rollup/,
]

/**
 * `Hyperbundler` automatically detects custom configuration from the project root that can override or extend the build behavior.
 *
 * Configuration file also accepts `.js`, `.mjs`, `.ts`, `.mts` formats.
 *
 * @example
 *
 * ```ts
 * import { defineConfig } from '@hypernym/bundler'
 *
 * export default defineConfig({
 *   // ...
 * })
 * ```
 */
export function defineConfig(options: Options): Options {
  return options
}
