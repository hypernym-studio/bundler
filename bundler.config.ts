import { defineConfig } from '@/config'
import { version } from './package.json'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { dts: './src/types/index.ts', output: './dist/index.d.mts' },
    {
      input: './src/index.ts',
      output: './dist/index.cjs',
    },
    {
      dts: './src/types/index.ts',
      output: './dist/index.d.cts',
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
