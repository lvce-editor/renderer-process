import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'

export const hydrate = async () => {
  // TODO only launch port and send to renderer worker
  const ipc = await LaunchEditorWorker.launchEditorWorker()
  IpcStates.set('Editor Worker', ipc)
}
