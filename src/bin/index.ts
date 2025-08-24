#!/usr/bin/env node

import { createArgs } from '@hypernym/args'
import { error } from '@/utils'
import { createConfigLoader } from './loader'
import { createBuilder } from './builder'
import type { Args } from '@/types/args'

async function main() {
  const args = createArgs<Args>({
    alias: { config: 'c' },
  })

  const config = await createConfigLoader(args)

  await createBuilder(config)
}

main().catch(error)
