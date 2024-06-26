/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.ts'
import * as ViewletDebugConsole from '../src/parts/ViewletDebugConsole/ViewletDebugConsole.ts'

test('create', () => {
  const state = ViewletDebugConsole.create()
  expect(state).toBeDefined()
})

test.skip('mount', () => {
  const state = ViewletDebugConsole.create()
  const $Parent = document.createElement('div')
  // TODO mount should be implemented on Viewlet
  Viewlet.mount($Parent, state)
  expect($Parent.children.length).toBe(1)
})

test.skip('focus', () => {
  const state = ViewletDebugConsole.create()
  Viewlet.mount(document.body, state)
  // @ts-ignore
  ViewletDebugConsole.focus(state)
  // @ts-ignore
  expect(document.activeElement).toBe(state.$Input)
})
