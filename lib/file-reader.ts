import fs from 'fs'
import path from 'path'

export function readFile(filePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    return fs.readFileSync(fullPath, 'utf-8')
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to read file: ${error.message}`)
    }
    throw new Error('Failed to read file: Unknown error')
  }
}
