/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletSideBar from '../src/parts/ViewletSideBar/ViewletSideBar.ts'

test('create', () => {
  // TODO ideally sidebar and sidebar content html elements should be created and mounted
  // at the same time so that there is only one layout and recalc style
  const state = ViewletSideBar.create()
  expect(state.$SideBar.innerHTML).toBe('<div class="SideBarTitleArea"><h2 class="SideBarTitleAreaTitle"></h2></div>')
})

// TODO test loadContent

test('dispose', () => {
  const state = ViewletSideBar.create()
  // TODO what to test?
  ViewletSideBar.dispose(state)
})
