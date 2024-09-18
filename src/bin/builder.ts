import { green, dim, bold } from '@hypernym/colors'
import { logoname, version } from './meta'
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
  const line = '─'.repeat(logoname.length + 2)

  cl()
  cl(dim(`┌${line}┐`))
  cl(dim('│'), `${logoname.toUpperCase()}`, dim('│'), dim(`v${version}`))
  cl(dim(`└${line}┘`))
  cl(dim(bold('i')), 'Config', dim(configPath))
  cl(dim(bold('i')), 'Bundling started...')
  cl(
    dim(bold('*')),
    'Processing',
    dim(`[${new Date().toLocaleTimeString()}]`),
    'Transforming files',
  )
  cl(dim('│'))

  await build(cwd, options)
    .then((stats) => {
      const check = green(bold('✔'))
      const buildTime = green(formatMs(stats.buildTime))
      const buildSize = green(formatBytes(stats.size))
      const totalModules = stats.files.length
      const modules =
        totalModules > 1
          ? `${green(totalModules)} modules`
          : `${green(totalModules)} module`

      cl(dim('│'))
      cl(
        dim(bold('*')),
        'Succeeded',
        dim(`[${new Date().toLocaleTimeString()}]`),
        'Module transformation is done',
      )
      cl(check, `Bundling fully completed in ${buildTime}`)
      cl(check, `${modules} transformed. Total size is ${buildSize}`)
      logger.info(`Bundle is generated and ready for production`)
      cl()
    })
    .catch(error)

  await hooks?.['bundle:end']?.(options)
}
