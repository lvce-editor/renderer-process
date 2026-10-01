/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  invoke: jest.fn(),
  send: jest.fn(),
}))

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')
const Window = await import('../src/parts/Window/Window.ts')

const exitFullscreen = jest.fn<() => Promise<void>>()
const requestFullscreen = jest.fn<() => Promise<void>>()

beforeEach(() => {
  jest.resetAllMocks()
  Object.defineProperties(document, {
    exitFullscreen: {
      configurable: true,
      value: exitFullscreen,
    },
    fullscreenElement: {
      configurable: true,
      value: null,
    },
  })
  Object.defineProperty(document.documentElement, 'requestFullscreen', {
    configurable: true,
    value: requestFullscreen,
  })
})

test('toggleFullScreen - enter full screen', async () => {
  await Window.toggleFullScreen()

  expect(requestFullscreen).toHaveBeenCalledTimes(1)
  expect(exitFullscreen).not.toHaveBeenCalled()
})

test('toggleFullScreen - exit full screen', async () => {
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    value: document.documentElement,
  })

  await Window.toggleFullScreen()

  expect(exitFullscreen).toHaveBeenCalledTimes(1)
  expect(requestFullscreen).not.toHaveBeenCalled()
})

test('handleFullScreenChange - forwards full screen state to renderer worker', () => {
  Window.handleFullScreenChange(true)

  expect(RendererWorker.send).toHaveBeenCalledWith('Layout.handleFullScreenChange', true)
})

test('onVisibilityChange - forwards document full screen changes', () => {
  Window.onVisibilityChange()
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    value: document.documentElement,
  })

  document.dispatchEvent(new Event('fullscreenchange'))

  expect(RendererWorker.send).toHaveBeenCalledWith('Layout.handleFullScreenChange', true)
})

test('onVisibilityChange - ignores element full screen changes', () => {
  Window.onVisibilityChange()
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    value: document.createElement('video'),
  })

  document.dispatchEvent(new Event('fullscreenchange'))

  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('prepareClose - waits for the renderer worker to save state', async () => {
  await Window.prepareClose()

  expect(RendererWorker.invoke).toHaveBeenCalledWith('SaveState.handleVisibilityChange', 'hidden')
})

test('canClose - clean documents require no prompt', async () => {
  jest.mocked(RendererWorker.invoke).mockResolvedValue(false)
  await expect(Window.canClose()).resolves.toBe(true)
  expect(RendererWorker.invoke).toHaveBeenCalledTimes(1)
  expect(RendererWorker.invoke).toHaveBeenCalledWith('Main.hasDirtyTabs')
})

test('canClose - cancellation leaves the window open', async () => {
  jest.mocked(RendererWorker.invoke).mockResolvedValueOnce(true).mockResolvedValueOnce(undefined).mockResolvedValueOnce(true)
  await expect(Window.canClose()).resolves.toBe(false)
  expect(RendererWorker.invoke).toHaveBeenNthCalledWith(2, 'Main.closeAllEditorsAndSave')
})

test('canClose - successful saves permit closing', async () => {
  jest.mocked(RendererWorker.invoke).mockResolvedValueOnce(true).mockResolvedValueOnce(undefined).mockResolvedValueOnce(false)
  await expect(Window.canClose()).resolves.toBe(true)
})

test('canClose - failed saves do not permit closing', async () => {
  jest.mocked(RendererWorker.invoke).mockResolvedValueOnce(true).mockRejectedValueOnce(new Error('write failed'))
  await expect(Window.canClose()).rejects.toThrow('write failed')
})
