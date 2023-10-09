#!/usr/bin/env node

import { cwd as _cwd } from 'node:process'
import { createArgs } from '@hypernym/args'
import { createConfigLoader } from './loader.js'
import { createBuilder } from './builder.js'
import { error } from '../utils/index.js'
import type { Args } from '../types/args.js'

async function main() {
  const cwd = _cwd()
  const args = createArgs<Args>({
    alias: { config: 'c' },
  })

  const config = await createConfigLoader(cwd, args)

  await createBuilder(cwd, args, config)
}

main().catch(error)
