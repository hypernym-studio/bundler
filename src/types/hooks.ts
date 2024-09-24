import type { Options } from './options'
import type { BuildEntryStats, BuildStats, BuildEntryOptions } from './build'

export interface HooksOptions {
  /**
   * Called at the beginning of bundling.
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
   *
   * @default undefined
   */
  'bundle:start'?: (options: Options) => void | Promise<void>
  /**
   * Called at the beginning of building.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:start': async (options, stats) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'build:start'?: (options: Options, stats: BuildStats) => void | Promise<void>
  /**
   * Called on each entry just before the build process.
   *
   * Provides the ability to customize entry options before they are passed to the next phase.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:entry:start': async (entry, stats) => {
   *      // ...
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'build:entry:start'?: (
    entry: BuildEntryOptions,
    stats: BuildEntryStats,
  ) => void | Promise<void>
  /**
   * Called on each entry right after the build process is completed.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:entry:end': async (entry, stats) => {
   *      // ...
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'build:entry:end'?: (
    entry: BuildEntryOptions,
    stats: BuildEntryStats,
  ) => void | Promise<void>
  /**
   * Called right after building is complete.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:end': async (options, stats) => {
   *       // ...
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'build:end'?: (options: Options, stats: BuildStats) => void | Promise<void>
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
   *
   * @default undefined
   */
  'bundle:end'?: (options: Options) => void | Promise<void>
}
