import { beforeEach, expect, jest, test, beforeAll } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.ClipboardItem = class {
    options: any
    constructor(options) {
      this.options = options
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

const Clipboard_ = await import('../src/parts/ClipBoard/ClipBoard.ts')

test('readText', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      // @ts-ignore
      readText: () => 'abc',
    },
  }
  await expect(Clipboard_.readText()).resolves.toBe('abc')
})

test('readText - clipboard not available', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {},
  }
  await expect(Clipboard_.readText()).rejects.toThrow(new TypeError('navigator.clipboard.readText is not a function'))
})

test('readText - clipboard blocked', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      async readText() {
        throw new Error('Read permission denied.')
      },
    },
  }
  await expect(Clipboard_.readText()).rejects.toThrow(new Error('Read permission denied.'))
})

test('readText - other error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      async readText() {
        throw new TypeError('x is not a function')
      },
    },
  }
  await expect(Clipboard_.readText()).rejects.toThrow(new TypeError('x is not a function'))
})

test('writeText', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      // @ts-ignore
      writeText: jest.fn(),
    },
  }
  await Clipboard_.writeText('abc')
  // @ts-ignore
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('abc')
})

test('writeText - error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      writeText() {
        throw new Error('not allowed')
      },
    },
  }
  await expect(Clipboard_.writeText('abc')).rejects.toThrow(new Error('not allowed'))
})

test('writeText - error - format not supported', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      async write() {
        throw new Error('Type image/avif not supported on write.')
      },
    },
  }

  await expect(
    Clipboard_.writeImage({
      type: 'image/avif',
    }),
  ).rejects.toThrow(new Error('Type image/avif not supported on write.'))
})

test('writeText', async () => {
  globalThis.navigator = {
    clipboard: {
      // @ts-ignore
      write: jest.fn(),
    },
  }
  const blob = {
    type: 'image/png',
  }
  await Clipboard_.writeImage(blob)
  // @ts-ignore
  expect(globalThis.navigator.clipboard.write).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(globalThis.navigator.clipboard.write).toHaveBeenCalledWith([
    new ClipboardItem({
      // @ts-ignore
      'image/png': blob,
    }),
  ])
})

test('execCopy', async () => {
  globalThis.navigator = {
    clipboard: {
      // @ts-ignore
      writeText: jest.fn(),
    },
  }
  // @ts-ignore
  globalThis.getSelection = jest.fn(() => {
    return {
      toString: () => 'abc',
    }
  })
  await Clipboard_.execCopy()
  // @ts-ignore
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('abc')
})
