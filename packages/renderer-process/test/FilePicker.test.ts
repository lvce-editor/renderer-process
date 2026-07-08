/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test, beforeAll } from '@jest/globals'
import * as FilePicker from '../src/parts/FilePicker/FilePicker.ts'

beforeAll(() => {
  // workaround for jsdom not supporting file picker apis
  // @ts-ignore
  window.showDirectoryPicker = jest.fn()
  // @ts-ignore
  window.showOpenFilePicker = jest.fn()
  // @ts-ignore
  window.showSaveFilePicker = jest.fn()
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('showDirectoryPicker - error', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrow(new TypeError('x is not a function'))
})

test('showDirectoryPicker - error - canceled', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new Error('The user aborted a request.')
  })
  // @ts-ignore
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrow(new Error('The user aborted a request.'))
})

test('showDirectoryPicker - error - not implemented', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new Error('window.showDirectoryPicker is not a function')
  })
  // @ts-ignore
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrow(new Error('window.showDirectoryPicker is not a function'))
})

test('showDirectoryPicker', async () => {
  // @ts-ignore
  window.showDirectoryPicker.mockImplementation(async () => {
    return {
      kind: 'directory',
      name: 'test-folder',
    }
  })
  // @ts-ignore
  expect(await FilePicker.showDirectoryPicker()).toEqual({
    kind: 'directory',
    name: 'test-folder',
  })
  // @ts-ignore
  expect(window.showDirectoryPicker).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(window.showDirectoryPicker).toHaveBeenCalledWith(undefined)
})

test('showFilePicker - error', async () => {
  // @ts-ignore
  window.showOpenFilePicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(FilePicker.showFilePicker()).rejects.toThrow(new TypeError('x is not a function'))
})

test('showFilePicker', async () => {
  // @ts-ignore
  window.showOpenFilePicker.mockImplementation(async () => {
    return [
      {
        kind: 'file',
        name: 'test.txt',
      },
    ]
  })
  // @ts-ignore
  expect(await FilePicker.showFilePicker()).toEqual([
    {
      kind: 'file',
      name: 'test.txt',
    },
  ])
  // @ts-ignore
  expect(window.showOpenFilePicker).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(window.showOpenFilePicker).toHaveBeenCalledWith(undefined)
})

test('showSaveFilePicker - error', async () => {
  // @ts-ignore
  window.showSaveFilePicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(FilePicker.showSaveFilePicker()).rejects.toThrow(new TypeError('x is not a function'))
})
