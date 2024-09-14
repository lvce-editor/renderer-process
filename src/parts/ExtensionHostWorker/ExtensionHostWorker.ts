import * as LaunchExtensionHostWorker from '../LaunchExtensionHostWorker/LaunchExtensionHostWorker.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const hydrate = async () => {
  // TODO only launch port and send to renderer worker
  const ipc = await LaunchExtensionHostWorker.launchExtensionHostWorker()
  // @ts-expect-error
  state.ipc = ipc
}
