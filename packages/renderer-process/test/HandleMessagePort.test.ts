import { afterEach, expect, jest, test } from '@jest/globals'
import { PlainMessagePortRpc } from '@lvce-editor/rpc'

const rendererWorkerInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  invoke: rendererWorkerInvoke,
}))

const DirectViewRpcRegistry = await import('../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts')
const { handleMessagePort } = await import('../src/parts/HandleMessagePort/HandleMessagePort.ts')

afterEach(() => {
  DirectViewRpcRegistry.clear()
  rendererWorkerInvoke.mockReset()
})

test('forwards a direct worker command to the renderer worker', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  rendererWorkerInvoke.mockReturnValue(promise)
  const { port1, port2 } = new MessageChannel()
  const directWorkerRpc = await PlainMessagePortRpc.create({
    commandMap: {},
    messagePort: port1,
  })
  await handleMessagePort(port2, 'Panel')

  await directWorkerRpc.invoke('Viewlet.forwardRendererWorkerCommand', 'Layout.maximizePanel', 42)

  expect(rendererWorkerInvoke).toHaveBeenCalledWith('Layout.maximizePanel', 42)
  resolve()
  await directWorkerRpc.dispose()
})
