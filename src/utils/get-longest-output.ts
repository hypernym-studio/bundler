import { getOutputPath } from './get-output-path'
import type { Options } from '@/types'

export function getLongestOutput(
  outDir: string,
  entries: Options['entries'],
): number {
  const outputs: string[] = []

  for (const entry of entries) {
    if ('copy' in entry && entry.copy) {
      const out = entry.copy.output
      outputs.push(out)
    }

    if ('input' in entry && entry.input) {
      const out = entry.output || getOutputPath(outDir, entry.input)
      outputs.push(out)
    }

    if ('declaration' in entry && entry.declaration) {
      const out = entry.output || getOutputPath(outDir, entry.declaration, true)
      outputs.push(out)
    }

    if ('template' in entry && entry.template) {
      outputs.push(entry.output)
    }
  }

  return Math.max(...outputs.map((v) => v.length))
}
