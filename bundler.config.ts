import { defineConfig } from './src/config.js'
import { version } from './package.json'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { types: './src/types/index.ts' },
    {
      input: './src/bin/index.ts',
      plugins: {
        replace: {
          preventAssignment: true,
          __version__: version,
        },
      },
    },
  ],
})
