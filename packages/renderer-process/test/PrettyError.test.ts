import { jest, beforeEach, test, expect } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Logger/Logger.ts', () => {
  return {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  }
})

const PrettyError = await import('../src/parts/PrettyError/PrettyError.ts')
const Logger = await import('../src/parts/Logger/Logger.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('print - typed message without stack', () => {
  PrettyError.print({ type: 'TypeError', message: 'pointerUp is not a function' }, '[renderer-process] Unhandled Error: ')

  expect(Logger.error).toHaveBeenCalledWith(`[renderer-process] Unhandled Error: TypeError: pointerUp is not a function`)
})

test('print - code frame without stack', () => {
  PrettyError.print({ type: 'SyntaxError', message: 'Unexpected token', codeFrame: '> 1 | const =' })

  expect(Logger.error).toHaveBeenCalledWith(`SyntaxError: Unexpected token\n\n> 1 | const =`)
})

test('print - code frame and stack', () => {
  PrettyError.print({ type: 'SyntaxError', message: 'Unexpected token', codeFrame: '> 1 | const =', stack: 'SyntaxError: Unexpected token\n    at file.ts:1:1' })

  expect(Logger.error).toHaveBeenCalledWith(`SyntaxError: Unexpected token\n\n> 1 | const =\n\nSyntaxError: Unexpected token\n    at file.ts:1:1`)
})

test('print - typed message and stack', () => {
  PrettyError.print({ type: 'TypeError', message: 'broken', stack: 'TypeError: broken\n    at file.ts:1:1' })

  expect(Logger.error).toHaveBeenCalledWith(`TypeError: broken\nTypeError: broken\n    at file.ts:1:1`)
})
