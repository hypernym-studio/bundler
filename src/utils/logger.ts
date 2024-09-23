import process from 'node:process'
import { dim } from '@hypernym/colors'
import { logo } from '@/bin/meta'

const cl = console.log
const separator = `/`

export const logger = {
  info: (...args: any[]): void => {
    cl(logo, dim(separator), ...args)
  },
  error: (...args: any[]): void => {
    cl()
    cl(logo, dim(separator), ...args)
    cl()
  },
  exit: (message: string): never => {
    cl()
    cl(logo, dim(separator), message)
    cl()

    return process.exit()
  },
}
