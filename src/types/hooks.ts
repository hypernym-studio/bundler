import type { Options } from './options.js'
import type { BuildStats, BuildEntryOptions } from './build.js'

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
   * import { plugin1, plugin2, plugin3 } from './plugins'
   *
   * export default defineConfig({
   *   hooks: {
   *     'build:entry:start': async (options, stats) => {
   *       // adds custom plugins for a specific entry only
   *       if (options.input?.includes('./src/index.ts')) {
   *         options.plugins = [
   *           plugin1(), // adds a custom plugin before the default bundler plugins
   *           ...options.plugins, // list of default bundler plugins
   *           plugin2(), // adds a custom plugin after the default bundler plugins
   *         ]
   *       }
   *       // adds custom plugins for a specific types only
   *       if (options.types?.includes('./src/types.ts')) {
   *         options.plugins = [
   *           ...options.plugins, // list of default bundler plugins
   *           plugin3(), // adds a custom plugin designed to work only with TS declarations
   *         ]
   *       }
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'build:entry:start'?: (
    options: BuildEntryOptions,
    stats: BuildStats,
  ) => void | Promise<void>
  /**
   * Called on each entry right after the build process is completed.
   *
   * @example
   *
   * ```ts
   * export default defineConfig({
   *   hooks: {
   *     'build:entry:end': async (options, stats) => {
   *      // ...
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'build:entry:end'?: (
    options: BuildEntryOptions,
    stats: BuildStats,
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
