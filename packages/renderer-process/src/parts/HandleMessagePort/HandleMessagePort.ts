import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'

export const handleMessagePort = async (port: MessagePort) => {
  await PlainMessagePortRpcParent.create({
    messagePort: port,
    commandMap: {},
  })
}
