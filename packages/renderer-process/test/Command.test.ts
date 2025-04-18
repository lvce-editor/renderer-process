import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ModuleMap/ModuleMap.ts', () => {
  return {
    getModuleId: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.ts')
const ModuleMap = await import('../src/parts/ModuleMap/ModuleMap.ts')

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} promise
 * @returns {Promise<Error>}
 *  */
const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

test('register', () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  expect(Command.state.commands[-12]).toBe(mockFn)
})

test('execute - command already registered', async () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  await Command.execute(-12, 'abc')
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(mockFn).toHaveBeenCalledWith('abc')
})

test('execute - command already registered but throws error', async () => {
  const mockFn = jest.fn(() => {
    throw new Error('Oops')
  })
  Command.register(-12, mockFn)
  expect(() => Command.execute(-12, 'abc')).toThrow(new Error('Oops'))
})

test('execute - error - module has syntax error', async () => {
  // @ts-ignore
  ModuleMap.getModuleId.mockImplementation(() => {
    return 21
  })
  Command.state.load = async () => {
    const error = new SyntaxError(`Unexpected token ','`)
    error.stack = `SyntaxError: Unexpected token ','`
    throw error
  }
  const error = await getError(Command.execute('test.test'))
  // @ts-ignore
  expect(error.message).toBe("Failed to load command test.test: VError: failed to load module 21: SyntaxError: Unexpected token ','")
  // @ts-ignore
  expect(error.stack).toMatch("VError: Failed to load command test.test: VError: failed to load module 21: SyntaxError: Unexpected token ','")
  // @ts-ignore
  expect(error.stack).toMatch('  at loadCommand')
})
