import { ModuleWorkerRpcParent, ModuleWorkerWithMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as ModuleWorkerState from '../ModuleWorkerState/ModuleWorkerState.ts'

interface RpcWithWorker extends Rpc {
  readonly ipc?: {
    readonly _rawIpc?: Worker
  }
}

type CreateNativeRpc = typeof ModuleWorkerRpcParent.create
type CreateTransferredRpc = typeof ModuleWorkerWithMessagePortRpcParent.create

export const create = async (
  {
    id,
    name,
    port,
    raw,
    rpcId,
    url,
  }: {
    readonly id?: number
    readonly name?: string
    readonly port: MessagePort
    readonly raw?: boolean
    readonly rpcId?: string
    readonly url: string
  },
  createTransferredRpc: CreateTransferredRpc = ModuleWorkerWithMessagePortRpcParent.create,
  createNativeRpc: CreateNativeRpc = ModuleWorkerRpcParent.create,
) => {
  const rpc = (await (rpcId === undefined
    ? createTransferredRpc({
        commandMap: {},
        name,
        port,
        url,
      })
    : createNativeRpc({
        commandMap: {},
        name,
        url,
      }))) as RpcWithWorker
  if (rpcId !== undefined) {
    await rpc.invokeAndTransfer('initialize', 'message-port', port)
    DirectViewRpcRegistry.registerRpc(rpcId, rpc)
  }
  const worker = rpc.ipc?._rawIpc
  if (typeof id === 'number' && raw && worker) {
    ModuleWorkerState.set(id, worker)
  }
  return undefined
}
