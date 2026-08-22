import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCreateWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockCreateRpc = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  ModuleWorkerWithMessagePortRpcParent: {
    create: mockCreateWorker,
  },
  PlainMessagePortRpc: {
    create: mockCreateRpc,
  },
}))

const { launchDragAndDropWorker } = await import('../src/parts/LaunchDragAndDropWorker/LaunchDragAndDropWorker.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('launches the drag and drop worker from the renderer process', async () => {
  const rpc = { invoke: jest.fn() }
  mockCreateWorker.mockResolvedValue({})
  mockCreateRpc.mockResolvedValue(rpc)

  await expect(launchDragAndDropWorker()).resolves.toEqual({ ok: true, value: rpc })
  expect(mockCreateWorker).toHaveBeenCalledWith({
    commandMap: {},
    name: 'Drag And Drop Worker',
    port: expect.any(MessagePort),
    url: expect.stringContaining('/@lvce-editor/drag-and-drop-worker/dist/dragAndDropWorkerMain.js'),
  })
  expect(mockCreateRpc).toHaveBeenCalledWith({
    commandMap: expect.any(Object),
    messagePort: expect.any(MessagePort),
  })
})

test('returns an error when launching the worker fails', async () => {
  const error = new Error('Worker Launch Error')
  mockCreateWorker.mockRejectedValue(error)

  await expect(launchDragAndDropWorker()).resolves.toEqual({ error, ok: false })
  expect(mockCreateRpc).not.toHaveBeenCalled()
})
