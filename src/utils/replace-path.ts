/**
 * Replaces the external module ID with a custom value.
 *
 * @example
 *
 * ```ts
 * import { defineConfig, replacePath } from '@hypernym/bundler'
 *
 * export default defineConfig({
 *   entries: [
 *     {
 *       input: './src/index.ts',
 *       output: './dist/index.mjs',
 *       externals: [/^@\/path/],
 *       // replaces `@/path` with `./path/index.mjs`
 *       paths: (id) => replacePath(/^@\/path/, './easing/index.mjs')(id),
 *     },
 *   ]
 * })
 * ```
 */
export function replacePath(
  path: RegExp | string,
  replace: string,
): (id: string) => string {
  return (id) => {
    if (id.match(path)) return replace
    return id
  }
}
