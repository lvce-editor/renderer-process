import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchExtensionHostWorker from '../LaunchExtensionHostWorker/LaunchExtensionHostWorker.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  IpcStates.set('Extension Host Worker', port2)
  // TODO only launch port and send to renderer worker
  await LaunchExtensionHostWorker.launchExtensionHostWorker(port1)
}
