import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const sendEditorWorker = (method: string, ...params: any[]) => {
  const ipc = IpcStates.get('Editor Worker raw')
  JsonRpc.send(ipc, method, ...params)
}
