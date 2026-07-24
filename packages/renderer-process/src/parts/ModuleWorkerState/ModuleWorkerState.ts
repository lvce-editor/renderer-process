interface DisposableWorker {
  terminate(): void
}

const workers: Record<number, DisposableWorker | undefined> = Object.create(null)

export const set = (id: number, worker: DisposableWorker): void => {
  workers[id] = worker
}

export const remove = (id: number): DisposableWorker | undefined => {
  const worker = workers[id]
  delete workers[id]
  return worker
}

export const clear = (): void => {
  for (const id of Object.keys(workers)) {
    delete workers[Number(id)]
  }
}
