import * as CreateIframeIpc from '../CreateIframeIpc/CreateIframeIpc.ts'
import * as HandleIpcOnce from '../HandleIpcOnce/HandleIpcOnce.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const sendMessageToIframe = async ($Iframe: HTMLIFrameElement, origin: string, method: string, ...args: any[]) => {
  // TODO use jsonrpc invoke
  const iframeIpc = CreateIframeIpc.createIframeIpc($Iframe, origin)
  HandleIpcOnce.handleIpcOnce(iframeIpc)
  console.log('before invoke')
  await JsonRpc.invokeAndTransfer(iframeIpc, method, ...args)
  console.log('after invoke')
}
