import process from 'node:process'
import { logger } from '@/utils/logger'

export function error(err: any): never {
  logger.error('Something went wrong...')
  console.error(err)
  return process.exit(1)
}
