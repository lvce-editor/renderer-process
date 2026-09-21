import * as DragAndDropWorker from '../DragAndDropWorker/DragAndDropWorker.ts'
import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as HotReloadState from '../HotReloadState/HotReloadState.ts'
import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as LaunchWorkers from '../LaunchWorkers/LaunchWorkers.ts'
import * as ModuleWorkerState from '../ModuleWorkerState/ModuleWorkerState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Result from '../Result/Result.ts'
import * as SessionReplay from '../SessionReplay/SessionReplay.ts'
import * as Viewlet from '../Viewlet/Viewlet.ts'
import * as WorkerRegistry from '../WorkerRegistry/WorkerRegistry.ts'

const state = { duration: 0, lastError: '', pending: false }

const waitForReady = async (): Promise<void> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      RendererWorker.invoke('Reload.waitForReady'),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Application restart timed out')), 30_000)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

export const getStatus = () => ({ duration: state.duration, error: state.lastError, pending: state.pending })

const restart = async (): Promise<void> => {
  const started = performance.now()
  try {
    document.documentElement.inert = true
    const snapshot: HotReloadState.Snapshot = await RendererWorker.invoke('Reload.prepareHotReload')
    HotReloadState.set(snapshot)
    await RendererWorker.invoke('Reload.retire')
    await SessionReplay.dispose()
    await RendererWorker.dispose()
    await DragAndDropWorker.dispose()
    WorkerRegistry.terminateAll()
    ModuleWorkerState.clear()
    DirectViewRpcRegistry.clear()
    IpcStates.clear()
    for (const uid of snapshot.uids.toReversed()) {
      Viewlet.dispose(uid)
    }
    const result = await LaunchWorkers.launchWorkers()
    if (Result.isError(result)) throw result.error
    await waitForReady()
    HotReloadState.set(undefined)
    state.duration = performance.now() - started
  } catch (error) {
    state.lastError = error instanceof Error ? error.message : String(error)
    console.error(error)
    // Keep the snapshot available for recovery; never silently discard drafts.
    const snapshot = HotReloadState.get()
    if (snapshot) {
      try {
        for (const [key, value] of Object.entries(snapshot.instances)) {
          localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (storageError) {
        console.error(storageError)
      }
    }
    const recovery = document.createElement('button')
    recovery.textContent = `Application restart failed: ${state.lastError}. Reload window`
    recovery.onclick = () => location.reload()
    document.body.append(recovery)
  } finally {
    document.documentElement.inert = false
    state.pending = false
  }
}

// Reply on the old RPC before retiring it. Awaiting restart from that RPC would
// strand the caller when its worker is terminated.
export const request = (): void => {
  if (state.pending) return
  state.pending = true
  state.lastError = ''
  setTimeout(() => void restart(), 0)
}
