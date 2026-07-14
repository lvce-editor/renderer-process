import { expect, jest, test } from '@jest/globals'
import * as Open from '../src/parts/Open/Open.ts'

const setWindow = (open: jest.Mock, assign: jest.Mock): void => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: {
        assign,
      },
      open,
    },
  })
}

test('openUrl opens a new window by default', () => {
  const open = jest.fn()
  const assign = jest.fn()
  setWindow(open, assign)

  Open.openUrl('test://test.txt')

  expect(open).toHaveBeenCalledTimes(1)
  expect(open).toHaveBeenCalledWith('test://test.txt')
  expect(assign).not.toHaveBeenCalled()
})

test('openUrl redirects the current window when requested', () => {
  const open = jest.fn()
  const assign = jest.fn()
  setWindow(open, assign)

  Open.openUrl('test://test.txt', true)

  expect(assign).toHaveBeenCalledTimes(1)
  expect(assign).toHaveBeenCalledWith('test://test.txt')
  expect(open).not.toHaveBeenCalled()
})
