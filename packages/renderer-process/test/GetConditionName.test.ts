import { expect, test } from '@jest/globals'
import * as GetConditionName from '../src/parts/GetConditionName/GetConditionName.ts'

test.each([
  [1, 'toBeFocused'],
  [2, 'toBeHidden'],
  [3, 'toBeVisible'],
  [4, 'toContainText'],
  [5, 'toHaveAttribute'],
  [6, 'toHaveClass'],
  [7, 'toHaveCount'],
  [8, 'toHaveCss'],
  [9, 'toHaveId'],
  [10, 'toHaveJSProperty'],
  [11, 'toHaveText'],
  [12, 'toHaveValue'],
])('resolves wire ID %s to %s', (id, name) => {
  expect(GetConditionName.getConditionName(id)).toBe(name)
  expect(GetConditionName.getConditionName(name)).toBe(name)
})

test('rejects unknown numeric IDs', () => {
  expect(() => GetConditionName.getConditionName(-1)).toThrow('unexpected condition type -1')
})
