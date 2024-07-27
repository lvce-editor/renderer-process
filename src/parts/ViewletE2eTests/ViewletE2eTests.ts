export * as Events from './ViewletE2eTestsEvents.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as SendToIframe from '../SendToIframe/SendToIframe.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'

const handleLoad = (event) => {
  console.log(event.target.src)
  RendererWorker.send('E2eTests.handleLoad')
}

export const setIframe = (state, src, sandbox = []) => {
  if (!src) {
    return
  }
  const $ExistingIframe = document.querySelector('.E2eTestsIframe')
  if ($ExistingIframe) {
    $ExistingIframe.remove()
  }
  const $Iframe = document.createElement('iframe')

  for (const element of sandbox) {
    $Iframe.sandbox.add(element)
  }
  $Iframe.className = 'E2eTestsIframe'
  $Iframe.src = src
  console.log({ src })
  $Iframe.addEventListener('load', handleLoad, {
    once: true,
  })
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
