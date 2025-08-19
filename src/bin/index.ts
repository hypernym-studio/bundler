#!/usr/bin/env node

import { cwd } from 'node:process'
import { createArgs } from '@hypernym/args'
import { createConfigLoader } from './loader'
import { createBuilder } from './builder'
import { error } from '@/utils'
import type { Args } from '@/types/args'

async function main() {
  const cwdir = cwd()
  const args = createArgs<Args>({
    alias: { config: 'c' },
  })

  const config = await createConfigLoader(cwdir, args)

  await createBuilder(cwdir, config)
}

main().catch(error)
