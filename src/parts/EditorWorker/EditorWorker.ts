import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  IpcStates.set('Editor Worker', port2)
  // TODO only launch port and send to renderer worker
  await LaunchEditorWorker.launchEditorWorker(port1)
}
