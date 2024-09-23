import { dim } from '@hypernym/colors'
import { version } from './meta'
import { build } from './build'
import { logger, formatMs, formatBytes, error } from '@/utils'
import type { ConfigLoader } from '@/types'

export async function createBuilder(
  cwd: string,
  config: ConfigLoader,
): Promise<void> {
  const { options, path: configPath } = config
  const { hooks } = options

  const cl = console.log

  await hooks?.['bundle:start']?.(options)

  logger.info(dim(`v${version}`))
  cl('Config', dim(configPath))
  cl('Bundling started...')
  cl(
    'Processing',
    dim(`[${new Date().toLocaleTimeString()}]`),
    'Transforming files',
  )
  cl()

  await build(cwd, options)
    .then((stats) => {
      const buildTime = dim(formatMs(stats.buildTime))
      const buildSize = dim(formatBytes(stats.size))
      const totalModules = stats.files.length
      const modules =
        totalModules > 1 ? `${totalModules} modules` : `${totalModules} module`

      cl()
      cl(
        'Succeeded',
        dim(`[${new Date().toLocaleTimeString()}]`),
        'Module transformation is done',
      )
      cl(`Bundling fully completed in ${buildTime}`)
      cl(`${modules} transformed. Total size is ${buildSize}`)
      logger.info(`Bundle is generated and ready for production`)
      cl()
    })
    .catch(error)

  await hooks?.['bundle:end']?.(options)
}
