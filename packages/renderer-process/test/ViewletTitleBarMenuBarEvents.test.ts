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

test('handleFocusOut closes menu when focus is lost', () => {
  const target = document.createElement('div')
  target.className = 'Menu'

  ViewletTitleBarMenuBarEvents.handleFocusOut({ relatedTarget: null, target })

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledTimes(1)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledWith(7)
})
