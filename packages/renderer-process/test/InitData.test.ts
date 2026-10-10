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
  config.textContent = JSON.stringify({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    assetDir: '/test-assets',
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    platform: 'electron',
    workerUrls: {
      'develop.editorWorkerPath': '/test-assets/packages/editor-worker/dist/editorWorkerMain.js',
    },
    workspaceUri: 'remote-ssh://user@example.com/home',
  })
  document.head.append(config)

  const InitData = await import('../src/parts/InitData/InitData.ts')
  const initData = InitData.getInitData()

  expect(initData.Config).toMatchObject({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    assetDir: '/test-assets',
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    platform: 2,
    workerUrls: {
      'develop.editorWorkerPath': '/test-assets/packages/editor-worker/dist/editorWorkerMain.js',
    },
    workspaceUri: 'remote-ssh://user@example.com/home',
  })
})

test('getInitData removes the Electron workspace query after reading Config', async () => {
  history.replaceState(null, '', '/?test=1&workspace=remote-ssh%3A%2F%2Fuser%40example.com%2Fhome#state')
  const config = document.createElement('script')
  config.id = 'Config'
  config.type = 'application/json'
  config.textContent = JSON.stringify({ platform: 'electron', workspaceUri: 'remote-ssh://user@example.com/home' })
  document.head.append(config)

  const InitData = await import('../src/parts/InitData/InitData.ts')
  const initData = InitData.getInitData()

  expect(initData.Config.workspaceUri).toBe('remote-ssh://user@example.com/home')
  expect(initData.Location.href).toBe('http://localhost/?test=1#state')
  expect(location.search).toBe('?test=1')
})

test('getInitData works without html config', async () => {
  const InitData = await import('../src/parts/InitData/InitData.ts')
  const initData = InitData.getInitData()

  expect(initData.Config).toEqual({
    assetDir: '',
    platform: 3,
    shouldLaunchMultipleWorkers: expect.any(Boolean),
    workerUrls: '',
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
    assetDir: expectedAssetDir,
    platform: expectedPlatform,
    workerUrls: { 'develop.editorWorkerPath': '/override/editor.js' },
  })
})
