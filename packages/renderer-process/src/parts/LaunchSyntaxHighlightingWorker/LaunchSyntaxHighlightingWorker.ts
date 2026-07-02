import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as Result from '../Result/Result.ts'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.ts'

export const launchSyntaxHighlightingWorker = async (port: MessagePort): Promise<Result.Result<void>> => {
  try {
    await IpcParent.create({
      method: IpcParentType.ModuleWorkerWithMessagePort,
      name: 'Syntax Highlighting Worker',
      port,
      url: SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl,
    })
    return Result.success(undefined)
  } catch (error) {
    return Result.error(error)
  }
}
