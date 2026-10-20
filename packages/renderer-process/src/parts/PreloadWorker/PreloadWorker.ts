import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as Result from '../Result/Result.ts'

export const preloadWorker = async (name: string, packageName: string, fileName: string, settingName: string): Promise<Result.Result<void>> => {
  const { port1, port2 } = new MessageChannel()
  const workerUrls = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('workerUrls')
  const url = workerUrls?.[settingName] || `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/${packageName}/dist/${fileName}`
  try {
    const pending = IpcParent.create({
      method: IpcParentType.ModuleWorkerWithMessagePort,
      name,
      parentName: 'Renderer Worker',
      port: port1,
      url,
    })
    // Start creation before caching, so our own request cannot consume this port.
    IpcStates.set(name, port2)
    await pending
    return Result.success(undefined)
  } catch (error) {
    IpcStates.remove(name)
    port1.close()
    port2.close()
    return Result.error(error)
  }
}
