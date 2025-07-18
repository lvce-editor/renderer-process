import { expect, jest, test } from '@jest/globals'
import * as ClipBoardData from '../src/parts/ClipBoardData/ClipBoardData.ts'
import * as ClipBoardDataType from '../src/parts/ClipBoardDataType/ClipBoardDataType.ts'

test('getData', () => {
  const clipBoardData = {
    getData: jest.fn(() => {
      return 'test'
    }),
  }
  expect(ClipBoardData.getText(clipBoardData)).toBe('test')
  expect(clipBoardData.getData).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(clipBoardData.getData).toHaveBeenCalledWith(ClipBoardDataType.Text)
})
