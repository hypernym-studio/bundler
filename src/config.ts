import type { Options } from '@/types/options'

/**
 * List of global default patterns for external module identifiers.
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
  /^@rolldown/,
  /^@hypernym/,
  /^rollup/,
  /^rolldown/,
]

/**
 * ESM & TS module bundler.
 *
 * Automatically detects a custom configuration file at the project root, which can override or extend the build behavior.
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
 *
 * @see [Repository](https://github.com/hypernym-studio/bundler)
 */
export function defineConfig(options: Options): Options {
  return options
}
