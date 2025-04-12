import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 460_000

export const instantiations = 3000

export const instantiationsPath = join(root, 'packages', 'renderer-process')
