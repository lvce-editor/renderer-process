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

test('showFilePicker - fallback', async () => {
  // @ts-ignore
  delete window.showOpenFilePicker
  const click = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
  const promise = FilePicker.showFilePicker({ multiple: false })
  const input = document.querySelector('input[type="file"]')!
  const file = new File(['hello'], 'test.txt', { type: 'text/plain' })
  Object.defineProperty(input, 'files', { configurable: true, value: [file] })
  input.dispatchEvent(new Event('change'))
  const [selectedFile] = await promise
  expect(selectedFile).toEqual({ file, kind: 'file', name: 'test.txt', readonly: true })
  expect(Object.values(selectedFile).every((value) => typeof value !== 'function')).toBe(true)
  expect(click).toHaveBeenCalledTimes(1)
  expect(document.querySelector('input[type="file"]')).toBeNull()
  click.mockRestore()
})

test('showFilePicker - fallback - canceled', async () => {
  // @ts-ignore
  delete window.showOpenFilePicker
  const click = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
  const promise = FilePicker.showFilePicker(undefined)
  const input = document.querySelector('input[type="file"]')!
  input.dispatchEvent(new Event('cancel'))
  await expect(promise).resolves.toEqual([])
  expect(document.querySelector('input[type="file"]')).toBeNull()
  const nextPromise = FilePicker.showFilePicker(undefined)
  const nextInput = document.querySelector('input[type="file"]')!
  const file = new File(['again'], 'again.txt')
  Object.defineProperty(nextInput, 'files', { configurable: true, value: [file] })
  nextInput.dispatchEvent(new Event('change'))
  await expect(nextPromise).resolves.toEqual([{ file, kind: 'file', name: 'again.txt', readonly: true }])
  expect(click).toHaveBeenCalledTimes(2)
  expect(document.querySelector('input[type="file"]')).toBeNull()
  click.mockRestore()
})

test('showFilePicker - fallback - click error removes the input and rejects', async () => {
  // @ts-ignore
  delete window.showOpenFilePicker
  const error = new Error('picker unavailable')
  const click = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {
    throw error
  })

  await expect(FilePicker.showFilePicker(undefined)).rejects.toBe(error)
  expect(document.querySelector('input[type="file"]')).toBeNull()
  expect(click).toHaveBeenCalledTimes(1)
  click.mockRestore()
})

test('showSaveFilePicker - error', async () => {
  // @ts-ignore
  window.showSaveFilePicker.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(FilePicker.showSaveFilePicker()).rejects.toThrow(new TypeError('x is not a function'))
})
