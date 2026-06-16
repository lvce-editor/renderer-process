import { expect, jest, test } from '@jest/globals'
import * as ClipboardData from '../src/parts/ClipBoardData/ClipBoardData.ts'
import * as ClipboardDataType from '../src/parts/ClipBoardDataType/ClipBoardDataType.ts'

test('getData', () => {
  const clipBoardData = {
    getData: jest.fn(() => {
      return 'test'
    }),
  }
  expect(ClipboardData.getText(clipBoardData)).toBe('test')
  expect(clipBoardData.getData).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(clipBoardData.getData).toHaveBeenCalledWith(ClipboardDataType.Text)
})
