import { isString } from '@hypernym/utils'
import { OutputPathsEntry } from './types'
import type { Plugin } from 'rolldown'

export function outputPaths(entries: OutputPathsEntry[]): Plugin {
  return {
    name: 'output-paths',
    renderChunk(code) {
      const patterns = [
        {
          pattern: /(import|export)([\s\S]*?\bfrom\s*)(['"])([^'"]+)(\3)/g,
          pathIndex: 3,
        },
        {
          pattern: /(import|require)\s*\(\s*(['"])([^'"]+)(\2)\s*\)/g,
          pathIndex: 2,
        },
      ]

      for (const { find, replacement } of entries) {
        const matcher = isString(find)
          ? new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
          : new RegExp(
              find.source,
              find.flags.includes('g') ? find.flags : find.flags + 'g',
            )

        for (const { pattern, pathIndex } of patterns) {
          pattern.lastIndex = 0

          code = code.replace(pattern, (match, ...groups) => {
            const path = groups[pathIndex]

            matcher.lastIndex = 0
            const matchResult = matcher.exec(path)

            return matchResult
              ? match.replace(
                  path,
                  isString(replacement)
                    ? replacement
                    : replacement(path, matchResult),
                )
              : match
          })
        }
      }

      return { code }
    },
  }
}
