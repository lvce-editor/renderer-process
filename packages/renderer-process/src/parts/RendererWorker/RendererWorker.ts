import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchRendererWorker from '../LaunchRendererWorker/LaunchRendererWorker.ts'
import * as Result from '../Result/Result.ts'

export const state: { rpc: Rpc | undefined } = {
  rpc: undefined,
}

export const hydrate = async () => {
  const result = await LaunchRendererWorker.launchRendererWorker()
  if (Result.isError(result)) {
    state.rpc = undefined
    return result
  }
  state.rpc = result.value
  return Result.success(undefined)
}

// TODO needed?
export const dispose = () => {
  if (state.rpc) {
    state.rpc.dispose()
  }
}

export const send = (method, ...params) => {
  // @ts-ignore
  state.rpc.send(method, ...params)
}

export const invoke = (method, ...params) => {
  // @ts-ignore
  return state.rpc.invoke(method, ...params)
}

export const sendAndTransfer = (message) => {
  // @ts-expect-error
  state.rpc.sendAndTransfer(message)
}

export const invokeAndTransfer = (method, ...params) => {
  // @ts-ignore
  return state.rpc.invokeAndTransfer(method, ...params)
}
