import { setViewletInstance } from '@lvce-editor/virtual-dom'
import { createCanvasPresentation } from '../CreateCanvasPresentation/CreateCanvasPresentation.ts'
import { getIsFirefox } from '../IsFirefox/IsFirefox.ts'
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

export const createForPreview = async (canvasId: number, objectId: number, portId: number, width: number, height: number): Promise<boolean> => {
  if (!getIsFirefox()) {
    await create2(canvasId, objectId, width, height)
    return false
  }
  // Firefox can lose automatic WebGL presentation when a preview canvas is reinserted.
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.dataset.id = String(canvasId)
  const offscreen = new OffscreenCanvas(width, height)
  const presentation = createCanvasPresentation(canvas, () => setViewletInstance(canvasId, undefined))
  // Keep the receiving port reachable until the sandbox disposes this canvas.
  setViewletInstance(canvasId, { factory: {}, state: { $Viewlet: canvas, canvasPresentation: presentation } })
  try {
    await RendererWorker.invokeAndTransfer('Transferrable.transfer', objectId, offscreen)
    await RendererWorker.invokeAndTransfer('Transferrable.transfer', portId, presentation.port)
  } catch (error) {
    presentation.dispose()
    presentation.port.close()
    throw error
  }
  return true
}
