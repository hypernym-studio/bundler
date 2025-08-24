import { defineConfig, externals } from '@/config'
import { replacePlugin } from '@/plugins'
import { version } from './package.json'

export default defineConfig({
  entries: [
    {
      input: './src/bin/build.ts',
      output: './dist/build/index.mjs',
      externals: [...externals, '@/plugins'],
      paths: [{ find: '@/plugins', replacement: '../plugins/index.mjs' }],
    },
    {
      input: './src/index.ts',
      externals: [...externals, '@/bin/build'],
      paths: [{ find: '@/bin/build', replacement: './build/index.mjs' }],
    },
    { dts: './src/types/index.ts', output: './dist/index.d.mts' },
    { input: './src/plugins/index.ts' },
    {
      dts: './src/plugins/types/index.ts',
      output: './dist/plugins/index.d.mts',
    },
    {
      input: './src/bin/index.ts',
      externals: [...externals, './build'],
      paths: [{ find: './build', replacement: '../build/index.mjs' }],
      plugins: [replacePlugin({ __version__: version })],
    },
  ],
})
