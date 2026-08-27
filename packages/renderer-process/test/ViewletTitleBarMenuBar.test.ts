/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom'
import * as Widget from '../src/parts/Widget/Widget.ts'

jest.unstable_mockModule('../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarFunctions.ts', () => ({
  closeMenu: jest.fn(),
  handleMenuClick: jest.fn(),
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
  ViewletTitleBarMenuBar.setMenus(state, [['closeMenus', 0]], 7)
})

test('setMenus closes a mouse-opened menu when clicking outside', () => {
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
  const editor = document.createElement('textarea')
  document.body.append(editor)

  ViewletTitleBarMenuBar.setMenus(state, [['addMenu', menu, []]], 7)
  editor.click()

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledTimes(1)
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).toHaveBeenCalledWith(7)
  ViewletTitleBarMenuBar.setMenus(state, [['closeMenus', 0]], 7)
})

test('setMenus keeps a mouse-opened menu open when clicking inside the menu bar', () => {
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
  const titleBarMenuBar = document.createElement('div')
  titleBarMenuBar.className = 'TitleBarMenuBar'
  document.body.append(titleBarMenuBar)

  ViewletTitleBarMenuBar.setMenus(state, [['addMenu', menu, []]], 7)
  state.$$Menus[0].click()
  titleBarMenuBar.click()

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).not.toHaveBeenCalled()
  ViewletTitleBarMenuBar.setMenus(state, [['closeMenus', 0]], 7)
})

test('setMenus removes the outside-click listener after closing the menu', () => {
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
  const editor = document.createElement('textarea')
  document.body.append(editor)

  ViewletTitleBarMenuBar.setMenus(state, [['addMenu', menu, []]], 7)
  ViewletTitleBarMenuBar.setMenus(state, [['closeMenus', 0]], 7)
  editor.click()

  expect(ViewletTitleBarMenuBarFunctions.closeMenu).not.toHaveBeenCalled()
})

test('setMenus keeps focus in the parent while opening a mouse-hovered submenu', async () => {
  const state: { $$Menus: HTMLElement[] } = {
    $$Menus: [],
  }
  const parentMenu = {
    focusedIndex: 0,
    height: 100,
    level: 0,
    width: 100,
    x: 0,
    y: 0,
  }
  const childMenu = {
    focusedIndex: -1,
    height: 100,
    level: 1,
    width: 100,
    x: 100,
    y: 0,
  }
  const menuItemDom = [
    {
      childCount: 0,
      className: 'MenuItem',
      tabIndex: -1,
      type: VirtualDomElements.Button,
    },
  ]

  ViewletTitleBarMenuBar.setMenus(state, [['addMenu', parentMenu, menuItemDom]], 7)
  expect(document.activeElement).toBe(state.$$Menus[0].children[0])

  ViewletTitleBarMenuBar.setMenus(
    state,
    [
      ['updateMenu', parentMenu, 2, menuItemDom],
      ['addMenu', childMenu, menuItemDom],
    ],
    7,
  )
  await Promise.resolve()

  expect(state.$$Menus).toHaveLength(2)
  expect(document.activeElement).toBe(state.$$Menus[0].children[0])
  expect(ViewletTitleBarMenuBarFunctions.closeMenu).not.toHaveBeenCalled()
})
