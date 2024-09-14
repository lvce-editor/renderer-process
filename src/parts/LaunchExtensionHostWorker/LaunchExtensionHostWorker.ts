import * as ExtensionHostWorkerUrl from '../ExtensionHostWorkerUrl/ExtensionHostWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const launchExtensionHostWorker = async (port: MessagePort) => {
  const ipc = await IpcParent.create({
    name: 'Extension Host Worker',
    url: ExtensionHostWorkerUrl.extensionHostWorkerUrl,
    method: IpcParentType.ModuleWorkerWithMessagePort,
    port,
  })
  return ipc
}
