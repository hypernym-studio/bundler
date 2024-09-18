import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { exists, writeFile } from '@hypernym/utils/fs'
import { cyan } from '@hypernym/colors'
import { build } from 'esbuild'
import { externals } from '@/config'
import { logger, error } from '@/utils'
import type { ConfigLoader, Options } from '@/types'
import type { Args } from '@/types/args'

export async function loadConfig(
  cwd: string,
  filePath: string,
  defaults: Options,
): Promise<ConfigLoader> {
  const result = await build({
    entryPoints: [resolve(cwd, filePath)],
    bundle: true,
    write: false,
    format: 'esm',
    target: 'esnext',
    packages: 'external',
  })
  const code = result.outputFiles[0].text
  const tempConfig = resolve(cwd, 'node_modules/.hypernym/bundler/config.mjs')
  await writeFile(tempConfig, code, 'utf-8')
  const content = await import(tempConfig)
  const config: Options = {
    ...defaults,
    ...content.default,
  }

  return { options: config, path: filePath }
}

export async function createConfigLoader(
  cwd: string,
  args: Args,
): Promise<ConfigLoader> {
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
    const path = args.config
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(cwd, path, defaults)
    else return logger.exit(warnMessage)
  }

  const configName = 'bundler.config'
  const configExts: string[] = ['.ts', '.js', '.mts', '.mjs']

  for (const ext of configExts) {
    const path = `${configName}${ext}`
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(cwd, path, defaults)
  }

  return logger.exit(warnMessage)
}
