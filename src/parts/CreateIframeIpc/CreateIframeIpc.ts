const getTransfer = (message: any) => {
  const transfer: any[] = []
  for (const param of message.params) {
    if (param instanceof MessagePort) {
      transfer.push(param)
    }
  }
  return transfer
}

export const createIframeIpc = ($Iframe: HTMLIFrameElement, origin: string) => {
  // TODO use jsonrpc invoke
  const { contentWindow } = $Iframe
  if (!contentWindow) {
    throw new Error(`content window not found`)
  }
  const iframeIpc = {
    send(message) {
      contentWindow.postMessage(message, origin)
    },
    sendAndTransfer(message) {
      const transfer = getTransfer(message)
      contentWindow.postMessage(message, origin, transfer)
    },
    addEventListener(type, listener, options) {
      const wrapped = (event) => {
        console.log({ event })
      }
      window.addEventListener('message', wrapped)
    },
  }
  return iframeIpc
}
