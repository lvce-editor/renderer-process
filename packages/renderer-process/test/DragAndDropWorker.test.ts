import { beforeEach, expect, jest, test } from '@jest/globals'

const mockLaunchDragAndDropWorker = jest.fn<(...args: any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/LaunchDragAndDropWorker/LaunchDragAndDropWorker.ts', () => ({
  launchDragAndDropWorker: mockLaunchDragAndDropWorker,
}))

const DragAndDropWorker = await import('../src/parts/DragAndDropWorker/DragAndDropWorker.ts')

beforeEach(() => {
  jest.resetAllMocks()
  DragAndDropWorker.state.rpc = undefined
})

test('hydrate stores the direct worker rpc', async () => {
  const rpc = {
    invokeAndTransfer: jest.fn(async () => {}),
  }
  mockLaunchDragAndDropWorker.mockResolvedValue({ ok: true, value: rpc })

  await expect(DragAndDropWorker.hydrate()).resolves.toEqual({ ok: true, value: undefined })
  expect(DragAndDropWorker.state.rpc).toBe(rpc)
})

test('hydrate clears the rpc when launch fails', async () => {
  const error = new Error('Failed to launch Drag And Drop Worker')
  DragAndDropWorker.state.rpc = { invokeAndTransfer: jest.fn() } as any
  mockLaunchDragAndDropWorker.mockResolvedValue({ error, ok: false })

  await expect(DragAndDropWorker.hydrate()).resolves.toEqual({ error, ok: false })
  expect(DragAndDropWorker.state.rpc).toBeUndefined()
})

test('handleMessagePort forwards the port to the worker', async () => {
  const port = {} as MessagePort
  const rpc = {
    invokeAndTransfer: jest.fn(async (_method: string, _port: MessagePort) => {}),
  }
  DragAndDropWorker.state.rpc = rpc as any

  await DragAndDropWorker.handleMessagePort(port)

  expect(rpc.invokeAndTransfer).toHaveBeenCalledWith('DragAndDrop.handleMessagePort', port)
})

test('handleMessagePort rejects before the worker is initialized', async () => {
  await expect(DragAndDropWorker.handleMessagePort({} as MessagePort)).rejects.toThrow('Drag And Drop Worker is not initialized')
})
