import { ElectronWindowRpcClient } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'

// TODO use handleIncomingIpc function
export const create = async ({ port, ipcId }) => {
  Assert.number(ipcId)
  if (!IsElectron.isElectron) {
    throw new Error('Electron api was requested but is not available')
  }
  const rpc = await ElectronWindowRpcClient.create({
    commandMap: {},
    window,
  })
  const webContentsIds = await rpc.invokeAndTransfer('CreateMessagePort.createMessagePort', ipcId, port)
  return webContentsIds
}
