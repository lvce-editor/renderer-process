import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'
import * as OffscreenCanvasState from '../OffscreenCanvasState/OffscreenCanvasState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const get = (id) => {
  return OffscreenCanvasState.get(id)
}

export const create = (canvasId, callbackId) => {
  const canvas = document.createElement('canvas')
  const offscreenCanvas = canvas.transferControlToOffscreen()
  OffscreenCanvasState.set(canvasId, canvas)
  RendererWorker.sendAndTransfer(
    {
      jsonrpc: JsonRpcVersion.Two,
      id: callbackId,
      params: [offscreenCanvas],
    },
    [offscreenCanvas],
  )
}
