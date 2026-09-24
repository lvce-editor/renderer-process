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
