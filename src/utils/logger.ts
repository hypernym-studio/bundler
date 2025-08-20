import process from 'node:process'
import { dim } from '@hypernym/colors'
import { name } from '@/bin/meta'

const cl = console.log
const separator = `|`

export const logger = {
  info: (...args: any[]): void => {
    cl(name, dim(separator), ...args)
  },
  error: (...args: any[]): void => {
    cl()
    cl(name, dim(separator), ...args)
    cl()
  },
  exit: (message: string): never => {
    cl()
    cl(name, dim(separator), message)
    cl()

    return process.exit()
  },
}
