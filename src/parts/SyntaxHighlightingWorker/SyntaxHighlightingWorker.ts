import * as LaunchSyntaxHighlightingWorker from '../LaunchSyntaxHighlightingWorker/LaunchSyntaxHighlightingWorker.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const hydrate = async () => {
  // TODO only launch port and send to renderer worker
  const ipc = await LaunchSyntaxHighlightingWorker.launchSyntaxHighlightingWorker()
  // @ts-expect-error
  state.ipc = ipc
}
