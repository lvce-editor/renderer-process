/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as ModernUi from '../src/parts/ModernUi/ModernUi.ts'

beforeEach(() => {
  document.body.className = 'App'
})

test('setModernUi enables the modern ui class', () => {
  ModernUi.setModernUi(true)

  expect(document.body.classList.contains('App')).toBe(true)
  expect(document.body.classList.contains('ModernUi')).toBe(true)
})

test('setModernUi disables the modern ui class', () => {
  document.body.classList.add('ModernUi')

  ModernUi.setModernUi(false)

  expect(document.body.classList.contains('App')).toBe(true)
  expect(document.body.classList.contains('ModernUi')).toBe(false)
})
