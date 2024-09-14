import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  // TODO only launch port and send to renderer worker
  const promise = LaunchEditorWorker.launchEditorWorker(port1)
  IpcStates.set('Editor Worker', port2)
  await promise
}
