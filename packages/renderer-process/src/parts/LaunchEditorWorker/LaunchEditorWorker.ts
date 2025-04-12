import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const launchEditorWorker = async (port: MessagePort) => {
  const ipc = await IpcParent.create({
    name: 'Editor Worker',
    url: EditorWorkerUrl.editorWorkerUrl,
    method: IpcParentType.ModuleWorkerWithMessagePort,
    port,
  })
  return ipc
}
