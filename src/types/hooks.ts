import type { Plugin } from 'rollup'
import type { Options } from './options.js'
import type { BuildStats } from './build.js'
import type { EntryInput, EntryTypes } from './entries.js'

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
   *
   * @default undefined
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
   *
   * @default undefined
   */
  'build:start'?: (
    options?: Options,
    buildStats?: BuildStats,
  ) => void | Promise<void>
  /**
   * Called just before the initialization of the Rollup plugin.
   *
   * Provides the ability to add and manipulate custom plugins.
   *
   * @example
   *
   * ```ts
   * import { plugin1, plugin2, plugin3 } from './plugins'
   *
   * export default defineConfig({
   *   hooks: {
   *     'rollup:plugins': (plugins, entry) => {
   *       // adds a custom plugin before the default bundler plugins
   *       plugins.unshift(plugin1())
   *       // adds a custom plugin after the default bundler plugins
   *       plugins.push(plugin2())
   *       // adds a custom plugin for a specific entry only
   *       if (entry?.input?.includes('./src/index.ts')) {
   *         plugins.push(plugin3())
   *       }
   *       // returns the final list of plugins
   *       return plugins
   *     }
   *   }
   * })
   * ```
   *
   * @default undefined
   */
  'rollup:plugins'?: (
    plugins: Plugin[],
    entry?: Partial<EntryInput> & Partial<Omit<EntryTypes, 'plugins'>>,
  ) => Plugin[]
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
   *
   * @default undefined
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
   *
   * @default undefined
   */
  'bundle:end'?: (options?: Options) => void | Promise<void>
}
