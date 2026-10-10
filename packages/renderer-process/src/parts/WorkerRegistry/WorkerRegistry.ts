interface WorkerHandle {
  readonly name?: string
  terminate(): void
}

export interface TrackedWorker {
  readonly id: string
  readonly name: string
  readonly parentId?: string
  readonly runtimeName: string
}

const workers = new Map<WorkerHandle, TrackedWorker>()
const metadataById = new Map<string, TrackedWorker>()
const state = { generation: 0, nextId: 0 }

export const getGeneration = (): number => state.generation

export const createRuntimeName = (name: string, parentName?: string): TrackedWorker => {
  state.nextId++
  const id = `worker-${state.nextId}`
  const runtimeId = `worker-${String(state.nextId).padStart(2, '0')}`
  const parent = parentName
    ? metadataById.values().find((worker) => worker.name === parentName)
    : name === 'Renderer Worker'
      ? undefined
      : metadataById.values().find((worker) => worker.name === 'Renderer Worker')
  const metadata: TrackedWorker = {
    id,
    name,
    ...(parent && { parentId: parent.id }),
    runtimeName: `[${runtimeId}] ${name}`,
  }
  metadataById.set(id, metadata)
  return metadata
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
  metadataById.set(metadata.id, metadata)
  workers.set(worker, metadata)
}

export const remove = (worker: WorkerHandle): void => {
  const metadata = workers.get(worker)
  workers.delete(worker)
  if (metadata) metadataById.delete(metadata.id)
}

export const discard = (metadata: TrackedWorker): void => {
  metadataById.delete(metadata.id)
}

export const terminate = (id: string): boolean => {
  for (const [worker, metadata] of workers) {
    if (metadata.id !== id) continue
    // The Workers view owns this worker. Keep it alive so it can finish the RPC
    // that requested termination and refresh the list.
    if (metadata.name === 'Workers View Worker') return false
    workers.delete(worker)
    metadataById.delete(metadata.id)
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
  metadataById.clear()
  for (const worker of retiring) {
    worker.terminate()
  }
}

export const getCount = (): number => workers.size

export const trackRpc = (rpc: unknown, generation: number, trackedWorker?: TrackedWorker): void => {
  const worker = (rpc as { ipc?: { _rawIpc?: WorkerHandle } }).ipc?._rawIpc
  if (worker) track(worker, generation, trackedWorker)
}
