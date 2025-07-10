import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.ts'
import * as IpcParentWithMessagePort from '../IpcParentWithMessagePort/IpcParentWithMessagePort.ts'
import * as IpcParentWithReferencePort from '../IpcParentWithReferencePort/IpcParentWithReferencePort.ts'
import * as IpcParentWithModuleWorkerWithMessagePort from '../IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.ts'
import * as IpcParentWithElectron from '../IpcParentWithElectron/IpcParentWithElectron.ts'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.ModuleWorker:
      return IpcParentWithModuleWorker
    case IpcParentType.MessagePort:
      return IpcParentWithMessagePort
    case IpcParentType.ReferencePort:
      return IpcParentWithReferencePort
    case IpcParentType.ModuleWorkerWithMessagePort:
      return IpcParentWithModuleWorkerWithMessagePort
    case IpcParentType.Electron:
      return IpcParentWithElectron
    default:
      throw new Error('unexpected ipc type')
  }
}
