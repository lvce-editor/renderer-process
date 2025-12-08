import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const launchEditorWorker = async (port: MessagePort) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerWithMessagePort,
    name: 'Editor Worker',
    port,
    url: EditorWorkerUrl.editorWorkerUrl,
  })
  return ipc
}
