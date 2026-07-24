import { ModuleWorkerWithMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import * as ModuleWorkerState from '../ModuleWorkerState/ModuleWorkerState.ts'

interface RpcWithWorker extends Rpc {
  readonly ipc?: {
    readonly _rawIpc?: Worker
  }
}

type CreateRpc = typeof ModuleWorkerWithMessagePortRpcParent.create

export const create = async (
  {
    id,
    name,
    port,
    raw,
    url,
  }: { readonly id?: number; readonly name?: string; readonly port: MessagePort; readonly raw?: boolean; readonly url: string },
  createRpc: CreateRpc = ModuleWorkerWithMessagePortRpcParent.create,
) => {
  const rpc = (await createRpc({
    commandMap: {},
    name,
    port,
    url,
  })) as RpcWithWorker
  const worker = rpc.ipc?._rawIpc
  if (typeof id === 'number' && raw && worker) {
    ModuleWorkerState.set(id, worker)
  }
  return undefined
}
