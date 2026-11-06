/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

let focus: (id: number) => void
let setViewletInstance
let root: HTMLDivElement
let callbacks: FrameRequestCallback[]
const originalRequestAnimationFrame = globalThis.requestAnimationFrame

beforeEach(async () => {
  jest.resetModules()
  document.body.replaceChildren()
  history.replaceState({}, '', '/chat')
  callbacks = []
  globalThis.requestAnimationFrame = (callback): number => callbacks.push(callback)
  ;({ focus } = await import('../src/parts/ChatRouteFocus/ChatRouteFocus.ts'))
  ;({ setViewletInstance } = await import('@lvce-editor/virtual-dom'))
  root = document.createElement('div')
  root.innerHTML = '<textarea name="composer"></textarea>'
  document.body.append(root)
  jest.spyOn(root.firstElementChild!, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList)
  setViewletInstance(1, { factory: {}, state: { $Viewlet: root } })
})

afterEach(() => {
  jest.restoreAllMocks()
  globalThis.requestAnimationFrame = originalRequestAnimationFrame
})

const flush = (): void => {
  while (callbacks.length) callbacks.shift()!(0)
}

test('focuses the current composer after startup rerenders, only once', () => {
  focus(1)
  const replacement = root.cloneNode(true) as HTMLDivElement
  root.replaceWith(replacement)
  jest.spyOn(replacement.firstElementChild!, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList)
  setViewletInstance(1, { factory: {}, state: { $Viewlet: replacement } })
  focus(1)
  flush()
  expect(document.activeElement).toBe(replacement.firstElementChild)
  const control = document.createElement('input')
  document.body.append(control)
  control.focus()
  focus(1)
  flush()
  expect(document.activeElement).toBe(control)
})

test.each(['before', 'during'])('preserves a control focused %s the request', (timing) => {
  const control = document.createElement('input')
  document.body.append(control)
  if (timing === 'before') control.focus()
  focus(1)
  if (timing === 'during') control.focus()
  flush()
  expect(document.activeElement).toBe(control)
})

test('a newer focus choice followed by blur cancels the fallback', () => {
  focus(1)
  const control = document.createElement('input')
  document.body.append(control)
  control.focus()
  control.blur()
  flush()
  expect(document.activeElement).toBe(document.body)
})

test('does not consume the request before a logged-in composer is rendered', () => {
  root.firstElementChild!.remove()
  focus(1)
  expect(callbacks).toHaveLength(0)
  root.innerHTML = '<textarea name="composer"></textarea>'
  jest.spyOn(root.firstElementChild!, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList)
  focus(1)
  flush()
  expect(document.activeElement).toBe(root.firstElementChild)
})

test.each(['hidden', 'disposed', 'non-chat'])('does not focus a %s composer', (condition) => {
  if (condition === 'hidden') jest.spyOn(root.firstElementChild!, 'getClientRects').mockReturnValue([] as unknown as DOMRectList)
  if (condition === 'non-chat') history.replaceState({}, '', '/')
  focus(1)
  if (condition === 'disposed') root.remove()
  flush()
  expect(document.activeElement).toBe(document.body)
})
