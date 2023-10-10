import process from 'node:process'
import { red } from '@hypernym/colors'
import { name } from '../bin/meta.js'
import { log } from '../utils/logger.js'

export function error(err: any): never {
  log(red(name), 'Something went wrong...')
  console.error(err)
  return process.exit(1)
}
