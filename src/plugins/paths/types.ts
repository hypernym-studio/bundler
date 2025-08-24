export interface OutputPathsEntry {
  find: string | RegExp
  replacement:
    | string
    | ((path: string, match: RegExpExecArray | null) => string)
}
