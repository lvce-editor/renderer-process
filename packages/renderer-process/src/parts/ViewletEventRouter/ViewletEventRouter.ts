import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const executeViewletCommand = 'Viewlet.executeViewletCommand'

export const send = (method: string, uid: number, ...args: readonly any[]): void => {
  // Editor shortcuts still execute through renderer-worker. Keep their input
  // events on the same port so typing cannot overtake a preceding shortcut.
  // Blur uses the direct editor handler, whose delayed render preserves the
  // focus of the next editor instead of clearing its keyboard context.
  if (method === executeViewletCommand && (DirectViewRpcRegistry.getRpcId(uid) !== 'Editor' || args[0] === 'handleBlur')) {
    const rpc = DirectViewRpcRegistry.get(uid)
    if (rpc) {
      rpc.send(method, uid, ...args)
      return
    }
  }
  RendererWorker.send(method, uid, ...args)
}
