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

export const create2 = async (canvasId: any, objectId: any, width: number, height: number) => {
  const canvas = document.createElement('canvas')
  if (width) {
    canvas.width = width
  }
  if (height) {
    canvas.height = height
  }
  const offscreenCanvas = canvas.transferControlToOffscreen()
  canvas.dataset.id = canvasId
  setViewletInstance(canvasId, {
    factory: {},
    state: {
      $Viewlet: canvas,
    },
  })
  await RendererWorker.invokeAndTransfer('Transferrable.transfer', objectId, offscreenCanvas)
}
