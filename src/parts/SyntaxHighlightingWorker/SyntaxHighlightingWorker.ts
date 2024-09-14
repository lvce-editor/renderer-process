import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchSyntaxHighlightingWorker from '../LaunchSyntaxHighlightingWorker/LaunchSyntaxHighlightingWorker.ts'

export const hydrate = async () => {
  // TODO only launch port and send to renderer worker
  const ipc = await LaunchSyntaxHighlightingWorker.launchSyntaxHighlightingWorker()
  IpcStates.set('Syntax Highlighting Worker', ipc)
}
