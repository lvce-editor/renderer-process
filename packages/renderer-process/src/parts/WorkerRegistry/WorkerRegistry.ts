interface WorkerHandle {
  readonly name?: string
  terminate(): void
}

export interface TrackedWorker {
  readonly id: string
  readonly name: string
  readonly runtimeName: string
}

const workers = new Map<WorkerHandle, TrackedWorker>()
const state = { generation: 0, nextId: 0 }

export const getGeneration = (): number => state.generation

export const createRuntimeName = (name: string): TrackedWorker => {
  state.nextId++
  const id = `worker-${state.nextId}`
  return {
    id,
    name,
    // Platform detection in workers relies on a trailing (Electron) or (Web).
    runtimeName: `[${id}] ${name}`,
  }
}

export const track = (worker: WorkerHandle, startedIn = state.generation, trackedWorker?: TrackedWorker): void => {
  if (startedIn !== state.generation) {
    worker.terminate()
    throw new Error('Worker launch canceled by application restart')
  }
  if (workers.has(worker)) {
    return
  }
  const metadata = trackedWorker || createRuntimeName(worker.name || 'Worker')
  workers.set(worker, metadata)
}

export const remove = (worker: WorkerHandle): void => {
  workers.delete(worker)
}

export const terminate = (id: string): boolean => {
  for (const [worker, metadata] of workers) {
    if (metadata.id !== id) continue
    // The Workers view owns this worker. Keep it alive so it can finish the RPC
    // that requested termination and refresh the list.
    if (metadata.name === 'Workers View Worker') return false
    workers.delete(worker)
    worker.terminate()
    return true
  }
  return false
}

export const getWorkers = (): readonly TrackedWorker[] => workers.values().toArray()

export const terminateAll = (): void => {
  state.generation++
  const retiring = workers.keys().toArray()
  workers.clear()
  for (const worker of retiring) {
    worker.terminate()
  }
}

export const getCount = (): number => workers.size

export const trackRpc = (rpc: unknown, generation: number, trackedWorker?: TrackedWorker): void => {
  const worker = (rpc as { ipc?: { _rawIpc?: WorkerHandle } }).ipc?._rawIpc
  if (worker) track(worker, generation, trackedWorker)
}
