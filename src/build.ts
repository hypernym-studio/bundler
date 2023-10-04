import { isString, isObject } from '@hypernym/utils'
import { getOutputPath } from './utils/index.js'
import type { Options, BuildStats } from './types/index.js'

export async function build(
  cwd: string,
  options: Options,
): Promise<BuildStats> {
  const { outDir = 'dist', hooks } = options

  const buildStats: BuildStats = {
    time: { start: 0, end: 0 },
    size: 0,
    files: [],
  }

  if (hooks?.['build:before']) await hooks['build:before'](options)

  if (options.entries && options.entries.length) {
    buildStats.time.start = Date.now()

    for (const entry of options.entries) {
      if (isString(entry)) {
        const output = getOutputPath(outDir, entry)
        buildStats.files.push(output)
      }

      if (isObject(entry)) {
        buildStats.files.push(entry.output)
      }
    }

    buildStats.time.end = Date.now()
  }

  if (hooks?.['build:done']) await hooks['build:done'](options)

  return buildStats
}
