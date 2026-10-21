import { beforeEach, expect, jest, test } from '@jest/globals'

const getConfiguredWorkerUrl = jest.fn<(...args: any[]) => any>()
const preloadWorker = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({ getConfiguredWorkerUrl }))
jest.unstable_mockModule('../src/parts/PreloadWorker/PreloadWorker.ts', () => ({ preloadWorker }))

const mockHydrateRendererWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateDragAndDropWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateEditorWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateSyntaxHighlightingWorker = jest.fn<(...args: any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
  preloadWorker.mockResolvedValue({ ok: true, value: undefined })
  mockHydrateRendererWorker.mockResolvedValue({ ok: true, value: undefined })
  mockHydrateEditorWorker.mockResolvedValue({ ok: true, value: undefined })
  mockHydrateSyntaxHighlightingWorker.mockResolvedValue({ ok: true, value: undefined })
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    hydrate: mockHydrateRendererWorker,
  }
})

jest.unstable_mockModule('../src/parts/DragAndDropWorker/DragAndDropWorker.ts', () => {
  return {
    hydrate: mockHydrateDragAndDropWorker,
  }
})

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => {
  return {
    hydrate: mockHydrateEditorWorker,
  }
})

jest.unstable_mockModule('../src/parts/SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts', () => {
  return {
    hydrate: mockHydrateSyntaxHighlightingWorker,
  }
})

const LaunchWorkers = await import('../src/parts/LaunchWorkers/LaunchWorkers.ts')

test('launchWorkers - does not launch the drag and drop worker', async () => {
  mockHydrateRendererWorker.mockResolvedValue({ ok: true, value: undefined })
  mockHydrateEditorWorker.mockResolvedValue({ ok: true, value: undefined })
  mockHydrateSyntaxHighlightingWorker.mockResolvedValue({ ok: true, value: undefined })

  await expect(LaunchWorkers.launchWorkers()).resolves.toEqual({ ok: true, value: undefined })
  expect(mockHydrateDragAndDropWorker).not.toHaveBeenCalled()
})

test('launchWorkers - returns first worker error', async () => {
  const error = new Error('Failed to start syntax highlighting worker')
  mockHydrateRendererWorker.mockResolvedValue({
    ok: true,
    value: undefined,
  })
  mockHydrateEditorWorker.mockResolvedValue({
    ok: true,
    value: undefined,
  })
  mockHydrateSyntaxHighlightingWorker.mockResolvedValue({
    error,
    ok: false,
  })

  const result = await LaunchWorkers.launchWorkers()

  expect(result).toEqual({
    error,
    ok: false,
  })
})

test('missing configuration preloads all nine default workers', async () => {
  await LaunchWorkers.launchWorkers()
  expect(mockHydrateRendererWorker).toHaveBeenCalledTimes(1)
  expect(mockHydrateEditorWorker).toHaveBeenCalledTimes(1)
  expect(mockHydrateSyntaxHighlightingWorker).toHaveBeenCalledTimes(1)
  expect(preloadWorker.mock.calls.map(([name]) => name)).toEqual([
    'Extension Management Worker',
    'File System Worker',
    'Activity Bar Worker',
    'Main Area Worker',
    'Status Bar Worker',
    'Icon Theme Worker',
  ])
})

test.each([[[]], [['rendererWorker']], [['unknownWorker', '__proto__']]])('bootstrap stays available with configuration %j', async (...args) => {
  getConfiguredWorkerUrl.mockReturnValue(args[0])
  await LaunchWorkers.launchWorkers()
  expect(mockHydrateRendererWorker).toHaveBeenCalledTimes(1)
  expect(mockHydrateEditorWorker).not.toHaveBeenCalled()
  expect(mockHydrateSyntaxHighlightingWorker).not.toHaveBeenCalled()
  expect(preloadWorker).not.toHaveBeenCalled()
})

test('a subset preloads each selected worker once', async () => {
  getConfiguredWorkerUrl.mockReturnValue(['fileSystemWorker', 'fileSystemWorker', 'editorWorker'])
  await LaunchWorkers.launchWorkers()
  expect(mockHydrateEditorWorker).toHaveBeenCalledTimes(1)
  expect(mockHydrateSyntaxHighlightingWorker).not.toHaveBeenCalled()
  expect(preloadWorker).toHaveBeenCalledTimes(1)
  expect(preloadWorker).toHaveBeenCalledWith('File System Worker', 'file-system-worker', 'fileSystemWorkerMain.js', 'develop.fileSystemWorkerPath')
})

test('preloads application workers with their configured worker URLs', async () => {
  getConfiguredWorkerUrl.mockReturnValue(['activityBarWorker', 'mainAreaWorker', 'statusBarWorker', 'iconThemeWorker'])
  await LaunchWorkers.launchWorkers()
  expect(preloadWorker.mock.calls).toEqual([
    ['Activity Bar Worker', 'activity-bar-worker', 'activityBarWorkerMain.js', 'develop.activityBarWorkerPath'],
    ['Main Area Worker', 'main-area-worker', 'mainAreaWorkerMain.js', 'develop.mainAreaWorkerPath'],
    ['Status Bar Worker', 'status-bar-worker', 'statusBarWorkerMain.js', 'develop.statusBarWorkerPath'],
    ['Icon Theme Worker', 'icon-theme-worker', 'iconThemeWorkerMain.js', 'develop.iconThemeWorkerPath'],
  ])
})

test('additional worker errors are returned to startup', async () => {
  const error = new Error('File system worker failed')
  getConfiguredWorkerUrl.mockReturnValue(['fileSystemWorker'])
  preloadWorker.mockResolvedValue({ error, ok: false })
  await expect(LaunchWorkers.launchWorkers()).resolves.toEqual({ error, ok: false })
})
