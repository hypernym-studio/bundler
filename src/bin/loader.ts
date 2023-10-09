import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exists } from '@hypernym/utils/node'
import { build } from 'esbuild'
import { externals } from '../config.js'
import { logger, error, errorMessage } from '../utils/index.js'
import type { Options } from '../types/options.js'
import type { Args } from '../types/args.js'

export async function loadConfig(
  filePath: string,
  defaults: Options,
): Promise<Options> {
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
  }

  return config
}

export async function createConfigLoader(
  cwd: string,
  args: Args,
): Promise<Options> {
  const pkgPath = resolve(cwd, 'package.json')
  const pkg = await readFile(pkgPath, 'utf-8').catch(error)
  const { dependencies } = JSON.parse(pkg)

  const defaults: Options = {
    externals: [...Object.keys(dependencies || {}), ...externals],
    entries: [],
  }

  if (args.config) {
    const path = resolve(cwd, args.config)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(path, defaults)
    else return logger.exit(errorMessage[404])
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
