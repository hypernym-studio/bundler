<h1 align="center">Hyperbundler</h1>

<p align="center">ESM & TS module bundler.</p>

<p align="center">
  <a href="https://github.com/hypernym-studio/bundler">Repository</a>
  <span>+</span>
  <a href="https://www.npmjs.com/package/@hypernym/bundler">Package</a>
  <span>+</span>
  <a href="https://github.com/hypernym-studio/bundler/releases">Releases</a>
  <span>+</span>
  <a href="https://github.com/hypernym-studio/bundler/discussions">Discussions</a>
</p>

<pre align="center">pnpm add -D @hypernym/bundler</pre>

<p align="center">
  <strong>Hypernym Studio</strong>
</p>

<br>

## Features

- Powered by Rollup
- Written in TypeScript
- Allows advanced customization
- Provides a powerful hooking system
- Supports all TS module resolutions
- Exports fully optimized code
- Follows modern practice
- Super easy to use
- API friendly

## Quick Start

1. Create a `bundler.config.ts` file at the root of your project:

> [!NOTE]
>
> Configuration also accepts `.js`, `.mjs`, `.ts`, `.mts` formats.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  // ...
})
```

2. Specify the bundle's entry points:

> See all [options](./src/types/options.ts).

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    { input: './src/index.ts' },
    { declaration: './src/types/index.ts' },
    {
      input: './src/utils/index.ts',
      output: './dist/utils/utils.min.mjs',
      transformers: {
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

<details>
<summary>CLI Output</summary>

<br>
<p>Example of CLI Output:</p>

```txt
┌─────────────────┐
│ ✦✦ HYPERBUNDLER │ v0.11.0
└─────────────────┘
i Config bundler.config.ts
i Bundling started...
* Processing [8:07:26 PM] Transforming files
│
├─ + esm ./dist/index.mjs (50ms) 313 B
├─ + dts ./dist/types/index.d.ts (1.23s) 13.61 KB
├─ + esm ./dist/bin/index.mjs (119ms) 16.53 KB
│
* Succeeded [8:07:28 PM] Module transformation is done
✔ Bundling fully completed in 1.40s
✔ 3 modules transformed. Total size is 30.45 KB
✦✦ HYPERBUNDLER [8:07:28 PM] Bundle is generated and ready for production
```

</details>

## Options

All options are documented with descriptions and examples, and auto-completion will be offered as you type.

Simply hover over the property and see what it does in the `quickinfo`.

### entries

- Type: `EntryOptions[]`

Specifies the bundle's entry points.

It allows you to manually set all build entries and adjust options for each one individually.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    { input: './src/index.ts' }, // => './dist/index.mjs'
    { declaration: './src/types.ts' }, // => './dist/types.d.ts'
    // ...
  ],
})
```

#### Entry Chunk

- [Types](./src/types/entries.ts)

Automatically transforms `chunks` for production.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    {
      input: './src/index.ts', // => './dist/index.mjs'
    },
  ],
})
```

#### Entry Declaration

- [Types](./src/types/entries.ts)

Builds TypeScript `declaration` files (.d.ts) for production.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    {
      { declaration: './src/types.ts' }, // => './dist/types.d.ts'
    },
  ],
})
```

#### Entry Copy

- [Types](./src/types/entries.ts)

Copies the single `file` or entire `directory` structure from source to destination, including subdirectories and files.

This can be very useful for copying some assets that don't need a transformation process, but a simple copy paste feature.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    {
      copy: {
        input: './src/path/file.ts', // or ['path-dir', 'path-file.ts', ...]
        output: './dist/out', // path to output dir
      },
    },
  ],
})
```

#### Entry Template

- [Types](./src/types/entries.ts)

Provides the ability to dynamically inject `template` content during the build phase and writes the file to the destination path defined in the output property.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'
import { name, version } from './package.json'

export default defineConfig({
  entries: [
    {
      template: `// Package ${name} v${version} ...`,
      output: './dist/template.ts',
    },
  ],
})
```

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

### alias

- Type: `{ find: string | RegExp; replacement: string; }[]`
- Default: `undefined`

Specifies prefixes that will resolve imports with custom paths.

Enables these `alias` by default:

```ts
// Imports module from './src/utils/index.js'
import { module } from '@/utils' // @
import { module } from '~/utils' // ~
```

Also, it is possible to completely override the default aliases by setting custom ones.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  alias: [{ find: /^#/, replacement: resolve('./src') }],
})
```

Now imports can be used like this:

```ts
// Imports module from './src/utils/index.js'
import { module } from '#/utils' // #
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
import { plugin1, plugin2 } from './src/utils/plugins.js'

export default defineConfig({
  hooks: {
    'build:entry:start': async (options, stats) => {
      // adds custom plugins for a specific entry only
      if (options.input?.includes('./src/index.ts')) {
        options.defaultPlugins = [
          plugin1(), // adds a custom plugin before the default bundler plugins
          ...options.defaultPlugins, // list of default bundler plugins
          plugin2(), // adds a custom plugin after the default bundler plugins
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

## Utils

### resolvePaths

- Type: `(options: ResolvePathsOptions[]): (id: string) => string`

Resolves external module IDs into custom paths.

```ts
import { defineConfig, resolvePaths } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    {
      input: './src/index.ts',
      externals: [/^@\/path/],
      paths: resolvePaths([
        // replaces `@/path` with `./path/index.mjs`
        { find: /^@\/path/, replacement: './path/index.mjs' },
      ]),
    },
  ],
})
```

## CLI

### Custom Config

Set a custom config path via the CLI command:

```sh
npx hyperbundler --config hyper.config.ts
```

## Community

Feel free to ask questions or share new ideas.

Use the official [discussions](https://github.com/hypernym-studio/bundler/discussions) to get involved.

## License

Developed in 🇭🇷 Croatia, © Hypernym Studio.

Released under the [MIT](LICENSE.txt) license.
