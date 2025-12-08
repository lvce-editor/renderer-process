import { IpcChildWithModuleWorker, IpcChildWithModuleWorkerAndMessagePort, IpcChildWithMessagePort } from '@lvce-editor/ipc'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return IpcChildWithMessagePort
    case IpcChildType.ModuleWorker:
      return IpcChildWithModuleWorker
    case IpcChildType.ModuleWorkerAndMessagePort:
      return IpcChildWithModuleWorkerAndMessagePort
    default:
      throw new Error('unexpected ipc type')
  }
}
