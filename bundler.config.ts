import { defineConfig } from '@/config'
import { version } from './package.json'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { declaration: './src/types/index.ts' },
    {
      input: './src/bin/index.ts',
      transformers: {
        replace: {
          preventAssignment: true,
          __version__: version,
        },
      },
    },
  ],
})
