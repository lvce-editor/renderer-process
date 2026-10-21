import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as EditorEventQueue from '../EditorEventQueue/EditorEventQueue.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const executeViewletCommand = 'Viewlet.executeViewletCommand'

export const sendKeyBinding = (identifier: number): void => {
  const uid = document.activeElement ? ComponentUid.get(document.activeElement) : 0
  if (DirectViewRpcRegistry.getRpcId(uid) !== 'Editor' && !EditorEventQueue.hasPending()) {
    RendererWorker.send('KeyBindings.handleKeyBinding', identifier)
    return
  }
  const args = DirectViewRpcRegistry.getRpcId(uid) === 'Editor' ? [identifier, uid] : [identifier]
  void EditorEventQueue.runShortcut(() => RendererWorker.invoke('KeyBindings.handleKeyBinding', ...args)).catch(ErrorHandling.handleError)
}

export const send = (method: string, uid: number, ...args: readonly any[]): void => {
  if (method === executeViewletCommand) {
    const rpc = DirectViewRpcRegistry.get(uid)
    if (rpc) {
      if (DirectViewRpcRegistry.getRpcId(uid) === 'Editor' && args[0] !== 'handleBlur' && args[0] !== 'handleFocus') {
        void EditorEventQueue.runInput(async () => {
          // A shortcut can close an editor while later native events are waiting.
          if (DirectViewRpcRegistry.get(uid) === rpc) await rpc.invoke(method, uid, ...args)
        }).catch(ErrorHandling.handleError)
      } else {
        // Focus lifecycles must complete even while a shortcut moves focus.
        rpc.send(method, uid, ...args)
      }
      return
    }
  }
  RendererWorker.send(method, uid, ...args)
}
