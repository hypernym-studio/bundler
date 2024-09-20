import type { ResolvePathsOptions } from '@/types'

/**
 * Resolves external module IDs into custom paths.
 *
 * @example
 *
 * ```ts
 * import { defineConfig, resolvePaths } from '@hypernym/bundler'
 *
 * export default defineConfig({
 *   entries: [
 *     {
 *       input: './src/index.ts',
 *       externals: [/^@\/path/],
 *       paths: resolvePaths([
 *         // replaces `@/path` with `./path/index.mjs`
 *         { find: /^@\/path/, replacement: './path/index.mjs', }
 *       ]),
 *     },
 *   ]
 * })
 * ```
 */
export function resolvePaths(
  options: ResolvePathsOptions[],
): (id: string) => string {
  return (id) => {
    for (const resolver of options) {
      const { find, replacement } = resolver
      if (id.match(find)) id = replacement
    }
    return id
  }
}
