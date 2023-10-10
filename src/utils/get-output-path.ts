export function getOutputPath(
  outDir: string,
  input: string,
  types: boolean = false,
): string {
  const _input = input.startsWith('./') ? input.slice(2) : input
  let output = _input.replace(_input.split('/')[0], outDir)

  const ts = types ? 'd.ts' : 'mjs'
  const mts = types ? 'd.mts' : 'mjs'
  const cts = types ? 'd.cts' : 'cjs'

  if (output.endsWith('.ts')) output = `${output.slice(0, -2)}${ts}`
  if (output.endsWith('.mts')) output = `${output.slice(0, -3)}${mts}`
  if (output.endsWith('.cts')) output = `${output.slice(0, -3)}${cts}`

  if (outDir.startsWith('./') || outDir.startsWith('../')) return output

  return `./${output}`
}
