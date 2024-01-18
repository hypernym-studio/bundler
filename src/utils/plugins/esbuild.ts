import { cwd } from 'node:process'
import { existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { createFilter } from '@rollup/pluginutils'
import { transform, type TransformOptions } from 'esbuild'
import type { Plugin } from 'rollup'

function resolvePath(path: string, index = false): string | null {
  const extensions = ['.js', '.ts', 'jsx', '.tsx']
  const fileWithoutExt = path.replace(/\.[jt]sx?$/, '')
  for (const ext of extensions) {
    const file = index ? join(path, `index${ext}`) : `${fileWithoutExt}${ext}`
    if (existsSync(file)) return file
  }
  return null
}

export function esbuild(options?: TransformOptions): Plugin {
  const filter = createFilter(/\.([cm]?ts|[jt]sx)$/)

  return {
    name: 'esbuild',

    resolveId(id, importer) {
      if (importer) {
        const resolved = resolve(importer ? dirname(importer) : cwd(), id)
        let file = resolvePath(resolved)

        if (file) return file
        if (!file && existsSync(resolved) && statSync(resolved).isDirectory()) {
          file = resolvePath(resolved, true)
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
