/**
 * @jest-environment jsdom
 */
import { beforeAll, expect, test } from '@jest/globals'
import * as SetIframeSandBox from '../src/parts/SetIframeSandBox/SetIframeSandBox.ts'

beforeAll(() => {
  // @ts-ignore
  HTMLIFrameElement.prototype.sandbox = {
    __tokens: [],
    add(...tokens) {
      // @ts-ignore
      this.__tokens.push(...tokens)
    },
    contains(key) {
      // @ts-ignore
      return this.__tokens.includes(key)
    },
  }
})

test('setIframeSandBox', async () => {
  const iframe = document.createElement('iframe')
  SetIframeSandBox.setIframeSandBox(iframe, ['allow-scripts'])
  expect(iframe.sandbox.contains('allow-scripts')).toBe(true)
})
