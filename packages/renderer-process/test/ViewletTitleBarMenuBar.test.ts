/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as Widget from '../src/parts/Widget/Widget.ts'

jest.unstable_mockModule('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFunctions.ts', () => ({
  closeMenu: jest.fn(),
}))

const ViewletTitleBarMenuBar = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ts')
const ViewletTitleBarMenuBarFunctions = await import('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFunctions.ts')

beforeEach(() => {
  jest.clearAllMocks()
  document.body.replaceChildren()
  Widget.state.$Widgets = undefined
  Widget.state.widgetSet = new Set()
})

test('setMenus closes menu when focus moves outside', () => {
  const state: { $$Menus: HTMLElement[] } = {
    $$Menus: [],
  }
  const menu = {
    focusedIndex: -1,
    height: 100,
    level: 0,
    width: 100,
    x: 0,
    y: 0,
  }

  ViewletTitleBarMenuBar.setMenus(state, [['addMenu', menu, []]], 7)

  const $Menu = state.$$Menus[0]
  const relatedTarget = document.createElement('textarea')
  $Menu.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget }))

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledTimes(1)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledWith(7)
})
