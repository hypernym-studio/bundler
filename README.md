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
npx hyperbundler
```

## Hooks

List of lifecycle hooks that are called at various phases:

| Name                                    | Description                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| [`bundle:start`](#bundlestart)          | Called at the beginning of bundling.                             |
| [`build:start`](#buildstart)            | Called at the beginning of building.                             |
| [`build:entry:start`](#buildentrystart) | Called on each entry just before the build process.              |
| [`build:entry:end`](#buildentryend)     | Called on each entry right after the build process is completed. |
| [`build:end`](#buildend)                | Called right after building is complete.                         |
| [`bundle:end`](#bundleend)              | Called right after bundling is complete.                         |

### bundle:start

- Type: `(options: Options) => void | Promise<void>`
- Default: `undefined`

Called at the beginning of bundling.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  hooks: {
    'bundle:start': async (options) => {
      // ...
    },
  },
})
```

### build:start

- Type: `(options: Options, stats: BuildStats) => void | Promise<void>`
- Default: `undefined`

Called at the beginning of building.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  hooks: {
    'build:start': async (options, stats) => {
      // ...
    },
  },
})
```

### build:entry:start

- Type: `(options: BuildEntryOptions, stats: BuildStats) => void | Promise<void>`
- Default: `undefined`

Called on each entry just before the build process.

Provides the ability to customize entry options before they are passed to the next phase.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'
import { plugin1, plugin2, plugin3 } from './src/utils/plugins.js'

export default defineConfig({
  hooks: {
    'build:entry:start': async (options, stats) => {
      // adds custom plugins for a specific entry only
      if (options.input?.includes('./src/index.ts')) {
        options.plugins = [
          plugin1(), // adds a custom plugin before the default bundler plugins
          ...options.plugins, // list of default bundler plugins
          plugin2(), // adds a custom plugin after the default bundler plugins
        ]
      }
      // adds custom plugins for a specific types only
      if (options.types?.includes('./src/types.ts')) {
        options.plugins = [
          ...options.plugins, // list of default bundler plugins
          plugin3(), // adds a custom plugin designed to work only with TS declarations
        ]
      }
    },
  },
})
```

### build:entry:end

- Type: `(options: BuildEntryOptions, stats: BuildStats) => void | Promise<void>`
- Default: `undefined`

Called on each entry right after the build process is completed.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  hooks: {
    'build:entry:end': async (options, stats) => {
      // ...
    },
  },
})
```

### build:end

- Type: `(options: Options, stats: BuildStats) => void | Promise<void>`
- Default: `undefined`

Called right after building is complete.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  hooks: {
    'build:end': async (options, stats) => {
      // ...
    },
  },
})
```

### bundle:end

- Type: `(options: Options) => void | Promise<void>`
- Default: `undefined`

Called right after bundling is complete.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  hooks: {
    'bundle:end': async (options) => {
      // ...
    },
  },
})
```

## Options

### outDir

- Type: `string`
- Default: `dist`

Specifies the output directory for production bundle.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  outDir: 'output',
})
```

### externals

- Type: `(string | RegExp)[]`
- Default: `[/^node:/, /^@types/, /^@rollup/, /^@hypernym/, /^rollup/, ...pkg.dependencies]`

Specifies the module IDs, or regular expressions to match module IDs, that should remain external to the bundle.

IDs and regexps from this option are applied globally to all entries.

Also, it is possible to define externals individually per entry (`entry.externals`).

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  externals: ['id-1', 'id-2', /regexp/],
})
```

## CLI

### Custom Config

Set a custom config path via the CLI command:

```sh
npx hyperbundler --config my.config.js
```

## Community

Feel free to use the official [discussions](https://github.com/hypernym-studio/bundler/discussions) for any additional questions.

## License

Developed in 🇭🇷 Croatia

Released under the [MIT](LICENSE.txt) license.

© Hypernym Studio
