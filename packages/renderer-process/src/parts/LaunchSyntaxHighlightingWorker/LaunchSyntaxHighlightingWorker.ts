import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.ts'

export const launchSyntaxHighlightingWorker = async (port: MessagePort) => {
  const ipc = await IpcParent.create({
    name: 'Syntax Highlighting Worker',
    url: SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl,
    method: IpcParentType.ModuleWorkerWithMessagePort,
    port,
  })
  return ipc
}
