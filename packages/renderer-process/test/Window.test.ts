/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as Window from '../src/parts/Window/Window.ts'

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
