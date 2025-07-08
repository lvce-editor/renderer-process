import * as LaunchRendererWorker from '../LaunchRendererWorker/LaunchRendererWorker.ts'

export const state = {
  rpc: undefined,
}

export const hydrate = async () => {
  const rpc = await LaunchRendererWorker.launchRendererWorker()
  // @ts-expect-error
  state.rpc = rpc
}

// TODO needed?
export const dispose = () => {
  if (state.rpc) {
    // @ts-expect-error
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
