import * as WebViewState from '../WebViewState/WebViewState.ts'

const objects = Object.create(null)

export const transfer = (transferable, objectId) => {
  objects[objectId] = transferable
}

export const acquire = (objectId) => {
  const value = objects[objectId]
  delete objects[objectId]
  return value
}

// TODO transfer port directly instead of storing
// it for a short time in state
export const transferToWebView = (objectId: number) => {
  const $Iframe = WebViewState.get(1)
  if (!$Iframe) {
    throw new Error(`webview not found`)
  }
  const { contentWindow } = $Iframe
  if (!contentWindow) {
    throw new Error(`missing content window`)
  }
  // TODO use jsonrpc invoke
  // TODO allow specifying transfer origin from renderer worker
  // TODO allow specifing method from renderer worker
  const port = acquire(objectId)
  contentWindow.postMessage(
    {
      jsonrpc: '2.0',
      method: 'handlePort',
      params: [port],
    },
    '*',
    [port],
  )
}
