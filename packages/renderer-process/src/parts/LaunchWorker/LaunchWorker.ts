import * as WorkerRegistry from '../WorkerRegistry/WorkerRegistry.ts'
import type { Rpc } from '@lvce-editor/rpc'
import { ModuleWorkerRpcParent } from '@lvce-editor/rpc'
import { commandMapRef } from '../CommandMapRef/CommandMapRef.ts'
import * as Result from '../Result/Result.ts'

export const launchWorker = async ({ name, url }): Promise<Result.Result<Rpc>> => {
  const generation = WorkerRegistry.getGeneration()
  const trackedWorker = WorkerRegistry.createRuntimeName(name)
  try {
    const rpc = await ModuleWorkerRpcParent.create({
      commandMap: commandMapRef,
      name: trackedWorker.runtimeName,
      url,
    })
    WorkerRegistry.trackRpc(rpc, generation, trackedWorker)
    return Result.success(rpc)
  } catch (error) {
    return Result.error(error)
  }
}
