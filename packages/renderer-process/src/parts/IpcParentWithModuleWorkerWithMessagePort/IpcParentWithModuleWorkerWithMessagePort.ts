import { ModuleWorkerWithMessagePortRpcParent } from '@lvce-editor/rpc'

// TODO add test
export const create = async ({ url, name, port }) => {
  await ModuleWorkerWithMessagePortRpcParent.create({
    url,
    name,
    commandMap: {},
    port,
  })
  return undefined
}
