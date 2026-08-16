import type { Rpc } from '@lvce-editor/rpc'

const rpcs = new Map<string, Rpc>()
const viewRpcIds = new Map<number, string>()

export const clear = (): void => {
  for (const rpc of rpcs.values()) {
    rpc.dispose()
  }
  rpcs.clear()
  viewRpcIds.clear()
}

export const get = (uid: number): Rpc | undefined => {
  const rpcId = viewRpcIds.get(uid)
  return rpcId === undefined ? undefined : rpcs.get(rpcId)
}

export const registerRpc = (rpcId: string, rpc: Rpc): void => {
  const previous = rpcs.get(rpcId)
  if (previous && previous !== rpc) {
    previous.dispose()
  }
  rpcs.set(rpcId, rpc)
}

export const registerView = (uid: number, rpcId: string | undefined): void => {
  if (rpcId === undefined) {
    viewRpcIds.delete(uid)
    return
  }
  viewRpcIds.set(uid, rpcId)
}

export const unregisterView = (uid: number): void => {
  viewRpcIds.delete(uid)
}
