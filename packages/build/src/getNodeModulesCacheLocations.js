import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './root.js'

export const getNodeModulesCacheLocations = (packageNames) => {
  const workspacePackageLocations = packageNames
    .toSorted()
    .filter((packageName) => existsSync(join(root, 'packages', packageName, 'package.json')))
    .map((packageName) => `packages/${packageName}/package.json`)
  return [
    '.nvmrc',
    'package.json',
    'package-lock.json',
    ...workspacePackageLocations,
    '.github/workflows/pr.yml',
    '.github/workflows/ci.yml',
    '.github/workflows/release.yml',
    'packages/build/src/computeNodeModulesCacheKey.js',
    'packages/build/src/getNodeModulesCacheLocations.js',
    'packages/server/src/postinstall.js',
  ]
}
