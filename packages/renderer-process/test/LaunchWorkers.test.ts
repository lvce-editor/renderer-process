import { beforeEach, expect, jest, test } from '@jest/globals'

const mockHydrateRendererWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateEditorWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateSyntaxHighlightingWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateExtensionHostWorker = jest.fn<(...args: any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    hydrate: mockHydrateRendererWorker,
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

jest.unstable_mockModule('../src/parts/ExtensionHostWorker/ExtensionHostWorker.ts', () => {
  return {
    hydrate: mockHydrateExtensionHostWorker,
  }
})

const LaunchWorkers = await import('../src/parts/LaunchWorkers/LaunchWorkers.ts')

test('launchWorkers - returns first worker error', async () => {
  const error = new Error('Failed to start extension host worker')
  mockHydrateRendererWorker.mockResolvedValue({
    ok: true,
    value: undefined,
  })
  mockHydrateEditorWorker.mockResolvedValue({
    ok: true,
    value: undefined,
  })
  mockHydrateSyntaxHighlightingWorker.mockResolvedValue({
    ok: true,
    value: undefined,
  })
  mockHydrateExtensionHostWorker.mockResolvedValue({
    ok: false,
    error,
  })

  const result = await LaunchWorkers.launchWorkers()

  expect(result).toEqual({
    ok: false,
    error,
  })
})
