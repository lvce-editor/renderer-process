import type { Rpc } from '@lvce-editor/rpc'
import { ModuleWorkerRpcParent } from '@lvce-editor/rpc'
import { commandMapRef } from '../CommandMapRef/CommandMapRef.ts'

export const launchWorker = async ({ name, url }): Promise<Rpc> => {
  const rpc = await ModuleWorkerRpcParent.create({
    url,
    name,
    commandMap: commandMapRef,
  })
  return rpc
}
