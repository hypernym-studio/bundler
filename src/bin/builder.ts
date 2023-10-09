import process, { stdout } from 'node:process'
import { parse } from 'node:path'
import { green, cyan, magenta, red, dim } from '@hypernym/colors'
import { createSpinner } from '@hypernym/spinner'
import { name, version } from './meta.js'
import { build } from './build.js'
import { cl, log, formatMs, formatBytes } from '../utils/index.js'
import type { Options } from '../types/options.js'
import type { Args } from '../types/args.js'

export async function createBuilder(cwd: string, args: Args, options: Options) {
  const spinner = createSpinner()

  cl()
  log(dim(name), dim(version))
  log(cyan(name), `Bundling started...`)
  spinner.start({
    message: `Transforming modules ${green('for production...')}`,
  })

  return await build(cwd, options)
    .then((stats) => {
      spinner.stop({
        message: `Modules transformation is ${green('done!')}`,
        template: (mark, message) => {
          const temp = `${mark}${message}`
          const cols = stdout.columns || 80
          const time = new Date().toLocaleTimeString()
          const length =
            // eslint-disable-next-line no-control-regex
            temp.replace(/\u001b\[.*?m/g, '').length + time.length + 1
          const repeatLength = cols <= length ? 0 : cols - length

          return temp + ' '.repeat(repeatLength) + dim(time)
        },
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

      log(check, `Bundling completed in ${buildTime}`)
      log(check, `${modules} modules transformed. Total size is ${buildSize}`)
      log(info, 'Individual stats per module')

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

        log(
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

      log(
        check,
        `Bundle is now fully generated and ready ${green('for production!')}`,
      )
    })
    .catch((err) => {
      spinner.stop({
        mark: red('✖'),
        message: `Modules transformation is ${red('interupted!')}`,
      })
      log(red(name), 'Something went wrong...')
      console.error(err)

      return process.exit(1)
    })
}
