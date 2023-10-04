import { build } from '../build.js'
import { logger } from '../utils/index.js'
import type { Args, Options } from '../types/index.js'

export async function createBuilder(cwd: string, args: Args, options: Options) {
  logger.start()

  const builder = await build(cwd, options)

  console.log(builder)
}
