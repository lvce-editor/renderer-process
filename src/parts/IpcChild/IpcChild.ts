import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...options }) => {
  const module = await IpcChildModule.getModule(method)
  const rawIpc = await module.listen(options)
  // @ts-ignore
  if (module.signal) {
    // @ts-ignore
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
