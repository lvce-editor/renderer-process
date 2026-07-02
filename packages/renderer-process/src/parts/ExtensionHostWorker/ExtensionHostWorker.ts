import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchExtensionHostWorker from '../LaunchExtensionHostWorker/LaunchExtensionHostWorker.ts'
import * as Result from '../Result/Result.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  // TODO only launch port and send to renderer worker
  const promise = LaunchExtensionHostWorker.launchExtensionHostWorker(port1)
  const name = IsElectron.isElectron ? 'Extension Host (Electron)' : 'Extension Host'
  IpcStates.set(name, port2)
  const result = await promise
  if (Result.isError(result)) {
    IpcStates.remove(name)
    return result
  }
  return Result.success(undefined)
}
