import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'
import * as Result from '../Result/Result.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  // TODO only launch port and send to renderer worker
  const promise = LaunchEditorWorker.launchEditorWorker(port1)
  IpcStates.set('Editor Worker', port2)
  const result = await promise
  if (Result.isError(result)) {
    IpcStates.remove('Editor Worker')
    return result
  }
  return Result.success(undefined)
}
