/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletClock from '../src/parts/ViewletClock/ViewletClock.ts'

test('create', () => {
  const state = ViewletClock.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletClock.create()
  ViewletClock.dispose(state)
})

test('setTime', () => {
  const state = ViewletClock.create()
  ViewletClock.setTime(state, '15:55')
  expect(state.$Viewlet.textContent).toBe('15:55')
})
