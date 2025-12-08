import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.ts'
import * as IpcParentWithMessagePort from '../IpcParentWithMessagePort/IpcParentWithMessagePort.ts'
import * as IpcParentWithReferencePort from '../IpcParentWithReferencePort/IpcParentWithReferencePort.ts'
import * as IpcParentWithModuleWorkerWithMessagePort from '../IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.ts'
import * as IpcParentWithElectron from '../IpcParentWithElectron/IpcParentWithElectron.ts'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.Electron:
      return IpcParentWithElectron
    case IpcParentType.MessagePort:
      return IpcParentWithMessagePort
    case IpcParentType.ModuleWorker:
      return IpcParentWithModuleWorker
    case IpcParentType.ModuleWorkerWithMessagePort:
      return IpcParentWithModuleWorkerWithMessagePort
    case IpcParentType.ReferencePort:
      return IpcParentWithReferencePort
    default:
      throw new Error('unexpected ipc type')
  }
}
