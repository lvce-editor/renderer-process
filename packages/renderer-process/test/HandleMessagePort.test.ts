import { afterEach, expect, jest, test } from '@jest/globals'
import { PlainMessagePortRpc } from '@lvce-editor/rpc'

const rendererWorkerSend = jest.fn()

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  send: rendererWorkerSend,
}))

const DirectViewRpcRegistry = await import('../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts')
const { handleMessagePort } = await import('../src/parts/HandleMessagePort/HandleMessagePort.ts')

afterEach(() => {
  DirectViewRpcRegistry.clear()
  rendererWorkerSend.mockClear()
})

test('forwards a direct worker command to the renderer worker', async () => {
  const { port1, port2 } = new MessageChannel()
  const directWorkerRpc = await PlainMessagePortRpc.create({
    commandMap: {},
    messagePort: port1,
  })
  await handleMessagePort(port2, 'Panel')

  await directWorkerRpc.invoke('Viewlet.forwardRendererWorkerCommand', 'Layout.maximizePanel', 42)

  expect(rendererWorkerSend).toHaveBeenCalledWith('Layout.maximizePanel', 42)
  await directWorkerRpc.dispose()
})
