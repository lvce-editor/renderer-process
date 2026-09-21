interface WorkerHandle {
  terminate(): void
}

const workers = new Set<WorkerHandle>()
const state = { generation: 0 }

export const getGeneration = (): number => state.generation

export const track = (worker: WorkerHandle, startedIn = state.generation): void => {
  if (startedIn !== state.generation) {
    worker.terminate()
    throw new Error('Worker launch canceled by application restart')
  }
  workers.add(worker)
}

export const remove = (worker: WorkerHandle): void => {
  workers.delete(worker)
}

export const terminateAll = (): void => {
  state.generation++
  const retiring = [...workers]
  workers.clear()
  for (const worker of retiring) {
    worker.terminate()
  }
}

export const getCount = (): number => workers.size

export const trackRpc = (rpc: unknown, generation: number): void => {
  const worker = (rpc as { ipc?: { _rawIpc?: WorkerHandle } }).ipc?._rawIpc
  if (worker) track(worker, generation)
}
