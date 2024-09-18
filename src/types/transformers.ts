import type { RollupReplaceOptions } from '@rollup/plugin-replace'
import type { RollupJsonOptions } from '@rollup/plugin-json'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupAliasOptions } from '@rollup/plugin-alias'
import type { TransformOptions as EsbuildOptions } from 'esbuild'
import type { Options as DtsOptions } from 'rollup-plugin-dts'

export interface TransformersChunk {
  esbuild?: EsbuildOptions
  resolve?: RollupNodeResolveOptions | true
  replace?: RollupReplaceOptions
  json?: RollupJsonOptions | true
  alias?: RollupAliasOptions
}

export interface TransformersDeclaration {
  dts?: DtsOptions
  alias?: RollupAliasOptions
}
