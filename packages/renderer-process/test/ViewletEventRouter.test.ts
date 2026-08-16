import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Rpc } from '@lvce-editor/rpc'

const rendererWorkerSend = jest.fn()

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  send: rendererWorkerSend,
}))

const DirectViewRpcRegistry = await import('../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts')
const ViewletEventRouter = await import('../src/parts/ViewletEventRouter/ViewletEventRouter.ts')

const createRpc = (): Rpc =>
  ({
    dispose: jest.fn(),
    send: jest.fn(),
  }) as unknown as Rpc

beforeEach(() => {
  DirectViewRpcRegistry.clear()
  rendererWorkerSend.mockClear()
})

test('routes a viewlet event directly to its worker', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', rpc)
  DirectViewRpcRegistry.registerView(42, 'Panel')

  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleClick', 3)

  expect(rpc.send).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleClick', 3)
  expect(rendererWorkerSend).not.toHaveBeenCalled()
})

test('routes an event without a direct worker to the renderer worker', () => {
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleClick', 3)

  expect(rendererWorkerSend).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleClick', 3)
})

test('routes other renderer messages to the renderer worker', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', rpc)
  DirectViewRpcRegistry.registerView(42, 'Panel')

  ViewletEventRouter.send('Other.command', 42, 'value')

  expect(rendererWorkerSend).toHaveBeenCalledWith('Other.command', 42, 'value')
  expect(rpc.send).not.toHaveBeenCalled()
})
