import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchExtensionHostWorker from '../LaunchExtensionHostWorker/LaunchExtensionHostWorker.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  // TODO only launch port and send to renderer worker
  const promise = LaunchExtensionHostWorker.launchExtensionHostWorker(port1)
  const name = IsElectron.isElectron ? 'Extension Host (Electron)' : 'Extension Host'
  IpcStates.set(name, port2)
  await promise
}
