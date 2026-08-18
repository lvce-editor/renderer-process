/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as RenderCanvas from '../src/parts/RenderCanvas/RenderCanvas.ts'

const clearRect = jest.fn()
const fillRect = jest.fn()
const resetTransform = jest.fn()
const scale = jest.fn()
const context = {
  clearRect,
  fillRect,
  fillStyle: '',
  resetTransform,
  scale,
}

beforeEach(() => {
  document.body.replaceChildren()
  jest.clearAllMocks()
  Object.defineProperty(globalThis, 'devicePixelRatio', {
    configurable: true,
    value: 2,
  })
  HTMLCanvasElement.prototype.getContext = jest.fn(() => context) as never
})

test('renders themed rectangles into a reusable high-dpi canvas', () => {
  const $Viewlet = document.createElement('div')
  const $Parent = document.createElement('div')
  $Parent.className = 'CanvasSlot'
  $Viewlet.append($Parent)
  document.body.append($Viewlet)
  const rectangles = [
    {
      className: 'Token Keyword',
      height: 2,
      width: 4,
      x: 1,
      y: 3,
    },
  ]

  RenderCanvas.renderCanvas($Viewlet, '.CanvasSlot', 'Canvas', 120, 80, rectangles, '1:0')
  RenderCanvas.renderCanvas($Viewlet, '.CanvasSlot', 'Canvas', 120, 80, rectangles, '1:1')

  const $Canvas = $Parent.querySelector<HTMLCanvasElement>('.Canvas')
  expect($Parent.querySelectorAll('canvas')).toHaveLength(1)
  expect($Canvas?.width).toBe(240)
  expect($Canvas?.height).toBe(160)
  expect($Canvas?.style.width).toBe('120px')
  expect($Canvas?.style.height).toBe('80px')
  expect($Canvas?.dataset.renderRevision).toBe('1:1')
  expect($Canvas?.dataset.rectangleCount).toBe('1')
  expect(resetTransform).toHaveBeenCalledTimes(2)
  expect(clearRect).toHaveBeenLastCalledWith(0, 0, 240, 160)
  expect(scale).toHaveBeenLastCalledWith(2, 2)
  expect(fillRect).toHaveBeenLastCalledWith(1, 3, 4, 2)
})

test('does nothing when the target slot is absent', () => {
  const $Viewlet = document.createElement('div')

  RenderCanvas.renderCanvas($Viewlet, '.Missing', 'Canvas', 120, 80, [], '1')

  expect($Viewlet.querySelector('canvas')).toBeNull()
})
