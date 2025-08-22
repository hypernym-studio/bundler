import { dim } from '@hypernym/colors'
import { logger, formatMs, formatBytes, error } from '@/utils'
import { version } from './meta'
import { build } from './build'
import type { ConfigLoader } from '@/types'

export async function createBuilder(config: ConfigLoader): Promise<void> {
  const { options, path: configPath } = config
  const { hooks } = options

  const cl = console.log

  await hooks?.['bundle:start']?.(options)

  cl()
  logger.info(dim(`v${version}`))
  cl('Config', dim(configPath))
  cl()
  cl('Processing specified entries...')
  cl()

  await build(options)
    .then((stats) => {
      const entriesLength = options.entries.length
      const totalEntries = `${entriesLength} ${entriesLength > 1 ? 'entries' : 'entry'}`
      const filesLength = stats.files.length
      const totalFiles = `${stats.files.length} file${filesLength > 1 ? 's' : ''}`
      const buildTime = formatMs(stats.buildTime)
      const buildSize = formatBytes(stats.size)

      cl()
      cl(
        'Stats:',
        dim(`${totalEntries}, ${totalFiles}, ${buildSize}, ${buildTime}`),
      )
      cl()
      cl('All entries successfully processed.')
      cl('Bundle is optimized and ready for production.')
      cl()
    })
    .catch(error)

  await hooks?.['bundle:end']?.(options)
}
