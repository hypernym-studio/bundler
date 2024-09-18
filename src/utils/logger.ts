import process from 'node:process'
import { dim } from '@hypernym/colors'
import { logoname } from '@/bin/meta'

const name = logoname.toUpperCase()
const cl = console.log

export const logger = {
  info: (...args: any[]): void => {
    const time = new Date().toLocaleTimeString()
    return cl(name, dim(`[${time}]`), ...args)
  },
  error: (...args: any[]): void => {
    const time = new Date().toLocaleTimeString()
    return cl(name, dim(`[${time}]`), ...args)
  },
  exit: (message: string): never => {
    const time = new Date().toLocaleTimeString()
    cl(name, dim(`[${time}]`), message)

    return process.exit()
  },
}
