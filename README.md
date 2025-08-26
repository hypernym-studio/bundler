<h1 align="center">@hypernym/bundler</h1>

<p align="center">ESM & TS module bundler.</p>

<p align="center">
  <a href="https://github.com/hypernym-studio/bundler">Repository</a>
  <span>✦</span>
  <a href="https://www.npmjs.com/package/@hypernym/bundler">Package</a>
  <span>✦</span>
  <a href="https://github.com/hypernym-studio/bundler/releases">Releases</a>
  <span>✦</span>
  <a href="https://github.com/hypernym-studio/bundler/discussions">Discussions</a>
</p>

<br>

<pre align="center">pnpm add -D @hypernym/bundler</pre>

<br>

## Features

- Powered by Rolldown
- Allows Advanced Customization
- Provides a Powerful Hooking System
- Exports Fully Optimized Code
- Follows Modern Practice
- Super Easy to Use
- API-Friendly

## Quick Start

1. Create a `bundler.config.ts` file at the root of your project:

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
    { dts: './src/types/index.ts' },
    {
      input: './src/utils/index.ts',
      output: './dist/utils/utils.min.mjs',
      minify: true,
    },
    // ...
  ],
})
```

3. Build via commands:

```sh
# pnpm
pnpm hyperbundler

# npm
npx hyperbundler
```

## Config

`Hyperbundler` automatically detects custom configuration from the project root that can override or extend the build behavior.

Configuration file also accepts `.js`, `.mjs`, `.ts`, `.mts` formats.

```ts
// bundler.config.{js,mjs,ts,mts}

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  // ...
})
```

### Custom path

Set a custom config path via the CLI command:

```sh
# pnpm
pnpm hyperbundler --config hyper.config.ts

# npm
npx hyperbundler --config hyper.config.ts
```

## Formats

During transformation, file formats are automatically resolved, and in most cases, no additional configuration is required.

The default module environment for generated files is `esm`, which means output files will have a `.mjs` extension unless otherwise specified. For TypeScript declarations, the corresponding extension will be `.d.mts`.

Formats can also be explicitly specified for each entry, if needed.

### Inputs

Default transformation behavior for all `chunk` entries:

- `./srcDir/file.js` → `./outDir/file.mjs`
- `./srcDir/file.mjs` → `./outDir/file.mjs`
- `./srcDir/file.cjs` → `./outDir/file.cjs`
- `./srcDir/file.ts` → `./outDir/file.mjs`
- `./srcDir/file.mts` → `./outDir/file.mjs`
- `./srcDir/file.cts` → `./outDir/file.cjs`

### Declarations

Default transformation behavior for all `dts` entries:

- `./srcDir/file.ts` → `./outDir/file.d.mts`

## Options

All options come with descriptions and examples. As you type, you’ll get suggestions and can see quick info by hovering over any property.

### entries

- Type: `EntryOptions[]`

Specifies the bundle's entry points.

It allows you to manually set all build entries and adjust options for each one individually.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    { input: './src/index.ts' }, // outputs './dist/index.mjs'
    { dts: './src/types.ts' }, // outputs './dist/types.d.mts'
    // ...
  ],
})
```

### Entry Chunk

Automatically transforms `chunks` for production.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    { input: './src/index.ts' }, // outputs './dist/index.mjs'
    {
      input: './src/index.ts',
      output: './out/index.js', // outputs './out/index.js'
    },
  ],
})
```

### Entry Dts

Builds TypeScript `declaration` files (`.d.mts`) for production.

```ts
import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    { dts: './src/types.ts' }, // outputs './dist/types.d.mts'
    {
      dts: './src/types.ts',
      output: './out/types.d.ts', // outputs './out/types.d.ts'
    },
  ],
})
```

### Entry Copy

Copies either a single `file` or an entire `directory` structure from the source to the destination, including all subdirectories and files.

This is especially useful for transferring assets that don't require any transformation, just a straightforward copy-paste operation.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    {
      // copies a single file
      copy: './src/path/file.ts', // outputs './dist/path/file.ts'
    },
    {
      // copies a single file
      copy: './src/path/file.ts',
      output: './dist/subdir/custom-file-name.ts',
    },
    {
      // copies the entire directory
      input: './src/path/srcdir',
      output: './dist/outdir',
    },
  ],
})
```

