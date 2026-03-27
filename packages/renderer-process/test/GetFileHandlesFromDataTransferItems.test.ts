/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'

const GetFileHandlesFromDataTransferItems = await import('../src/parts/GetFileHandlesFromDataTransferItems/GetFileHandlesFromDataTransferItems.ts')

test('getFileHandles - falls back to file api when getAsFileSystemHandle is unavailable', async () => {
  const file = new File(['test'], 'test.txt', {
    type: 'text/plain',
  })
  const items = [
    {
      getAsFile() {
        return file
      },
    },
  ]
  const [handle] = await GetFileHandlesFromDataTransferItems.getFileHandles(items)

  expect(handle.kind).toBe('file')
  expect(handle.name).toBe('test.txt')
  expect(await handle.getFile()).toBe(file)
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
