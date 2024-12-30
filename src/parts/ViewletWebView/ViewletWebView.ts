export * as Events from './ViewletWebViewEvents.ts'
import * as SetIframeCredentialless from '../SetIframeCredentialless/SetIframeCredentialless.ts'
import * as SetIframeCsp from '../SetIframeCsp/SetIframeCsp.ts'
import * as SetIframeSandBox from '../SetIframeSandBox/SetIframeSandBox.ts'
import * as SetIframeSrc from '../SetIframeSrc/SetIframeSrc.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'
import * as WebViewState from '../WebViewState/WebViewState.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'

// TODO could use browser view when running in electron
export const setIframe = (state, src, sandbox = [], srcDoc = '', csp = '', credentialless = true) => {
  if (!src && !srcDoc) {
    return
  }
  const { $Viewlet } = state
  const $Parent = $Viewlet.querySelector('.WebViewWrapper')
  if (!$Parent) {
    throw new Error('webview wrapper not found')
  }
  const $Iframe = document.createElement('iframe')
  SetIframeCredentialless.setIframeCredentialless($Iframe, credentialless)
  SetIframeCsp.setIframeCsp($Iframe, csp)
  SetIframeSandBox.setIframeSandBox($Iframe, sandbox)
  SetIframeSrc.setIframeSrc($Iframe, src, srcDoc)
  $Iframe.className = 'E2eTestIframe WebViewIframe'
  $Parent.append($Iframe)
  state.frame = $Iframe
  WebViewState.set(1, $Iframe)
}

export const setPort = (state, portId, origin) => {
  const port = Transferrable.acquire(portId)
  const { frame } = state
  // TODO wait for load in renderer worker
  // TODO avoid closure
  // TODO use jsonrpc invoke
  const handleLoad = () => {
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
  frame.addEventListener('load', handleLoad, { once: true })
}

export const setPosition = (state, id, x, y, width, height) => {
  const $Iframe = WebViewState.get(id)
  if (!$Iframe) {
    return
  }
  SetBounds.setBounds($Iframe, x, y, width, height)
}
