import { resolve, parse } from 'node:path'
import { stat } from 'node:fs/promises'
import { dim } from '@hypernym/colors'
import { write, copy, readdir } from '@hypernym/utils/fs'
import { isObject, isString, isUndefined } from '@hypernym/utils'
import { rollup } from 'rollup'
import { getLogFilter } from 'rollup/getLogFilter'
import replacePlugin from '@rollup/plugin-replace'
import jsonPlugin from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import aliasPlugin from '@rollup/plugin-alias'
import { dts as dtsPlugin } from 'rollup-plugin-dts'
import { esbuild as esbuildPlugin } from '@/utils/plugins/esbuild'
import {
  getOutputPath,
  getLongestOutput,
  formatMs,
  formatBytes,
  error,
} from '@/utils'
import type { ModuleFormat } from 'rollup'
import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { Options, BuildStats, BuildLogs } from '@/types'

function logModuleStats(
  file: {
    format: string
    path: string
    buildTime: number
    size: number
    logs: BuildLogs[]
  },
  longestOutput: number,
) {
  const cl = console.log
  const base = parse(file.path).base
  const path = file.path.replace(base, '')
  let format = file.format

  if (format.includes('system')) format = 'sys'
  if (format === 'commonjs') format = 'cjs'
  if (format === 'module') format = 'esm'

  longestOutput = longestOutput + 2
  const ansiCode = 9
  const pathDim = dim(path)
  const output = pathDim + base
  const pathDimNoAnsi = pathDim.length - ansiCode
  const difference = longestOutput - pathDimNoAnsi - base.length
  const padLength = output.length + difference

  cl(
    dim('+'),
    format.padEnd(5),
    output.padEnd(padLength),
    dim('time'),
    formatMs(file.buildTime).padEnd(7),
    dim('size'),
    formatBytes(file.size),
  )

  if (file.logs) {
    for (const log of file.logs) {
      cl(
        dim('!'),
        log.level.padEnd(5),
        output.padEnd(padLength),
        dim(log.log.message),
      )
    }
  }
}

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

  await hooks?.['build:start']?.(options, buildStats)

  if (options.entries) {
    const longestOutput = getLongestOutput(outDir, options.entries)

    start = Date.now()

    const aliasDir = resolve(cwd, './src')
    let aliasOptions: RollupAliasOptions = {
      entries: options.alias || [
        { find: '@', replacement: aliasDir },
        { find: '~', replacement: aliasDir },
      ],
    }

    for (const entry of options.entries) {
      const entryStart = Date.now()

      if (entry.copy) {
        const _entry = {
          input: isString(entry.copy.input)
            ? [entry.copy.input]
            : entry.copy.input,
          output: entry.copy.output,
          recursive: entry.copy.recursive || true,
          filter: entry.copy.filter,
        }
        const buildLogs: BuildLogs[] = []

        for (const copyInput of _entry.input) {
          const fileSrc = resolve(cwd, copyInput)
          const fileDist = resolve(cwd, _entry.output, copyInput)

          await copy(fileSrc, fileDist, {
            recursive: _entry.recursive,
            filter: _entry.filter,
          }).catch(error)

          const stats = await stat(fileDist)
          let totalSize = 0

          if (!stats.isDirectory()) totalSize = stats.size
          else {
            const files = await readdir(fileDist)
            for (const file of files) {
              const filePath = resolve(fileDist, file)
              const fileStat = await stat(filePath)
              totalSize = totalSize + fileStat.size
            }
          }

          const parseInput = (path: string): string => {
            if (path.startsWith('./')) return path.slice(2)
            else return path
          }

          const parseOutput = (path: string): string => {
            if (path.startsWith('./')) return path
            else return `./${path}`
          }

          const fileStats = {
            cwd,
            path: `${parseOutput(_entry.output)}/${parseInput(copyInput)}`,
            size: totalSize,
            buildTime: Date.now() - entryStart,
            format: 'copy',
            logs: buildLogs,
          }

          buildStats.files.push(fileStats)
          buildStats.size = buildStats.size + stats.size

          logModuleStats(fileStats, longestOutput)
        }
      }

      if (entry.input) {
        const logFilter = getLogFilter(entry.logFilter || [])

        const _output = entry.output || getOutputPath(outDir, entry.input)
        let _format: ModuleFormat = 'esm'
        if (_output.endsWith('.cjs')) _format = 'cjs'

        const buildLogs: BuildLogs[] = []
        const _entry = {
          input: entry.input,
          output: _output,
          externals: entry.externals || options.externals,
          format: entry.format || _format,
          ...entry,
          defaultPlugins: [
            esbuildPlugin({
              minify: !isUndefined(entry.minify)
                ? entry.minify
                : options.minify,
              ...entry.transformers?.esbuild,
            }),
          ],
        }

        if (!entry.plugins) {
          if (_entry.transformers?.json) {
            const jsonOptions = isObject(_entry.transformers.json)
              ? _entry.transformers.json
              : undefined
            _entry.defaultPlugins.push(jsonPlugin(jsonOptions))
          }

          if (_entry.transformers?.replace) {
            _entry.defaultPlugins.unshift(
              replacePlugin({
                preventAssignment: true,
                ..._entry.transformers.replace,
              }),
            )
          }

          if (_entry.transformers?.resolve) {
            const resolveOptions = isObject(_entry.transformers.resolve)
              ? _entry.transformers.resolve
              : undefined
            _entry.defaultPlugins.unshift(resolvePlugin(resolveOptions))
          }

          _entry.defaultPlugins.unshift(
            aliasPlugin(_entry.transformers?.alias || aliasOptions),
          )
        }

        const fileStats = {
          cwd,
          path: _entry.output,
          size: 0,
          buildTime: entryStart,
          format: _entry.format,
          logs: buildLogs,
        }

        await hooks?.['build:entry:start']?.(_entry, fileStats)

        const _build = await rollup({
          input: resolve(cwd, _entry.input),
          external: _entry.externals,
          plugins: _entry.plugins || _entry.defaultPlugins,
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

        fileStats.size = stats.size
        fileStats.buildTime = Date.now() - entryStart
        fileStats.logs = buildLogs

        buildStats.files.push(fileStats)
        buildStats.size = buildStats.size + stats.size

        logModuleStats(fileStats, longestOutput)

        await hooks?.['build:entry:end']?.(_entry, fileStats)
      }

      if (entry.dts || entry.declaration) {
        const logFilter = getLogFilter(entry.logFilter || [])
        const buildLogs: BuildLogs[] = []
        const dts = entry.dts! || entry.declaration!

        const _entry = {
          dts,
          output: entry.output || getOutputPath(outDir, dts, true),
          externals: entry.externals || options.externals,
          format: entry.format || 'esm',
          ...entry,
          defaultPlugins: [dtsPlugin(entry.transformers?.dts)],
        }

        if (!entry.plugins) {
          _entry.defaultPlugins.unshift(
            aliasPlugin(_entry.transformers?.alias || aliasOptions),
          )
        }

        const fileStats = {
          cwd,
          path: _entry.output,
          size: 0,
          buildTime: entryStart,
          format: 'dts',
          logs: buildLogs,
        }

        await hooks?.['build:entry:start']?.(_entry, fileStats)

        const _build = await rollup({
          input: resolve(cwd, _entry.dts),
          external: _entry.externals,
          plugins: _entry.plugins || _entry.defaultPlugins,
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

        fileStats.size = stats.size
        fileStats.buildTime = Date.now() - entryStart
        fileStats.logs = buildLogs

        buildStats.files.push(fileStats)
        buildStats.size = buildStats.size + stats.size

        logModuleStats(fileStats, longestOutput)

        await hooks?.['build:entry:end']?.(_entry, fileStats)
      }

      if (entry.template && entry.output) {
        const buildLogs: BuildLogs[] = []

        await write(entry.output, entry.template)

        const stats = await stat(resolve(cwd, entry.output))

        const fileStats = {
          cwd,
          path: entry.output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format: 'tmp',
          logs: buildLogs,
        }

        buildStats.files.push(fileStats)
        buildStats.size = buildStats.size + stats.size

        logModuleStats(fileStats, longestOutput)
      }
    }

    buildStats.buildTime = Date.now() - start
  }

  await hooks?.['build:end']?.(options, buildStats)

  return buildStats
}
