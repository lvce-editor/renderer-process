export * as Events from './ViewletE2eTestsEvents.ts'
import * as AttachEventsFunctional from '../AttachEventsFunctional/AttachEventsFunctional.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as SendToIframe from '../SendToIframe/SendToIframe.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'
import * as Events from './ViewletE2eTestsEvents.ts'

export const setIframe = (state, src, sandbox = []) => {
  const $ExistingIframe = document.querySelector('.E2eTestsIframe')
  if ($ExistingIframe) {
    $ExistingIframe.remove()
  }
  const $Iframe = document.createElement('iframe')
  AttachEventsFunctional.attachEventsFunctional($Iframe, {
    [DomEventType.Load]: Events.handleLoad,
  })
  for (const element of sandbox) {
    $Iframe.sandbox.add(element)
  }
  $Iframe.className = 'E2eTestsIframe'
  $Iframe.src = src
  document.body.append($Iframe)
}

export const setPort = (state, portId, origin) => {
  const $ExistingIframe = document.querySelector('.E2eTestsIframe')
  if (!$ExistingIframe) {
    throw new Error('no iframe found')
  }
  const port = Transferrable.acquire(portId)
  // @ts-ignore
  const { contentWindow } = $ExistingIframe
  const message = {
    jsonrpc: '2.0',
    method: 'handleIpc',
    params: [port],
  }
  const transfer = [port]
  SendToIframe.sendToIframe(contentWindow, message, origin, transfer)
}
