import { defineConfig } from '@/config'
import { replacePlugin } from '@/plugins'
import { version } from './package.json'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { dts: './src/types/index.ts', output: './dist/index.d.mts' },
    { input: './src/plugins/index.ts' },
    {
      dts: './src/plugins/types/index.ts',
      output: './dist/plugins/index.d.mts',
    },
    {
      input: './src/bin/index.ts',
      plugins: [replacePlugin({ __version__: version })],
    },
  ],
})
