export * as Events from './ViewletE2eTestEvents.ts'

// TODO could use browser view when running in electron
export const setIframe = (state, src, sandbox = []) => {
  if (!src) {
    return
  }
  const { $Viewlet } = state
  const $Parent = $Viewlet.querySelector('.E2eTestIframeWrapper')
  const $Iframe = document.createElement('iframe')
  for (const element of sandbox) {
    $Iframe.sandbox.add(element)
  }
  $Iframe.className = 'E2eTestIframe'
  $Iframe.src = src
  $Parent.append($Iframe)
}

export const setPreviewTransform = (state, transform) => {
  const { $Viewlet } = state
  const $Parent = $Viewlet.querySelector('.E2eTestIframeWrapper')
  $Parent.style.transform = transform
}
// export const setPort = (state, portId, origin) => {
//   const $ExistingIframe = document.querySelector('.E2eTestsIframe')
//   if (!$ExistingIframe) {
//     throw new Error('no iframe found')
//   }
//   const port = Transferrable.acquire(portId)
//   // @ts-ignore
//   const { contentWindow } = $ExistingIframe
//   const message = {
//     jsonrpc: '2.0',
//     method: 'handleIpc',
//     params: [port],
//   }
//   const transfer = [port]
//   SendToIframe.sendToIframe(contentWindow, message, origin, transfer)
// }
