import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exists } from '@hypernym/utils/node'
import { cyan } from '@hypernym/colors'
import { build } from 'esbuild'
import { externals } from '../config.js'
import { logger, error } from '../utils/index.js'
import type { Options } from '../types/options.js'
import type { Args } from '../types/args.js'

export async function loadConfig(
  cwd: string,
  filePath: string,
  defaults: Options,
): Promise<Options> {
  const result = await build({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'esm',
    target: 'esnext',
    packages: 'external',
  })
  const code = result.outputFiles[0].text

  const tempDir = resolve(cwd, 'node_modules', '.hypernym', 'bundler')
  const tempConfig = resolve(tempDir, 'config.mjs')
  await mkdir(tempDir, { recursive: true })
  await writeFile(tempConfig, code, 'utf-8')

  const content = await import(tempConfig)
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

  const warnMessage = `Missing required configuration. To start bundling, add the ${cyan(
    `'bundler.config.{js,mjs,ts,mts}'`,
  )} file to the project's root.`

  const defaults: Options = {
    externals: [...Object.keys(dependencies || {}), ...externals],
    entries: [],
  }

  if (args.config) {
    const path = resolve(cwd, args.config)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(cwd, path, defaults)
    else return logger.exit(warnMessage)
  }

  const configName = 'bundler.config'
  const configExts: string[] = ['.ts', '.js', '.mts', '.mjs']

  for (const ext of configExts) {
    const path = resolve(cwd, `${configName}${ext}`)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(cwd, path, defaults)
  }

  return logger.exit(warnMessage)
}
