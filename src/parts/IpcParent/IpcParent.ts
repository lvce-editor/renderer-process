import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as IpcStates from '../IpcStates/IpcStates.ts'

export const create = async ({ method, ...options }) => {
  if (ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers && options.name && IpcStates.has(options.name)) {
    const x = IpcStates.get(options.name)
    console.log({ x, options })
  }
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  return module.create(options)
}
