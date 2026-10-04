/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  document.body.replaceChildren()
  document.head.replaceChildren()
})

test('getInitData includes resolved config from html', async () => {
  const config = document.createElement('script')
  config.id = 'Config'
  config.type = 'application/json'
  config.type = 'application/json'
  config.textContent = JSON.stringify({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    assetDir: '/test-assets',
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    platform: 'remote',
    workerUrls: {
      'develop.editorWorkerPath': '/test-assets/packages/editor-worker/dist/editorWorkerMain.js',
    },
  })
  document.head.append(config)

  const InitData = await import('../src/parts/InitData/InitData.ts')
  const initData = InitData.getInitData()

  expect(initData.Config).toMatchObject({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    assetDir: '/test-assets',
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    platform: 3,
    workerUrls: {
      'develop.editorWorkerPath': '/test-assets/packages/editor-worker/dist/editorWorkerMain.js',
    },
  })
})

test('getInitData works without html config', async () => {
  const InitData = await import('../src/parts/InitData/InitData.ts')
  const initData = InitData.getInitData()

  expect(initData.Config).toEqual({
    assetDir: '',
    platform: 3,
    workerUrls: '',
    shouldLaunchMultipleWorkers: expect.any(Boolean),
  })
})

test.each([
  ['electron', 2, '../../../../..'],
  ['web', 1, ''],
  ['remote', 3, ''],
])('resolves %s platform and default asset directory for IPC', async (platform, expectedPlatform, expectedAssetDir) => {
  const config = document.createElement('script')
  config.id = 'Config'
  config.type = 'application/json'
  config.textContent = JSON.stringify({ platform, workerUrls: { 'develop.editorWorkerPath': '/override/editor.js' } })
  document.head.append(config)
  const InitData = await import('../src/parts/InitData/InitData.ts')
  expect(InitData.getInitData().Config).toMatchObject({
    platform: expectedPlatform,
    assetDir: expectedAssetDir,
    workerUrls: { 'develop.editorWorkerPath': '/override/editor.js' },
  })
})
