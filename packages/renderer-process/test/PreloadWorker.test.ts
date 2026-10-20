/** @jest-environment jsdom */
import { beforeEach, expect, jest, test } from '@jest/globals'

const create = jest.fn<(...args: any[]) => Promise<any>>()
const getConfiguredWorkerUrl = jest.fn<(...args: any[]) => any>()
jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.ts', () => ({ create }))
jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({ getConfiguredWorkerUrl }))
jest.unstable_mockModule('../src/parts/AssetDir/AssetDir.ts', () => ({ assetDir: '/assets' }))
const PreloadWorker = await import('../src/parts/PreloadWorker/PreloadWorker.ts')
const IpcStates = await import('../src/parts/IpcStates/IpcStates.ts')
const port1 = { close: jest.fn() }
const port2 = { close: jest.fn() }

beforeEach(() => {
  IpcStates.clear()
  jest.resetAllMocks()
  globalThis.MessageChannel = jest.fn(() => ({ port1, port2 })) as any
  create.mockResolvedValue(undefined)
})

test('uses runtime URL override and makes the port available before startup completes', async () => {
  getConfiguredWorkerUrl.mockReturnValue({ 'develop.fileSystemWorkerPath': '/custom-fs.js' })
  const ready = Promise.withResolvers<void>()
  create.mockReturnValue(ready.promise)
  const pending = PreloadWorker.preloadWorker('File System Worker', 'file-system-worker', 'fileSystemWorkerMain.js', 'develop.fileSystemWorkerPath')
  expect(IpcStates.get('File System Worker')).toBe(port2)
  expect(create).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'File System Worker', parentName: 'Renderer Worker', port: port1, url: '/custom-fs.js' }),
  )
  ready.resolve()
  await expect(pending).resolves.toEqual({ ok: true, value: undefined })
})

test('uses the development package URL and closes unclaimed ports on hot reload', async () => {
  await PreloadWorker.preloadWorker(
    'Extension Management Worker',
    'extension-management-worker',
    'extensionManagementWorkerMain.js',
    'develop.extensionManagementWorkerPath',
  )
  expect(create).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/assets/packages/renderer-worker/node_modules/@lvce-editor/extension-management-worker/dist/extensionManagementWorkerMain.js',
    }),
  )
  IpcStates.clear()
  expect(port2.close).toHaveBeenCalledTimes(1)
  expect(IpcStates.has('Extension Management Worker')).toBeFalsy()
})

test('startup failure removes the cached port and closes both ends', async () => {
  const error = new Error('Worker startup failed')
  create.mockRejectedValue(error)
  await expect(
    PreloadWorker.preloadWorker('File System Worker', 'file-system-worker', 'fileSystemWorkerMain.js', 'develop.fileSystemWorkerPath'),
  ).resolves.toEqual({ error, ok: false })
  expect(IpcStates.has('File System Worker')).toBeFalsy()
  expect(port1.close).toHaveBeenCalledTimes(1)
  expect(port2.close).toHaveBeenCalledTimes(1)
})
