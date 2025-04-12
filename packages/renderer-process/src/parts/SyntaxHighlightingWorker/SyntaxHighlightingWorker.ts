import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchSyntaxHighlightingWorker from '../LaunchSyntaxHighlightingWorker/LaunchSyntaxHighlightingWorker.ts'

export const hydrate = async () => {
  const { port1, port2 } = new MessageChannel()
  // TODO only launch port and send to renderer worker
  const promise = LaunchSyntaxHighlightingWorker.launchSyntaxHighlightingWorker(port1)
  IpcStates.set('Syntax Highlighting Worker', port2)
  await promise
}
