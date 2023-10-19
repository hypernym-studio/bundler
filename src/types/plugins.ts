import type { RollupReplaceOptions } from '@rollup/plugin-replace'
import type { RollupJsonOptions } from '@rollup/plugin-json'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { TransformOptions as EsbuildOptions } from 'esbuild'
import type { Options as DtsOptions } from 'rollup-plugin-dts'

export interface PluginsInput {
  esbuild?: EsbuildOptions
  resolve?: RollupNodeResolveOptions | true
  json?: RollupJsonOptions | true
  replace?: RollupReplaceOptions
}

export interface PluginsTypes {
  dts?: DtsOptions
}
