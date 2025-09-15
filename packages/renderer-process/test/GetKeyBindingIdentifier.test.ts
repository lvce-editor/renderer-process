import { expect, test } from '@jest/globals'
import * as GetKeyBindingIdenfitier from '../src/parts/GetKeyBindingIdentifier/GetKeyBindingIdentifier.ts'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.ts'

test('KeyA', () => {
  const event = {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    key: 'a',
  } as any
  expect(GetKeyBindingIdenfitier.getKeyBindingIdentifier(event)).toBe(KeyCode.KeyA)
})

test('KeyB', () => {
  const event = {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    key: 'b',
  } as any
  expect(GetKeyBindingIdenfitier.getKeyBindingIdentifier(event)).toBe(KeyCode.KeyB)
})
