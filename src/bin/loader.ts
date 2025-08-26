import { cwd } from 'node:process'
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
  filePath: string,
  defaults: Options,
): Promise<ConfigLoader> {
  const cwd = defaults.cwd!

  const result = await build({
    input: resolve(cwd, filePath),
    write: false,
    external: (id) => !(isAbsolute(id) || /^(\.|@\/|~\/)/.test(id)),
    tsconfig: defaults.tsconfig,
    output: { format: 'esm' },
  })
  const tempConfig = resolve(cwd, 'node_modules/.hypernym/bundler/config.mjs')
  await write(tempConfig, result.output[0].code)

  const config: Options = (await import(tempConfig)).default

  const options: Options = {
    ...defaults,
    ...config,
  }

  return { options, path: filePath }
}

export async function createConfigLoader(args: Args): Promise<ConfigLoader> {
  const cwdir = args.cwd && args.cwd.trim() !== '' ? resolve(args.cwd) : cwd()
  const tsconfig = await getTSConfigPath(cwdir, args.tsconfig)

  const pkgPath = resolve(cwdir, 'package.json')
  const pkgFile = await read(pkgPath).catch(error)
  const { dependencies }: { dependencies: Record<string, string> } =
    JSON.parse(pkgFile)

  const defaults: Options = {
    cwd: cwdir,
    tsconfig,
    externals: [...Object.keys(dependencies || {}), ...externals],
    entries: [],
  }

  const warnMessage = `Missing required configuration. To start bundling, add the ${cyan(
    `'bundler.config.{js,mjs,ts,mts}'`,
  )} file to the project's root.`

  if (args.config) {
    const path = resolve(args.config)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(path, defaults)
    else return logger.exit(warnMessage)
  }

  const configName = 'bundler.config'
  const configExts: string[] = ['.ts', '.mts', '.mjs', '.js']

  for (const ext of configExts) {
    const path = resolve(cwdir, `${configName}${ext}`)
    const isConfig = await exists(path)
    if (isConfig) return await loadConfig(path, defaults)
  }

  return logger.exit(warnMessage)
}
