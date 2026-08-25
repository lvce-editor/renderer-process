interface PendingViewletCommandBatch {
  readonly commands: readonly (readonly unknown[])[]
  readonly uid: number
}

const appliedBatches = new Map<number, number>()
const pendingBatches = new Map<number, PendingViewletCommandBatch>()
const state = {
  nextTransactionId: 1,
}

export const queue = (uid: number, commands: readonly (readonly unknown[])[]): number => {
  const transactionId = state.nextTransactionId++
  pendingBatches.set(transactionId, { commands, uid })
  return transactionId
}

export const take = (uid: number, transactionId: number): readonly (readonly unknown[])[] => {
  const batch = pendingBatches.get(transactionId)
  if (!batch) {
    const appliedUid = appliedBatches.get(transactionId)
    if (appliedUid !== undefined) {
      if (appliedUid !== uid) {
        throw new Error(`pending viewlet command transaction ${transactionId} belongs to ${appliedUid}, not ${uid}`)
      }
      appliedBatches.delete(transactionId)
      return []
    }
    throw new Error(`pending viewlet command transaction not found: ${transactionId}`)
  }
  if (batch.uid !== uid) {
    throw new Error(`pending viewlet command transaction ${transactionId} belongs to ${batch.uid}, not ${uid}`)
  }
  const commands: (readonly unknown[])[] = []
  for (const [pendingTransactionId, pendingBatch] of pendingBatches) {
    if (pendingBatch.uid !== uid) {
      continue
    }
    commands.push(...pendingBatch.commands)
    pendingBatches.delete(pendingTransactionId)
    if (pendingTransactionId === transactionId) {
      break
    }
    appliedBatches.set(pendingTransactionId, uid)
  }
  return commands
}

export const clear = (): void => {
  appliedBatches.clear()
  pendingBatches.clear()
  state.nextTransactionId = 1
}
