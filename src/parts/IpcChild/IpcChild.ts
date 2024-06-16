import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...options }) => {
  const module = await IpcChildModule.getModule(method)
  const rawIpc = await module.listen(options)
  if (module.signal) {
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
