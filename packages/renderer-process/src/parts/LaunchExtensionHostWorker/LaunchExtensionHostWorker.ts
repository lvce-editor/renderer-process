import * as ExtensionHostWorkerUrl from '../ExtensionHostWorkerUrl/ExtensionHostWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as Result from '../Result/Result.ts'

export const launchExtensionHostWorker = async (port: MessagePort): Promise<Result.Result<void>> => {
  const name = IsElectron.isElectron ? 'Extension Host (Electron)' : 'Extension Host'
  try {
    await IpcParent.create({
      method: IpcParentType.ModuleWorkerWithMessagePort,
      name,
      port,
      url: ExtensionHostWorkerUrl.extensionHostWorkerUrl,
    })
    return Result.success(undefined)
  } catch (error) {
    return Result.error(error)
  }
}
