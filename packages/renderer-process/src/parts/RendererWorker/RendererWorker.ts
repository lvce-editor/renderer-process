import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchRendererWorker from '../LaunchRendererWorker/LaunchRendererWorker.ts'
import * as RendererWorkerTrace from '../RendererWorkerTrace/RendererWorkerTrace.ts'
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
  RendererWorkerTrace.listen(result.value)
  return Result.success(undefined)
}

// TODO needed?
export const dispose = () => {
  if (state.rpc) {
    state.rpc.dispose()
  }
}

export const send = (method, ...params) => {
  RendererWorkerTrace.record('sent', method, params)
  // @ts-ignore
  state.rpc.send(method, ...params)
}

export const invoke = (method, ...params) => {
  RendererWorkerTrace.record('sent', method, params)
  // @ts-ignore
  return state.rpc.invoke(method, ...params)
}

export const sendAndTransfer = (message) => {
  if (Array.isArray(message) && typeof message[0] === 'string') {
    RendererWorkerTrace.record('sent', message[0], message.slice(1))
  }
  // @ts-expect-error
  state.rpc.sendAndTransfer(message)
}

export const invokeAndTransfer = (method, ...params) => {
  RendererWorkerTrace.record('sent', method, params)
  // @ts-ignore
  return state.rpc.invokeAndTransfer(method, ...params)
}
