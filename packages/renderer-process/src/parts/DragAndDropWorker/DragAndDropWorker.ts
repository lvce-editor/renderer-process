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
    throw new Error('Drag And Drop Worker is not initialized')
  }
  await state.rpc.invokeAndTransfer('DragAndDrop.handleMessagePort', port)
}
