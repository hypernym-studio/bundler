import { resolve, isAbsolute } from 'node:path'
import { exists, write, read } from '@hypernym/utils/fs'
import { cyan } from '@hypernym/colors'
import { build } from 'rolldown'
import { externals } from '@/config'
import { logger, error } from '@/utils'
import type { ConfigLoader, Options } from '@/types'
import type { Args } from '@/types/args'

export async function getTSConfigPath(
  cwd: string,
  filePath = 'tsconfig.json',
): Promise<string | undefined> {
  const tsconfigPath = resolve(cwd, filePath)
  const tsconfigFile = await exists(tsconfigPath)
  if (tsconfigFile) return tsconfigPath
}

export async function loadConfig(
  cwd: string,
  filePath: string,
  defaults: Options,
): Promise<ConfigLoader> {
  let tsconfigPath = await getTSConfigPath(cwd)
  const result = await build({
    input: resolve(cwd, filePath),
    write: false,
    external: (id) => !(isAbsolute(id) || id.startsWith('.')),
    resolve: { tsconfigFilename: tsconfigPath },
    output: { format: 'esm' },
  })
  const code = result.output[0].code
  const tempConfig = resolve(cwd, 'node_modules/.hypernym/bundler/config.mjs')
  await write(tempConfig, code)
  const content = await import(tempConfig)
  const config: Options = {
    ...defaults,
    ...(content.default as Options),
  }

  return { options: config, path: filePath }
}

export async function createConfigLoader(
  cwd: string,
  args: Args,
): Promise<ConfigLoader> {
  const pkgPath = resolve(cwd, 'package.json')
  const pkgFile = await read(pkgPath).catch(error)
  const { dependencies }: { dependencies: Record<string, string> } =
    JSON.parse(pkgFile)

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
  const configExts: string[] = ['.ts', '.mts', '.mjs', '.js']

  for (const ext of configExts) {
    const path = resolve(cwd, `${configName}${ext}`)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(cwd, path, defaults)
  }

  return logger.exit(warnMessage)
}
