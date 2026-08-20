import { expect, test } from '@jest/globals'
import * as GetEventClass from '../src/parts/GetEventClass/GetEventClass.ts'

test('uses MouseEvent for context menus', () => {
  globalThis.MouseEvent = class extends Event {} as unknown as typeof MouseEvent
  expect(GetEventClass.getEventClass('contextmenu')).toBe(MouseEvent)
})
