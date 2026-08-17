import type { Rpc } from '@lvce-editor/rpc'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'

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

export const getViewUid = (rpcId: string): number => {
  let matchingUid: number | undefined
  for (const [uid, registeredRpcId] of viewRpcIds) {
    if (registeredRpcId === rpcId) {
      matchingUid = uid
    }
  }
  if (matchingUid === undefined) {
    throw new Error(`direct view not found: ${rpcId}`)
  }
  return matchingUid
}

export const getFocusedViewUid = (rpcId: string, element: Element | null = document.activeElement): number => {
  const uid = element ? ComponentUid.get(element) : 0
  if (!uid || viewRpcIds.get(uid) !== rpcId) {
    throw new Error(`focused direct view not found: ${rpcId}`)
  }
  return uid
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
