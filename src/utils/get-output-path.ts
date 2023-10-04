import { parse } from 'node:path'

export function getOutputPath(outDir: string, input: string): string {
  const distDir = parse(outDir).base
  const srcDir = input.split('/')

  if (input.startsWith('./')) return input.replace(srcDir[1], distDir)

  return input.replace(srcDir[0], distDir)
}
