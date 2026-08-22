import { expect, jest, test } from '@jest/globals'

const mockInvoke = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  invoke: mockInvoke,
}))

const PersistentFileHandle = await import('../src/parts/PersistentFileHandle/PersistentFileHandle.ts')

test('addHandle forwards to the renderer worker', async () => {
  const handle = {} as FileSystemHandle
  mockInvoke.mockResolvedValue(undefined)

  await PersistentFileHandle.addHandle('html:///test.txt', handle)

  expect(mockInvoke).toHaveBeenCalledWith('PersistentFileHandle.addHandle', 'html:///test.txt', handle)
})
