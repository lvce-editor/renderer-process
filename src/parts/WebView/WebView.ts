import * as SetIframeCredentialless from '../SetIframeCredentialless/SetIframeCredentialless.ts'
import * as SetIframeCsp from '../SetIframeCsp/SetIframeCsp.ts'
import * as SetIframeSandBox from '../SetIframeSandBox/SetIframeSandBox.ts'
import * as SetIframeSrc from '../SetIframeSrc/SetIframeSrc.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'
import * as WaitForFrameToLoad from '../WaitForFrameToLoad/WaitForFrameToLoad.ts'
import * as WebViewState from '../WebViewState/WebViewState.ts'

// TODO could use browser view when running in electron
export const create = async (uid, src, sandbox = [], srcDoc = '', csp = '', credentialless = true) => {
  if (!src && !srcDoc) {
    return
  }
  const $Iframe = document.createElement('iframe')
  SetIframeCredentialless.setIframeCredentialless($Iframe, credentialless)
  SetIframeCsp.setIframeCsp($Iframe, csp)
  SetIframeSandBox.setIframeSandBox($Iframe, sandbox)
  SetIframeSrc.setIframeSrc($Iframe, src, srcDoc)
  $Iframe.className = 'E2eTestIframe WebViewIframe'
  WebViewState.set(uid, $Iframe)
  // TODO make make waitForFrameToLoad a separate command
  await WaitForFrameToLoad.waitForFrameToLoad($Iframe)
}

// TODO rename to sendMessage
export const setPort = (state, portId, origin) => {
  const port = Transferrable.acquire(portId)
  const { frame } = state
  // TODO wait for load in renderer worker
  // TODO avoid closure
  // TODO use jsonrpc invoke
  const { contentWindow } = frame
  contentWindow.postMessage(
    {
      jsonrpc: '2.0',
      method: 'setPort',
      params: [port],
    },
    origin,
    [port],
  )
}
