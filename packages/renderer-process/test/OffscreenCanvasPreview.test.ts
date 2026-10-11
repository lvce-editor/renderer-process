/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { getViewletInstance, setViewletInstance } from '@lvce-editor/virtual-dom'

const transfer = jest.fn<(...args: readonly unknown[]) => Promise<void>>()
const port = { close: jest.fn() }
const createPresentation = jest.fn((canvas: HTMLCanvasElement, onDispose: () => void) => {
  return { dispose: jest.fn(onDispose), port }
})
jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({ invokeAndTransfer: transfer }))
jest.unstable_mockModule('../src/parts/IsFirefox/IsFirefox.ts', () => ({ getIsFirefox: () => true }))
jest.unstable_mockModule('../src/parts/CreateCanvasPresentation/CreateCanvasPresentation.ts', () => ({
  createCanvasPresentation: createPresentation,
}))
const { createForPreview } = await import('../src/parts/OffscreenCanvas/OffscreenCanvas.ts')
const originalOffscreenCanvas = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas')

beforeEach(() => {
  jest.clearAllMocks()
  transfer.mockResolvedValue(undefined)
  Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: jest.fn(() => ({})) })
})

afterEach(() => {
  setViewletInstance(42, undefined)
  if (originalOffscreenCanvas) Object.defineProperty(globalThis, 'OffscreenCanvas', originalOffscreenCanvas)
  else delete (globalThis as { OffscreenCanvas?: unknown }).OffscreenCanvas
})

test('keeps the presentation reachable for the canvas lifetime and releases it on disposal', async () => {
  expect(await createForPreview(42, 43, 44, 300, 200)).toBe(true)
  const presentation = createPresentation.mock.results[0].value as { dispose: () => void; port: typeof port }
  expect(getViewletInstance(42).state.canvasPresentation).toBe(presentation)
  expect(transfer).toHaveBeenCalledWith('Transferrable.transfer', 44, port)
  presentation.dispose()
  expect(getViewletInstance(42)).toBeUndefined()
})

test('a failed transfer releases the retained presentation and closes the untransferred port', async () => {
  transfer.mockRejectedValueOnce(new Error('transfer failed'))
  await expect(createForPreview(42, 43, 44, 300, 200)).rejects.toThrow('transfer failed')
  const presentation = createPresentation.mock.results[0].value as { dispose: () => void; port: typeof port }
  expect(getViewletInstance(42)).toBeUndefined()
  expect(presentation.dispose).toHaveBeenCalledTimes(1)
  expect(port.close).toHaveBeenCalledTimes(1)
})
