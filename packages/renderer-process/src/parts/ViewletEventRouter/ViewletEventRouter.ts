import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const executeViewletCommand = 'Viewlet.executeViewletCommand'

export const send = (method: string, uid: number, ...args: readonly any[]): void => {
  // Editor shortcuts still execute through renderer-worker. Keep their input
  // events on the same port so typing cannot overtake a preceding shortcut.
  if (method === executeViewletCommand && DirectViewRpcRegistry.getRpcId(uid) !== 'Editor') {
    const rpc = DirectViewRpcRegistry.get(uid)
    if (rpc) {
      rpc.send(method, uid, ...args)
      return
    }
  }
  RendererWorker.send(method, uid, ...args)
}
