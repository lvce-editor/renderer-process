import { jest, beforeEach, test, expect } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  globalThis.alert = jest.fn()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.ts', () => {
  return {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  }
})

const UnhandledErrorHandling = await import('../src/parts/UnhandledErrorHandling/UnhandledErrorHandling.ts')
const Logger = await import('../src/parts/Logger/Logger.ts')

test.skip('handleError - normal error', () => {
  const message = 'oops'
  const filename = '/test/file.ts'
  const lineno = 1
  const colno = 1
  const mockError = new Error('oops')
  // @ts-ignore
  UnhandledErrorHandling.handleUnhandledError(message, filename, lineno, colno, mockError)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining(`[renderer-process] Unhandled Error: Error: oops`))
})

test('handleError - null', async () => {
  const message = ''
  const filename = ''
  const lineno = 1
  const colno = 1
  const mockError = null
  const promise = new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
  UnhandledErrorHandling.handleUnhandledError(message, filename, lineno, colno, mockError)
  await promise
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(`[renderer-process] Unhandled Error: null`)
})
