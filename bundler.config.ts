import { defineConfig } from './src/config.js'
import { version } from './package.json'

export default defineConfig({
  entries: [
    { input: './src/index.ts', output: './dist/index.mjs' },
    { input: './src/types/index.ts', output: './dist/types/index.d.ts' },
    {
      input: './src/bin/index.ts',
      output: './dist/bin/index.mjs',
      banner: '#!/usr/bin/env node',
      plugins: {
        replace: {
          preventAssignment: true,
          __version__: version,
        },
      },
    },
  ],
})
