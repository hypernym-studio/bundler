import { defineConfig } from '@/config'
import { version } from './package.json'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { dts: './src/types/index.ts' },
    {
      input: './src/index.ts',
      output: './dist/index.cjs',
    },
    {
      dts: './src/types/index.ts',
      output: './dist/types/index.d.cts',
    },
    {
      input: './src/bin/index.ts',
      transformers: {
        replace: {
          __version__: version,
        },
      },
    },
  ],
})
