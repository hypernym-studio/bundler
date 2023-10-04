#!/usr/bin/env node

import { createArgs } from '@hypernym/args'
import { createConfigLoader } from './loader.js'
import { createBuilder } from './builder.js'
import { error } from '../utils/index.js'
import type { Args } from '../types/index.js'

async function main() {
  const cwd = process.cwd()
  const args = createArgs<Args>({
    alias: { config: 'c' },
  })

  const config = await createConfigLoader(cwd, args)

  await createBuilder(cwd, args, config)
}

main().catch(error)
