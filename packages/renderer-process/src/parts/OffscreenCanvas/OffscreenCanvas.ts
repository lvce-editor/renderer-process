import { setViewletInstance } from '@lvce-editor/virtual-dom'
import * as OffscreenCanvasState from '../OffscreenCanvasState/OffscreenCanvasState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const get = (id) => {
  return OffscreenCanvasState.get(id)
}

export const create = async (canvasId, objectId) => {
  const canvas = document.createElement('canvas')
  const offscreenCanvas = canvas.transferControlToOffscreen()
  OffscreenCanvasState.set(canvasId, canvas)
  await RendererWorker.invokeAndTransfer('Transferrable.transfer', objectId, offscreenCanvas)
}

export const create2 = async (canvasId: any, objectId: any) => {
  const canvas = document.createElement('canvas')
  const offscreenCanvas = canvas.transferControlToOffscreen()
  setViewletInstance(canvasId, {
    factory: {},
    state: {
      $Viewlet: canvas,
    },
  })
  await RendererWorker.invokeAndTransfer('Transferrable.transfer', objectId, offscreenCanvas)
}
