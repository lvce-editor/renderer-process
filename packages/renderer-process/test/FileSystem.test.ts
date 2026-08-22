import { expect, jest, test } from '@jest/globals'

const mockInvoke = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  invoke: mockInvoke,
}))

const FileSystem = await import('../src/parts/FileSystem/FileSystem.ts')

test('writeFile forwards to the renderer worker', async () => {
  mockInvoke.mockResolvedValue(undefined)

  await FileSystem.writeFile('memfs:///test.txt', 'test content')

  expect(mockInvoke).toHaveBeenCalledWith('FileSystem.writeFile', 'memfs:///test.txt', 'test content')
})
