import { cwd } from 'node:process'
import { resolve, dirname } from 'node:path'
import { stat } from 'node:fs/promises'
import { exists } from '@hypernym/utils/fs'
import { createFilter } from '@rollup/pluginutils'
import { transform, type TransformOptions } from 'esbuild'
import type { Plugin } from 'rollup'

async function resolvePath(
  path: string,
  index = false,
): Promise<string | null> {
  const extensions = ['.js', '.ts', 'jsx', '.tsx']
  const fileWithoutExt = path.replace(/\.[jt]sx?$/, '')
  for (const ext of extensions) {
    const file = index ? `${path}/index${ext}` : `${fileWithoutExt}${ext}`
    if (await exists(file)) return file
  }
  return null
}

export function esbuild(options?: TransformOptions): Plugin {
  const filter = createFilter(/\.([cm]?ts|[jt]sx)$/)

  return {
    name: 'esbuild',

    async resolveId(id, importer) {
      if (importer) {
        const resolved = resolve(importer ? dirname(importer) : cwd(), id)
        let file = await resolvePath(resolved)

        if (file) return file
        if (
          !file &&
          (await exists(resolved)) &&
          (await stat(resolved)).isDirectory()
        ) {
          file = await resolvePath(resolved, true)
          if (file) return file
        }
      }

      return null
    },

    async transform(code, id) {
      if (!filter(id)) return null

      const result = await transform(code, {
        loader: 'default',
        ...options,
        sourcefile: id,
      })

      return {
        code: result.code,
        map: result.map || null,
      }
    },

    async renderChunk(code, { fileName }) {
      if (!options?.minify) return null

      if (/\.d\.(c|m)?tsx?$/.test(fileName)) return null

      const result = await transform(code, {
        ...options,
        sourcefile: fileName,
        minify: true,
      })

      return {
        code: result.code,
        map: result.map || null,
      }
    },
  }
}
