import { ModuleWorkerWithMessagePortRpcParent, PlainMessagePortRpc, type Rpc } from '@lvce-editor/rpc'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as DragAndDropWorkerUrl from '../DragAndDropWorkerUrl/DragAndDropWorkerUrl.ts'
import * as Result from '../Result/Result.ts'

export const launchDragAndDropWorker = async (): Promise<Result.Result<Rpc>> => {
  try {
    const { port1, port2 } = new MessageChannel()
    await ModuleWorkerWithMessagePortRpcParent.create({
      commandMap: {},
      name: 'Drag And Drop Worker',
      port: port1,
      url: DragAndDropWorkerUrl.dragAndDropWorkerUrl,
    })
    const rpc = await PlainMessagePortRpc.create({
      commandMap: CommandMapRef.commandMapRef,
      messagePort: port2,
    })
    return Result.success(rpc)
  } catch (error) {
    return Result.error(error)
  }
}
