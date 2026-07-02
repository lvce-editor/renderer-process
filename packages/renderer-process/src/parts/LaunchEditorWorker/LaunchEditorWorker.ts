import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as Result from '../Result/Result.ts'

export const launchEditorWorker = async (port: MessagePort): Promise<Result.Result<void>> => {
  try {
    await IpcParent.create({
      method: IpcParentType.ModuleWorkerWithMessagePort,
      name: 'Editor Worker',
      port,
      url: EditorWorkerUrl.editorWorkerUrl,
    })
    return Result.success(undefined)
  } catch (error) {
    return Result.error(error)
  }
}