### Entry Template

Specifies the content of the `template` file.

Provides the ability to dynamically inject template content during the build phase.

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

- Type: `string | undefined`
- Default: `dist`

Specifies the output directory for production bundle.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  outDir: './output',
})
```

### externals

- Type: `(string | RegExp)[] | undefined`
- Default: `[/^node:/, /^@types/, /^@rollup/, /^@rolldown/, /^@hypernym/, /^rollup/, /^rolldown/, ...pkg.dependencies]`

Specifies the module IDs or regular expressions that match module IDs to be treated as external and excluded from the bundle.

The IDs and regular expressions provided in this option are applied globally across all entries.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  externals: ['id-1', 'id-2', /regexp/],
})
```

Alternatively, externals can be defined individually for each entry using the `entry.externals` property.

```ts
export default defineConfig({
  entries: [
    {
      input: './src/index.ts',
      externals: ['id-1', 'id-2', /regexp/],
    },
  ],
})
```

### minify

- Type: `boolean | 'dce-only' | MinifyOptions | undefined`
- Default: `undefined`

Controls code minification for all `chunk` entries.

- `true`: Enable full minification including code compression and dead code elimination.
- `false`: Disable minification (default).
- `'dce-only'`: Only perform dead code elimination without code compression.
- `MinifyOptions`: Fine-grained control over minification settings.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  minify: true,
})
```

It can also be set per entry:

```ts
export default defineConfig({
  entries: [
    {
      input: './src/index.ts',
      minify: true,
    },
  ],
})
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

- Type: `(options: Options) => void | Promise<void> | undefined`
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

- Type: `(options: Options, stats: BuildStats) => void | Promise<void> | undefined`
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

- Type: `(entry: BuildEntryOptions, stats: BuildEntryStats) => void | Promise<void> | undefined`
- Default: `undefined`

Called on each entry just before the build process.

Provides the ability to customize entry options before they are passed to the next phase.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'
import { plugin1, plugin2 } from './src/utils/plugins.js'

export default defineConfig({
  hooks: {
    'build:entry:start': async (entry, stats) => {
      // ...
    },
  },
})
```

### build:entry:end

- Type: `(entry: BuildEntryOptions, stats: BuildEntryStats) => void | Promise<void> | undefined`
- Default: `undefined`

Called on each entry right after the build process is completed.

```ts
// bundler.config.ts

import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  hooks: {
    'build:entry:end': async (entry, stats) => {
      // ...
    },
  },
})
```

### build:end

- Type: `(options: Options, stats: BuildStats) => void | Promise<void> | undefined`
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

- Type: `(options: Options) => void | Promise<void> | undefined`
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

### externals

List of global default patterns for external module identifiers.

```ts
import { externals } from '@hypernym/bundler'

export default defineConfig({
  entries: [
    {
      input: './src/index.ts',
      externals: [...externals, 'id', /regexp/],
    },
  ],
})
```

## Plugins

Provides built-in plugins that can be used out of the box and additionally customized as needed.

```ts
import {
  aliasPlugin,
  jsonPlugin,
  replacePlugin,
  dts,
  outputPaths,
  //...
} from '@hypernym/bundler/plugins'
```

## Programmatic

### build

- Type: `function build(options: Options): Promise<BuildStats>`

```ts
import { build } from '@hypernym/bundler'

await build({
  entries: [{ input: './src/index.ts' }],
  // ...
})
```

## CLI

### config

Specifies the path to the `bundler` custom config file.

```sh
# pnpm
pnpm hyperbundler --config hyper.config.mjs

# npm
npx hyperbundler --config hyper.config.mjs
```

### cwd

Specifies the path to the project root (current working directory).

```sh
# pnpm
pnpm hyperbundler --cwd ./custom-dir

# npm
npx hyperbundler --cwd ./custom-dir
```

### tsconfig

Specifies the path to the `tsconfig` file.

By default, if the file `tsconfig.json` exists in the project root, it will be used as the default config file.

```sh
# pnpm
pnpm hyperbundler --tsconfig tsconfig.json

# npm
npx hyperbundler --tsconfig tsconfig.json
```

## License

Developed in 🇭🇷 Croatia, © Hypernym Studio.

Released under the [MIT](LICENSE.txt) license.
