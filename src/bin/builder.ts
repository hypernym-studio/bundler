import process from 'node:process'
import { parse } from 'node:path'
import { green, cyan, magenta, red, dim } from '@hypernym/colors'
import { createSpinner } from '@hypernym/spinner'
import { version } from './meta.js'
import { build } from './build.js'
import { cl, logger, formatMs, formatBytes } from '../utils/index.js'
import type { Options } from '../types/options.js'
import type { Args } from '../types/args.js'

export async function createBuilder(cwd: string, args: Args, options: Options) {
  const { hooks } = options

  if (hooks?.['bundle:start']) await hooks['bundle:start'](options)

  logger.info(version)
  logger.info(`Bundling started...`)

  const spinner = createSpinner()
  spinner.start({
    message: `Transforming modules ${green('for production...')}`,
  })

  await build(cwd, options)
    .then((stats) => {
      spinner.stop({
        message: `Modules transformation is ${green('done!')}`,
      })

      const check = green('✔')
      const info = cyan('i')
      const buildTime = green(formatMs(stats.buildTime))
      const buildSize = green(formatBytes(stats.size))
      const modules = green(stats.files.length)
      const longestPath = Math.max(...stats.files.map((v) => v.path.length + 1))
      const longestTime = Math.max(
        ...stats.files.map((v) => formatMs(v.buildTime).length),
      )
      const longestSize = Math.max(
        ...stats.files.map((v) => formatBytes(v.size).length),
      )

      cl(check, `Bundling completed in ${buildTime}`)
      cl(check, `${modules} modules transformed. Total size is ${buildSize}`)
      cl(info, 'Individual stats per module')

      for (const file of stats.files) {
        let format = file.format
        const base = parse(file.path).base
        const path = file.path.replace(base, '')

        if (format.includes('system')) format = 'sys'
        if (format === 'commonjs') format = 'cjs'
        if (format === 'module') format = 'esm'
        if (base.includes('.d.')) format = 'dts'

        if (file.logs) {
          for (const log of file.logs) {
            cl(magenta('!'), magenta(log.log.message))
          }
        }

        cl(
          info,
          dim('├─'),
          dim(path) + cyan(base),
          ' '.padEnd(longestPath - (path.length + base.length)),
          dim(format.padStart(5)),
          dim('│'),
          dim(formatMs(file.buildTime).padStart(longestTime)),
          dim('│'),
          dim(formatBytes(file.size).padStart(longestSize)),
        )
      }

      logger.info(
        check,
        `Bundle is now fully generated and ready ${green('for production!')}`,
      )
    })
    .catch((err) => {
      spinner.stop({
        mark: red('✖'),
        message: `Modules transformation is ${red('interupted!')}`,
      })
      logger.error('Something went wrong...')
      console.error(err)

      return process.exit(1)
    })

  if (hooks?.['bundle:end']) await hooks['bundle:end'](options)
}
