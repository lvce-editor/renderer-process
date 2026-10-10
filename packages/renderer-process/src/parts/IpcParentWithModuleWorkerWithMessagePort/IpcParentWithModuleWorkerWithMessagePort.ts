import * as WorkerRegistry from '../WorkerRegistry/WorkerRegistry.ts'
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
    parentName,
    port,
    raw,
    rpcId,
    url,
  }: {
    readonly id?: number
    readonly name?: string
    readonly parentName?: string
    readonly port: MessagePort
    readonly raw?: boolean
    readonly rpcId?: string
    readonly url: string
  },
  createTransferredRpc: CreateTransferredRpc = ModuleWorkerWithMessagePortRpcParent.create,
  createNativeRpc: CreateNativeRpc = ModuleWorkerRpcParent.create,
) => {
  const generation = WorkerRegistry.getGeneration()
  const trackedWorker = WorkerRegistry.createRuntimeName(name || 'Worker', parentName)
  let rpc: RpcWithWorker
  try {
    rpc = (await (rpcId === undefined
      ? createTransferredRpc({
          commandMap: {},
          name: trackedWorker.runtimeName,
          port,
          url,
        })
      : createNativeRpc({
          commandMap: {},
          name: trackedWorker.runtimeName,
          url,
        }))) as RpcWithWorker
  } catch (error) {
    WorkerRegistry.discard(trackedWorker)
    throw error
  }
  if (rpcId !== undefined) {
    await rpc.invokeAndTransfer('initialize', 'message-port', port)
    DirectViewRpcRegistry.registerRpc(rpcId, rpc)
  }
  const worker = rpc.ipc?._rawIpc
  if (worker) {
    WorkerRegistry.track(worker, generation, trackedWorker)
  } else {
    WorkerRegistry.discard(trackedWorker)
  }
  if (typeof id === 'number' && raw && worker) {
    ModuleWorkerState.set(id, worker)
  }
  return undefined
}
