import { stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { isObject } from '@hypernym/utils'
import { rollup } from 'rollup'
import _replace from '@rollup/plugin-replace'
import _json from '@rollup/plugin-json'
import _resolve from '@rollup/plugin-node-resolve'
import { dts as dtsPlugin } from 'rollup-plugin-dts'
import { esbuild as esbuildPlugin } from './utils/plugins/esbuild.js'
import type { Plugin } from 'rollup'
import type { Options, BuildStats } from './types/index.js'

const replacePlugin = _replace.default ?? _replace
const jsonPlugin = _json.default ?? _json
const resolvePlugin = _resolve.default ?? _resolve

export async function build(
  cwd: string,
  options: Options,
): Promise<BuildStats> {
  const { hooks } = options

  let start = 0
  const buildStats: BuildStats = {
    cwd,
    size: 0,
    buildTime: 0,
    files: [],
  }

  if (hooks?.['build:before']) await hooks['build:before'](options)

  if (options.entries) {
    start = Date.now()

    for (const entry of options.entries) {
      const { input, output, plugins, externals, banner, footer } = entry
      const entryStart = Date.now()

      const defaultPlugins: Plugin[] = [esbuildPlugin(plugins?.esbuild)]

      if (plugins?.json) {
        const jsonOptions = isObject(plugins.json) ? plugins.json : undefined
        defaultPlugins.push(jsonPlugin(jsonOptions))
      }

      if (plugins?.replace) {
        defaultPlugins.unshift(
          replacePlugin({
            preventAssignment: true,
            ...plugins.replace,
          }),
        )
      }
      if (plugins?.resolve) {
        const resolveOptions = isObject(plugins.resolve)
          ? plugins.resolve
          : undefined
        defaultPlugins.unshift(resolvePlugin(resolveOptions))
      }

      const isTypesExt = ['.d.ts', '.d.mts', '.d.cts'].some((ext) =>
        output.endsWith(ext),
      )

      if (!isTypesExt) {
        const builder = await rollup({
          input: resolve(cwd, input),
          external: externals || options.externals,
          plugins: defaultPlugins,
        })
        await builder.write({
          file: resolve(cwd, output),
          format: entry.format || 'esm',
          banner,
          footer,
        })
        const stats = await stat(resolve(cwd, output))

        buildStats.files.push({
          path: output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
        })
        buildStats.size = buildStats.size + stats.size
      } else {
        const builder = await rollup({
          input: resolve(cwd, input),
          plugins: [dtsPlugin(plugins?.dts)],
        })
        await builder.write({
          file: resolve(cwd, output),
          format: entry.format || 'esm',
          banner,
          footer,
        })
        const stats = await stat(resolve(cwd, output))

        buildStats.files.push({
          path: output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
        })
        buildStats.size = buildStats.size + stats.size
      }
    }

    buildStats.buildTime = Date.now() - start
  }

  if (hooks?.['build:done']) await hooks['build:done'](options)

  return buildStats
}
