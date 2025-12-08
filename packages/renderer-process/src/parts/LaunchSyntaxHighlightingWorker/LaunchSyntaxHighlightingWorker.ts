import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.ts'

export const launchSyntaxHighlightingWorker = async (port: MessagePort) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerWithMessagePort,
    name: 'Syntax Highlighting Worker',
    port,
    url: SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl,
  })
  return ipc
}
