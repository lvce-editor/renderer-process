import * as ExtensionHostWorkerUrl from '../ExtensionHostWorkerUrl/ExtensionHostWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'

export const launchExtensionHostWorker = async (port: MessagePort) => {
  const name = IsElectron.isElectron ? 'Extension Host (Electron)' : 'Extension Host'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerWithMessagePort,
    name,
    port,
    url: ExtensionHostWorkerUrl.extensionHostWorkerUrl,
  })
  return ipc
}
