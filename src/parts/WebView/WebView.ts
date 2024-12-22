import * as SetIframeCredentialless from '../SetIframeCredentialless/SetIframeCredentialless.ts'
import * as SetIframeCsp from '../SetIframeCsp/SetIframeCsp.ts'
import * as SetIframePermissionPolicy from '../SetIframePermissionPolicy/SetIframePermissionPolicy.ts'
import * as SetIframeSandBox from '../SetIframeSandBox/SetIframeSandBox.ts'
import * as SetIframeSrc from '../SetIframeSrc/SetIframeSrc.ts'
import * as WaitForFrameToLoad from '../WaitForFrameToLoad/WaitForFrameToLoad.ts'
import * as WebViewState from '../WebViewState/WebViewState.ts'

// TODO could use browser view when running in electron
export const create = async (
  uid: number,
  src: string,
  sandbox: readonly string[],
  csp: string,
  credentialless: boolean,
  permissionPolicy: string,
  title: string,
) => {
  const $Iframe = document.createElement('iframe')
  SetIframeCredentialless.setIframeCredentialless($Iframe, credentialless)
  SetIframeCsp.setIframeCsp($Iframe, csp)
  SetIframeSandBox.setIframeSandBox($Iframe, sandbox)
  SetIframeSrc.setIframeSrc($Iframe, src)
  SetIframePermissionPolicy.set($Iframe, permissionPolicy)
  // TODO set classname from iframe worker
  $Iframe.className = 'E2eTestIframe WebViewIframe'
  if (title) {
    $Iframe.title = title
  }
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
export const setPort = (uid: number, port: MessagePort, origin: string, portType?: any) => {
  const $Iframe = WebViewState.get(uid)
  // TODO use jsonrpc invoke
  const { contentWindow } = $Iframe
  if (!contentWindow) {
    throw new Error(`content window not found`)
  }
  contentWindow.postMessage(
    {
      jsonrpc: '2.0',
      method: 'setPort',
      params: [port, portType],
    },
    origin,
    [port],
  )
}

export const dispose = (uid: number): void => {
  const $Iframe = WebViewState.get(uid)
  $Iframe.remove()
  WebViewState.remove(uid)
}
