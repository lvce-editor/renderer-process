/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletSidebar from '../src/parts/ViewletSideBar/ViewletSideBar.ts'

test('create', () => {
  // TODO ideally sidebar and sidebar content HTML elements should be created and mounted
  // at the same time so that there is only one layout and recalc style
  const state = ViewletSidebar.create()
  expect(state.$Sidebar.innerHTML).toBe('<div class="SideBarTitleArea"><h2 class="SideBarTitleAreaTitle"></h2></div>')
})

// TODO test loadContent

test('dispose', () => {
  const state = ViewletSidebar.create()
  // TODO what to test?
  ViewletSidebar.dispose(state)
  expect(state.$Sidebar.children).toHaveLength(0)
})
