import { beforeEach, expect, jest, test } from '@jest/globals'

const mockHydrateRendererWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateEditorWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockHydrateSyntaxHighlightingWorker = jest.fn<(...args: any[]) => Promise<any>>()

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

const LaunchWorkers = await import('../src/parts/LaunchWorkers/LaunchWorkers.ts')

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
