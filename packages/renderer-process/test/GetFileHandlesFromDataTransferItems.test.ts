/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')

const setNavigator = (value) => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value,
  })
}

afterEach(() => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor)
    return
  }
  // @ts-ignore
  delete globalThis.navigator
})

const GetFileHandlesFromDataTransferItems = await import('../src/parts/GetFileHandlesFromDataTransferItems/GetFileHandlesFromDataTransferItems.ts')

test('getFileHandles - falls back to file api when getAsFileSystemHandle is unavailable', async () => {
  setNavigator({
    userAgent: 'Mozilla/5.0 Firefox/123.0',
  })
  const file = new File(['test'], 'test.txt', {
    type: 'text/plain',
  })
  const items = [
    {
      getAsFileSystemHandle() {
        throw new TypeError('item.getAsFileSystemHandle is not a function')
      },
      getAsFile() {
        return file
      },
    },
  ]
  expect(await GetFileHandlesFromDataTransferItems.getFileHandles(items)).toEqual([file])
})

test('getFileHandles - uses file system access api when available', async () => {
  const items = [
    {
      getAsFileSystemHandle() {
        return {
          __type: 'FileSystemFileHandle',
        }
      },
    },
  ]
  expect(await GetFileHandlesFromDataTransferItems.getFileHandles(items)).toEqual([
    {
      __type: 'FileSystemFileHandle',
    },
  ])
})

test('getFileHandles - throws unexpected errors', async () => {
  const items = [
    {
      getAsFileSystemHandle() {
        throw new Error('unexpected failure')
      },
    },
  ]

  await expect(GetFileHandlesFromDataTransferItems.getFileHandles(items)).rejects.toThrow(new Error('unexpected failure'))
})
