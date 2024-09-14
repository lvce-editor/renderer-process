import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchExtensionHostWorker from '../LaunchExtensionHostWorker/LaunchExtensionHostWorker.ts'

export const hydrate = async () => {
  // TODO only launch port and send to renderer worker
  const ipc = await LaunchExtensionHostWorker.launchExtensionHostWorker()
  IpcStates.set('Extension Host Worker', ipc)
}
