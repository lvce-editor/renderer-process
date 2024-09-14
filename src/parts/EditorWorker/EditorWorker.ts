import * as LaunchEditorWorker from '../LaunchEditorWorker/LaunchEditorWorker.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const hydrate = async () => {
  // TODO only launch port and send to renderer worker
  const ipc = await LaunchEditorWorker.launchEditorWorker()
  // @ts-expect-error
  state.ipc = ipc
}
