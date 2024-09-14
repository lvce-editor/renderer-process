import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchSyntaxHighlightingWorker from '../LaunchSyntaxHighlightingWorker/LaunchSyntaxHighlightingWorker.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  IpcStates.set('Syntax Highlighting Worker', port2)
  // TODO only launch port and send to renderer worker
  await LaunchSyntaxHighlightingWorker.launchSyntaxHighlightingWorker(port1)
}
