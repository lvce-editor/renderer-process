interface PendingViewletCommandBatch {
  readonly commands: readonly (readonly unknown[])[]
  committed: boolean
  readonly uid: number
}

const pendingBatches = new Map<number, PendingViewletCommandBatch>()
const state = {
  nextTransactionId: 1,
}

export const queue = (uid: number, commands: readonly (readonly unknown[])[]): number => {
  const transactionId = state.nextTransactionId++
  pendingBatches.set(transactionId, { commands, committed: false, uid })
  return transactionId
}

export const take = (uid: number, transactionId: number): readonly (readonly unknown[])[] => {
  const batch = pendingBatches.get(transactionId)
  if (!batch) {
    throw new Error(`pending viewlet command transaction not found: ${transactionId}`)
  }
  if (batch.uid !== uid) {
    throw new Error(`pending viewlet command transaction ${transactionId} belongs to ${batch.uid}, not ${uid}`)
  }
  batch.committed = true
  const commands: (readonly unknown[])[] = []
  for (const [pendingTransactionId, pendingBatch] of pendingBatches) {
    if (pendingBatch.uid !== uid) {
      continue
    }
    if (!pendingBatch.committed) {
      break
    }
    commands.push(...pendingBatch.commands)
    pendingBatches.delete(pendingTransactionId)
  }
  return commands
}

export const clear = (): void => {
  pendingBatches.clear()
  state.nextTransactionId = 1
}
