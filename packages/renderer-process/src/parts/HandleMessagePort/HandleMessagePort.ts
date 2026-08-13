import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import * as Viewlet from '../Viewlet/Viewlet.ts'

export const handleMessagePort = async (port: MessagePort) => {
  await PlainMessagePortRpcParent.create({
    commandMap: {
      'Viewlet.queueCommands': Viewlet.queueCommands,
    },
    messagePort: port,
  })
}
