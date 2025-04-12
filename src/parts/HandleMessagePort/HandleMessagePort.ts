import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const handleMessagePort = async (port: MessagePort) => {
  const ipc = await IpcChild.listen({
    method: IpcChildType.MessagePort,
    port,
  })
  HandleIpc.handleIpc(ipc)
}
