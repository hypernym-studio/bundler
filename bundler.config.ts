import { defineConfig, externals } from '@/config'
import { replacePlugin } from '@/plugins'
import { version } from './package.json'

export default defineConfig({
  entries: [
    {
      input: './src/bin/build.ts',
      output: './dist/build/index.js',
      externals: [...externals, '@/plugins'],
      paths: [{ find: '@/plugins', replacement: '../plugins/index.js' }],
    },
    {
      input: './src/index.ts',
      externals: [...externals, '@/bin/build'],
      paths: [{ find: '@/bin/build', replacement: './build/index.js' }],
    },
    { dts: './src/types/index.ts', output: './dist/index.d.ts' },
    { input: './src/plugins/index.ts' },
    {
      dts: './src/plugins/types/index.ts',
      output: './dist/plugins/index.d.ts',
    },
    {
      input: './src/bin/index.ts',
      externals: [...externals, './build'],
      paths: [{ find: './build', replacement: '../build/index.js' }],
      plugins: [replacePlugin({ __version: version })],
    },
  ],
})
