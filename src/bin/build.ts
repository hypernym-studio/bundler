import { cwd } from 'node:process'
import { resolve, parse } from 'node:path'
import { stat } from 'node:fs/promises'
import { dim } from '@hypernym/colors'
import { isUndefined } from '@hypernym/utils'
import { readdir, write, copy } from '@hypernym/utils/fs'
import { rolldown } from 'rolldown'
import { dts as dtsPlugin } from 'rolldown-plugin-dts'
import {
  getOutputPath,
  parseOutputPath,
  formatMs,
  formatBytes,
  error,
} from '@/utils'
import { outputPaths } from '@/plugins'
import type { InputOptions, OutputOptions, ModuleFormat } from 'rolldown'
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
    dim('+'),
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
  const {
    cwd: cwdir = cwd(),
    outDir = 'dist',
    entries,
    externals,
    tsconfig,
    hooks,
    minify,
  } = options

  let start = 0
  const buildStats: BuildStats = {
    cwd: cwdir,
    size: 0,
    buildTime: 0,
    files: [],
  }

  await hooks?.['build:start']?.(options, buildStats)

  if (entries) {
    start = Date.now()

    for (const entry of entries) {
      const entryStart = Date.now()

      if (entry.input || entry.dts) {
        const buildLogs: BuildLogs[] = []

        const isChunk = !isUndefined(entry.input)

        const outputRawPath =
          parseOutputPath(entry.output) ||
          getOutputPath(outDir, entry.input! || entry.dts!, {
            extension: isChunk ? 'auto' : 'dts',
          })
        const outputResolvePath = resolve(cwdir, outputRawPath)

        let format: ModuleFormat = entry.format || 'esm'
        if (outputRawPath.endsWith('.cjs')) format = 'cjs'

        const entryInput = {
          input: resolve(cwdir, entry.input! || entry.dts!),
          external: entry.externals || externals!,
          plugins: isChunk
            ? entry.plugins
            : entry.plugins || [
                dtsPlugin({
                  ...entry.dtsPlugin,
                  emitDtsOnly: true,
                  banner: entry.banner,
                  footer: entry.footer,
                }),
              ],
          onLog: (level, log, handler) => {
            if (entry.onLog) entry.onLog(level, log, handler, buildLogs)
            else buildLogs.push({ level, log })
          },
          resolve: entry.resolve,
          transform: {
            define: entry.define,
            inject: entry.inject,
          },
          tsconfig: entry.tsconfig || tsconfig,
        } satisfies InputOptions

        const entryOutput = {
          file: isChunk ? outputResolvePath : undefined,
          minify: isChunk
            ? !isUndefined(entry.minify)
              ? entry.minify
              : minify
            : undefined,
          format,
          banner: entry.banner,
          footer: entry.footer,
          intro: entry.intro,
          outro: entry.outro,
          name: entry.name,
          globals: entry.globals,
          extend: entry.extend,
          plugins: entry.paths ? [outputPaths(entry.paths)] : undefined,
        } satisfies OutputOptions

        const entryOptions = {
          ...entryInput,
          ...entryOutput,
          externals: entryInput.external,
        }

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: outputRawPath,
          size: 0,
          buildTime: entryStart,
          format: isChunk ? format : 'dts',
          logs: buildLogs,
        }

        await hooks?.['build:entry:start']?.(entryOptions, entryStats)

        const bundle = await rolldown(entryInput)
        if (isChunk) await bundle.write(entryOutput)
        else {
          const generated = await bundle.generate(entryOutput)
          await write(outputResolvePath, generated.output[0].code)
        }

        const stats = await stat(outputResolvePath)

        entryStats.size = stats.size
        entryStats.buildTime = Date.now() - entryStart
        entryStats.logs = buildLogs

        buildStats.files.push(entryStats)
        buildStats.size = buildStats.size + stats.size

        logEntryStats(entryStats)

        await hooks?.['build:entry:end']?.(entryOptions, entryStats)
      }

      if (entry.copy) {
        const inputResolvePath = resolve(cwdir, entry.copy)
        const outputRawPath =
          parseOutputPath(entry.output) ||
          getOutputPath(outDir, entry.copy, {
            extension: 'original',
          })
        const outputResolvePath = resolve(cwdir, outputRawPath)

        await copy(inputResolvePath, outputResolvePath, {
          recursive: entry.recursive || true,
          filter: entry.filter,
        }).catch(error)

        const stats = await stat(outputResolvePath)
        let totalSize = 0

        if (!stats.isDirectory()) totalSize = stats.size
        else {
          const files = await readdir(outputResolvePath)
          for (const file of files) {
            const filePath = resolve(outputResolvePath, file)
            const fileStat = await stat(filePath)
            totalSize = totalSize + fileStat.size
          }
        }

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: outputRawPath,
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
        const outputRawPath = parseOutputPath(entry.output)!
        const outputResolvePath = resolve(cwdir, outputRawPath)

        await write(outputResolvePath, entry.template)

        const stats = await stat(outputResolvePath)

        const entryStats: BuildEntryStats = {
          cwd: cwdir,
          path: outputRawPath,
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
