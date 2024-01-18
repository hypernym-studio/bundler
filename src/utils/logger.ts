import process from 'node:process'
import { cyan, magenta, red, dim } from '@hypernym/colors'
import { name, version } from '@/bin/meta'

export const cl = console.log

export const logger = {
  info: (...args: any[]): void => {
    const time = `[${new Date().toLocaleTimeString()}]`
    return cl(cyan(name), dim(time), ...args)
  },
  error: (...args: any[]): void => {
    const time = `[${new Date().toLocaleTimeString()}]`
    return cl(red(name), dim(time), ...args)
  },
  exit: (message: string): never => {
    const time = `[${new Date().toLocaleTimeString()}]`

    cl(magenta(name), dim(time), version)
    cl(magenta(name), dim(time), message)

    return process.exit(1)
  },
}
