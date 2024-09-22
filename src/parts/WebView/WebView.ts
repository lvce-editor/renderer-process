import * as SetIframeCredentialless from '../SetIframeCredentialless/SetIframeCredentialless.ts'
import * as SetIframeCsp from '../SetIframeCsp/SetIframeCsp.ts'
import * as SetIframeSandBox from '../SetIframeSandBox/SetIframeSandBox.ts'
import * as SetIframeSrc from '../SetIframeSrc/SetIframeSrc.ts'
import * as WaitForFrameToLoad from '../WaitForFrameToLoad/WaitForFrameToLoad.ts'
import * as WebViewState from '../WebViewState/WebViewState.ts'
import * as HandleIpcOnce from '../HandleIpcOnce/HandleIpcOnce.ts'
import * as CreateIframeIpc from '../CreateIframeIpc/CreateIframeIpc.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO could use browser view when running in electron
export const create = async (uid: number, src: string, sandbox: readonly string[], csp: string, credentialless: boolean) => {
  const $Iframe = document.createElement('iframe')
  SetIframeCredentialless.setIframeCredentialless($Iframe, credentialless)
  SetIframeCsp.setIframeCsp($Iframe, csp)
  SetIframeSandBox.setIframeSandBox($Iframe, sandbox)
  SetIframeSrc.setIframeSrc($Iframe, src)
  $Iframe.className = 'E2eTestIframe WebViewIframe'
  WebViewState.set(uid, $Iframe)
  // TODO make make waitForFrameToLoad a separate command
}

export const load = async (uid: number) => {
  const $Iframe = WebViewState.get(uid)
  const promise = WaitForFrameToLoad.waitForFrameToLoad($Iframe)
  const parent = document.getElementById('Workbench') as HTMLElement
  parent.append($Iframe)
  await promise
}

// TODO rename to sendMessage
export const setPort = async (uid: number, port: MessagePort, origin: string) => {
  const $Iframe = WebViewState.get(uid)
  // TODO use jsonrpc invoke
  const iframeIpc = CreateIframeIpc.createIframeIpc($Iframe, origin)
  console.log('before invoke')
  await JsonRpc.invokeAndTransfer(iframeIpc, 'setPort', port)
  console.log('after invoke')
}
