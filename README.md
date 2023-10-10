# Bundler

ESM & TS module bundler.

<sub><a href="https://github.com/hypernym-studio/bundler">Repository</a> | <a href="https://www.npmjs.com/package/@hypernym/bundler">Package</a> | <a href="https://github.com/hypernym-studio/bundler/releases">Releases</a> | <a href="https://github.com/hypernym-studio/bundler/discussions">Discussions</a></sub>

```sh
npm i -D @hypernym/bundler
```

## Features

- Powered by Rollup
- Allows advanced customization
- Provides a powerful hooking system
- Exports fully optimized code
- Follows modern practice
- Super easy to use

## Quick Start

1. Create a `bundler.config.ts` file at the root of your project:

> **Note**
> Configuration also accepts `.js`, `.mjs`, `.ts`, `.mts` formats.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  // ...
})
```

2. Specify the bundle's entry points:

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { types: './src/types/index.ts' },
    {
      input: './src/utils/index.ts',
      plugins: {
        esbuild: { minify: true },
      },
    },
    // ...
  ],
})
```

3. Build via command:

```sh
npx bundler
```

## Options

### outDir

- Type: `string`
- Default: `dist`

Specifies the output directory for production bundle.

```ts
// bundler.config.ts

export default defineConfig({
  outDir: 'output',
})
```

### Custom Config

Set a custom config path via the CLI command:

```sh
npx bundler --config my.config.js
```

## Community

Feel free to use the official [discussions](https://github.com/hypernym-studio/bundler/discussions) for any additional questions.

## License

Developed in 🇭🇷 Croatia

Released under the [MIT](LICENSE.txt) license.

© Hypernym Studio
