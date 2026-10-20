import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getNodeModulesCacheLocations } from '../src/getNodeModulesCacheLocations.js'

test('includes every workspace package manifest', () => {
  const locations = getNodeModulesCacheLocations(['server', 'build'])

  assert.deepEqual(locations, [
    '.nvmrc',
    'package.json',
    'package-lock.json',
    'packages/build/package.json',
    'packages/server/package.json',
    '.github/workflows/pr.yml',
    '.github/workflows/ci.yml',
    '.github/workflows/release.yml',
    'packages/build/src/computeNodeModulesCacheKey.js',
    'packages/build/src/getNodeModulesCacheLocations.js',
    'packages/server/src/postinstall.js',
  ])
})

test('ignores package directories without a manifest', () => {
  const locations = getNodeModulesCacheLocations(['e2e-integration'])

  assert.equal(locations.includes('packages/e2e-integration/package.json'), false)
})
