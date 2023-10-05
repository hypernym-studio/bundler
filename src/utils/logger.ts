import process, { stdout } from 'node:process'
import { cyan, magenta, dim } from '@hypernym/colors'
import { name, version } from '../bin/meta.js'

const cl = console.log

export const log = (...args: string[]) => {
  let length = args.length + 2
  const cols = stdout.columns || 80
  const time = new Date().toLocaleTimeString()

  for (const arg of args) {
    // eslint-disable-next-line no-control-regex
    length = length + arg.replace(/\u001b\[.*?m/g, '').length
  }

  const repeatLength =
    cols <= length + time.length ? 0 : cols - (length + time.length)

  return cl(...args, ' '.repeat(repeatLength), dim(time))
}

export const logger = {
  start: (): void => {
    cl()
    log(dim(name), dim(version))
    log(cyan(name), `Bundling started...`)
    cl()
  },
  exit: (message: string): never => {
    cl()
    log(dim(name), dim(version))
    log(magenta(name), message)
    cl()
    return process.exit(1)
  },
}
