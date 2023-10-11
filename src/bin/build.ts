import { resolve } from 'node:path'
import { stat } from 'node:fs/promises'
import { isObject } from '@hypernym/utils'
import { rollup } from 'rollup'
import { getLogFilter } from 'rollup/getLogFilter'
import _replace from '@rollup/plugin-replace'
import _json from '@rollup/plugin-json'
import _resolve from '@rollup/plugin-node-resolve'
import { dts as dtsPlugin } from 'rollup-plugin-dts'
import { esbuild as esbuildPlugin } from '../utils/plugins/esbuild.js'
import { getOutputPath } from '../utils/index.js'
import type { Plugin, ModuleFormat } from 'rollup'
import type { Options } from '../types/options.js'
import type { BuildStats, BuildLogs } from '../types/build.js'

const replacePlugin = _replace.default ?? _replace
const jsonPlugin = _json.default ?? _json
const resolvePlugin = _resolve.default ?? _resolve

export async function build(
  cwd: string,
  options: Options,
): Promise<BuildStats> {
  const { outDir = 'dist', hooks } = options

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
      const entryStart = Date.now()

      const logFilter = getLogFilter(entry.logFilter || [])

      if ('input' in entry) {
        const { input, externals, plugins, banner, footer } = entry

        const buildLogs: BuildLogs[] = []
        const _output = getOutputPath(outDir, input)
        let _format: ModuleFormat = 'esm'

        if (_output.endsWith('.cjs')) _format = 'cjs'

        const output = entry.output || _output
        const format = entry.format || _format

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

        const builder = await rollup({
          input: resolve(cwd, input),
          external: externals || options.externals,
          plugins: defaultPlugins,
          onLog: (level, log) => {
            if (logFilter(log)) buildLogs.push({ level, log })
          },
        })
        await builder.write({
          file: resolve(cwd, output),
          format,
          banner,
          footer,
        })
        const stats = await stat(resolve(cwd, output))

        buildStats.files.push({
          path: output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format,
          logs: buildLogs,
        })
        buildStats.size = buildStats.size + stats.size
      }

      if ('types' in entry) {
        const { types, externals, plugins, banner, footer } = entry

        const buildLogs: BuildLogs[] = []
        const _output = getOutputPath(outDir, types, true)
        let _format: ModuleFormat = 'esm'

        if (_output.endsWith('.d.cts')) _format = 'cjs'

        const output = entry.output || _output
        const format = entry.format || _format

        const builder = await rollup({
          input: resolve(cwd, types),
          external: externals || options.externals,
          plugins: [dtsPlugin(plugins?.dts)],
          onLog: (level, log) => {
            if (logFilter(log)) buildLogs.push({ level, log })
          },
        })
        await builder.write({
          file: resolve(cwd, output),
          format,
          banner,
          footer,
        })
        const stats = await stat(resolve(cwd, output))

        buildStats.files.push({
          path: output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format,
          logs: buildLogs,
        })
        buildStats.size = buildStats.size + stats.size
      }
    }

    buildStats.buildTime = Date.now() - start
  }

  if (hooks?.['build:done']) await hooks['build:done'](options)

  return buildStats
}
