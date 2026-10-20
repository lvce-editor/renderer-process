const pendingInputs = new Set<Promise<void>>()
const state: { shortcut: Promise<void> | undefined } = { shortcut: undefined }

export const hasPending = (): boolean => Boolean(state.shortcut || pendingInputs.size > 0)

const settle = async (result: Promise<void>): Promise<void> => {
  try {
    await result
  } catch {
    // The caller reports failures; later input must still be allowed to run.
  }
}

const removeInput = async (settled: Promise<void>): Promise<void> => {
  await settled
  pendingInputs.delete(settled)
}

const runAfterShortcut = async (previous: Promise<void> | undefined, run: () => Promise<void>): Promise<void> => {
  if (previous) await previous
  await run()
}

export const runInput = (run: () => Promise<void>): Promise<void> => {
  // Inputs in the same burst run concurrently so the worker can coalesce renders.
  const result = runAfterShortcut(state.shortcut, run)
  const settled = settle(result)
  pendingInputs.add(settled)
  void removeInput(settled)
  return result
}

const runAfterInputs = async (earlier: readonly Promise<void>[], run: () => Promise<void>): Promise<void> => {
  await Promise.all(earlier)
  await run()
}

const clearShortcut = async (settled: Promise<void>): Promise<void> => {
  await settled
  if (state.shortcut === settled) state.shortcut = undefined
}

export const runShortcut = (run: () => Promise<void>): Promise<void> => {
  // Snapshot only earlier input; later input waits for this shortcut instead.
  const earlier = [...pendingInputs]
  if (state.shortcut) earlier.push(state.shortcut)
  const result = runAfterInputs(earlier, run)
  const settled = settle(result)
  state.shortcut = settled
  void clearShortcut(settled)
  return result
}
