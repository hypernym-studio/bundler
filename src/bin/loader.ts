import { parse, resolve } from 'node:path'
import { exists } from '@hypernym/utils/node'
import { build } from 'esbuild'
import { logger, error, errorMessage } from '../utils/index.js'
import type { Args, Options } from '../types/index.js'

export async function loadConfig(
  filePath: string,
  defaults: Options,
): Promise<Options> {
  const { base, ext } = parse(filePath)

  if (ext === '.js' || ext === '.mjs') {
    const content = await import(filePath)
    const config: Options = {
      ...defaults,
      ...content.default,
      base,
    }
    return config
  }

  if (ext === '.ts' || ext === '.mts') {
    const result = await build({
      entryPoints: [filePath],
      bundle: true,
      write: false,
      format: 'esm',
      target: 'esnext',
    })
    const code = result.outputFiles[0].text
    const buffer = Buffer.from(code).toString('base64')
    const content = await import(`data:text/javascript;base64,${buffer}`)
    const config: Options = {
      ...defaults,
      ...content.default,
      base,
    }
    return config
  }

  return logger.exit(errorMessage[404])
}

export async function createConfigLoader(
  cwd: string,
  args: Args,
): Promise<Options> {
  const pkgPath = resolve(cwd, 'package.json')
  const pkg = await import(pkgPath, { assert: { type: 'json' } }).catch(error)
  const { dependencies } = pkg.default

  const defaults: Options = {
    outDir: 'dist',
    externals: [
      ...Object.keys(dependencies || {}),
      /^node:/,
      /^@types/,
      /^@rollup/,
      /^rollup/,
    ],
    entries: [],
  }

  if (args.config) {
    const path = resolve(cwd, args.config)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(path, defaults)
  }

  const configName = 'bundler.config'
  const configExts: string[] = ['.js', '.mjs', '.ts', '.mts']

  for (const ext of configExts) {
    const path = resolve(cwd, `${configName}${ext}`)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(path, defaults)
  }

  return logger.exit(errorMessage[404])
}
