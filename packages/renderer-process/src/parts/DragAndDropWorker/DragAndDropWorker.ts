import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchDragAndDropWorker from '../LaunchDragAndDropWorker/LaunchDragAndDropWorker.ts'
import * as Result from '../Result/Result.ts'

export const state: { rpc: Rpc | undefined } = {
  rpc: undefined,
}

export const hydrate = async (): Promise<Result.Result<void>> => {
  const result = await LaunchDragAndDropWorker.launchDragAndDropWorker()
  if (Result.isError(result)) {
    state.rpc = undefined
    return result
  }
  state.rpc = result.value
  return Result.success(undefined)
}

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  if (!state.rpc) {
    const result = await hydrate()
    if (Result.isError(result)) {
      throw result.error
    }
  }
  const rpc = state.rpc
  if (!rpc) {
    throw new Error('Drag And Drop Worker failed to initialize')
  }
  await rpc.invokeAndTransfer('DragAndDrop.handleMessagePort', port)
}
