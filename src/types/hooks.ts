import type { Options } from './options.js'
import type { BuildStats } from './build.js'

export interface HooksOptions {
  /**
   * Called just before bundling started.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'bundle:start': async (options) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   */
  'bundle:start'?: (options?: Options) => void | Promise<void>
  /**
   * Called just before building started.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:start': async (options, buildStats) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   */
  'build:start'?: (
    options?: Options,
    buildStats?: BuildStats,
  ) => void | Promise<void>
  /**
   * Called right after building is complete.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:end': async (options, buildStats) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   */
  'build:end'?: (
    options?: Options,
    buildStats?: BuildStats,
  ) => void | Promise<void>
  /**
   * Called right after bundling is complete.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'bundle:end': async (options) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   */
  'bundle:end'?: (options?: Options) => void | Promise<void>
}
