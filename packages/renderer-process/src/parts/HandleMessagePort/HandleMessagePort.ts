import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Viewlet from '../Viewlet/Viewlet.ts'

const forwardRendererWorkerCommand = (method: string, ...params: readonly unknown[]): void => {
  RendererWorker.send(method, ...params)
}

export const handleMessagePort = async (port: MessagePort, rpcId?: string): Promise<void> => {
  const rpc = await PlainMessagePortRpcParent.create({
    commandMap: {
      'Viewlet.forwardRendererWorkerCommand': forwardRendererWorkerCommand,
      'Viewlet.queueCommands': Viewlet.queueCommands,
    },
    messagePort: port,
  })
  if (rpcId !== undefined) {
    DirectViewRpcRegistry.registerRpc(rpcId, rpc)
  }
}
