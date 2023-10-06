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
- Includes JS API for building programmatically
- Exports fully optimized code
- Follows modern practice
- Fully tree-shakeable
- Super easy to use

## Quick Start

1. Add the `bundler.config.ts` file to the project's root:

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
    {
      input: './src/index.ts',
      output: './dist/index.mjs',
    },
    {
      input: './src/types/index.ts',
      output: './dist/types/index.d.ts',
    },
    // ...
  ],
})
```

3. Build via `hyperbuild` command:

```sh
npx hyperbuild
```

## Options

### Custom Config

Set a custom config path via the CLI command:

```sh
npx hyperbuild --config my.config.js
```

## Community

Feel free to use the official [discussions](https://github.com/hypernym-studio/bundler/discussions) for any additional questions.

## License

Developed in 🇭🇷 Croatia

Released under the [MIT](LICENSE.txt) license.

© Hypernym Studio
