import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as Viewlet from '../Viewlet/Viewlet.ts'

export const handleMessagePort = async (port: MessagePort, rpcId?: string): Promise<void> => {
  const rpc = await PlainMessagePortRpcParent.create({
    commandMap: {
      'Viewlet.queueCommands': Viewlet.queueCommands,
    },
    messagePort: port,
  })
  if (rpcId !== undefined) {
    DirectViewRpcRegistry.registerRpc(rpcId, rpc)
  }
}
