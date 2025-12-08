import { ModuleWorkerWithMessagePortRpcParent } from '@lvce-editor/rpc'

// TODO add test
export const create = async ({ name, port, url }) => {
  await ModuleWorkerWithMessagePortRpcParent.create({
    commandMap: {},
    name,
    port,
    url,
  })
  return undefined
}
