/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ComponentUid/ComponentUid.ts', () => ({
  fromEvent: jest.fn(() => 7),
}))

jest.unstable_mockModule('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFunctions.ts', () => ({
  closeMenu: jest.fn(),
}))

const ViewletTitleBarMenuBarEvents = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarEvents.ts')
const ViewletTitleBarMenuBarFunctions = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFunctions.ts')

beforeEach(() => {
  jest.clearAllMocks()
  document.body.replaceChildren()
})

test('handleFocusOut closes menu when focus moves outside', () => {
  const target = document.createElement('div')
  target.className = 'Menu'
  const relatedTarget = document.createElement('textarea')
  relatedTarget.className = 'EditorInput'

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget, target })

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledTimes(1)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledWith(7)
})

test('handleFocusOut keeps menu open when focus moves within menu', () => {
  const target = document.createElement('div')
  target.className = 'Menu'
  const relatedTarget = document.createElement('button')
  relatedTarget.className = 'MenuItem'

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget, target })

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).not.toHaveBeenCalled()
})

test('handleFocusOut closes menu when focus is lost', async () => {
  const target = document.createElement('div')
  target.className = 'Menu'
  document.body.append(target)

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget: null, target })
  await Promise.resolve()

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledTimes(1)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledWith(7)
})

test('handleFocusOut keeps menu open when a focused menu item is replaced', () => {
  const target = document.createElement('button')
  target.className = 'MenuItem'

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget: null, target })

  expect(target.isConnected).toBe(false)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).not.toHaveBeenCalled()
})

test('handleFocusOut keeps menu open when a focused menu item is replaced after focusout', async () => {
  const target = document.createElement('button')
  target.className = 'MenuItem'
  document.body.append(target)
  target.focus()
  const replacement = document.createElement('button')
  replacement.className = 'MenuItem'

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget: null, target })
  target.remove()
  document.body.append(replacement)
  replacement.focus()
  await Promise.resolve()

  expect(target.isConnected).toBe(false)
  expect(document.activeElement).toBe(replacement)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).not.toHaveBeenCalled()
})

test('handleFocusOut closes menu when the old menu item is replaced while focus moves outside', async () => {
  const target = document.createElement('button')
  target.className = 'MenuItem'
  document.body.append(target)
  target.focus()
  const editor = document.createElement('textarea')
  editor.className = 'EditorInput'
  document.body.append(editor)

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget: null, target })
  target.remove()
  editor.focus()
  await Promise.resolve()

  expect(document.activeElement).toBe(editor)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledTimes(1)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledWith(7)
})
