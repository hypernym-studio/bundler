export function getOutputPath(
  outDir: string,
  input: string,
  { extension = 'auto' }: { extension?: 'auto' | 'dts' | 'original' } = {},
): string {
  const src = input.startsWith('./') ? input.slice(2) : input

  let output = src.includes('/')
    ? src.replace(src.split('/')[0], outDir)
    : `${outDir}/${src}`

  if (extension !== 'original') {
    const ext = output.match(/\.[^/.]+$/)?.[0] ?? ''
    const esm = ['.js', '.mjs', '.ts', '.mts']
    const legacy = ['.cjs', '.cts']
    let newExt = ''

    if (esm.includes(ext)) {
      newExt = extension === 'dts' ? '.d.mts' : '.mjs'
    } else if (legacy.includes(ext)) {
      newExt = extension === 'dts' ? '.d.cts' : '.cjs'
    }

    if (newExt) output = `${output.slice(0, -ext.length)}${newExt}`
  }

  return outDir.startsWith('./') || outDir.startsWith('../')
    ? output
    : `./${output}`
}
