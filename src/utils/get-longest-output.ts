import { getOutputPath } from './get-output-path'
import type { Options } from '@/types'

export function getLongestOutput(
  outDir: string,
  entries: Options['entries'],
): number {
  const outputs: string[] = []

  for (const entry of entries) {
    if (entry.copy) {
      outputs.push(
        entry.output ||
          getOutputPath(outDir, entry.copy, { extension: 'original' }),
      )
    }

    if (entry.input) {
      outputs.push(entry.output || getOutputPath(outDir, entry.input))
    }

    if (entry.dts) {
      outputs.push(
        entry.output || getOutputPath(outDir, entry.dts, { extension: 'dts' }),
      )
    }

    if (entry.template) outputs.push(entry.output)
  }

  return Math.max(...outputs.map((v) => v.length))
}
