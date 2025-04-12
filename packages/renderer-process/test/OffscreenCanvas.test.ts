/**
 * @jest-environment jsdom
 */
import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  HTMLCanvasElement.prototype.transferControlToOffscreen = () => {
    return {
      isOffscreenCanvasPlaceholder: true,
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(),
    sendAndTransfer: jest.fn(),
    invokeAndTransfer: jest.fn(),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')

const OffscreenCanvas = await import('../src/parts/OffscreenCanvas/OffscreenCanvas.ts')

test('create', () => {
  const canvasId = 1
  const objectId = 2
  OffscreenCanvas.create(canvasId, objectId)
  expect(RendererWorker.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(RendererWorker.invokeAndTransfer).toHaveBeenCalledWith('Transferrable.transfer', objectId, {
    isOffscreenCanvasPlaceholder: true,
  })
})
