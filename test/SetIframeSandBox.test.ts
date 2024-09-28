/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as SetIframeSandBox from '../src/parts/SetIframeSandBox/SetIframeSandBox.ts'

test('setIframeSandBox', async () => {
  const iframe = document.createElement('iframe')
  SetIframeSandBox.setIframeSandBox(iframe, ['allow-scripts'])
  expect(iframe.sandbox.contains('allow-scripts')).toBe(true)
})
