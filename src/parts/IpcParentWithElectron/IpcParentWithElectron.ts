import * as HandleIpcOnce from '../HandleIpcOnce/HandleIpcOnce.ts'
// @ts-ignore
import { IpcChildWithElectronWindow } from '@lvce-editor/ipc'
import * as Assert from '../Assert/Assert.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO use handleIncomingIpc function
export const create = async ({ port, ipcId }) => {
  Assert.number(ipcId)
  if (!IsElectron.isElectron) {
    throw new Error('Electron api was requested but is not available')
  }
  const windowIpc = IpcChildWithElectronWindow.wrap(window)
  HandleIpcOnce.handleIpcOnce(windowIpc)
  const webContentsIds = await JsonRpc.invokeAndTransfer(windowIpc, 'CreateMessagePort.createMessagePort', ipcId, port)
  return webContentsIds
}
