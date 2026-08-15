/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
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
