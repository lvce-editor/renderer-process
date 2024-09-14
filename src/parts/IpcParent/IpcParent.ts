import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as IpcStates from '../IpcStates/IpcStates.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const create = async ({ method, ...options }) => {
  if (ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers && options.name && IpcStates.has(options.name)) {
    if (!options.id) {
      throw new Error('id is required')
    }
    // TODO rename method
    // TODO avoid cyclic dependency
    const port = IpcStates.get(options.name)
    IpcStates.remove(options.name)
    await RendererWorker.invokeAndTransfer('Transferrable.transfer', options.id, port)
    console.log({ x: port, options })
  }
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  return module.create(options)
}
