export function getOutputPath(
  outDir: string,
  input: string,
  dts?: boolean,
): string {
  const _input = input.startsWith('./') ? input.slice(2) : input
  let output = _input.replace(_input.split('/')[0], outDir)

  const ext = dts ? 'd.mts' : 'mjs'
  const cts = dts ? 'd.cts' : 'cjs'

  if (output.endsWith('.js')) output = `${output.slice(0, -2)}${ext}`
  else if (output.endsWith('.ts')) output = `${output.slice(0, -2)}${ext}`
  else if (output.endsWith('.mts')) output = `${output.slice(0, -3)}${ext}`
  else if (output.endsWith('.cts')) output = `${output.slice(0, -3)}${cts}`

  if (outDir.startsWith('./') || outDir.startsWith('../')) return output
  else return `./${output}`
}
