export const getNodeModulesCacheLocations = (packageNames) => {
  const workspacePackageLocations = packageNames.toSorted().map((packageName) => `packages/${packageName}/package.json`)
  return [
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
