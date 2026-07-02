import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCreate = jest.fn<(...args: any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.ts', () => {
  return {
    create: mockCreate,
  }
})

const LaunchEditorWorker = await import('../src/parts/LaunchEditorWorker/LaunchEditorWorker.ts')
const LaunchExtensionHostWorker = await import('../src/parts/LaunchExtensionHostWorker/LaunchExtensionHostWorker.ts')
const LaunchSyntaxHighlightingWorker = await import('../src/parts/LaunchSyntaxHighlightingWorker/LaunchSyntaxHighlightingWorker.ts')

test('launchEditorWorker - error result', async () => {
  const error = new Error('Failed to start editor worker')
  mockCreate.mockRejectedValue(error)

  const result = await LaunchEditorWorker.launchEditorWorker({} as MessagePort)

  expect(result).toEqual({
    error,
    ok: false,
  })
})

test('launchSyntaxHighlightingWorker - error result', async () => {
  const error = new Error('Failed to start syntax highlighting worker')
  mockCreate.mockRejectedValue(error)

  const result = await LaunchSyntaxHighlightingWorker.launchSyntaxHighlightingWorker({} as MessagePort)

  expect(result).toEqual({
    error,
    ok: false,
  })
})

test('launchExtensionHostWorker - error result', async () => {
  const error = new Error('Failed to start extension host worker')
  mockCreate.mockRejectedValue(error)

  const result = await LaunchExtensionHostWorker.launchExtensionHostWorker({} as MessagePort)

  expect(result).toEqual({
    error,
    ok: false,
  })
})
