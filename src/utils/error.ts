import process from 'node:process'
import { cyan, red } from '@hypernym/colors'
import { name } from '../bin/meta.js'
import { log } from '../utils/logger.js'

export function error(err: any): never {
  log(red(name), 'Something went wrong...')
  console.error(err)
  return process.exit(1)
}

export const errorMessage = {
  404: `Missing required configuration. To start bundling, add the ${cyan(
    `'bundler.config.{js,mjs,ts,mts}'`,
  )} file to the project's root.`,
}
