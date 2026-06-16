/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as Meta from '../src/parts/Meta/Meta.ts'

beforeEach(() => {
  document.head.replaceChildren();
})

test("setThemeColor - meta element doesn't exist", () => {
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  document.head.append(meta)
  Meta.setThemeColor('#ffffff')
  expect(meta.content).toBe('#ffffff')
})

test("setThemeColor - meta element doesn't exist", () => {
  Meta.setThemeColor('#ffffff')
  expect(document.querySelectorAll('meta')).toHaveLength(0)
})
