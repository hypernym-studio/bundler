import { cwd } from 'node:process'
import { resolve, parse } from 'node:path'
import { stat } from 'node:fs/promises'
import { dim } from '@hypernym/colors'
import { isUndefined } from '@hypernym/utils'
import { readdir, write, copy } from '@hypernym/utils/fs'
import { rolldown } from 'rolldown'
import { dts as dtsPlugin } from 'rolldown-plugin-dts'
import { getOutputPath, formatMs, formatBytes, error } from '@/utils'
import { outputPaths } from '@/plugins'
import type { ModuleFormat } from 'rolldown'
import type { Options, BuildEntryStats, BuildStats, BuildLogs } from '@/types'

function logEntryStats(stats: BuildEntryStats): void {
  const cl = console.log
  const base = parse(stats.path).base
  const path = stats.path.replace(base, '')
  let format = stats.format

  if (format === 'commonjs') format = 'cjs'
  if (format === 'es' || format === 'module') format = 'esm'

  const pathDim = dim(path)
  const output = pathDim + base
  const outputLength = output.length + 2

  cl(
    '▸',
    format.padEnd(5),
    output.padEnd(outputLength),
    dim(`[${formatBytes(stats.size)}, ${formatMs(stats.buildTime)}]`),
  )

  if (stats.logs) {
    for (const log of stats.logs) {
      cl(
        '!',
        log.level.padEnd(5),
        output.padEnd(outputLength),
        dim(log.log.message),
      )
    }
  }
}

export async function build(options: Options): Promise<BuildStats> {
  const { cwd: cwdir = cwd(), outDir = 'dist', tsconfig, hooks } = options

  let start = 0
  const buildStats: BuildStats = {
    cwd: cwdir,
    size: 0,
    buildTime: 0,
    files: [],
  }

  await hooks?.['build:start']?.(options, buildStats)

  if (options.entries) {
    start = Date.now()

    for (const entry of options.entries) {
      const entryStart = Date.now()

      if (entry.input) {
        const buildLogs: BuildLogs[] = []

        const _output = entry.output || getOutputPath(outDir, entry.input)
        let format: ModuleFormat = entry.format || 'esm'
        if (_output.endsWith('.cjs')) format = 'cjs'

        const _entry = {
          ...entry,
          input: entry.input,
          output: _output,
          format,
          externals: entry.externals || options.externals!,
          minify: !isUndefined(entry.minify) ? entry.minify : options.minify,
        }

        const input = resolve(cwdir, _entry.input)
        const output = resolve(cwdir, _entry.output)

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: _entry.output,
          size: 0,
          buildTime: entryStart,
          format,
          logs: buildLogs,
        }

        await hooks?.['build:entry:start']?.(_entry, entryStats)

        const bundle = await rolldown({
          input,
          external: _entry.externals,
          plugins: _entry.plugins,
          onLog: (level, log, handler) => {
            if (_entry.onLog) _entry.onLog(level, log, handler, buildLogs)
            else buildLogs.push({ level, log })
          },
          resolve: {
            ..._entry.resolve,
            tsconfigFilename: _entry.resolve?.tsconfigFilename || tsconfig,
          },
          define: _entry.define,
        })
        await bundle.write({
          file: output,
          minify: _entry.minify,
          format: _entry.format,
          banner: _entry.banner,
          footer: _entry.footer,
          intro: _entry.intro,
          outro: _entry.outro,
          name: _entry.name,
          globals: _entry.globals,
          extend: _entry.extend,
          plugins: _entry.paths ? [outputPaths(_entry.paths)] : undefined,
        })

        const stats = await stat(output)

        entryStats.size = stats.size
        entryStats.buildTime = Date.now() - entryStart
        entryStats.logs = buildLogs

        buildStats.files.push(entryStats)
        buildStats.size = buildStats.size + stats.size

        logEntryStats(entryStats)

        await hooks?.['build:entry:end']?.(_entry, entryStats)
      }

      if (entry.dts) {
        const buildLogs: BuildLogs[] = []

        const _entry = {
          ...entry,
          output:
            entry.output ||
            getOutputPath(outDir, entry.dts, { extension: 'dts' }),
          externals: entry.externals || options.externals!,
          format: entry.format || 'esm',
          plugins: [dtsPlugin({ ...entry.dtsPlugin, emitDtsOnly: true })],
        }

        const input = resolve(cwdir, _entry.dts)
        const output = resolve(cwdir, _entry.output)

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: _entry.output,
          size: 0,
          buildTime: entryStart,
          format: 'dts',
          logs: buildLogs,
        }

        await hooks?.['build:entry:start']?.(_entry, entryStats)

        const bundle = await rolldown({
          input,
          external: _entry.externals,
          plugins: _entry.plugins,
          onLog: (level, log, handler) => {
            if (_entry.onLog) _entry.onLog(level, log, handler, buildLogs)
            else buildLogs.push({ level, log })
          },
          resolve: {
            ..._entry.resolve,
            tsconfigFilename: _entry.resolve?.tsconfigFilename || tsconfig,
          },
          define: _entry.define,
        })
        const generated = await bundle.generate({
          format: _entry.format,
          banner: _entry.banner,
          footer: _entry.footer,
          intro: _entry.intro,
          outro: _entry.outro,
          name: _entry.name,
          globals: _entry.globals,
          extend: _entry.extend,
          plugins: _entry.paths ? [outputPaths(_entry.paths)] : undefined,
        })
        await write(_entry.output, generated.output[0].code)

        const stats = await stat(output)

        entryStats.size = stats.size
        entryStats.buildTime = Date.now() - entryStart
        entryStats.logs = buildLogs

        buildStats.files.push(entryStats)
        buildStats.size = buildStats.size + stats.size

        logEntryStats(entryStats)

        await hooks?.['build:entry:end']?.(_entry, entryStats)
      }

      if (entry.copy) {
        const outputPath = getOutputPath(outDir, entry.copy, {
          extension: 'original',
        })

        const _entry = {
          input: entry.copy,
          output: entry.output || outputPath,
        }

        const input = resolve(cwdir, _entry.input)
        const output = resolve(cwdir, _entry.output)

        await copy(input, output, {
          recursive: entry.recursive || true,
          filter: entry.filter,
        }).catch(error)

        const stats = await stat(output)
        let totalSize = 0

        if (!stats.isDirectory()) totalSize = stats.size
        else {
          const files = await readdir(output)
          for (const file of files) {
            const filePath = resolve(output, file)
            const fileStat = await stat(filePath)
            totalSize = totalSize + fileStat.size
          }
        }

        const parseOutput = (path: string): string => {
          if (path.startsWith('./')) return path
          else return `./${path}`
        }

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: parseOutput(_entry.output),
          size: totalSize,
          buildTime: Date.now() - entryStart,
          format: 'copy',
          logs: [],
        }

        buildStats.files.push(entryStats)
        buildStats.size = buildStats.size + stats.size

        logEntryStats(entryStats)
      }

      if (entry.template && entry.output) {
        await write(entry.output, entry.template)

        const stats = await stat(resolve(cwdir, entry.output))

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: entry.output,
          size: stats.size,
          buildTime: Date.now() - entryStart,
          format: 'tmp',
          logs: [],
        }

        buildStats.files.push(entryStats)
        buildStats.size = buildStats.size + stats.size

        logEntryStats(entryStats)
      }
    }

    buildStats.buildTime = Date.now() - start
  }

  await hooks?.['build:end']?.(options, buildStats)

  return buildStats
}
