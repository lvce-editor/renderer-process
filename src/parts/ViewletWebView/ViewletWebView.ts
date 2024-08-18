export * as Events from './ViewletWebViewEvents.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'

// TODO could use browser view when running in electron
export const setIframe = (state, src, sandbox = []) => {
  if (!src) {
    return
  }
  const { $Viewlet } = state
  const $Parent = $Viewlet.querySelector('.WebViewWrapper')
  const $Iframe = document.createElement('iframe')
  for (const element of sandbox) {
    $Iframe.sandbox.add(element)
  }
  $Iframe.className = 'E2eTestIframe WebViewIframe'
  $Iframe.src = src
  $Parent.append($Iframe)
  state.frame = $Iframe
}

export const setPort = (state, portId, origin) => {
  const port = Transferrable.acquire(portId)
  const { frame } = state
  frame.addEventListener('load', () => {
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
  })
}
