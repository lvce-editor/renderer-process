import * as DirectViewRpcRegistry from '../DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const executeViewletCommand = 'Viewlet.executeViewletCommand'

export const send = (method: string, uid: number, ...args: readonly any[]): void => {
  if (method === executeViewletCommand) {
    const rpc = DirectViewRpcRegistry.get(uid)
    if (rpc) {
      rpc.send(method, uid, ...args)
      return
    }
  }
  RendererWorker.send(method, uid, ...args)
}
