import { getOutputPath } from './get-output-path'
import type { Options } from '@/types'

export function getLongestOutput(
  outDir: string,
  entries: Options['entries'],
): number {
  const outputs: string[] = []

  for (const entry of entries) {
    if (entry.copy) outputs.push(entry.copy.output)

    if (entry.input) {
      const out = entry.output || getOutputPath(outDir, entry.input)
      outputs.push(out)
    }

    if (entry.declaration || entry.dts) {
      const dts = entry.declaration! || entry.dts!
      const out = entry.output || getOutputPath(outDir, dts, true)
      outputs.push(out)
    }

    if (entry.template) outputs.push(entry.output)
  }

  return Math.max(...outputs.map((v) => v.length))
}
