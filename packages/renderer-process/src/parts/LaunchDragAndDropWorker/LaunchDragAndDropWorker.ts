import * as WorkerRegistry from '../WorkerRegistry/WorkerRegistry.ts'
import { ModuleWorkerWithMessagePortRpcParent, PlainMessagePortRpc, type Rpc } from '@lvce-editor/rpc'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as DragAndDropWorkerUrl from '../DragAndDropWorkerUrl/DragAndDropWorkerUrl.ts'
import * as Result from '../Result/Result.ts'

export const launchDragAndDropWorker = async (): Promise<Result.Result<Rpc>> => {
  const generation = WorkerRegistry.getGeneration()
  const trackedWorker = WorkerRegistry.createRuntimeName('Drag And Drop Worker')
  try {
    const { port1, port2 } = new MessageChannel()
    const workerRpc = await ModuleWorkerWithMessagePortRpcParent.create({
      commandMap: {},
      name: trackedWorker.runtimeName,
      port: port1,
      url: DragAndDropWorkerUrl.dragAndDropWorkerUrl,
    })
    WorkerRegistry.trackRpc(workerRpc, generation, trackedWorker)
    const rpc = await PlainMessagePortRpc.create({
      commandMap: CommandMapRef.commandMapRef,
      messagePort: port2,
    })
    return Result.success(rpc)
  } catch (error) {
    return Result.error(error)
  }
}
