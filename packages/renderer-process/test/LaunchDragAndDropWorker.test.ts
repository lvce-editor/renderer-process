import { expect, jest, test } from '@jest/globals'

const mockLaunchWorker = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/LaunchWorker/LaunchWorker.ts', () => ({
  launchWorker: mockLaunchWorker,
}))

const { launchDragAndDropWorker } = await import('../src/parts/LaunchDragAndDropWorker/LaunchDragAndDropWorker.ts')

test('launches the drag and drop worker from the renderer process', async () => {
  const result = { ok: true, value: {} }
  mockLaunchWorker.mockResolvedValue(result)

  await expect(launchDragAndDropWorker()).resolves.toBe(result)
  expect(mockLaunchWorker).toHaveBeenCalledWith({
    name: 'Drag And Drop Worker',
    url: expect.stringContaining('/@lvce-editor/drag-and-drop-worker/dist/dragAndDropWorkerMain.js'),
  })
})
