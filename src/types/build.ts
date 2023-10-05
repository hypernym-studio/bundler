export interface BuildStats {
  cwd: string
  size: number
  buildTime: number
  files: {
    path: string
    size: number
    buildTime: number
  }[]
}

// Auto-generated
export * from '../build.js'
