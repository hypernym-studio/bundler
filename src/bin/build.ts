import { resolve, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
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

  if (hooks?.['build:start']) await hooks['build:start'](options, buildStats)

  if (options.entries) {
    start = Date.now()

    for (const entry of options.entries) {
      const entryStart = Date.now()

      let logFilter = getLogFilter(entry.logFilter || [])

      if ('input' in entry) {
        const _output = getOutputPath(outDir, entry.input)
        let _format: ModuleFormat = 'esm'
        if (_output.endsWith('.cjs')) _format = 'cjs'

        const buildLogs: BuildLogs[] = []
        const _entry: {
          input: string
          output: string
          externals: typeof entry.externals
          format: ModuleFormat
          plugins: Plugin[]
          pluginsOptions: typeof entry.plugins
          banner: typeof entry.banner
          footer: typeof entry.footer
          intro: typeof entry.intro
          outro: typeof entry.outro
          paths: typeof entry.paths
          name: typeof entry.name
          globals: typeof entry.globals
          extend: typeof entry.extend
        } = {
          input: entry.input,
          output: entry.output || _output,
          externals: entry.externals || options.externals,
          format: entry.format || _format,
          plugins: [esbuildPlugin(entry.plugins?.esbuild)],
          pluginsOptions: entry.plugins,
          banner: entry.banner,
          footer: entry.footer,
          intro: entry.intro,
          outro: entry.outro,
          paths: entry.paths,
          name: entry.name,
          globals: entry.globals,
          extend: entry.extend,
        }

        if (_entry.pluginsOptions?.json) {
          const jsonOptions = isObject(_entry.pluginsOptions.json)
            ? _entry.pluginsOptions.json
            : undefined
          _entry.plugins.push(jsonPlugin(jsonOptions))
        }

        if (_entry.pluginsOptions?.replace) {
          _entry.plugins.unshift(
            replacePlugin({
              preventAssignment: true,
              ..._entry.pluginsOptions.replace,
            }),
          )
        }
        if (_entry.pluginsOptions?.resolve) {
          const resolveOptions = isObject(_entry.pluginsOptions.resolve)
            ? _entry.pluginsOptions.resolve
            : undefined
          _entry.plugins.unshift(resolvePlugin(resolveOptions))
        }

        if (hooks?.['build:entry:start']) {
          await hooks['build:entry:start'](_entry, buildStats)
        }

        const _build = await rollup({
          input: resolve(cwd, _entry.input),
          external: _entry.externals,
          plugins: _entry.plugins,
          onLog: (level, log) => {
            if (logFilter(log)) buildLogs.push({ level, log })
          },
        })
        await _build.write({
          file: resolve(cwd, _entry.output),
          format: _entry.format,
          banner: _entry.banner,
          footer: _entry.footer,
          intro: _entry.intro,
          outro: _entry.outro,
          paths: _entry.paths,
          name: _entry.name,
          globals: _entry.globals,
          extend: _entry.extend,
        })
        const stats = await stat(resolve(cwd, _entry.output))

        buildStats.files.push({
          path: _entry.output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format: _entry.format,
          logs: buildLogs,
        })
        buildStats.size = buildStats.size + stats.size

        if (hooks?.['build:entry:end']) {
          await hooks['build:entry:end'](_entry, buildStats)
        }
      }

      if ('types' in entry) {
        const _output = getOutputPath(outDir, entry.types, true)
        let _format: ModuleFormat = 'esm'
        if (_output.endsWith('.d.cts')) _format = 'cjs'

        const buildLogs: BuildLogs[] = []
        const _entry: {
          types: string
          output: string
          externals: typeof entry.externals
          format: ModuleFormat
          plugins: Plugin[]
          pluginsOptions: typeof entry.plugins
          banner: typeof entry.banner
          footer: typeof entry.footer
          intro: typeof entry.intro
          outro: typeof entry.outro
          paths: typeof entry.paths
        } = {
          types: entry.types,
          output: entry.output || _output,
          externals: entry.externals || options.externals,
          format: entry.format || _format,
          plugins: [dtsPlugin(entry.plugins?.dts)],
          pluginsOptions: entry.plugins,
          banner: entry.banner,
          footer: entry.footer,
          intro: entry.intro,
          outro: entry.outro,
          paths: entry.paths,
        }

        if (hooks?.['build:entry:start']) {
          await hooks['build:entry:start'](_entry, buildStats)
        }

        const _build = await rollup({
          input: resolve(cwd, _entry.types),
          external: _entry.externals,
          plugins: _entry.plugins,
          onLog: (level, log) => {
            if (logFilter(log)) buildLogs.push({ level, log })
          },
        })
        await _build.write({
          file: resolve(cwd, _entry.output),
          format: _entry.format,
          banner: _entry.banner,
          footer: _entry.footer,
          intro: _entry.intro,
          outro: _entry.outro,
          paths: _entry.paths,
        })
        const stats = await stat(resolve(cwd, _entry.output))

        buildStats.files.push({
          path: _entry.output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format: 'dts',
          logs: buildLogs,
        })
        buildStats.size = buildStats.size + stats.size

        if (hooks?.['build:entry:end']) {
          await hooks['build:entry:end'](_entry, buildStats)
        }
      }

      if ('template' in entry) {
        logFilter = getLogFilter(entry.logFilter || ['!code:EMPTY_BUNDLE'])

        const _distDir = parse(fileURLToPath(import.meta.url)).dir
        const _output = entry.output
        let _format = 'esm'
        if (_output.endsWith('.cjs')) _format = 'cjs'

        const buildLogs: BuildLogs[] = []
        const _entry: {
          template: string
          output: string
          content: typeof entry.content
          plugins: Plugin[]
          pluginsOptions: typeof entry.plugins
          format: string
        } = {
          template: resolve(_distDir, '_empty.ts'),
          output: _output,
          content: entry.content,
          plugins: [esbuildPlugin(entry.plugins?.esbuild)],
          pluginsOptions: entry.plugins,
          format: entry.format || _format,
        }

        const _build = await rollup({
          input: _entry.template,
          plugins: _entry.plugins,
          onLog: (level, log) => {
            if (logFilter(log)) buildLogs.push({ level, log })
          },
        })
        await _build.write({
          file: resolve(cwd, _entry.output),
          intro: _entry.content,
        })
        const stats = await stat(resolve(cwd, _entry.output))

        buildStats.files.push({
          path: _entry.output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format: _entry.format,
          logs: buildLogs,
        })
        buildStats.size = buildStats.size + stats.size
      }
    }

    buildStats.buildTime = Date.now() - start
  }

  if (hooks?.['build:end']) await hooks['build:end'](options, buildStats)

  return buildStats
}
